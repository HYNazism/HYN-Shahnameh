## Verified release status / وضعیت واقعی انتشار

The latest published [`v1.0.11` release](https://github.com/HYNazism/HYN-Shahnameh/releases/tag/v1.0.11) contains six platform ZIP archives for Windows x64, macOS universal, Linux x64, Android, iOS/iPadOS, and Web/PWA, plus a release manifest and SHA-256 checksums. These are ZIP containers, not direct installer files; no standalone .exe, .apk, .dmg, .AppImage, or .ipa is attached. The current package.json version is 2.7.1, separate from the automated GitHub release tag v1.0.11.

انتشار جدید [`v1.0.11`](https://github.com/HYNazism/HYN-Shahnameh/releases/tag/v1.0.11) شامل شش آرشیو ZIP برای Windows x64، macOS universal، Linux x64، Android، iOS/iPadOS و وب/PWA به‌همراه مانیفست و checksumهای SHA-256 است. این‌ها آرشیو هستند، نه فایل نصب مستقل؛ فایل .exe، .apk، .dmg، .AppImage یا .ipa مستقیماً پیوست نشده است. نسخه package.json برابر 2.7.1 و جدا از برچسب انتشار خودکار v1.0.11 است.

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
