import React, { useState, useEffect } from 'react';
import { Language } from '../types/game';
import { CURRENT_RELEASE_INFO, PlatformReleaseAsset, ReleaseMetadata } from '../constants/releaseInfo';
import {
  X,
  Github,
  Download,
  Smartphone,
  Monitor,
  Globe2,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Layers,
  Laptop,
  Cpu,
  History,
  FileCheck2,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  lang: Language;
  onClose: () => void;
}

export const GitHubReleasesModal: React.FC<Props> = ({ lang, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'executables' | 'changelog' | 'automation'>('executables');
  const [liveRelease, setLiveRelease] = useState<ReleaseMetadata>(CURRENT_RELEASE_INFO);

  useEffect(() => {
    fetch('/releases/release-manifest.json')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && Array.isArray(data.assets) && data.version) {
          setLiveRelease(prev => ({
            ...prev,
            version: data.version,
            tag: data.tag || `v${data.version}`,
            releasedAt: data.releasedAt || prev.releasedAt,
            assets: data.assets,
          }));
        }
      })
      .catch(() => {
        // Fallback to static CURRENT_RELEASE_INFO
      });
  }, []);

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    sound.playCoin();
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const isFa = lang === 'fa' || lang === 'ar';
  const rel = liveRelease;

  const getPlatformIcon = (id: PlatformReleaseAsset['id']) => {
    switch (id) {
      case 'windows':
        return <Monitor className="w-4 h-4 text-sky-400" />;
      case 'macos':
        return <Laptop className="w-4 h-4 text-amber-300" />;
      case 'linux':
        return <Cpu className="w-4 h-4 text-orange-400" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'ios':
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'web':
      default:
        return <Globe2 className="w-4 h-4 text-teal-400" />;
    }
  };

  const getPlatformAccent = (id: PlatformReleaseAsset['id']) => {
    switch (id) {
      case 'windows':
        return 'border-sky-500/35 hover:border-sky-400/70 bg-sky-950/20';
      case 'macos':
        return 'border-amber-500/35 hover:border-amber-400/70 bg-amber-950/20';
      case 'linux':
        return 'border-orange-500/35 hover:border-orange-400/70 bg-orange-950/20';
      case 'android':
        return 'border-emerald-500/35 hover:border-emerald-400/70 bg-emerald-950/20';
      case 'ios':
        return 'border-purple-500/35 hover:border-purple-400/70 bg-purple-950/20';
      case 'web':
      default:
        return 'border-teal-500/35 hover:border-teal-400/70 bg-teal-950/20';
    }
  };

  const autoReleaseCommands = `# ۱. انتشار خودکار بر اساس نوع تغییر کامیت (توصیه شده)
npm run release:auto

# ۲. انتشار ساب‌ورژن اصلاحی (Patch: v1.1.x)
npm run release:patch

# ۳. انتشار ساب‌ورژن ویژگی جدید (Minor: v1.x.0)
npm run release:minor

# ۴. انتشار تغییر اساسی نسخه (Major: vx.0.0)
npm run release:major`;

  const gitRemotePushCommand = `git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main --tags`;

  return (
    <div
      dir={isFa ? 'rtl' : 'ltr'}
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4 select-none"
    >
      <div className="bg-[#0b101e] border border-amber-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-slate-100 flex flex-wrap items-center gap-2">
                <span>
                  {isFa
                    ? 'مرکز انتشار خودکار و نسخه‌های اجرایی همه دستگاه‌ها'
                    : 'Automated Multi-Platform Executable Releases'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                  {rel.tag}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono uppercase">
                  {rel.releaseType === 'major'
                    ? isFa
                      ? 'نسخه اصلی (Major)'
                      : 'MAJOR'
                    : rel.releaseType === 'minor'
                    ? isFa
                      ? 'ساب‌ورژن ویژگی (Minor)'
                      : 'MINOR'
                    : isFa
                    ? 'ساب‌ورژن اصلاحی (Patch)'
                    : 'PATCH'}
                </span>
              </h2>
              <span className="text-xs text-slate-400">
                {isFa
                  ? 'بیلد خودکار ۶ پلتفرم (ویندوز، مک، لینوکس، اندروید، آیفون و وب PWA) پس از هر تغییر با امضای SHA-256'
                  : 'Automated 6-platform executable builds (Windows, macOS, Linux, Android, iOS, Web PWA) on every change'}
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

        {/* Navigation Tabs */}
        <div className="px-4 md:px-6 pt-3 border-b border-slate-800/80 flex items-center gap-2 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('executables')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'executables'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isFa ? `دانلود نسخه‌های اجرایی (${rel.tag})` : `Device Executables (${rel.tag})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('changelog')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'changelog'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isFa ? 'تاریخچه نسخه‌ها و ساب‌ورژن‌ها' : 'Version & Sub-version History'}</span>
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'automation'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isFa ? 'اتوماسیون گیت‌هاب و دستورات ریلیز' : 'GitHub CI/CD & CLI Automation'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
          {activeTab === 'executables' && (
            <>
              {/* 6 Device Executable Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {rel.assets.map(asset => (
                  <div
                    key={asset.id}
                    className={`p-4 border rounded-xl flex flex-col justify-between gap-3 transition-all shadow-lg ${getPlatformAccent(
                      asset.id
                    )}`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shrink-0">
                            {getPlatformIcon(asset.id)}
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-slate-100 leading-snug">
                              {isFa ? asset.platformFa : asset.platform}
                            </h3>
                            <span className="text-[10px] text-amber-300/90 font-mono">
                              {asset.format}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-300 font-mono shrink-0">
                          {asset.sizeFormatted}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1 font-mono text-[10px]">
                        <div className="flex items-center justify-between text-slate-300 truncate">
                          <span className="text-slate-500">File:</span>
                          <span className="truncate max-w-[180px] text-sky-300">{asset.filename}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 truncate">
                          <span className="text-slate-500">SHA256:</span>
                          <span className="text-emerald-400" title={asset.sha256}>
                            {asset.sha256.slice(0, 14)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={asset.latestDownloadUrl}
                      download={asset.filename}
                      onClick={() => sound.playCoin()}
                      className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        {isFa ? `دانلود مستقیم نسخه ${rel.tag}` : `Download ${rel.tag} Bundle`}
                      </span>
                    </a>
                  </div>
                ))}
              </div>

              {/* Verification & Manifest Bar */}
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-200 block">
                      {isFa
                        ? 'اعتبارسنجی امنیتی SHA-256 و مانیفست رسمی ریلیز'
                        : 'Official SHA-256 Checksums & Release Manifest'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isFa
                        ? 'تمامی بسته‌های اجرایی بالا در هر بار تغییر کد به‌صورت خودکار کامپایل و امضا می‌شوند.'
                        : 'All 6 platform executables are automatically compiled and signed on every code change.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/releases/sha256sums.txt"
                    download={`sha256sums-${rel.tag}.txt`}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>sha256sums.txt</span>
                  </a>
                  <a
                    href="/releases/release-manifest.json"
                    download={`release-manifest-${rel.tag}.json`}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>release-manifest.json</span>
                  </a>
                </div>
              </div>
            </>
          )}

          {activeTab === 'changelog' && (
            <div className="flex flex-col gap-3">
              {rel.history.map((item, idx) => (
                <div
                  key={item.version}
                  className={`p-4 rounded-xl border ${
                    idx === 0
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-slate-900/60 border-slate-800'
                  } flex flex-col gap-2`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black">
                        {item.tag}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px] uppercase">
                        {item.type}
                      </span>
                      <h3 className="text-xs md:text-sm font-black text-slate-100">
                        {isFa ? item.titleFa : item.titleEn}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                  </div>

                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 leading-relaxed">
                    {item.highlightsFa.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-slate-900/70 border border-emerald-500/30 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-slate-100">
                      {isFa
                        ? 'پایپ‌لاین خودکار گیت‌هاب اکشنز (.github/workflows/release.yml)'
                        : 'Automated GitHub Actions SemVer Pipeline'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    {isFa ? 'فعال روی هر تغییر (Push & Tag)' : 'Active on Every Push'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isFa
                    ? 'پس از هر بار تغییر، اسکریپت انتشار خودکار نوع تغییر (Patch / Minor / Major) را تشخیص داده، شماره نسخه را ارتقا می‌دهد، هر ۶ پکیج اجرایی دستگاه‌ها را بیلد و امضا می‌کند، در گیت تگ می‌زند و در GitHub Releases منتشر می‌نماید.'
                    : 'After every change, the release engine detects the semantic bump (patch/minor/major), builds all 6 device executables, tags the commit in Git, and publishes the GitHub Release.'}
                </p>
              </div>

              {/* Automated SemVer Commands */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-2 font-mono">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    {isFa
                      ? 'دستورات انتشار خودکار با ساب‌ورژن یا نسخه اصلی:'
                      : 'Automated Sub-version / Major Release Commands:'}
                  </span>
                  <button
                    onClick={() => copyCommand(autoReleaseCommands, 'semver')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedCmd === 'semver' ? (
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
                  {autoReleaseCommands}
                </pre>
              </div>

              {/* Remote Connect Command */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300 flex items-center gap-2 font-mono">
                    <Github className="w-4 h-4 text-sky-400" />
                    {isFa
                      ? 'اتصال به مخزن گیت‌هاب و ارسال کل تگ‌ها و ریلیزها:'
                      : 'Connect GitHub Remote & Push All Tags:'}
                  </span>
                  <button
                    onClick={() => copyCommand(gitRemotePushCommand, 'remote')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedCmd === 'remote' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{isFa ? 'کپی شد' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isFa ? 'کپی' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-sky-200 overflow-x-auto leading-relaxed select-all text-left"
                >
                  {gitRemotePushCommand}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {isFa
              ? `آخرین نسخه منتشرشده: ${rel.tag} · ۶ پلتفرم اجرایی آماده دانلود`
              : `Latest Release: ${rel.tag} · 6 Executable Targets Ready`}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
