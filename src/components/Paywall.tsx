import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';
import { useBackHandler } from '../utils/backNav';
import { buy, fetchPrice, FREE_ROUNDS, refreshPurchases } from '../utils/billing';
import { toFa } from '../utils/fa';

/**
 * پنجرهٔ «پرداخت کن»؛ وقتی کودک در یک تمرین به مرحلهٔ چهارم می‌رسد.
 * پرداخت از راه صفحهٔ رسمی کافه‌بازار انجام می‌شود. پس از پرداخت، usePremium همه‌جا را باز می‌کند
 * و این پنجره خودش بسته می‌شود و تمرین از همان مرحله ادامه پیدا می‌کند.
 */
export const Paywall: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [price, setPrice] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  useBackHandler(() => { if (!busy) onClose(); });
  useEffect(() => { let on = true; fetchPrice().then(p => { if (on) setPrice(p); }); return () => { on = false; }; }, []);

  const explain = (r: Awaited<ReturnType<typeof buy>>) => {
    if (r.ok || r.error === 'canceled') return '';
    if (r.error === 'no-bazaar') return 'برنامهٔ «بازار» روی این گوشی نصب نیست یا باید به‌روز شود. بازار را نصب کن و دوباره امتحان کن.';
    if (r.error === 'unsupported') return 'پرداخت فقط در نسخهٔ بازارِ برنامه کار می‌کند.';
    return 'پرداخت انجام نشد. اینترنت را بررسی کن و دوباره امتحان کن.';
  };
  const pay = async () => { sound.playPop(); setBusy(true); setMsg(''); const r = await buy(); setBusy(false); if (r.ok) sound.playSuccess(); else setMsg(explain(r)); };
  const restore = async () => {
    sound.playPop(); setBusy(true); setMsg('');
    const r = await refreshPurchases(); setBusy(false);
    if (r.ok) sound.playSuccess(); else setMsg(r.error === 'failed' || r.error === 'no-bazaar' ? explain(r) : 'خرید قبلی‌ای در حساب بازارِ این گوشی پیدا نشد.');
  };

  return <div className="pw-scene" role="presentation" onClick={() => { if (!busy) onClose(); }}>
    <section className="pw-panel" dir="rtl" role="dialog" aria-modal="true" aria-label="باز کردن همهٔ تمرین‌ها" onClick={e => e.stopPropagation()}>
      <div className="pw-lock" aria-hidden="true">🔒</div>
      <h2>همهٔ تمرین‌ها را باز کن</h2>
      <p>{toFa(FREE_ROUNDS)} مرحلهٔ اولِ هر تمرین رایگان بود. با یک بار پرداخت، همهٔ تمرین‌های دهکدهٔ ریاضی برای همیشه باز می‌شود.</p>
      <ul className="pw-list">
        <li>✨ همهٔ تمرین‌های هر سه جزیره</li>
        <li>♾️ فقط یک بار پرداخت، برای همیشه</li>
        <li>🔁 با نصب دوباره هم از حساب بازار برمی‌گردد</li>
      </ul>
      {msg && <div className="pw-msg" role="alert">{msg}</div>}
      <button type="button" className="pw-buy" disabled={busy} onClick={pay}>{busy ? 'کمی صبر کن…' : price ? `پرداخت و باز کردن همه · ${price}` : 'پرداخت و باز کردن همه'}</button>
      <div className="pw-row">
        <button type="button" className="pw-link" disabled={busy} onClick={restore}>قبلاً خریده‌ام</button>
        <button type="button" className="pw-link" disabled={busy} onClick={() => { sound.playPop(); onClose(); }}>بعداً</button>
      </div>
    </section>
  </div>;
};
