#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function run(cmd, options = {}) {
  return execSync(cmd, {
    cwd: ROOT_DIR,
    encoding: 'utf-8',
    stdio: options.silent ? 'pipe' : 'inherit',
    ...options,
  });
}

function getLatestGitTag() {
  try {
    const tag = run('git describe --tags --abbrev=0', { silent: true }).trim();
    return tag.replace(/^v/, '');
  } catch {
    return '1.0.5';
  }
}

function parseSemVer(verStr) {
  const clean = (verStr || '1.0.0').replace(/^v/, '').trim();
  const parts = clean.split('.').map(n => parseInt(n, 10) || 0);
  return {
    major: parts[0] ?? 1,
    minor: parts[1] ?? 0,
    patch: parts[2] ?? 0,
  };
}

function detectBumpTypeFromGit(lastTag) {
  try {
    const log = run(`git log v${lastTag}..HEAD --oneline`, { silent: true }).trim();
    if (!log) return 'patch';
    if (/BREAKING CHANGE|major:|^[a-f0-9]+\s+\w+!:/im.test(log)) {
      return 'major';
    }
    if (/^[a-f0-9]+\s+(feat|minor)(\(.+\))?:/im.test(log)) {
      return 'minor';
    }
    return 'patch';
  } catch {
    return 'patch';
  }
}

function getRecentCommitSummary(lastTag) {
  try {
    const raw = run(`git log v${lastTag}..HEAD --pretty=format:"%s"`, { silent: true }).trim();
    if (!raw) return ['به‌روزرسانی و بهینه‌سازی خودکار تمامی نسخه‌های اجرایی چندپلتفرمه'];
    return raw
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 5);
  } catch {
    return ['به‌روزرسانی و بهینه‌سازی خودکار تمامی نسخه‌های اجرایی چندپلتفرمه'];
  }
}

function main() {
  const args = process.argv.slice(2);
  const explicitArg = args[0] || 'auto';
  const customNote = args.slice(1).join(' ').trim();

  const pkgPath = path.join(ROOT_DIR, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  const lastTagVersion = getLatestGitTag();
  const baseVersion =
    pkg.version && pkg.version !== '0.0.0' ? pkg.version : lastTagVersion;
  const current = parseSemVer(baseVersion);

  let bumpType = 'patch';
  let nextVersion = '';

  if (explicitArg.startsWith('--version=')) {
    nextVersion = explicitArg.split('=')[1].replace(/^v/, '');
    bumpType = 'minor';
  } else if (['major', 'minor', 'patch'].includes(explicitArg)) {
    bumpType = explicitArg;
  } else {
    bumpType = detectBumpTypeFromGit(baseVersion);
  }

  if (!nextVersion) {
    if (bumpType === 'major') {
      nextVersion = `${current.major + 1}.0.0`;
    } else if (bumpType === 'minor') {
      nextVersion = `${current.major}.${current.minor + 1}.0`;
    } else {
      nextVersion = `${current.major}.${current.minor}.${current.patch + 1}`;
    }
  }

  const tagName = `v${nextVersion}`;
  const nowIso = new Date().toISOString();
  const dateShort = nowIso.split('T')[0];

  console.log('==================================================================');
  console.log(`🚀 Razmnameh Automated Semantic Release Engine`);
  console.log(`📌 Previous Version : v${baseVersion}`);
  console.log(`🔼 Bump Type        : ${bumpType.toUpperCase()} (${bumpType === 'major' ? 'تغییر اساسی ورژن' : 'ساب‌ورژن'})`);
  console.log(`🎯 Target Release   : ${tagName}`);
  console.log('==================================================================');

  // 1. Update package.json
  pkg.version = nextVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');

  // 2. Update capacitor.config.json if present
  const capPath = path.join(ROOT_DIR, 'capacitor.config.json');
  if (fs.existsSync(capPath)) {
    try {
      const cap = JSON.parse(fs.readFileSync(capPath, 'utf-8'));
      cap.version = nextVersion;
      fs.writeFileSync(capPath, JSON.stringify(cap, null, 2) + '\n', 'utf-8');
    } catch {
      // ignore
    }
  }

  // 3. First build + package pass to calculate real sizes & SHA-256 hashes
  console.log('\n🔨 Step 1/4: Building Web & PWA Bundle...');
  run('npm run build');

  console.log('\n📦 Step 2/4: Packaging 6 Platform Executables & Calculating SHA-256...');
  run(`RELEASE_VERSION=${nextVersion} python3 scripts/build-releases.py`);

  // 4. Read generated release-manifest.json
  const manifestPath = path.join(ROOT_DIR, 'release-dist', 'release-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // 5. Update src/constants/releaseInfo.ts with real assets & history
  const releaseInfoPath = path.join(ROOT_DIR, 'src', 'constants', 'releaseInfo.ts');
  const commitHighlights = customNote
    ? [customNote]
    : getRecentCommitSummary(baseVersion);

  const historyList = [
    {
      version: nextVersion,
      tag: tagName,
      type: bumpType,
      date: dateShort,
      titleFa:
        customNote ||
        (bumpType === 'major'
          ? `انتشار نسخه اصلی ${tagName} با بسته‌های اجرایی تمامی پلتفرم‌ها`
          : `انتشار خودکار ساب‌ورژن ${tagName} با خروجی اجرایی ۶ پلتفرم`),
      titleEn: `Automated ${bumpType.toUpperCase()} Multi-Platform Release ${tagName}`,
      highlightsFa: [
        ...commitHighlights,
        `تولید خودکار ۶ پکیج اجرایی مجزا (Windows, macOS .app, Linux, Android APK, iOS .mobileconfig, Web PWA) با امضای SHA-256`,
      ],
    },
    {
      version: '1.0.5',
      tag: 'v1.0.5',
      type: 'patch',
      date: '2026-10-28',
      titleFa: 'سبک نقاشی قهوه‌خانه‌ای اصیل و مدیریت هوشمند منطق روایت (StoryLogicManager)',
      titleEn: 'Authentic Qahveh-Khaneh Art Style & StoryLogicManager',
      highlightsFa: [
        'بازطراحی کامل اسپرایت‌های رستم، سهراب، گردآفرید، اسفندیار و دیوان به سبک نقاشی قهوه‌خانه‌ای بزرگسالانه',
        'پیاده‌سازی StoryLogicManager برای تطبیق کامل دیالوگ‌ها، سپاهیان پیش‌رو و هماوردان با قهرمان انتخاب‌شده',
      ],
    },
    {
      version: '1.0.4',
      tag: 'v1.0.4',
      type: 'patch',
      date: '2026-10-28',
      titleFa: 'رفع باگ ضربات پیاپی و محیط پارالاکس نگارگری ایرانی',
      titleEn: 'Combo Hit Fix & Persian Miniature Parallax Environment',
      highlightsFa: [
        'رفع کامل باگ ریست شدن موقعیت کاراکتر هنگام کمبو و ضربات پیاپی',
        'افزودن پس‌زمینه‌های پویا به سبک مینیاتور ایرانی از دشت زابل تا غارهای تاریک مازندران',
      ],
    },
    {
      version: '1.0.0',
      tag: 'v1.0.0',
      type: 'major',
      date: '2026-10-28',
      titleFa: 'انتشار اولیه رزم‌نامه: نبرد اساطیری شاهنامه',
      titleEn: 'Initial Official Release of Razmnameh',
      highlightsFa: [
        'هفت‌خان رستم، میدان دوئل تن‌به‌تن، درخت مهارت، نقالی صوتی و کیف پول‌های کریپتو',
      ],
    },
  ];

  // Deduplicate history by version
  const uniqueHistory = [];
  const seenVersions = new Set();
  for (const h of historyList) {
    if (!seenVersions.has(h.version)) {
      seenVersions.add(h.version);
      uniqueHistory.push(h);
    }
  }

  const releaseInfoContent = `export interface PlatformReleaseAsset {
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

export const CURRENT_RELEASE_INFO: ReleaseMetadata = ${JSON.stringify(
    {
      version: nextVersion,
      tag: tagName,
      releaseType: bumpType,
      releasedAt: manifest.releasedAt,
      assets: manifest.assets.map(a => ({
        id: a.id,
        platform: a.platform,
        platformFa: a.platformFa,
        filename: a.filename,
        latestAlias: a.latestAlias,
        downloadUrl: a.downloadUrl,
        latestDownloadUrl: a.latestDownloadUrl,
        sizeFormatted: a.sizeFormatted,
        sha256: a.sha256,
        format: a.format,
      })),
      history: uniqueHistory,
    },
    null,
    2
  )};
`;

  fs.writeFileSync(releaseInfoPath, releaseInfoContent, 'utf-8');

  // 6. Update RELEASE_NOTES.md dynamically
  const assetTableRows = manifest.assets
    .map(
      a =>
        `| \`${a.filename}\` | ${a.platformFa} | \`${a.format}\` | \`${a.sizeFormatted}\` | \`${a.sha256.slice(0, 16)}...\` |`
    )
    .join('\n');

  const releaseNotesMd = `# رزم‌نامه: نبرد افسانه‌ای شاهنامه | Razmnameh ${tagName}
**انتشار رسمی خودکار چندپلتفرمه برای تمامی دستگاه‌ها و سیستم‌عامل‌ها (${bumpType.toUpperCase()} RELEASE)**
**Official Automated Multi-Platform Release for All Devices & Operating Systems**

---

## 🇮🇷 خلاصه تغییرات نسخه ${tagName} (${dateShort})
- **نوع انتشار:** ${bumpType === 'major' ? 'نسخه اصلی (Major Release)' : bumpType === 'minor' ? 'ساب‌ورژن ویژگی جدید (Minor Sub-Version)' : 'ساب‌ورژن اصلاحی (Patch Sub-Version)'}
${commitHighlights.map(item => `- ${item}`).join('\n')}
- سبک بصری **نقاشی قهوه‌خانه‌ای اصیل (Qahveh-Khaneh Style)** با خطوط محیطی قوی و جزئیات بزرگسالانه برای تمامی پهلوانان، دیوان و هماوردان.
- لایه مدیریت هوشمند روایت (**StoryLogicManager**) جهت تطبیق کامل دیالوگ‌ها، سپاهیان پیش‌رو و هماوردان بر اساس قهرمان انتخابی.

---

## 📦 بسته‌های اجرایی آماده دانلود برای هر دستگاه (Executable Release Assets - ${tagName}):

| نام فایل اجرایی | پلتفرم و دستگاه هدف | فرمت اجرایی | حجم | کد اعتبارسنجی SHA-256 |
| :--- | :--- | :--- | :--- | :--- |
${assetTableRows}
| \`sha256sums.txt\` | تمامی پلتفرم‌ها | فایل هش امنیتی SHA-256 | \`1 KB\` | اعتبارسنجی رسمی |

---

## 🖥️ راهنمای اجرای مستقیم روی هر دستگاه:

### ۱. ویندوز ۱۰ و ۱۱ (\`shahnameh-${tagName}-windows-x64-executable.zip\`)
- فایل فشرده را استخراج کرده و مستقیم روی فایل اجرایی **\`Razmnameh-Windows-Start.bat\`** دوبار کلیک کنید تا بازی در پنجره اختصاصی بدون فریم اجرا شود، یا دستور \`npm run build:exe\` را برای ساخت نصاب \`.exe\` اجرا نمایید.

### ۲. مک‌اواس Apple Silicon & Intel (\`shahnameh-${tagName}-macos-universal-app.zip\`)
- فایل فشرده را استخراج کرده و برنامه **\`Razmnameh.app\`** را مستقیم اجرا کنید یا به پوشه \`Applications\` منتقل نمایید.

### ۳. لینوکس و استیم‌دک (\`shahnameh-${tagName}-linux-x64-executable.zip\`)
- فایل فشرده را استخراج کرده و فایل اجرایی **\`./razmnameh-linux.sh\`** یا شورتکات دسکتاپ **\`Razmnameh.desktop\`** را اجرا نمایید.

### ۴. اندروید (\`shahnameh-${tagName}-android-apk-bundle.zip\`)
- اسکریپت یک‌کلیکی **\`./build-android-apk.sh\`** را اجرا کنید تا فایل نصبی \`app-debug.apk\` به صورت خودکار کامپایل شود.

### ۵. آیفون و آیپد (\`shahnameh-${tagName}-ios-ipados-bundle.zip\`)
- پروفایل نصبی **\`Razmnameh-iOS-Fullscreen.mobileconfig\`** را روی آیفون یا آیپد باز کرده و نصب کنید تا آیکون تمام‌صفحه بازی روی صفحه اصلی دستگاه اضافه شود.

### ۶. وب و سرورهای ابری (\`shahnameh-${tagName}-web-pwa.zip\`)
- آماده آپلود روی هر هاست، سرور، Vercel، Cloudflare Pages و نصب آفلاین PWA.

---

## 💎 آدرس‌های رسمی کیف پول توسعه‌دهنده (Creator Crypto Vaults):
- **Bitcoin (BTC):** \`bc1qqjfn0wdap5dphrx89kp8u7tux6ynj227msrlq4\`
- **Ethereum (ERC-20) / USDT (BEP-20):** \`0x7Abd8370a0878cCF3bC36811c7a5cC71Ac027E9A\`
- **TON:** \`UQDR4WPq0mF7e6wpvBKspdsnhe3mXLtBmjgenmSfK-DL6svK\`
- **USDT (TRC-20):** \`TEZgraBLWUAoZK48BeB7YippCXCwwCbFrL\`
`;

  fs.writeFileSync(path.join(ROOT_DIR, 'RELEASE_NOTES.md'), releaseNotesMd, 'utf-8');

  // 7. Final build + package pass so compiled dist/ includes updated releaseInfo.ts
  console.log('\n🔄 Step 3/4: Syncing Release Metadata into Final Production Build...');
  run('npm run build');
  run(`RELEASE_VERSION=${nextVersion} python3 scripts/build-releases.py`);

  // 8. Commit & Tag in Git, and push if remote origin exists
  console.log('\n🏷️ Step 4/4: Committing & Tagging Release in Git...');
  try {
    run('git add -A');
    run(
      `git commit -m "chore(release): publish multi-platform release ${tagName} [${bumpType}]"`
    );
  } catch {
    console.log('ℹ️ Working tree already clean or committed.');
  }

  try {
    run(`git tag -d ${tagName}`, { silent: true });
  } catch {
    // tag didn't exist yet
  }
  run(
    `git tag -a ${tagName} -m "Release ${tagName} (${bumpType}): Windows, macOS, Linux, Android, iOS, Web/PWA"`
  );

  // Check if remote origin is configured
  try {
    const remotes = run('git remote -v', { silent: true }).trim();
    if (remotes.includes('origin')) {
      console.log('🌐 Pushing branch and release tag to GitHub origin...');
      run('git push origin main --follow-tags || git push origin HEAD --tags');
    } else {
      console.log('ℹ️ Local git tag created. When remote origin is added, git push --tags will publish to GitHub.');
    }
  } catch {
    console.log('ℹ️ Local git commit and tag completed.');
  }

  console.log('\n==================================================================');
  console.log(`✅ RELEASE ${tagName} COMPLETED SUCCESSFULLY!`);
  console.log(`📂 Executables ready in: release-dist/ and public/releases/`);
  console.log('==================================================================');
}

main();
