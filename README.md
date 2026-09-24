# دهکدهٔ ریاضی

بازی آموزشی ریاضی پایهٔ اول دبستان با React، TypeScript، Vite و Capacitor؛ هم‌خانوادهٔ «دهکدهٔ الفبا».

## اجرای محلی

```bash
npm install
npm run dev
```

## ساخت وب

```bash
npm run build
npm run preview
```

## ساخت Android

نیازمند Android Studio، JDK 21 و Android SDK است:

```bash
npm install
npm run android:add   # فقط بار اول
npm run android:sync
npm run android:open
```

در Android Studio گزینه Build APK را اجرا کنید. برای GitHub کافی است پروژه را روی شاخه `main` پوش کنید یا workflow با نام **Build Android APK** را دستی اجرا کنید؛ فایل APK در Artifacts همان اجرا قرار می‌گیرد.

## معماری

تحلیل آموزشی کامل و معماری در `ANALYSIS-FA.md` است. تمرین‌ها داده‌اند (`src/math/exercises.ts`) و موتور اجرا از UI جداست.
