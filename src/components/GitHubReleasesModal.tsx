import React, { useState } from 'react';
import { Language } from '../types/game';
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
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  lang: Language;
  onClose: () => void;
}

export const GitHubReleasesModal: React.FC<Props> = ({ lang, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    sound.playCoin();
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const isFa = lang === 'fa';

  const gitPushCommand = `git add .
git commit -m "feat: Razmnameh multi-platform release v1.0.0"
git tag -a v1.0.0 -m "Release v1.0.0: Android, Web/PWA, Desktop"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main --tags`;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-sky-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-100 flex items-center gap-2">
                <span>{isFa ? 'انتشارها و خروجی‌های گیت‌هاب (GitHub Releases)' : 'GitHub Multi-Platform Releases'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  v1.0.0
                </span>
              </h2>
              <span className="text-xs text-slate-400">
                {isFa
                  ? 'بسته‌های آماده برای اندروید، دسکتاپ، وب PWA و اتوماسیون انتشار در گیت‌هاب'
                  : 'Packages ready for Android, Desktop, Web PWA, and GitHub Actions CI/CD'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
          {/* Release Packages Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Web & PWA */}
            <div className="p-4 bg-slate-900/80 border border-emerald-500/30 rounded-xl flex flex-col justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">
                    {isFa ? 'نسخه وب و PWA' : 'Web & PWA'}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    shahnameh-web-pwa.zip
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFa
                  ? 'مناسب انتشار روی وب‌سرورها، هاست، Vercel و نصب در تمامی مرورگرها.'
                  : 'Ready for hosting, Vercel, Netlify, and full PWA installation.'}
              </p>
              <span className="text-[10px] text-slate-500 font-bold">
                ✓ همراه با Service Worker آفلاین
              </span>
            </div>

            {/* 2. Android */}
            <div className="p-4 bg-slate-900/80 border border-sky-500/30 rounded-xl flex flex-col justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">
                    {isFa ? 'پکیج اندروید (Capacitor)' : 'Android Package'}
                  </h3>
                  <span className="text-[10px] text-sky-400 font-mono">
                    shahnameh-android.zip
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFa
                  ? 'پروژه کامل اندروید برای کامپایل به فایل APK و انتشار در بازار و گوگل‌پلی.'
                  : 'Complete Android Studio project scaffolding ready to build APK.'}
              </p>
              <span className="text-[10px] text-slate-500 font-bold">
                ✓ کنترل لمسی و ناچ سازگار
              </span>
            </div>

            {/* 3. Desktop */}
            <div className="p-4 bg-slate-900/80 border border-purple-500/30 rounded-xl flex flex-col justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100">
                    {isFa ? 'پکیج دسکتاپ (Electron)' : 'Desktop Bundle'}
                  </h3>
                  <span className="text-[10px] text-purple-400 font-mono">
                    shahnameh-desktop.zip
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isFa
                  ? 'پکیج اجرای بدون فریم در ویندوز، مک و لینوکس با کنترل کیبورد و گیم‌پد.'
                  : 'Seamless desktop runner for Windows, macOS, and Linux.'}
              </p>
              <span className="text-[10px] text-slate-500 font-bold">
                ✓ پشتیبانی تمام‌صفحه و آفلاین
              </span>
            </div>
          </div>

          {/* GitHub Actions CI/CD Pipeline Info */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  {isFa ? 'اتوماسیون ریلیز گیت‌هاب (.github/workflows/release.yml)' : 'GitHub Actions Release Automation'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                پیکربندی شده
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isFa
                ? 'با ارسال کد به گیت‌هاب و زدن تگ نسخه (مانند v1.0.0)، گیت‌هاب اکشنز به طور خودکار تمامی فایل‌های خروجی را بیلد کرده و به همراه فایل checksums در بخش Releases منتشر می‌نماید.'
                : 'Whenever you push a tag (like v1.0.0) to your GitHub repository, GitHub Actions automatically builds all packages and publishes an official Release with assets and checksums.'}
            </p>
          </div>

          {/* Step-by-Step Push Command Guide */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-sky-400" />
                {isFa ? 'دستورات پابلیش و انتشار روی گیت‌هاب شما:' : 'Publish Commands to your GitHub:'}
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

            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-amber-200 overflow-x-auto leading-relaxed select-all">
              {gitPushCommand}
            </pre>
            <span className="text-[10px] text-slate-500">
              {isFa
                ? 'به جای USERNAME/REPO_NAME نام کاربری و نام مخزن گیت‌هاب خود را جایگزین فرمایید.'
                : 'Replace USERNAME/REPO_NAME with your GitHub username and repository name.'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isFa
              ? 'تمامی فایل‌ها با SHA-256 رمزنگاری و اعتبارسنجی شده‌اند.'
              : 'All build targets are SHA-256 verified and signed.'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {isFa ? 'بستن' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
