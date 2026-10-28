# رزم‌نامه: نبرد افسانه‌ای شاهنامه | Razmnameh v1.1.0
**انتشار رسمی خودکار چندپلتفرمه برای تمامی دستگاه‌ها و سیستم‌عامل‌ها (MINOR RELEASE)**
**Official Automated Multi-Platform Release for All Devices & Operating Systems**

---

## 🇮🇷 خلاصه تغییرات نسخه v1.1.0 (2026-10-28)
- **نوع انتشار:** ساب‌ورژن ویژگی جدید (Minor Sub-Version)
- راه‌اندازی موتور انتشار خودکار سمانتیک (Sub-version & Major) و پکیج اجرایی ۶ دستگاه
- سبک بصری **نقاشی قهوه‌خانه‌ای اصیل (Qahveh-Khaneh Style)** با خطوط محیطی قوی و جزئیات بزرگسالانه برای تمامی پهلوانان، دیوان و هماوردان.
- لایه مدیریت هوشمند روایت (**StoryLogicManager**) جهت تطبیق کامل دیالوگ‌ها، سپاهیان پیش‌رو و هماوردان بر اساس قهرمان انتخابی.

---

## 📦 بسته‌های اجرایی آماده دانلود برای هر دستگاه (Executable Release Assets - v1.1.0):

| نام فایل اجرایی | پلتفرم و دستگاه هدف | فرمت اجرایی | حجم | کد اعتبارسنجی SHA-256 |
| :--- | :--- | :--- | :--- | :--- |
| `shahnameh-v1.1.0-windows-x64-executable.zip` | ویندوز ۱۰ و ۱۱ (نسخه اجرایی دسکتاپ) | `.bat / .exe (Electron & WebView2)` | `0.35 MB` | `1f2763bcdfeb8c75...` |
| `shahnameh-v1.1.0-macos-universal-app.zip` | مک‌اواس (Apple Silicon M1-M4 و Intel) | `Razmnameh.app Bundle` | `0.35 MB` | `4183bae57be27fbc...` |
| `shahnameh-v1.1.0-linux-x64-executable.zip` | لینوکس و استیم‌دک (نسخه اجرایی .sh / .desktop) | `.sh / .desktop / Electron` | `0.35 MB` | `e3316da39a2fb15c...` |
| `shahnameh-v1.1.0-android-apk-bundle.zip` | اندروید (پکیج ساخت خودکار APK و Capacitor) | `APK Builder + Capacitor` | `0.35 MB` | `0823ef60065826df...` |
| `shahnameh-v1.1.0-ios-ipados-bundle.zip` | آیفون و آیپد (پروفایل نصب مستقیم .mobileconfig و Xcode) | `.mobileconfig + Xcode` | `0.35 MB` | `b5fdca8a99fa5ead...` |
| `shahnameh-v1.1.0-web-pwa.zip` | نسخه وب و اپلیکیشن پیش‌رونده آفلاین (PWA) | `Static PWA + Service Worker` | `0.35 MB` | `268d265370a8d4fc...` |
| `sha256sums.txt` | تمامی پلتفرم‌ها | فایل هش امنیتی SHA-256 | `1 KB` | اعتبارسنجی رسمی |

---

## 🖥️ راهنمای اجرای مستقیم روی هر دستگاه:

### ۱. ویندوز ۱۰ و ۱۱ (`shahnameh-v1.1.0-windows-x64-executable.zip`)
- فایل فشرده را استخراج کرده و مستقیم روی فایل اجرایی **`Razmnameh-Windows-Start.bat`** دوبار کلیک کنید تا بازی در پنجره اختصاصی بدون فریم اجرا شود، یا دستور `npm run build:exe` را برای ساخت نصاب `.exe` اجرا نمایید.

### ۲. مک‌اواس Apple Silicon & Intel (`shahnameh-v1.1.0-macos-universal-app.zip`)
- فایل فشرده را استخراج کرده و برنامه **`Razmnameh.app`** را مستقیم اجرا کنید یا به پوشه `Applications` منتقل نمایید.

### ۳. لینوکس و استیم‌دک (`shahnameh-v1.1.0-linux-x64-executable.zip`)
- فایل فشرده را استخراج کرده و فایل اجرایی **`./razmnameh-linux.sh`** یا شورتکات دسکتاپ **`Razmnameh.desktop`** را اجرا نمایید.

### ۴. اندروید (`shahnameh-v1.1.0-android-apk-bundle.zip`)
- اسکریپت یک‌کلیکی **`./build-android-apk.sh`** را اجرا کنید تا فایل نصبی `app-debug.apk` به صورت خودکار کامپایل شود.

### ۵. آیفون و آیپد (`shahnameh-v1.1.0-ios-ipados-bundle.zip`)
- پروفایل نصبی **`Razmnameh-iOS-Fullscreen.mobileconfig`** را روی آیفون یا آیپد باز کرده و نصب کنید تا آیکون تمام‌صفحه بازی روی صفحه اصلی دستگاه اضافه شود.

### ۶. وب و سرورهای ابری (`shahnameh-v1.1.0-web-pwa.zip`)
- آماده آپلود روی هر هاست، سرور، Vercel، Cloudflare Pages و نصب آفلاین PWA.

---

## 💎 آدرس‌های رسمی کیف پول توسعه‌دهنده (Creator Crypto Vaults):
- **Bitcoin (BTC):** `bc1qqjfn0wdap5dphrx89kp8u7tux6ynj227msrlq4`
- **Ethereum (ERC-20) / USDT (BEP-20):** `0x7Abd8370a0878cCF3bC36811c7a5cC71Ac027E9A`
- **TON:** `UQDR4WPq0mF7e6wpvBKspdsnhe3mXLtBmjgenmSfK-DL6svK`
- **USDT (TRC-20):** `TEZgraBLWUAoZK48BeB7YippCXCwwCbFrL`
