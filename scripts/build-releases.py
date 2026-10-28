#!/usr/bin/env python3
import os
import sys
import json
import shutil
import zipfile
import hashlib
from datetime import datetime, timezone

VERSION = "v1.0.5"

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def zip_directory(source_dir, output_zip, arc_prefix='', exclude_dirs=None):
    if exclude_dirs is None:
        exclude_dirs = set()
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file.endswith('.zip') and 'public/releases' in root:
                    continue
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, source_dir)
                arc_name = os.path.join(arc_prefix, rel_path) if arc_prefix else rel_path
                zf.write(abs_path, arc_name)

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    dist_dir = os.path.join(root_dir, 'dist')
    release_dir = os.path.join(root_dir, 'release-dist')
    public_releases_dir = os.path.join(root_dir, 'public', 'releases')

    if not os.path.exists(dist_dir):
        print(f"Error: {dist_dir} does not exist. Please run 'npm run build' first.")
        sys.exit(1)

    os.makedirs(release_dir, exist_ok=True)
    os.makedirs(public_releases_dir, exist_ok=True)

    print("==================================================")
    print(f"🚀 Packaging Razmnameh Multi-Platform Releases {VERSION}")
    print("==================================================")

    generated_files = []

    # 1. Web & PWA Package
    web_zip = os.path.join(release_dir, f'shahnameh-{VERSION}-web-pwa.zip')
    print(f"📦 Creating Web & PWA package: {os.path.basename(web_zip)}")
    zip_directory(dist_dir, web_zip, arc_prefix='shahnameh-web-pwa')
    generated_files.append(('web-pwa', web_zip))

    # 2. Android Package (Capacitor & Native TWA)
    android_stage = os.path.join(release_dir, 'android-staging')
    if os.path.exists(android_stage):
        shutil.rmtree(android_stage)
    os.makedirs(android_stage, exist_ok=True)

    shutil.copytree(dist_dir, os.path.join(android_stage, 'dist'))

    for filename in ['capacitor.config.json', 'package.json', 'RELEASE_NOTES.md']:
        src = os.path.join(root_dir, filename)
        if os.path.exists(src):
            shutil.copy(src, android_stage)

    android_readme = os.path.join(android_stage, 'ANDROID_README.md')
    with open(android_readme, 'w', encoding='utf-8') as f:
        f.write(f"""# راهنمای اجرای خروجی اندروید (Android APK / AAB) - نسخه {VERSION}
این بسته شامل کلیه فایل‌های وب کامپایل‌شده نسخه {VERSION} (استایل نقاشی قهوه‌خانه‌ای و موتور روایت StoryLogicManager) به همراه تنظیمات Capacitor برای سیستم‌عامل اندروید است.

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

    android_zip = os.path.join(release_dir, f'shahnameh-{VERSION}-android-package.zip')
    print(f"📦 Creating Android package: {os.path.basename(android_zip)}")
    zip_directory(android_stage, android_zip, arc_prefix='shahnameh-android')
    shutil.rmtree(android_stage)
    generated_files.append(('android', android_zip))

    # 3. Desktop Application Package (Electron)
    desktop_stage = os.path.join(release_dir, 'desktop-staging')
    if os.path.exists(desktop_stage):
        shutil.rmtree(desktop_stage)
    os.makedirs(desktop_stage, exist_ok=True)

    shutil.copytree(dist_dir, os.path.join(desktop_stage, 'dist'))
    electron_src = os.path.join(root_dir, 'electron')
    if os.path.exists(electron_src):
        shutil.copytree(electron_src, os.path.join(desktop_stage, 'electron'))

    desktop_package_json = os.path.join(desktop_stage, 'package.json')
    with open(desktop_package_json, 'w', encoding='utf-8') as f:
        f.write(f"""{{
  "name": "razmnameh-desktop",
  "version": "{VERSION.lstrip('v')}",
  "main": "electron/main.cjs",
  "scripts": {{
    "start": "electron ."
  }},
  "devDependencies": {{
    "electron": "^33.0.0"
  }}
}}""")

    desktop_readme = os.path.join(desktop_stage, 'DESKTOP_README.md')
    with open(desktop_readme, 'w', encoding='utf-8') as f:
        f.write(f"""# راهنمای اجرای نسخه دسکتاپ (Windows / macOS / Linux) - نسخه {VERSION}

## روش اجرا:
۱. در این پوشه دستور زیر را اجرا کنید:
   npm install electron
۲. برای اجرای بازی:
   npx electron .
""")

    desktop_zip = os.path.join(release_dir, f'shahnameh-{VERSION}-desktop-bundle.zip')
    print(f"📦 Creating Desktop package: {os.path.basename(desktop_zip)}")
    zip_directory(desktop_stage, desktop_zip, arc_prefix='shahnameh-desktop')
    shutil.rmtree(desktop_stage)
    generated_files.append(('desktop', desktop_zip))

    # 4. Complete Source Code Bundle for GitHub Upload
    source_zip = os.path.join(release_dir, f'shahnameh-{VERSION}-full-source.zip')
    print(f"📦 Creating Full GitHub Source package: {os.path.basename(source_zip)}")
    zip_directory(
        root_dir,
        source_zip,
        arc_prefix='shahnameh-source',
        exclude_dirs={'node_modules', '.git', 'dist', 'dev-dist', 'release-dist', '.aistudio'}
    )
    generated_files.append(('source', source_zip))

    # 5. Generate Checksums & Manifest
    checksum_file = os.path.join(release_dir, 'sha256sums.txt')
    assets_meta = {}
    with open(checksum_file, 'w', encoding='utf-8') as f:
        for key, filepath in generated_files:
            filename = os.path.basename(filepath)
            size_bytes = os.path.getsize(filepath)
            size_kb = round(size_bytes / 1024, 1)
            sha = sha256_file(filepath)
            f.write(f"{sha}  {filename}\n")
            print(f"  ✓ {filename} ({size_kb} KB) -> {sha[:16]}...")

            # Copy to public/releases for direct browser download
            public_dest = os.path.join(public_releases_dir, filename)
            shutil.copy2(filepath, public_dest)
            # Also copy stable alias without version for legacy links
            alias_map = {
                'web-pwa': 'shahnameh-web-pwa.zip',
                'android': 'shahnameh-android.zip',
                'desktop': 'shahnameh-desktop.zip',
                'source': 'shahnameh-full-source.zip',
            }
            if key in alias_map:
                shutil.copy2(filepath, os.path.join(public_releases_dir, alias_map[key]))

            assets_meta[key] = {
                "filename": filename,
                "url": f"/releases/{filename}",
                "sizeBytes": size_bytes,
                "sizeFormatted": f"{size_kb} KB",
                "sha256": sha,
            }

    shutil.copy2(checksum_file, os.path.join(public_releases_dir, 'sha256sums.txt'))

    manifest = {
        "latestVersion": VERSION,
        "builtAt": datetime.now(timezone.utc).isoformat(),
        "assets": assets_meta,
    }
    manifest_path = os.path.join(public_releases_dir, 'releases-manifest.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print("==================================================")
    print(f"✅ All multi-platform packages created in: {release_dir}")
    print(f"🌐 Direct browser downloads published in: {public_releases_dir}")
    print(f"🔒 Checksums saved to: {checksum_file}")
    print("==================================================")

if __name__ == '__main__':
    main()
