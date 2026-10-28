import React, { useEffect, useState } from 'react';
import { Language } from '../types/game';
import {
  X,
  Github,
  Download,
  Smartphone,
  Monitor,
  Globe2,
  Terminal,
  CheckCircle2,
  Copy,
  Layers,
  Tag,
  FileArchive,
  Send,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  Check,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  lang: Language;
  onClose: () => void;
}

interface ReleaseAssetInfo {
  filename: string;
  url: string;
  sizeBytes: number;
  sizeFormatted: string;
  sha256: string;
}

interface ManifestData {
  latestVersion: string;
  builtAt: string;
  assets: {
    'web-pwa'?: ReleaseAssetInfo;
    android?: ReleaseAssetInfo;
    desktop?: ReleaseAssetInfo;
    source?: ReleaseAssetInfo;
  };
}

interface ReleaseVersionItem {
  tag: string;
  titleFa: string;
  titleEn: string;
  date: string;
  commit: string;
  isLatest?: boolean;
  highlightsFa: string[];
  highlightsEn: string[];
}

const RELEASE_HISTORY: ReleaseVersionItem[] = [
  {
    tag: 'v1.0.5',
    titleFa: 'نگارگری اصیل قهوه‌خانه‌ای و موتور مدیریت منطق روایت (StoryLogicManager)',
    titleEn: 'Authentic Qahveh-Khaneh Sprite Art & StoryLogicManager Engine',
    date: '2026-10-28',
    commit: '65c1e22',
    isLatest: true,
    highlightsFa: [
      'پیاده‌سازی کامل استایل بصری «نقاشی قهوه‌خانه‌ای» (Qahveh-Khaneh) با خطوط محیطی قوی قهوه‌ای سوخته (#140b05) و رنگ‌بندی گرم سنتی',
      'چهره‌پردازی اغراق‌آمیز پهلوانان (رستم با کلاهخود دیو سپید و ببر بیان، سهراب، گردآفرید، اسفندیار) و دیوان مازندران و ضحاک ماردوش',
      'ایجاد لایه متمرکز StoryLogicManager جهت تطبیق کامل دیالوگ‌ها، پیش‌درآمدها، سپاه پیش‌رو و هماورد نهایی بر اساس قهرمان انتخابی',
      'تفکیک بصری سپاهیان دشمن در مراحل مختلف (دیوان مازندران در مراحل ۱ تا ۳، نگهبانان دژ سپید ایران در برابر سهراب، و مهاجمان توران در برابر رستم و گردآفرید)',
      'تولید و انتشار مستقیم بسته‌های نصبی ZIP نسخه v1.0.5 برای وب PWA، اندروید، دسکتاپ و سورس کامل گیت‌هاب',
    ],
    highlightsEn: [
      'Full Qahveh-Khaneh painting sprite renderer with bold dark sepia contours and traditional oil pigments',
      'Exaggerated heroic & demonic portraiture for Rostam, Sohrab, Gordafarid, Esfandiar, Zahhak, and Div-e Sepid',
      'Centralized StoryLogicManager preventing anachronistic story overlaps across heroes and stages',
      'Faction-specific vanguard enemies (Mazandaran Demons, Iranian Sentinels, Turanian Raiders)',
      'Compiled multi-platform v1.0.5 ZIP bundles directly downloadable from the release center',
    ],
  },
  {
    tag: 'v1.0.4',
    titleFa: 'ارتقای جزئیات بزرگسالانه زره‌های تاریخی و بوم زنده پرتره قهوه‌خانه‌ای',
    titleEn: 'Mature High-Detail Historical Armor & Live Qahveh-Khaneh Portrait Canvas',
    date: '2026-10-28',
    commit: '07183f8',
    highlightsFa: [
      'افزودن بوم زنده و تعاملی پرتره پهلوانان در منوی اصلی با انیمیشن ضربه سلاح',
      'طراحی دقیق جوشن پولک‌دار، بازوبند و ساق‌بند فولادی، سپر زرکوب و پر سیمرغ',
    ],
    highlightsEn: [
      'Interactive live Qahveh-Khaneh portrait canvas on the main menu with weapon strike animation',
      'Detailed scale mail, articulated vambraces, greaves, brass shields, and Simurgh plumes',
    ],
  },
  {
    tag: 'v1.0.3',
    titleFa: 'رفع کامل باگ ریست شدن کاراکتر در کمبوها و ضربات پیاپی',
    titleEn: 'Consecutive Hit & Combo State Stability Fix',
    date: '2026-10-28',
    commit: '29fd75e',
    highlightsFa: [
      'رفع باگ بازسازی ناخواسته GameEngine هنگام ثبت کمبوها و ضربات تمام‌کننده (Finisher)',
      'بروزرسانی پویا و بدون وقفه ضرایب سلاح و زره با متد updateCombatBonuses',
    ],
    highlightsEn: [
      'Fixed character position reset bug during rapid combo chains and finishers',
      'Added dynamic updateCombatBonuses method without recreating GameEngine instance',
    ],
  },
  {
    tag: 'v1.0.2',
    titleFa: 'محیط‌های نبرد نگارگری ایرانی با افکت پارالاکس پویا',
    titleEn: 'Persian Miniature Dynamic Parallax Battle Environments',
    date: '2026-10-28',
    commit: '8a41c19',
    highlightsFa: [
      'طراحی ۷ بوم نبرد چندلایه با افکت پارالاکس از دشت‌های زرین زابلستان تا غارهای تاریک مازندران',
      'ابرهای اسلیمی، سروهای مینیاتوری، صخره‌های مرجانی و مشعل‌های لرزان متناسب با هر خان',
    ],
    highlightsEn: [
      '7 multi-layered Persian miniature parallax environments shifting from Zabol plains to Mazandaran caves',
      'Islimi clouds, miniature cypress trees, stylized crags, and atmospheric lighting per stage',
    ],
  },
  {
    tag: 'v1.0.1',
    titleFa: 'همگام‌سازی روایت شاهنامه و میدان دوئل تن‌به‌تن',
    titleEn: 'Shahnameh Narrative & Duel Arena Coherence Update',
    date: '2026-10-28',
    commit: '4c92b70',
    highlightsFa: [
      'اصلاح هماوردان میدان دوئل تن‌به‌تن (قفل تیغه‌ها) و تطبیق با داستان هر مرحله',
      'ارتقای سیستم تبلیغات جایزه‌دار کریپتویی بر اساس کشور بازیکن',
    ],
    highlightsEn: [
      'Synchronized Duel Arena opponents with stage lore and hero selection',
      'Geo-targeted crypto-paying ad network integration connected to creator wallets',
    ],
  },
  {
    tag: 'v1.0.0',
    titleFa: 'انتشار اولیه چندپلتفرمه (وب PWA، اندروید، دسکتاپ و کیف پول‌های کریپتو)',
    titleEn: 'Initial Multi-Platform Release (Web PWA, Android, Desktop & Crypto Vaults)',
    date: '2026-10-28',
    commit: '1b08e31',
    highlightsFa: [
      'انتشار اولیه با پشتیبانی از وب PWA، پروژه اندروید Capacitor و نسخه دسکتاپ Electron',
      'اتصال کامل به کیف پول‌های Bitcoin، Ethereum، TON و USDT توسعه‌دهنده',
    ],
    highlightsEn: [
      'Initial release supporting Web PWA, Android Capacitor, and Electron Desktop',
      'Integrated creator Bitcoin, Ethereum, TON, and USDT wallets',
    ],
  },
];

export const GitHubReleasesModal: React.FC<Props> = ({ lang, onClose }) => {
  const [selectedTag, setSelectedTag] = useState<string>('v1.0.5');
  const [manifest, setManifest] = useState<ManifestData | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Direct GitHub API Release Publisher state
  const [repoSlug, setRepoSlug] = useState<string>(() => localStorage.getItem('gh_repo_slug') || '');
  const [ghToken, setGhToken] = useState<string>('');
  const [publishStatus, setPublishStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [publishMessage, setPublishMessage] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  const isFa = lang === 'fa';

  useEffect(() => {
    fetch('/releases/releases-manifest.json')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) setManifest(data);
      })
      .catch(() => {});
  }, []);

  const selectedRelease = RELEASE_HISTORY.find(r => r.tag === selectedTag) || RELEASE_HISTORY[0];

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    sound.playCoin();
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const targetRepo = repoSlug.trim() || 'USERNAME/REPO_NAME';

  const gitPushCommand = `git add -A
git commit -m "release: Razmnameh multi-platform ${selectedRelease.tag}"
git tag -f -a ${selectedRelease.tag} -m "${selectedRelease.titleEn}"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/${targetRepo}.git
git push -u origin main --tags --force`;

  const handleDirectGitHubPublish = async () => {
    const cleanRepo = repoSlug.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
    if (!cleanRepo || !cleanRepo.includes('/')) {
      setPublishStatus('error');
      setPublishMessage(
        isFa
          ? 'لطفاً نام مخزن گیت‌هاب را به فرمت USERNAME/REPO_NAME وارد کنید.'
          : 'Please enter repository in USERNAME/REPO_NAME format.'
      );
      return;
    }
    if (!ghToken.trim()) {
      setPublishStatus('error');
      setPublishMessage(
        isFa
          ? 'لطفاً توکن دسترسی گیت‌هاب (Personal Access Token با دسترسی repo) را وارد کنید.'
          : 'Please enter a GitHub Personal Access Token (with repo scope).'
      );
      return;
    }

    localStorage.setItem('gh_repo_slug', cleanRepo);
    setPublishStatus('loading');
    setPublishMessage('');

    const releaseBody = [
      `# رزم‌نامه: نبرد افسانه‌ای شاهنامه | Razmnameh ${selectedRelease.tag}`,
      `**${selectedRelease.titleFa}**`,
      `**${selectedRelease.titleEn}**`,
      '',
      '### تغییرات و ویژگی‌های این نسخه (Changelog):',
      ...selectedRelease.highlightsFa.map(item => `- ${item}`),
      '',
      '---',
      '### English Highlights:',
      ...selectedRelease.highlightsEn.map(item => `- ${item}`),
      '',
      '---',
      '### Creator Crypto Vaults:',
      '- **BTC:** `bc1qqjfn0wdap5dphrx89kp8u7tux6ynj227msrlq4`',
      '- **ETH / USDT (BEP-20):** `0x7Abd8370a0878cCF3bC36811c7a5cC71Ac027E9A`',
    ].join('\n');

    try {
      const response = await fetch(`https://api.github.com/repos/${cleanRepo}/releases`, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${ghToken.trim()}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tag_name: selectedRelease.tag,
          target_commitish: 'main',
          name: `رزم‌نامه ${selectedRelease.tag} | ${selectedRelease.titleFa}`,
          body: releaseBody,
          draft: false,
          prerelease: false,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      sound.playVictory();
      setPublishStatus('success');
      setPublishedUrl(data.html_url || `https://github.com/${cleanRepo}/releases/tag/${selectedRelease.tag}`);
      setPublishMessage(
        isFa
          ? `نسخه ${selectedRelease.tag} با موفقیت در بخش Releases مخزن ${cleanRepo} منتشر شد!`
          : `Release ${selectedRelease.tag} successfully published to ${cleanRepo}!`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPublishStatus('error');
      setPublishMessage(
        isFa
          ? `خطا در ارتباط با API گیت‌هاب: ${msg} (مطمئن شوید مخزن ${cleanRepo} ساخته شده و توکن دسترسی Write دارد).`
          : `GitHub API Error: ${msg}`
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4 select-none">
      <div className="bg-[#0b101e] border-2 border-emerald-500/50 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-black text-slate-100 flex items-center gap-2 flex-wrap">
                <span>
                  {isFa
                    ? 'مرکز انتشارها و دانلود مستقیم نسخه‌های گیت‌هاب (GitHub Releases)'
                    : 'GitHub Multi-Platform Releases & Direct Downloads'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                  v1.0.5 LATEST
                </span>
              </h2>
              <span className="text-xs text-slate-400">
                {isFa
                  ? 'تمامی ۶ نسخه (v1.0.0 تا v1.0.5) تگ‌گذاری شده و بسته‌های ZIP آماده دانلود مستقیم و انتشار در گیت‌هاب هستند'
                  : 'All 6 versions (v1.0.0 to v1.0.5) tagged with direct downloadable multi-platform ZIP bundles'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
          {/* 1. Release Versions Timeline Selector (v1.0.0 -> v1.0.5) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>
                  {isFa
                    ? 'نسخه‌های ثبت‌شده و تگ‌های رسمی گیت (۶ ریلیز کامل):'
                    : 'Official Tagged Releases (v1.0.0 – v1.0.5):'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                HEAD -&gt; main (tag: v1.0.5)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {RELEASE_HISTORY.map(rel => {
                const active = rel.tag === selectedTag;
                return (
                  <button
                    key={rel.tag}
                    onClick={() => {
                      sound.playCoin();
                      setSelectedTag(rel.tag);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                      active
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono font-black text-xs text-emerald-400">{rel.tag}</span>
                      {rel.isLatest && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                          جدید
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-300 line-clamp-1 font-bold">
                      {isFa ? rel.titleFa : rel.titleEn}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">#{rel.commit}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Selected Release Changelog Card */}
          <div className="p-4 bg-slate-900/90 border border-amber-500/35 rounded-2xl flex flex-col gap-2.5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-xs">
                  {selectedRelease.tag}
                </span>
                <h3 className="text-sm md:text-base font-black text-amber-100">
                  {isFa ? selectedRelease.titleFa : selectedRelease.titleEn}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Commit: <strong className="text-slate-200">{selectedRelease.commit}</strong> · {selectedRelease.date}
              </span>
            </div>

            <ul className="flex flex-col gap-1.5 text-xs text-slate-300 leading-relaxed pr-1">
              {(isFa ? selectedRelease.highlightsFa : selectedRelease.highlightsEn).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Direct Downloadable Release Assets (v1.0.5 Compiled ZIP Packages) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>
                  {isFa
                    ? 'دانلود مستقیم فایل‌های خروجی ریلیز (آپلود شده روی سرور بازی):'
                    : 'Direct Download Multi-Platform Release Assets (v1.0.5):'}
                </span>
              </span>
              <a
                href="/releases/sha256sums.txt"
                download="sha256sums.txt"
                className="text-[11px] font-mono text-sky-400 hover:text-sky-300 underline flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>دانلود فایل sha256sums.txt</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Asset 1: Web & PWA */}
              <div className="p-3.5 bg-slate-900/90 border border-emerald-500/35 rounded-xl flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {isFa ? 'بسته وب و PWA' : 'Web & PWA Bundle'}
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-mono block truncate">
                        shahnameh-v1.0.5-web-pwa.zip
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isFa
                      ? 'نسخه کامپایل‌شده آماده آپلود روی هاست، Vercel و نصب آفلاین PWA.'
                      : 'Compiled production build with Service Worker.'}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  {manifest?.assets?.['web-pwa'] && (
                    <span className="text-[10px] font-mono text-slate-500">
                      حجم: {manifest.assets['web-pwa'].sizeFormatted}
                    </span>
                  )}
                  <a
                    href="/releases/shahnameh-v1.0.5-web-pwa.zip"
                    download="shahnameh-v1.0.5-web-pwa.zip"
                    onClick={() => sound.playCoin()}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isFa ? 'دانلود مستقیم ZIP' : 'Download ZIP'}</span>
                  </a>
                </div>
              </div>

              {/* Asset 2: Android Capacitor */}
              <div className="p-3.5 bg-slate-900/90 border border-sky-500/35 rounded-xl flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {isFa ? 'پکیج اندروید (APK)' : 'Android Package'}
                      </h4>
                      <span className="text-[10px] text-sky-400 font-mono block truncate">
                        shahnameh-v1.0.5-android-package.zip
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isFa
                      ? 'پروژه کامل Capacitor اندروید آماده خروجی APK در اندروید استودیو.'
                      : 'Complete Android Capacitor package ready for APK build.'}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  {manifest?.assets?.android && (
                    <span className="text-[10px] font-mono text-slate-500">
                      حجم: {manifest.assets.android.sizeFormatted}
                    </span>
                  )}
                  <a
                    href="/releases/shahnameh-v1.0.5-android-package.zip"
                    download="shahnameh-v1.0.5-android-package.zip"
                    onClick={() => sound.playCoin()}
                    className="w-full py-2 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isFa ? 'دانلود مستقیم ZIP' : 'Download ZIP'}</span>
                  </a>
                </div>
              </div>

              {/* Asset 3: Desktop Electron */}
              <div className="p-3.5 bg-slate-900/90 border border-purple-500/35 rounded-xl flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {isFa ? 'نسخه دسکتاپ (PC)' : 'Desktop Bundle'}
                      </h4>
                      <span className="text-[10px] text-purple-400 font-mono block truncate">
                        shahnameh-v1.0.5-desktop-bundle.zip
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isFa
                      ? 'پکیج اجرای دسکتاپ Electron برای ویندوز، مک و لینوکس.'
                      : 'Electron desktop application for Windows, Mac & Linux.'}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  {manifest?.assets?.desktop && (
                    <span className="text-[10px] font-mono text-slate-500">
                      حجم: {manifest.assets.desktop.sizeFormatted}
                    </span>
                  )}
                  <a
                    href="/releases/shahnameh-v1.0.5-desktop-bundle.zip"
                    download="shahnameh-v1.0.5-desktop-bundle.zip"
                    onClick={() => sound.playCoin()}
                    className="w-full py-2 px-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isFa ? 'دانلود مستقیم ZIP' : 'Download ZIP'}</span>
                  </a>
                </div>
              </div>

              {/* Asset 4: Complete GitHub Source Code */}
              <div className="p-3.5 bg-slate-900/90 border border-amber-500/40 rounded-xl flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <FileArchive className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate">
                        {isFa ? 'سورس کامل گیت‌هاب' : 'Full GitHub Source'}
                      </h4>
                      <span className="text-[10px] text-amber-400 font-mono block truncate">
                        shahnameh-v1.0.5-full-source.zip
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isFa
                      ? 'کل سورس کد پروژه به همراه GitHub Actions آماده آپلود در گیت‌هاب.'
                      : 'Complete source repository with GitHub Actions workflow.'}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  {manifest?.assets?.source && (
                    <span className="text-[10px] font-mono text-slate-500">
                      حجم: {manifest.assets.source.sizeFormatted}
                    </span>
                  )}
                  <a
                    href="/releases/shahnameh-v1.0.5-full-source.zip"
                    download="shahnameh-v1.0.5-full-source.zip"
                    onClick={() => sound.playCoin()}
                    className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isFa ? 'دانلود سورس کامل' : 'Download Source'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Direct One-Click GitHub API Release Publisher */}
          <div className="p-4 bg-slate-900/80 border border-sky-500/40 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span className="text-xs md:text-sm font-black text-sky-300">
                  {isFa
                    ? `انتشار مستقیم و اتوماتیک نسخه ${selectedRelease.tag} روی اکانت گیت‌هاب شما (GitHub REST API)`
                    : `One-Click Publish ${selectedRelease.tag} Directly to Your GitHub Repository`}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                POST /repos/:owner/:repo/releases
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <input
                type="text"
                dir="ltr"
                value={repoSlug}
                onChange={e => setRepoSlug(e.target.value)}
                placeholder="USERNAME/REPO_NAME (e.g. hyn1989/razmnameh)"
                className="px-3 py-2 bg-slate-950 border border-slate-700 focus:border-sky-400 rounded-xl text-xs font-mono text-slate-100 outline-none"
              />
              <input
                type="password"
                dir="ltr"
                value={ghToken}
                onChange={e => setGhToken(e.target.value)}
                placeholder="GitHub Token (ghp_...)"
                className="px-3 py-2 bg-slate-950 border border-slate-700 focus:border-sky-400 rounded-xl text-xs font-mono text-slate-100 outline-none"
              />
              <button
                onClick={handleDirectGitHubPublish}
                disabled={publishStatus === 'loading'}
                className="py-2 px-4 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Github className="w-4 h-4" />
                <span>
                  {publishStatus === 'loading'
                    ? isFa
                      ? 'در حال ارسال به گیت‌هاب...'
                      : 'Publishing...'
                    : isFa
                    ? `ثبت آنی ریلیز ${selectedRelease.tag} در گیت‌هاب`
                    : `Publish ${selectedRelease.tag} Now`}
                </span>
              </button>
            </div>

            {publishStatus === 'success' && (
              <div className="p-2.5 bg-emerald-950/90 border border-emerald-500/60 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{publishMessage}</span>
                </div>
                {publishedUrl && (
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <span>مشاهده در گیت‌هاب</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {publishStatus === 'error' && (
              <div className="p-2.5 bg-red-950/90 border border-red-500/60 rounded-xl flex items-center gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{publishMessage}</span>
              </div>
            )}
          </div>

          {/* 5. Terminal Git Push Commands */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-amber-400" />
                {isFa
                  ? `دستورات ترمینال برای Push تمام تگ‌ها (v1.0.0 تا ${selectedRelease.tag}):`
                  : `Terminal Commands to Push All Tags (${selectedRelease.tag}):`}
              </span>
              <button
                onClick={() => copyCommand(gitPushCommand, 'git')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedCmd === 'git' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isFa ? 'کپی شد' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isFa ? 'کپی دستورات' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            <pre
              dir="ltr"
              className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-amber-200 overflow-x-auto leading-relaxed select-all text-left"
            >
              {gitPushCommand}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 md:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>
              {isFa
                ? 'تمامی تگ‌های v1.0.0 تا v1.0.5 در مخزن گیت ثبت شده و بسته‌های ZIP با SHA-256 امضا شده‌اند.'
                : 'All tags v1.0.0–v1.0.5 committed & ZIP bundles signed with SHA-256.'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
