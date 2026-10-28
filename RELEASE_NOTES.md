# رزم‌نامه: نبرد افسانه‌ای شاهنامه | Razmnameh v1.0.0
**انتشار رسمی چندپلتفرمه برای تمامی دستگاه‌ها و سیستم‌عامل‌ها**
**Official Multi-Platform Release for All Devices & Operating Systems**

---

## 🇮🇷 معرفی نسخه ۱.۰.۰ (فارسی)

بازی حماسی **«رزم‌نامه: نبرد هفت‌خان رستم»** یک اثر اکشن دوبعدی با استانداردهای مدرن، اقتباس وفادارانه از شاهنامه فردوسی، صداگذاری حماسی نقالی سنتی و بهینه‌سازی شده برای اجرا روی تمامی پلتفرم‌ها است.

### 🌟 ویژگی‌های برجسته:
1. **پشتیبانی کامل از تمامی دستگاه‌ها و صفحات نمایش:**
   - مقیاس‌بندی هوشمند خودکار روی گوشی‌های کشیده، تبلت‌های عریض و مانیتورهای دسکتاپ.
   - رعایت حریم ایمن بریدگی دوربین و ناچ گوشی‌ها (`safe-area-inset`).
   - پشتیبانی از زبان‌های راست‌به‌چپ (فارسی) و چپ‌به‌راست (انگلیسی، فرانسوی، ترکی).
2. **سیستم کنترل لمسی مجازی شناور (Virtual D-pad):**
   - جوی‌استیک شناور و دکمه‌های کنترلی با فیدبک لرزشی (Haptic Feedback) و شخصی‌سازی شفافیت و موقعیت.
3. **نبرد داستانی و میدان هماوردی (Duel Arena):**
   - هفت‌خان رستم به همراه نبرد تن‌به‌تن با هوش مصنوعی دیو سپید، اژدها و شیر درنده.
4. **درگاه درآمدزایی وب۳ و حمایت از توسعه‌دهنده:**
   - کیف پول‌های تایید شده: TON، USDT TRC20، USDT BEP20، Ethereum و Bitcoin.
5. **قابلیت نصب کامل PWA و آفلاین:**
   - عملکرد کامل آفلاین به همراه Service Worker و آیکون‌های استاندارد ماسک‌بل.

---

## 📦 بسته‌های خروجی آماده دانلود در این نسخه (Release Assets):

| نام بسته | پلتفرم هدف | توضیحات |
| :--- | :--- | :--- |
| `shahnameh-v1.0.0-web-pwa.zip` | وب، هاست و سرورها | نسخه کامپایل‌شده برای انتشار روی وب‌سرور، Vercel، کلودفلر و نصب PWA |
| `shahnameh-v1.0.0-android-package.zip` | اندروید (APK & AAB) | پروژه آماده Capacitor جهت تولید فایل نصبی APK برای گوشی‌های اندروید |
| `shahnameh-v1.0.0-desktop-bundle.zip` | کامپیوتر (Windows, Mac, Linux) | پکیج اجرای نیتیو دسکتاپ با الکترون |
| `sha256sums.txt` | اعتبارسنجی امنیتی | کدهای اعتبارسنجی SHA-256 کلیه فایل‌ها |

---

## 📱 راهنمای نصب و اجرای هر پلتفرم:

### ۱. نصب روی گوشی‌های اندروید (Android):
- **روش اول (نصب آنی وب‌اپ):** با مرورگر کروم آدرس بازی را باز کنید و دکمه سبز «نصب برنامه» یا «Install App» را بزنید.
- **روش دوم (ساخت فایل نصبی APK):**
  1. بسته `shahnameh-v1.0.0-android-package.zip` را استخراج کنید.
  2. در ترمینال دستورات زیر را وارد کنید:
     ```bash
     npm install @capacitor/core @capacitor/android @capacitor/cli
     npx cap add android
     npx cap open android
     ```
  3. در اندروید استودیو دکمه **Build APK** را بزنید.

### ۲. نصب روی آیفون و آیپد (iOS):
1. در مرورگر Safari آدرس بازی را باز کنید.
2. دکمه **Share** (اشتراک‌گذاری در نوار پایین) را لمس کنید.
3. گزینه **Add to Home Screen** را انتخاب کرده و **Add** را بزنید تا بازی تمام‌صفحه نصب شود.

### ۳. اجرای نسخه دسکتاپ (Windows, macOS, Linux):
1. بسته `shahnameh-v1.0.0-desktop-bundle.zip` را استخراج کنید.
2. دستورات زیر را اجرا کنید:
   ```bash
   npm install electron
   npx electron .
   ```

---

## 💎 آدرس‌های رسمی کیف پول توسعه‌دهنده (Creator Crypto Vaults):
- **TON:** `UQDR4WPq0mF7e6wpvBKspdsnhe3mXLtBmjgenmSfK-DL6svK`
- **USDT (TRC-20):** `TEZgraBLWUAoZK48BeB7YippCXCwwCbFrL`
- **USDT (BEP-20):** `0x7Abd8370a0878cCF3bC36811c7a5cC71Ac027E9A`
- **Ethereum (ERC-20):** `0x7Abd8370a0878cCF3bC36811c7a5cC71Ac027E9A`
- **Bitcoin (BTC):** `bc1qqjfn0wdap5dphrx89kp8u7tux6ynj227msrlq4`

---

## 🇬🇧 English Summary

**Razmnameh: Legends of Shahnameh v1.0.0** is an epic 2D action platformer and arena fighter inspired by Ferdowsi's Shahnameh, built with modern web technologies, full responsive auto-scaling for every display ratio, offline PWA compliance, virtual touch controls with haptic feedback, and cross-platform native packaging (Android Capacitor, Electron Desktop, and Web PWA).
