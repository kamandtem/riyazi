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
    // پرداخت درون‌برنامه‌ای کافه‌بازار؛ کلید RSA از پنل بازار (بخش پرداخت درون‌برنامه‌ای)
    BazaarBilling: {
      rsaPublicKey: 'MIHNMA0GCSqGSIb3DQEBAQUAA4G7ADCBtwKBrwDCkiiZvKD9AKEH5JK8U5F9RsPzADGWjlaamkofloVjxtMdmJvnzfRra9pgqZh6Ava3Y+u75R8npVLRPP5lX5WTsTeMpjwLEvLNEO1z+3f6nSB69+JPEB3OBIT46X9nhQpnjIqLWy58PwTozj96S+itiQNfNhdo2S5OYpecUesKyNHbNkfEI5MekdYBoo/oSl0vAz5/maRXlnPeZ+BDbS0QNsPzW85ucjzQPIVlqokCAwEAAQ==',
      productId: 'riaziaval',
    },
    StatusBar: { overlaysWebView: false, style: 'DARK', backgroundColor: '#57C3F1' },
  },
};
export default config;
