#!/usr/bin/env python3
import os
import sys
import shutil
import zipfile
import hashlib

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def zip_directory(source_dir, output_zip, arc_prefix=''):
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(source_dir):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, source_dir)
                arc_name = os.path.join(arc_prefix, rel_path) if arc_prefix else rel_path
                zf.write(abs_path, arc_name)

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    dist_dir = os.path.join(root_dir, 'dist')
    release_dir = os.path.join(root_dir, 'release-dist')

    if not os.path.exists(dist_dir):
        print(f"Error: {dist_dir} does not exist. Please run 'npm run build' first.")
        sys.exit(1)

    os.makedirs(release_dir, exist_ok=True)
    print("==================================================")
    print("🚀 Packaging Razmnameh Multi-Platform Releases v1.0.0")
    print("==================================================")

    generated_files = []

    # 1. Web & PWA Package
    web_zip = os.path.join(release_dir, 'shahnameh-v1.0.0-web-pwa.zip')
    print(f"📦 Creating Web & PWA package: {os.path.basename(web_zip)}")
    zip_directory(dist_dir, web_zip, arc_prefix='shahnameh-web-pwa')
    generated_files.append(web_zip)

    # 2. Android Package (Capacitor & Native TWA)
    android_stage = os.path.join(release_dir, 'android-staging')
    if os.path.exists(android_stage):
        shutil.rmtree(android_stage)
    os.makedirs(android_stage, exist_ok=True)
    
    # Copy dist into android staging
    shutil.copytree(dist_dir, os.path.join(android_stage, 'dist'))
    
    # Copy capacitor config & package.json
    for filename in ['capacitor.config.json', 'package.json']:
        src = os.path.join(root_dir, filename)
        if os.path.exists(src):
            shutil.copy(src, android_stage)
            
    # Add Android Quickstart Guide
    android_readme = os.path.join(android_stage, 'ANDROID_README.md')
    with open(android_readme, 'w', encoding='utf-8') as f:
        f.write("""# راهنمای اجرای خروجی اندروید (Android APK / AAB)
این بسته شامل کلیه فایل‌های وب کامپایل‌شده به همراه تنظیمات Capacitor برای سیستم‌عامل اندروید است.

## مراحل ساخت فایل نصب APK در Android Studio:
۱. پیش‌نیاز: نصب Node.js و Android Studio
۲. اجرای دستور نصب پیش‌نیازها:
   npm install @capacitor/core @capacitor/android @capacitor/cli
۳. مقداردهی اولیه پلتفرم اندروید:
   npx cap add android
۴. همگام‌سازی فایل‌های بازی با اندروید:
   npx cap sync android
۵. باز کردن پروژه در محیط اندروید استودیو:
   npx cap open android
۶. از منوی Build گزینه Build APK یا Generate Signed Bundle را انتخاب فرمایید.
""")

    android_zip = os.path.join(release_dir, 'shahnameh-v1.0.0-android-package.zip')
    print(f"📦 Creating Android package: {os.path.basename(android_zip)}")
    zip_directory(android_stage, android_zip, arc_prefix='shahnameh-android')
    shutil.rmtree(android_stage)
    generated_files.append(android_zip)

    # 3. Desktop Application Package (Electron)
    desktop_stage = os.path.join(release_dir, 'desktop-staging')
    if os.path.exists(desktop_stage):
        shutil.rmtree(desktop_stage)
    os.makedirs(desktop_stage, exist_ok=True)

    shutil.copytree(dist_dir, os.path.join(desktop_stage, 'dist'))
    electron_src = os.path.join(root_dir, 'electron')
    if os.path.exists(electron_src):
        shutil.copytree(electron_src, os.path.join(desktop_stage, 'electron'))

    # Package.json for desktop runner
    desktop_package_json = os.path.join(desktop_stage, 'package.json')
    with open(desktop_package_json, 'w', encoding='utf-8') as f:
        f.write("""{
  "name": "razmnameh-desktop",
  "version": "1.0.0",
  "main": "electron/main.cjs",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^33.0.0"
  }
}""")

    desktop_readme = os.path.join(desktop_stage, 'DESKTOP_README.md')
    with open(desktop_readme, 'w', encoding='utf-8') as f:
        f.write("""# راهنمای اجرای نسخه دسکتاپ (Windows / macOS / Linux)

## روش اجرا:
۱. در این پوشه دستور زیر را اجرا کنید:
   npm install electron
۲. برای اجرای بازی:
   npx electron .
""")

    desktop_zip = os.path.join(release_dir, 'shahnameh-v1.0.0-desktop-bundle.zip')
    print(f"📦 Creating Desktop package: {os.path.basename(desktop_zip)}")
    zip_directory(desktop_stage, desktop_zip, arc_prefix='shahnameh-desktop')
    shutil.rmtree(desktop_stage)
    generated_files.append(desktop_zip)

    # 4. Generate Checksums
    checksum_file = os.path.join(release_dir, 'sha256sums.txt')
    with open(checksum_file, 'w', encoding='utf-8') as f:
        for filepath in generated_files:
            filename = os.path.basename(filepath)
            size_mb = os.path.getsize(filepath) / (1024 * 1024)
            sha = sha256_file(filepath)
            f.write(f"{sha}  {filename}\n")
            print(f"  ✓ {filename} ({size_mb:.2f} MB) -> {sha[:16]}...")

    print("==================================================")
    print(f"✅ All multi-platform packages created in: {release_dir}")
    print(f"🔒 Checksums saved to: {checksum_file}")
    print("==================================================")

if __name__ == '__main__':
    main()
