import { useEffect, useState } from 'react';
import { registerPlugin } from '@capacitor/core';
import { EXERCISE_BY_ID, exercisesOfHouse } from '../math/exercises';

/**
 * پرداخت درون‌برنامه‌ای کافه‌بازار (SDK رسمی Poolakey، از راه پلاگین BazaarBilling).
 * یک محصول ماندگار (consume نمی‌شود): «همهٔ تمرین‌ها». پس از خرید، تا همیشه باز می‌ماند و
 * با نصب دوباره یا گوشی تازه، از حساب بازار همان کاربر بازیابی می‌شود.
 */
export const PRODUCT_ID = 'riaziaval';
/** تعداد تمرین رایگان در هر خانه */
export const FREE_PER_HOUSE = 2;

interface PurchaseRow { productId: string; purchaseState: 'PURCHASED' | 'REFUNDED'; orderId?: string; purchaseToken?: string }
interface BazaarBillingPlugin {
  isBazaarInstalled(): Promise<{ installed: boolean }>;
  getProduct(o: { productId: string }): Promise<{ productId?: string; price?: string; title?: string }>;
  purchase(o: { productId: string; payload?: string }): Promise<PurchaseRow>;
  getPurchases(): Promise<{ purchases: PurchaseRow[] }>;
}
const Native = registerPlugin<BazaarBillingPlugin>('BazaarBilling');
const isNative = () => !!(window as any).Capacitor?.isNativePlatform?.();

// ───────────── وضعیت «خریده‌ام» (ذخیرهٔ محلی + اطلاع به صفحه‌ها) ─────────────
const KEY = 'riazi_premium_v1';
const EVT = 'riazi-premium-change';
let premium = (() => { try { return JSON.parse(localStorage.getItem(KEY) || 'null')?.ok === true; } catch { return false; } })();

function setPremium(v: boolean) {
  if (premium === v) return;
  premium = v;
  try { v ? localStorage.setItem(KEY, JSON.stringify({ ok: true, t: Date.now() })) : localStorage.removeItem(KEY); } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(EVT));
}
export const isPremium = () => premium;
export function usePremium(): boolean {
  const [v, setV] = useState(premium);
  useEffect(() => { const on = () => setV(premium); window.addEventListener(EVT, on); on(); return () => window.removeEventListener(EVT, on); }, []);
  return v;
}

// ───────────── قفل تمرین‌ها ─────────────
/** سومین تمرین (و بعدی‌ها) در هر خانه قفل است، مگر کاربر خریده باشد */
export function isLocked(exId: string, hasPremium = premium): boolean {
  if (hasPremium) return false;
  const e = EXERCISE_BY_ID[exId];
  if (!e) return false;
  return exercisesOfHouse(e.house).findIndex(x => x.id === exId) >= FREE_PER_HOUSE;
}

// ───────────── کار با بازار ─────────────
export type BillingError = 'no-bazaar' | 'canceled' | 'unsupported' | 'failed';
export interface BillingResult { ok: boolean; error?: BillingError; message?: string }
const errOf = (e: any): BillingResult => {
  const code = String(e?.code || '');
  if (code === 'CANCELED') return { ok: false, error: 'canceled' };
  if (code === 'BazaarNotFoundException' || code === 'BazaarNotSupportedException') return { ok: false, error: 'no-bazaar', message: e?.message };
  return { ok: false, error: 'failed', message: e?.message };
};
const owned = (rows: PurchaseRow[]) => rows.some(r => r.productId === PRODUCT_ID && r.purchaseState === 'PURCHASED');
const refunded = (rows: PurchaseRow[]) => rows.some(r => r.productId === PRODUCT_ID && r.purchaseState === 'REFUNDED') && !owned(rows);

/** بررسی خریدهای حساب بازار (هنگام شروع برنامه و دکمهٔ «بازیابی خرید») */
export async function refreshPurchases(): Promise<BillingResult> {
  if (!isNative()) return { ok: premium, error: premium ? undefined : 'unsupported' };
  try {
    const { purchases } = await Native.getPurchases();
    if (owned(purchases)) setPremium(true); else if (refunded(purchases)) setPremium(false);
    return { ok: premium };
  } catch (e) { return errOf(e); }
}

/** قیمت محصول برای نمایش روی دکمه (اختیاری؛ اگر نشد خالی برمی‌گردد) */
export async function fetchPrice(): Promise<string> {
  if (!isNative()) return '';
  try { return (await Native.getProduct({ productId: PRODUCT_ID })).price || ''; } catch { return ''; }
}

/** صفحهٔ پرداخت بازار را باز می‌کند. در صورت موفقیت، همه‌چیز باز می‌شود. */
export async function buy(): Promise<BillingResult> {
  if (!isNative()) {
    // در مرورگرِ توسعه، خرید شبیه‌سازی می‌شود تا بشود ظاهر را آزمایش کرد
    if ((import.meta as any).env?.DEV) { setPremium(true); return { ok: true }; }
    return { ok: false, error: 'unsupported' };
  }
  try {
    const r = await Native.purchase({ productId: PRODUCT_ID, payload: 'riazi-' + Date.now() });
    if (r.productId === PRODUCT_ID && r.purchaseState === 'PURCHASED') { setPremium(true); return { ok: true }; }
    return { ok: false, error: 'failed' };
  } catch (e) {
    const res = errOf(e);
    if (res.error === 'canceled' || res.error === 'no-bazaar') return res;
    // مثلاً «این محصول را قبلاً خریده‌اید»: خریدهای حساب را بررسی کن
    const again = await refreshPurchases();
    return again.ok ? { ok: true } : res;
  }
}

/** هنگام شروع برنامه: خریدهای قبلی را بازیابی کن (بی‌صدا؛ اگر بازار نبود همان وضعیت ذخیره‌شده می‌ماند) */
export function initBilling() { void refreshPurchases(); }
