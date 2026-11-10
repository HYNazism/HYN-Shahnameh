## Verified release status / وضعیت واقعی انتشار

The published [`v1.0.6` release](https://github.com/HYNazism/HYN-Shahnameh/releases/tag/v1.0.6) contains six platform `.zip` archives (Windows x64, macOS universal app, Linux x64, Android APK bundle, iOS/iPadOS bundle, and Web/PWA), plus a release manifest and SHA-256 checksums. The downloadable release assets are ZIP archives; no standalone `.exe`, `.apk`, `.dmg`, `.AppImage`, or `.ipa` is attached directly. The current `package.json` version is `2.7.1`, while the automated GitHub release tag is `v1.0.6`; these version schemes are separate.

انتشار فعلی [`v1.0.6`](https://github.com/HYNazism/HYN-Shahnameh/releases/tag/v1.0.6) شامل شش آرشیو `.zip` برای Windows x64، برنامهٔ Universal مک، Linux x64، بستهٔ ساخت APK اندروید، بستهٔ iOS/iPadOS و وب/PWA به‌همراه مانیفست انتشار و checksumهای SHA-256 است. فایل‌های قابل‌دانلود انتشار ZIP هستند؛ فایل مستقل `.exe`، `.apk`، `.dmg`، `.AppImage` یا `.ipa` مستقیماً پیوست نشده است. نسخهٔ فعلی `package.json` برابر `2.7.1` است، اما تگ خودکار انتشار GitHub برابر `v1.0.6` است؛ این دو شیوهٔ شماره‌گذاری جدا هستند.

---

## فارسی

Razmnameh یک بازی دوبعدی اکشن-پلتفرمر الهام‌گرفته از شاهنامهٔ فردوسی است. این پروژه با React 19، TypeScript و Vite ساخته شده و برای اجرا در مرورگرهای دسکتاپ و موبایل طراحی شده است. سازگاری و کارایی به دستگاه و مرورگر بستگی دارد.

### دریافت نسخه و وضعیت انتشار

- [انتشارهای GitHub](https://github.com/HYNazism/HYN-Shahnameh/releases)
- نسخهٔ فعلی `package.json` برابر `2.7.1` است.
- گردش‌کار انتشار فعلی فایل‌های ZIP و checksum می‌سازد. ZIPهای موجود شامل دارایی‌های وب و/یا اسکریپت‌های اجرا و ساخت هستند؛ آن‌ها نصاب بومی `.exe` یا فایل نصب‌شدنی `.apk` نیستند. پیش از معرفی بستهٔ بومی به‌عنوان دانلود مستقیم، آن را جداگانه بسازید و آزمایش کنید.

### توسعهٔ محلی

پیش‌نیازها: Node.js و npm.

```bash
git clone https://github.com/HYNazism/HYN-Shahnameh.git
cd HYN-Shahnameh
npm install --legacy-peer-deps
npm run dev
```

Vite سرور توسعه را روی درگاه `3000` اجرا می‌کند. برای بررسی TypeScript و ساخت برنامهٔ وب:

```bash
npm run lint
npm run build
```

برای ساخت آرشیوهای انتشار محلی:

```bash
npm run build:releases
```

این فرمان بسته‌بندی تعریف‌شده در `scripts/build-releases.js` را اجرا می‌کند و به‌تنهایی تضمین‌کنندهٔ نصاب بومی برای همهٔ سیستم‌عامل‌ها نیست.

### فناوری‌ها و مجوز

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Capacitor · Electron.

در حال حاضر فایل `LICENSE` در مخزن وجود ندارد؛ بنابراین مجوز استفادهٔ مجدد یا بازتوزیع اعلام نشده است. برای مشخص‌کردن حقوق استفاده، مالک پروژه باید فایل مجوز اضافه کند.



---

## English

Razmnameh is a 2D action-platformer inspired by Ferdowsi's Shahnameh. It is built with React 19, TypeScript, and Vite, and is intended to run in desktop and mobile browsers. Compatibility and performance vary by device and browser.

### Downloads and release status

- [GitHub Releases](https://github.com/HYNazism/HYN-Shahnameh/releases)
- The current `package.json` version is `2.7.1`.
- The release workflow currently creates ZIP archives and checksums. Existing ZIPs contain web assets and/or launcher/build scripts; they are not native `.exe` installers or installable `.apk` files. Native packages must be built and verified separately before being advertised as direct downloads.

### Local development

Requirements: Node.js and npm.

```bash
git clone https://github.com/HYNazism/HYN-Shahnameh.git
cd HYN-Shahnameh
npm install --legacy-peer-deps
npm run dev
```

Vite starts the development server on port `3000`. To type-check and build the web app:

```bash
npm run lint
npm run build
```

To create the configured local release archives:

```bash
npm run build:releases
```

This runs the packaging defined in `scripts/build-releases.js`; it does not by itself guarantee native installers for every operating system.

### Technologies and license

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Capacitor · Electron.

There is currently no `LICENSE` file in the repository, so no reuse or redistribution license has been declared. The project owner should add a license file to specify usage rights.
