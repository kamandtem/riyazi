import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'ir.riazi.village',
  appName: 'دهکده ریاضی',
  webDir: 'dist',
  backgroundColor: '#57C3F1',
  server: { androidScheme: 'https' },
  android: {
    // در اندروید ۱۵ به بعد، محتوا زیر نوار ساعت/باتری و نوار دکمه‌های پایین نمی‌رود
    adjustMarginsForEdgeToEdge: 'auto',
  },
  plugins: {
    StatusBar: { overlaysWebView: false, style: 'DARK', backgroundColor: '#57C3F1' },
  },
};
export default config;
