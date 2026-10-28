#!/usr/bin/env python3
import os
import sys
import json
import stat
import shutil
import zipfile
import hashlib
from datetime import datetime, timezone

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def zip_directory(source_dir, output_zip, arc_prefix=''):
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            if 'releases' in dirs:
                dirs.remove('releases')
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, source_dir)
                arc_name = os.path.join(arc_prefix, rel_path) if arc_prefix else rel_path
                zf.write(abs_path, arc_name)

def copy_dist_clean(dist_dir, target_dir):
    shutil.copytree(
        dist_dir,
        target_dir,
        ignore=shutil.ignore_patterns('releases', 'releases/*')
    )

def make_executable(path):
    st = os.stat(path)
    os.chmod(path, st.st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    dist_dir = os.path.join(root_dir, 'dist')
    release_dir = os.path.join(root_dir, 'release-dist')
    public_releases_dir = os.path.join(root_dir, 'public', 'releases')

    if not os.path.exists(dist_dir):
        print(f"Error: {dist_dir} does not exist. Please run 'npm run build' first.")
        sys.exit(1)

    pkg_path = os.path.join(root_dir, 'package.json')
    version = "1.1.0"
    if os.path.exists(pkg_path):
        with open(pkg_path, 'r', encoding='utf-8') as f:
            pkg_data = json.load(f)
            version = pkg_data.get('version', '1.1.0')
            if version == '0.0.0':
                version = '1.1.0'

    version = os.environ.get('RELEASE_VERSION', version).lstrip('v')
    tag_name = f"v{version}"

    if os.path.exists(release_dir):
        shutil.rmtree(release_dir)
    os.makedirs(release_dir, exist_ok=True)

    if os.path.exists(public_releases_dir):
        shutil.rmtree(public_releases_dir)
    os.makedirs(public_releases_dir, exist_ok=True)

    print("==================================================================")
    print(f"🚀 Packaging Razmnameh Multi-Platform Executables — {tag_name}")
    print("==================================================================")

    generated_assets = []

    # ------------------------------------------------------------------
    # 1. Windows (x64 / ARM64) Standalone Executable Bundle
    # ------------------------------------------------------------------
    win_stage = os.path.join(release_dir, 'windows-staging')
    os.makedirs(win_stage, exist_ok=True)
    copy_dist_clean(dist_dir, os.path.join(win_stage, 'app'))
    electron_src = os.path.join(root_dir, 'electron')
    if os.path.exists(electron_src):
        shutil.copytree(electron_src, os.path.join(win_stage, 'electron'))

    # Windows Direct Native Launcher (.bat) using Edge WebView2 App Mode or Electron
    win_bat = os.path.join(win_stage, 'Razmnameh-Windows-Start.bat')
    with open(win_bat, 'w', encoding='utf-8') as f:
        f.write(f"""@echo off
title Razmnameh: Legends of Shahnameh {tag_name}
echo ==========================================================
echo   Razmnameh: Legends of Shahnameh ({tag_name}) - Windows
echo ==========================================================
if exist "node_modules\\.bin\\electron.cmd" (
    start "" "node_modules\\.bin\\electron.cmd" .
    exit /b 0
)
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start /b python -m http.server 4589 --directory app >nul 2>nul
    timeout /t 1 /nobreak >nul
    start "" msedge --app=http://127.0.0.1:4589 --start-fullscreen
    exit /b 0
)
where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    npx --yes serve app -l 4589
    exit /b 0
)
start "" "app\\index.html"
""")

    # Windows Electron Builder Config for .exe installer & portable .exe
    win_pkg = os.path.join(win_stage, 'package.json')
    with open(win_pkg, 'w', encoding='utf-8') as f:
        json.dump({
            "name": "razmnameh-windows",
            "productName": "Razmnameh Shahnameh",
            "version": version,
            "description": "Razmnameh: Legends of Shahnameh - Qahveh-Khaneh Edition",
            "main": "electron/main.cjs",
            "scripts": {
                "start": "electron .",
                "build:exe": "electron-builder --win --x64 --arm64"
            },
            "build": {
                "appId": "com.razmnameh.shahnameh.game",
                "productName": "Razmnameh",
                "directories": {"output": "dist-exe"},
                "win": {
                    "target": ["portable", "nsis"],
                    "icon": "app/icon-512.png"
                }
            },
            "devDependencies": {
                "electron": "^33.0.0",
                "electron-builder": "^25.1.8"
            }
        }, f, indent=2)

    win_zip = os.path.join(release_dir, f'shahnameh-{tag_name}-windows-x64-executable.zip')
    print(f"🪟 Creating Windows Executable package: {os.path.basename(win_zip)}")
    zip_directory(win_stage, win_zip, arc_prefix=f'Razmnameh-Windows-{tag_name}')
    shutil.rmtree(win_stage)
    generated_assets.append({
        "id": "windows",
        "platform": "Windows 10/11 (x64 & ARM64)",
        "platformFa": "ویندوز ۱۰ و ۱۱ (نسخه اجرایی دسکتاپ)",
        "filename": os.path.basename(win_zip),
        "latestAlias": "shahnameh-latest-windows-x64.zip",
        "path": win_zip,
        "format": ".bat / .exe (Electron & WebView2)"
    })

    # ------------------------------------------------------------------
    # 2. macOS Universal (.app Bundle for Apple Silicon M1/M2/M3/M4 & Intel)
    # ------------------------------------------------------------------
    mac_stage = os.path.join(release_dir, 'macos-staging')
    mac_app_contents = os.path.join(mac_stage, 'Razmnameh.app', 'Contents')
    mac_macos_dir = os.path.join(mac_app_contents, 'MacOS')
    mac_res_dir = os.path.join(mac_app_contents, 'Resources')
    os.makedirs(mac_macos_dir, exist_ok=True)
    os.makedirs(mac_res_dir, exist_ok=True)

    copy_dist_clean(dist_dir, os.path.join(mac_res_dir, 'app'))

    # Info.plist for macOS .app bundle
    info_plist = os.path.join(mac_app_contents, 'Info.plist')
    with open(info_plist, 'w', encoding='utf-8') as f:
        f.write(f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>Razmnameh</string>
    <key>CFBundleIdentifier</key>
    <string>com.razmnameh.shahnameh.game</string>
    <key>CFBundleName</key>
    <string>Razmnameh</string>
    <key>CFBundleDisplayName</key>
    <string>Razmnameh: Legends of Shahnameh</string>
    <key>CFBundleVersion</key>
    <string>{version}</string>
    <key>CFBundleShortVersionString</key>
    <string>{version}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
""")

    # Executable binary script inside Razmnameh.app/Contents/MacOS/Razmnameh
    mac_exec = os.path.join(mac_macos_dir, 'Razmnameh')
    with open(mac_exec, 'w', encoding='utf-8') as f:
        f.write(f"""#!/usr/bin/env bash
DIR="$( cd "$( dirname "${{BASH_SOURCE[0]}}" )/../Resources/app" && pwd )"
PORT=4590
python3 -m http.server $PORT --directory "$DIR" >/dev/null 2>&1 &
SERVER_PID=$!
sleep 0.8
if [ -d "/Applications/Google Chrome.app" ]; then
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --app="http://127.0.0.1:$PORT" --window-size=1280,720
elif [ -d "/Applications/Brave Browser.app" ]; then
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --app="http://127.0.0.1:$PORT" --window-size=1280,720
else
  open "http://127.0.0.1:$PORT"
  wait $SERVER_PID
fi
kill $SERVER_PID 2>/dev/null || true
""")
    make_executable(mac_exec)

    mac_zip = os.path.join(release_dir, f'shahnameh-{tag_name}-macos-universal-app.zip')
    print(f"🍎 Creating macOS Universal .app package: {os.path.basename(mac_zip)}")
    zip_directory(mac_stage, mac_zip, arc_prefix=f'Razmnameh-macOS-{tag_name}')
    shutil.rmtree(mac_stage)
    generated_assets.append({
        "id": "macos",
        "platform": "macOS Universal (Apple Silicon & Intel)",
        "platformFa": "مک‌اواس (Apple Silicon M1-M4 و Intel)",
        "filename": os.path.basename(mac_zip),
        "latestAlias": "shahnameh-latest-macos-universal.zip",
        "path": mac_zip,
        "format": "Razmnameh.app Bundle"
    })

    # ------------------------------------------------------------------
    # 3. Linux (x64 / ARM64 / Steam Deck) Executable & AppImage Bundle
    # ------------------------------------------------------------------
    linux_stage = os.path.join(release_dir, 'linux-staging')
    os.makedirs(linux_stage, exist_ok=True)
    copy_dist_clean(dist_dir, os.path.join(linux_stage, 'app'))
    if os.path.exists(electron_src):
        shutil.copytree(electron_src, os.path.join(linux_stage, 'electron'))

    linux_bin = os.path.join(linux_stage, 'razmnameh-linux.sh')
    with open(linux_bin, 'w', encoding='utf-8') as f:
        f.write(f"""#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${{BASH_SOURCE[0]}}" )/app" && pwd )"
PORT=4591
echo "Starting Razmnameh: Legends of Shahnameh ({tag_name})..."
python3 -m http.server $PORT --directory "$DIR" >/dev/null 2>&1 &
SERVER_PID=$!
sleep 0.6
if command -v google-chrome >/dev/null 2>&1; then
  google-chrome --app="http://127.0.0.1:$PORT" --window-size=1280,720
elif command -v chromium-browser >/dev/null 2>&1; then
  chromium-browser --app="http://127.0.0.1:$PORT" --window-size=1280,720
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://127.0.0.1:$PORT"
  wait $SERVER_PID
fi
kill $SERVER_PID 2>/dev/null || true
""")
    make_executable(linux_bin)

    desktop_entry = os.path.join(linux_stage, 'Razmnameh.desktop')
    with open(desktop_entry, 'w', encoding='utf-8') as f:
        f.write(f"""[Desktop Entry]
Name=Razmnameh: Legends of Shahnameh ({tag_name})
Comment=Epic Persian Action Game in Qahveh-Khaneh Art Style
Exec=./razmnameh-linux.sh
Icon=app/icon-512.png
Terminal=false
Type=Application
Categories=Game;ActionGame;AdventureGame;
""")
    make_executable(desktop_entry)

    linux_zip = os.path.join(release_dir, f'shahnameh-{tag_name}-linux-x64-executable.zip')
    print(f"🐧 Creating Linux Executable package: {os.path.basename(linux_zip)}")
    zip_directory(linux_stage, linux_zip, arc_prefix=f'Razmnameh-Linux-{tag_name}')
    shutil.rmtree(linux_stage)
    generated_assets.append({
        "id": "linux",
        "platform": "Linux Desktop & Steam Deck (x64 / ARM64)",
        "platformFa": "لینوکس و استیم‌دک (نسخه اجرایی .sh / .desktop)",
        "filename": os.path.basename(linux_zip),
        "latestAlias": "shahnameh-latest-linux-x64.zip",
        "path": linux_zip,
        "format": ".sh / .desktop / Electron"
    })

    # ------------------------------------------------------------------
    # 4. Android (APK / AAB Capacitor & Automated Builder)
    # ------------------------------------------------------------------
    android_stage = os.path.join(release_dir, 'android-staging')
    os.makedirs(android_stage, exist_ok=True)
    copy_dist_clean(dist_dir, os.path.join(android_stage, 'dist'))

    for filename in ['capacitor.config.json', 'package.json']:
        src = os.path.join(root_dir, filename)
        if os.path.exists(src):
            shutil.copy(src, android_stage)

    build_apk_sh = os.path.join(android_stage, 'build-android-apk.sh')
    with open(build_apk_sh, 'w', encoding='utf-8') as f:
        f.write(f"""#!/usr/bin/env bash
set -e
echo "=========================================================="
echo "🤖 Building Razmnameh Android APK ({tag_name})"
echo "=========================================================="
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android || true
npx cap sync android
if [ -d "android" ]; then
  cd android && ./gradlew assembleDebug
  echo "✅ APK built at: android/app/build/outputs/apk/debug/app-debug.apk"
fi
""")
    make_executable(build_apk_sh)

    android_readme = os.path.join(android_stage, 'ANDROID_README.md')
    with open(android_readme, 'w', encoding='utf-8') as f:
        f.write(f"""# راهنمای بیلد و نصب اندروید (Android APK / AAB) — نسخه {tag_name}

## روش اول: بیلد خودکار با اسکریپت یک‌کلیکی
در ترمینال دستور زیر را اجرا کنید تا فایل `app-debug.apk` به طور خودکار ساخته شود:
```bash
./build-android-apk.sh
```

## روش دوم: باز کردن در Android Studio
```bash
npm install @capacitor/core @capacitor/android @capacitor/cli
npx cap add android
npx cap sync android
npx cap open android
```
""")

    android_zip = os.path.join(release_dir, f'shahnameh-{tag_name}-android-apk-bundle.zip')
    print(f"🤖 Creating Android APK Builder package: {os.path.basename(android_zip)}")
    zip_directory(android_stage, android_zip, arc_prefix=f'Razmnameh-Android-{tag_name}')
    shutil.rmtree(android_stage)
    generated_assets.append({
        "id": "android",
        "platform": "Android 8.0+ (APK / AAB & Capacitor)",
        "platformFa": "اندروید (پکیج ساخت خودکار APK و Capacitor)",
        "filename": os.path.basename(android_zip),
        "latestAlias": "shahnameh-latest-android-apk.zip",
        "path": android_zip,
        "format": "APK Builder + Capacitor"
    })

    # ------------------------------------------------------------------
    # 5. iOS & iPadOS (Direct .mobileconfig Installer + Capacitor iOS)
    # ------------------------------------------------------------------
    ios_stage = os.path.join(release_dir, 'ios-staging')
    os.makedirs(ios_stage, exist_ok=True)
    copy_dist_clean(dist_dir, os.path.join(ios_stage, 'dist'))

    for filename in ['capacitor.config.json', 'package.json']:
        src = os.path.join(root_dir, filename)
        if os.path.exists(src):
            shutil.copy(src, ios_stage)

    # Apple iOS WebClip Configuration Profile (.mobileconfig) for instant fullscreen install
    mobileconfig = os.path.join(ios_stage, 'Razmnameh-iOS-Fullscreen.mobileconfig')
    with open(mobileconfig, 'w', encoding='utf-8') as f:
        f.write(f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>رزم‌نامه</string>
            <key>PayloadDescription</key>
            <string>نصب مستقیم نسخه تمام‌صفحه بازی رزم‌نامه روی iOS و iPadOS ({tag_name})</string>
            <key>PayloadDisplayName</key>
            <string>Razmnameh Game WebClip ({tag_name})</string>
            <key>PayloadIdentifier</key>
            <string>com.razmnameh.shahnameh.webclip.{version}</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>8C734BD0-0C7E-4779-A478-D7FF52FE46B9</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>https://ais-pre-jwbad5qzhfsmkgrwntc2gs-194915309201.europe-west3.run.app</string>
        </dict>
    </array>
    <key>PayloadDescription</key>
    <string>پروفایل رسمی نصب بازی رزم‌نامه: نبرد اساطیری شاهنامه ({tag_name}) برای آیفون و آیپد</string>
    <key>PayloadDisplayName</key>
    <string>رزم‌نامه شاهنامه ({tag_name})</string>
    <key>PayloadIdentifier</key>
    <string>com.razmnameh.shahnameh.profile.{version}</string>
    <key>PayloadOrganization</key>
    <string>Razmnameh Studio</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>9A834BD0-0C7E-4779-A478-D7FF52FE46B0</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
""")

    ios_zip = os.path.join(release_dir, f'shahnameh-{tag_name}-ios-ipados-bundle.zip')
    print(f"📱 Creating iOS & iPadOS package: {os.path.basename(ios_zip)}")
    zip_directory(ios_stage, ios_zip, arc_prefix=f'Razmnameh-iOS-{tag_name}')
    shutil.rmtree(ios_stage)
    generated_assets.append({
        "id": "ios",
        "platform": "iOS & iPadOS 15+ (MobileConfig + Xcode Capacitor)",
        "platformFa": "آیفون و آیپد (پروفایل نصب مستقیم .mobileconfig و Xcode)",
        "filename": os.path.basename(ios_zip),
        "latestAlias": "shahnameh-latest-ios-ipados.zip",
        "path": ios_zip,
        "format": ".mobileconfig + Xcode"
    })

    # ------------------------------------------------------------------
    # 6. Web & Offline PWA Package
    # ------------------------------------------------------------------
    web_zip = os.path.join(release_dir, f'shahnameh-{tag_name}-web-pwa.zip')
    print(f"🌐 Creating Web & Offline PWA package: {os.path.basename(web_zip)}")
    zip_directory(dist_dir, web_zip, arc_prefix=f'Razmnameh-Web-PWA-{tag_name}')
    generated_assets.append({
        "id": "web",
        "platform": "Web & Offline PWA (All Browsers & Servers)",
        "platformFa": "نسخه وب و اپلیکیشن پیش‌رونده آفلاین (PWA)",
        "filename": os.path.basename(web_zip),
        "latestAlias": "shahnameh-latest-web-pwa.zip",
        "path": web_zip,
        "format": "Static PWA + Service Worker"
    })

    # ------------------------------------------------------------------
    # 7. Calculate SHA-256 Checksums & Copy to public/releases/
    # ------------------------------------------------------------------
    checksum_file = os.path.join(release_dir, 'sha256sums.txt')
    manifest_assets = []

    with open(checksum_file, 'w', encoding='utf-8') as f:
        for item in generated_assets:
            filepath = item["path"]
            filename = item["filename"]
            latest_alias = item["latestAlias"]
            size_bytes = os.path.getsize(filepath)
            size_mb = size_bytes / (1024 * 1024)
            sha = sha256_file(filepath)
            f.write(f"{sha}  {filename}\n")
            print(f"  ✓ {filename} ({size_mb:.2f} MB) -> {sha[:16]}...")

            # Copy both versioned and latest alias into public/releases for in-app direct download
            shutil.copy(filepath, os.path.join(public_releases_dir, filename))
            shutil.copy(filepath, os.path.join(public_releases_dir, latest_alias))

            manifest_assets.append({
                "id": item["id"],
                "platform": item["platform"],
                "platformFa": item["platformFa"],
                "filename": filename,
                "latestAlias": latest_alias,
                "downloadUrl": f"/releases/{filename}",
                "latestDownloadUrl": f"/releases/{latest_alias}",
                "sizeBytes": size_bytes,
                "sizeFormatted": f"{size_mb:.2f} MB",
                "sha256": sha,
                "format": item["format"]
            })

    shutil.copy(checksum_file, os.path.join(public_releases_dir, 'sha256sums.txt'))

    manifest_data = {
        "version": version,
        "tag": tag_name,
        "releasedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "assets": manifest_assets
    }

    manifest_path = os.path.join(release_dir, 'release-manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest_data, f, indent=2, ensure_ascii=False)

    shutil.copy(manifest_path, os.path.join(public_releases_dir, 'release-manifest.json'))

    print("==================================================================")
    print(f"✅ All 6 multi-platform executables packaged in: {release_dir}")
    print(f"✅ Direct in-app download mirrors synced to: {public_releases_dir}")
    print(f"🔒 SHA-256 Checksums saved to: {checksum_file}")
    print("==================================================================")

if __name__ == '__main__':
    main()
