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
  "version": "1.1.0",
  "tag": "v1.1.0",
  "releaseType": "minor",
  "releasedAt": "2026-10-28T16:51:05Z",
  "assets": [
    {
      "id": "windows",
      "platform": "Windows 10/11 (x64 & ARM64)",
      "platformFa": "ویندوز ۱۰ و ۱۱ (نسخه اجرایی دسکتاپ)",
      "filename": "shahnameh-v1.1.0-windows-x64-executable.zip",
      "latestAlias": "shahnameh-latest-windows-x64.zip",
      "downloadUrl": "/releases/shahnameh-v1.1.0-windows-x64-executable.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-windows-x64.zip",
      "sizeFormatted": "0.35 MB",
      "sha256": "1f2763bcdfeb8c75425f31b638a29be971fa3e0598959f9a98c986d1b4322f09",
      "format": ".bat / .exe (Electron & WebView2)"
    },
    {
      "id": "macos",
      "platform": "macOS Universal (Apple Silicon & Intel)",
      "platformFa": "مک‌اواس (Apple Silicon M1-M4 و Intel)",
      "filename": "shahnameh-v1.1.0-macos-universal-app.zip",
      "latestAlias": "shahnameh-latest-macos-universal.zip",
      "downloadUrl": "/releases/shahnameh-v1.1.0-macos-universal-app.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-macos-universal.zip",
      "sizeFormatted": "0.35 MB",
      "sha256": "4183bae57be27fbc45aaebffe3c25f01b272e56293f0144b05ad9b19fab80a2e",
      "format": "Razmnameh.app Bundle"
    },
    {
      "id": "linux",
      "platform": "Linux Desktop & Steam Deck (x64 / ARM64)",
      "platformFa": "لینوکس و استیم‌دک (نسخه اجرایی .sh / .desktop)",
      "filename": "shahnameh-v1.1.0-linux-x64-executable.zip",
      "latestAlias": "shahnameh-latest-linux-x64.zip",
      "downloadUrl": "/releases/shahnameh-v1.1.0-linux-x64-executable.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-linux-x64.zip",
      "sizeFormatted": "0.35 MB",
      "sha256": "e3316da39a2fb15ccd9b35b52e9055e44754131799a44ceffc7ece950e2cad78",
      "format": ".sh / .desktop / Electron"
    },
    {
      "id": "android",
      "platform": "Android 8.0+ (APK / AAB & Capacitor)",
      "platformFa": "اندروید (پکیج ساخت خودکار APK و Capacitor)",
      "filename": "shahnameh-v1.1.0-android-apk-bundle.zip",
      "latestAlias": "shahnameh-latest-android-apk.zip",
      "downloadUrl": "/releases/shahnameh-v1.1.0-android-apk-bundle.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-android-apk.zip",
      "sizeFormatted": "0.35 MB",
      "sha256": "0823ef60065826df2ccffe9c38bc4d45aa1625d7c6360b12b6c44bc88cac84f7",
      "format": "APK Builder + Capacitor"
    },
    {
      "id": "ios",
      "platform": "iOS & iPadOS 15+ (MobileConfig + Xcode Capacitor)",
      "platformFa": "آیفون و آیپد (پروفایل نصب مستقیم .mobileconfig و Xcode)",
      "filename": "shahnameh-v1.1.0-ios-ipados-bundle.zip",
      "latestAlias": "shahnameh-latest-ios-ipados.zip",
      "downloadUrl": "/releases/shahnameh-v1.1.0-ios-ipados-bundle.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-ios-ipados.zip",
      "sizeFormatted": "0.35 MB",
      "sha256": "b5fdca8a99fa5eadcee03d85895e1cb5b305da4de6a4e750a915e6387a73d6d9",
      "format": ".mobileconfig + Xcode"
    },
    {
      "id": "web",
      "platform": "Web & Offline PWA (All Browsers & Servers)",
      "platformFa": "نسخه وب و اپلیکیشن پیش‌رونده آفلاین (PWA)",
      "filename": "shahnameh-v1.1.0-web-pwa.zip",
      "latestAlias": "shahnameh-latest-web-pwa.zip",
      "downloadUrl": "/releases/shahnameh-v1.1.0-web-pwa.zip",
      "latestDownloadUrl": "/releases/shahnameh-latest-web-pwa.zip",
      "sizeFormatted": "0.35 MB",
      "sha256": "268d265370a8d4fcbd5148a22af52827b94f0edadaefb91d30aba7fb0c1b4d9e",
      "format": "Static PWA + Service Worker"
    }
  ],
  "history": [
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
