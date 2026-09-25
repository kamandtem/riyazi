import { useEffect, useState, type CSSProperties } from 'react';

/**
 * جهت صفحه:
 * - خودِ برنامه (شروع، نقشهٔ جزیره‌ها، دهکده‌ها، فهرست تمرین‌ها) عمودی است.
 * - همهٔ بازی‌ها (اجرای تمرین) افقی‌اند تا الگوها و محور در یک خط جا شوند و اسکرول لازم نباشد.
 * در اندروید با پلاگین ScreenOrientation قفل می‌شود؛ در مرورگر اگر قفل ممکن نبود، صفحهٔ بازی با CSS چرخانده می‌شود.
 */
type Dir = 'landscape' | 'portrait';
let wanted: Dir = 'portrait';
let timer = 0;

async function apply(dir: Dir) {
  const cap = (window as any).Capacitor;
  try {
    if (cap?.isNativePlatform?.()) {
      const { ScreenOrientation } = await import('@capacitor/screen-orientation');
      await ScreenOrientation.lock({ orientation: dir });
      return;
    }
  } catch { /* پلاگین نصب نیست */ }
  try { await (screen.orientation as any)?.lock?.(dir); } catch { /* مرورگر اجازه نمی‌دهد؛ چرخش CSS جایش را می‌گیرد */ }
}

export function lockOrientation(dir: Dir) {
  wanted = dir;
  window.clearTimeout(timer);
  // با کمی تأخیر برای عمودی تا رفتن از یک بازی به بازی بعد، صفحه بی‌دلیل نچرخد
  timer = window.setTimeout(() => apply(wanted), dir === 'portrait' ? 180 : 0);
}

/** برای صفحهٔ بازی: قفل افقی + اگر هنوز عمودی بود، چرخاندن با CSS */
export function useLandscape() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [d, setD] = useState(read);
  useEffect(() => {
    lockOrientation('landscape');
    const on = () => setD(read());
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => { window.removeEventListener('resize', on); window.removeEventListener('orientationchange', on); lockOrientation('portrait'); };
  }, []);
  const rotated = d.h > d.w;
  const lw = rotated ? d.h : d.w, lh = rotated ? d.w : d.h;
  // --lw / --lh: پهنا و بلندی واقعیِ صحنهٔ افقی (vh/vw در حالت چرخیده غلط می‌شوند)
  const vars = { '--lw': `${lw}px`, '--lh': `${lh}px` } as CSSProperties;
  const style: CSSProperties = rotated
    ? { ...vars, width: d.h, height: d.w, transform: `translateX(${d.w}px) rotate(90deg)` }
    : vars;
  return { rotated, style };
}
