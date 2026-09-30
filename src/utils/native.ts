/** تنظیمات مخصوص اندروید: نوار وضعیت (ساعت، باتری، آنتن) و نوار پایین */
export async function initNativeChrome() {
  const cap = (window as any).Capacitor;
  if (!cap?.isNativePlatform?.()) return;
  document.documentElement.classList.add('is-native');
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Light }); // آیکن‌های تیره روی زمینهٔ روشن
    await StatusBar.setBackgroundColor({ color: '#57C3F1' });
  } catch { /* پلاگین در دسترس نیست */ }
}

/** رنگ نوار وضعیت را با رنگ بالای هر صفحه هماهنگ می‌کند */
export async function setStatusBarColor(color: string, darkIcons = true) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  const cap = (window as any).Capacitor;
  if (!cap?.isNativePlatform?.()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setBackgroundColor({ color });
    await StatusBar.setStyle({ style: darkIcons ? Style.Light : Style.Dark });
  } catch { /* ignore */ }
}

/** صفحهٔ تمرین بدون نوار وضعیت و نوار ناوبری اندروید */
export async function enterExerciseFullscreen() {
  const cap = (window as any).Capacitor;
  if (cap?.isNativePlatform?.()) {
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      await StatusBar.hide();
    } catch { /* ignore */ }
  }
  try {
    const el = document.documentElement as any;
    if (!document.fullscreenElement && el.requestFullscreen) await el.requestFullscreen();
  } catch { /* مرورگر ممکن است تمام‌صفحه را اجازه ندهد */ }
  try { await (screen.orientation as any)?.lock?.('landscape'); } catch { /* قفل صفحه در بعضی WebViewها مجاز نیست */ }
  document.documentElement.classList.add('exercise-fullscreen');
}

export async function exitExerciseFullscreen() {
  const cap = (window as any).Capacitor;
  if (cap?.isNativePlatform?.()) {
    try {
      const { StatusBar } = await import('@capacitor/status-bar');
      await StatusBar.show();
    } catch { /* ignore */ }
  }
  try {
    if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
  } catch { /* ignore */ }
  try { await (screen.orientation as any)?.unlock?.(); } catch { /* ignore */ }
  document.documentElement.classList.remove('exercise-fullscreen');
}

export const vibrate = (ms = 60) => { try { navigator.vibrate?.(ms); } catch { /* ignore */ } };
