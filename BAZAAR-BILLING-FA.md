# پرداخت درون‌برنامه‌ای کافه‌بازار

- محصول: `riaziaval` (خرید ماندگار، consume نمی‌شود) — کلید RSA در `capacitor.config.ts` (بخش `BazaarBilling`).
- قانون: ۲ تمرین اول هر خانه رایگان؛ از تمرین سوم، قفل 🔒 و پنجرهٔ پرداخت. پس از خرید همه‌چیز باز است.
  عدد رایگان‌ها: `FREE_PER_HOUSE` در `src/utils/billing.ts`.
- پلاگین بومی: `plugins/capacitor-bazaar-billing` (روی SDK رسمی Poolakey نسخه ۲.۳.۰). مجوز، queries و receiver را خود Poolakey به manifest اضافه می‌کند.
- اجرا: `npm install && npm run build && npx cap add android && npx cap sync android && python3 scripts/patch-android.py android` (workflow گیت‌هاب همین را انجام می‌دهد).

## قبل از انتشار
1. در پنل بازار محصول درون‌برنامه‌ای با شناسهٔ `riaziaval` (نوع «خرید» نه اشتراک) بسازید و فعال کنید.
2. APK باید با همان کلید امضا و روی بازار (حداقل حالت آزمایشی) آپلود شده باشد؛ تست روی گوشی با «بازار» نصب و واردشده انجام شود.
3. در مرورگر (`npm run dev`) خرید شبیه‌سازی می‌شود تا ظاهر قابل‌تست باشد؛ در نسخهٔ نهایی وب پرداخت غیرفعال است.
