export interface PlatformReleaseAsset {
  id: 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web';
  platform: string;
  platformFa: string;
  filename: string;
  latestAlias: string;
  downloadUrl: string;
  latestDownloadUrl: string;
  sizeFormatted: string;
  sha256: string;
  format: string;
}

export interface ReleaseHistoryEntry {
  version: string;
  tag: string;
  type: 'major' | 'minor' | 'patch';
  date: string;
  titleFa: string;
  titleEn: string;
  highlightsFa: string[];
}

export interface ReleaseMetadata {
  version: string;
  tag: string;
  releaseType: 'major' | 'minor' | 'patch';
  releasedAt: string;
  assets: PlatformReleaseAsset[];
  history: ReleaseHistoryEntry[];
}

export const CURRENT_RELEASE_INFO: ReleaseMetadata = {
  "version": "2.7.1",
  "tag": "v2.7.1",
  "releaseType": "patch",
  "releasedAt": "2026-10-29T15:42:46Z",
  "assets": [
    {
      "id": "windows",
      "platform": "Windows 10/11 (x64 & ARM64)",
      "platformFa": "ویندوز ۱۰ و ۱۱ (نسخه اجرایی دسکتاپ)",
      "filename": "shahnameh-v2.7.1-windows-x64-executable.zip",
      "latestAlias": "shahnameh-latest-windows-x64.zip",
      "downloadUrl": "/releases/shahnameh-v2.7.1-windows-x64-executable.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-windows-x64.zip",
      "sizeFormatted": "0.39 MB",
      "sha256": "152f004ebac892291767d1159c5905c6017586ffa706bd8e57a38c4eb84009a9",
      "format": ".bat / .exe (Electron & WebView2)"
    },
    {
      "id": "macos",
      "platform": "macOS Universal (Apple Silicon & Intel)",
      "platformFa": "مک‌اواس (Apple Silicon M1-M4 و Intel)",
      "filename": "shahnameh-v2.7.1-macos-universal-app.zip",
      "latestAlias": "shahnameh-latest-macos-universal.zip",
      "downloadUrl": "/releases/shahnameh-v2.7.1-macos-universal-app.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-macos-universal.zip",
      "sizeFormatted": "0.39 MB",
      "sha256": "ef71ffbfe2b1ceed81ec885d1e2b9e6aeedc1bd691dd37f13538f6ad3f346a4d",
      "format": "Razmnameh.app Bundle"
    },
    {
      "id": "linux",
      "platform": "Linux Desktop & Steam Deck (x64 / ARM64)",
      "platformFa": "لینوکس و استیم‌دک (نسخه اجرایی .sh / .desktop)",
      "filename": "shahnameh-v2.7.1-linux-x64-executable.zip",
      "latestAlias": "shahnameh-latest-linux-x64.zip",
      "downloadUrl": "/releases/shahnameh-v2.7.1-linux-x64-executable.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-linux-x64.zip",
      "sizeFormatted": "0.39 MB",
      "sha256": "676a8061dc6be3dcc683c5045a7815a76bafe51b9e6f42d9546564ef6b260c4e",
      "format": ".sh / .desktop / Electron"
    },
    {
      "id": "android",
      "platform": "Android 8.0+ (APK / AAB & Capacitor)",
      "platformFa": "اندروید (پکیج ساخت خودکار APK و Capacitor)",
      "filename": "shahnameh-v2.7.1-android-apk-bundle.zip",
      "latestAlias": "shahnameh-latest-android-apk.zip",
      "downloadUrl": "/releases/shahnameh-v2.7.1-android-apk-bundle.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-android-apk.zip",
      "sizeFormatted": "0.39 MB",
      "sha256": "992eaaf722fcbd189fbec631e8458e1319601ba7a91ca1588acdb91cd8670b3a",
      "format": "APK Builder + Capacitor"
    },
    {
      "id": "ios",
      "platform": "iOS & iPadOS 15+ (MobileConfig + Xcode Capacitor)",
      "platformFa": "آیفون و آیپد (پروفایل نصب مستقیم .mobileconfig و Xcode)",
      "filename": "shahnameh-v2.7.1-ios-ipados-bundle.zip",
      "latestAlias": "shahnameh-latest-ios-ipados.zip",
      "downloadUrl": "/releases/shahnameh-v2.7.1-ios-ipados-bundle.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-ios-ipados.zip",
      "sizeFormatted": "0.39 MB",
      "sha256": "c9e6119c7d1389a68a2b214d28e5a09fee6b3e5572ea1075ac32620e6fac484d",
      "format": ".mobileconfig + Xcode"
    },
    {
      "id": "web",
      "platform": "Web & Offline PWA (All Browsers & Servers)",
      "platformFa": "نسخه وب و اپلیکیشن پیش‌رونده آفلاین (PWA)",
      "filename": "shahnameh-v2.7.1-web-pwa.zip",
      "latestAlias": "shahnameh-latest-web-pwa.zip",
      "downloadUrl": "/releases/shahnameh-v2.7.1-web-pwa.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-web-pwa.zip",
      "sizeFormatted": "0.38 MB",
      "sha256": "862d2cce0fcd85040a1d3221bcfb7c2c0d71468fcc652b164dd358fc80f5ea58",
      "format": "Static PWA + Service Worker"
    }
  ],
  "history": [
    {
      "version": "2.7.1",
      "tag": "v2.7.1",
      "type": "patch",
      "date": "2026-10-29",
      "titleFa": "انتشار خودکار ساب‌ورژن v2.7.1 با خروجی اجرایی ۶ پلتفرم",
      "titleEn": "Automated PATCH Multi-Platform Release v2.7.1",
      "highlightsFa": [
        "به‌روزرسانی و بهینه‌سازی خودکار تمامی نسخه‌های اجرایی چندپلتفرمه",
        "تولید خودکار ۶ پکیج اجرایی مجزا (Windows, macOS .app, Linux, Android APK, iOS .mobileconfig, Web PWA) با امضای SHA-256"
      ]
    },
    {
      "version": "2.7.0",
      "tag": "v2.7.0",
      "type": "minor",
      "date": "2026-10-29",
      "titleFa": "--notes v2.7.0 — Complete Mature Shahnameh & Persian Miniature Redesign (Tahmasbi, Baysonghori & Qahveh-Khaneh Synthesis, Illuminated Sarloh/Jadval/Katibeh Manuscript UI, Engraved Jawshan & Damascus Steel Combat)",
      "titleEn": "Automated MINOR Multi-Platform Release v2.7.0",
      "highlightsFa": [
        "--notes v2.7.0 — Complete Mature Shahnameh & Persian Miniature Redesign (Tahmasbi, Baysonghori & Qahveh-Khaneh Synthesis, Illuminated Sarloh/Jadval/Katibeh Manuscript UI, Engraved Jawshan & Damascus Steel Combat)",
        "تولید خودکار ۶ پکیج اجرایی مجزا (Windows, macOS .app, Linux, Android APK, iOS .mobileconfig, Web PWA) با امضای SHA-256"
      ]
    },
    {
      "version": "2.6.1",
      "tag": "v2.6.1",
      "type": "patch",
      "date": "2026-10-29",
      "titleFa": "انتشار خودکار ساب‌ورژن v2.6.1 با خروجی اجرایی ۶ پلتفرم",
      "titleEn": "Automated PATCH Multi-Platform Release v2.6.1",
      "highlightsFa": [
        "به‌روزرسانی و بهینه‌سازی خودکار تمامی نسخه‌های اجرایی چندپلتفرمه",
        "تولید خودکار ۶ پکیج اجرایی مجزا (Windows, macOS .app, Linux, Android APK, iOS .mobileconfig, Web PWA) با امضای SHA-256"
      ]
    },
    {
      "version": "1.1.1",
      "tag": "v1.1.1",
      "type": "patch",
      "date": "2026-10-29",
      "titleFa": "انتشار خودکار ساب‌ورژن v1.1.1 و همگام‌سازی زنده مانیفست SHA-256 برای هر ۶ پلتفرم اجرایی",
      "titleEn": "Automated PATCH Multi-Platform Release v1.1.1",
      "highlightsFa": [
        "انتشار خودکار ساب‌ورژن v1.1.1 و همگام‌سازی زنده مانیفست SHA-256 برای هر ۶ پلتفرم اجرایی",
        "تولید خودکار ۶ پکیج اجرایی مجزا (Windows, macOS .app, Linux, Android APK, iOS .mobileconfig, Web PWA) با امضای SHA-256"
      ]
    },
    {
      "version": "1.1.0",
      "tag": "v1.1.0",
      "type": "minor",
      "date": "2026-10-28",
      "titleFa": "راه‌اندازی موتور انتشار خودکار سمانتیک (Sub-version & Major) و پکیج اجرایی ۶ دستگاه",
      "titleEn": "Automated MINOR Multi-Platform Release v1.1.0",
      "highlightsFa": [
        "راه‌اندازی موتور انتشار خودکار سمانتیک (Sub-version & Major) و پکیج اجرایی ۶ دستگاه",
        "تولید خودکار ۶ پکیج اجرایی مجزا (Windows, macOS .app, Linux, Android APK, iOS .mobileconfig, Web PWA) با امضای SHA-256"
      ]
    },
    {
      "version": "1.0.5",
      "tag": "v1.0.5",
      "type": "patch",
      "date": "2026-10-28",
      "titleFa": "سبک نقاشی قهوه‌خانه‌ای اصیل و مدیریت هوشمند منطق روایت (StoryLogicManager)",
      "titleEn": "Authentic Qahveh-Khaneh Art Style & StoryLogicManager",
      "highlightsFa": [
        "بازطراحی کامل اسپرایت‌های رستم، سهراب، گردآفرید، اسفندیار و دیوان به سبک نقاشی قهوه‌خانه‌ای بزرگسالانه",
        "پیاده‌سازی StoryLogicManager برای تطبیق کامل دیالوگ‌ها، سپاهیان پیش‌رو و هماوردان با قهرمان انتخاب‌شده"
      ]
    },
    {
      "version": "1.0.4",
      "tag": "v1.0.4",
      "type": "patch",
      "date": "2026-10-28",
      "titleFa": "رفع باگ ضربات پیاپی و محیط پارالاکس نگارگری ایرانی",
      "titleEn": "Combo Hit Fix & Persian Miniature Parallax Environment",
      "highlightsFa": [
        "رفع کامل باگ ریست شدن موقعیت کاراکتر هنگام کمبو و ضربات پیاپی",
        "افزودن پس‌زمینه‌های پویا به سبک مینیاتور ایرانی از دشت زابل تا غارهای تاریک مازندران"
      ]
    },
    {
      "version": "1.0.0",
      "tag": "v1.0.0",
      "type": "major",
      "date": "2026-10-28",
      "titleFa": "انتشار اولیه رزم‌نامه: نبرد اساطیری شاهنامه",
      "titleEn": "Initial Official Release of Razmnameh",
      "highlightsFa": [
        "هفت‌خان رستم، میدان دوئل تن‌به‌تن، درخت مهارت، نقالی صوتی و کیف پول‌های کریپتو"
      ]
    }
  ]
};
