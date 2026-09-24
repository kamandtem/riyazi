/** ابزارهای عمومی: عدد فارسی، نام عددها برای خواندن با صدا، و تصادفی‌سازی */
export const toFa = (n: number | string) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);

const ONES = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه', 'ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const TENS = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
/** نام عدد به فارسی (۰ تا ۱۰۰) برای موتور گفتار */
export function numWord(n: number): string {
  if (n < 0) return 'منفی ' + numWord(-n);
  if (n < 20) return ONES[n];
  if (n === 100) return 'صد';
  const t = Math.floor(n / 10), o = n % 10;
  return o ? `${TENS[t]} و ${ONES[o]}` : TENS[t];
}

export const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = <T,>(arr: readonly T[]): T[] => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** گزینه‌های نزدیک به جواب (مثلاً یکی کمتر و یکی بیشتر) تا انتخاب فقط حدس نباشد */
export function nearOptions(answer: number, count = 3, min = 0, max = 100): number[] {
  const set = new Set<number>([answer]);
  const deltas = shuffle([-1, 1, -2, 2, 3, -3]);
  for (const d of deltas) { if (set.size >= count) break; const v = answer + d; if (v >= min && v <= max) set.add(v); }
  let k = 4; while (set.size < count) { const v = answer + k++; if (v <= max) set.add(v); else set.add(Math.max(min, answer - k)); }
  return shuffle([...set]);
}
