import React, { useEffect, useState } from 'react';
import { Download, Smartphone, Apple, CheckCircle2, X } from 'lucide-react';
import { Language } from '../types/game';
import { sound } from '../utils/audio';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface Props {
  lang: Language;
}

export const PWAInstallButton: React.FC<Props> = ({ lang }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (PWA / Installed app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowSuccessToast(true);
      sound.playVictory();
      setTimeout(() => setShowSuccessToast(false), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      sound.playCoin();
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setShowSuccessToast(true);
        sound.playVictory();
        setTimeout(() => setShowSuccessToast(false), 4000);
      }
    } else if (isIOS) {
      sound.playCoin();
      setShowIOSGuide(true);
    } else {
      // Manual instruction modal or prompt
      setShowIOSGuide(true);
    }
  };

  // If already installed and opened as app, don't show the install button
  if (isInstalled) {
    return null;
  }

  const isFa = lang === 'fa';

  return (
    <>
      <button
        onClick={handleInstallClick}
        title={isFa ? 'نصب نسخه اختصاصی اپلیکیشن روی گوشی و دسکتاپ' : 'Install Native PWA App on Device'}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>{isFa ? 'نصب برنامه' : 'Install App'}</span>
      </button>

      {/* iOS & Manual Installation Modal Guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <div className="bg-[#0b101e] border border-amber-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                {isIOS ? <Apple className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                <span>{isFa ? 'راهنمای نصب رزم‌نامه' : 'Installation Guide'}</span>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 flex flex-col gap-3 leading-relaxed">
              {isIOS ? (
                <>
                  <p>
                    {isFa
                      ? 'برای نصب رزم‌نامه روی آیفون یا آیپد بدون نیاز به اپ‌استور:'
                      : 'To install Razmnameh on iPhone or iPad:'}
                  </p>
                  <ol className="list-decimal list-inside flex flex-col gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <li>
                      {isFa
                        ? 'در پایین مرورگر سافاری (Safari) دکمه اشتراک‌گذاری (Share) را بزنید.'
                        : 'Tap the Share icon in the Safari toolbar.'}
                    </li>
                    <li>
                      {isFa
                        ? 'گزینه «Add to Home Screen» (افزودن به صفحه اصلی) را انتخاب کنید.'
                        : 'Select "Add to Home Screen".'}
                    </li>
                    <li>
                      {isFa
                        ? 'دکمه «Add» را لمس کنید تا آیکون بازی به منوی برنامه‌ها اضافه شود.'
                        : 'Tap "Add" in the top right.'}
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p>
                    {isFa
                      ? 'برای نصب رزم‌نامه روی اندروید یا کامپیوتر:'
                      : 'To install on Android or PC:'}
                  </p>
                  <ol className="list-decimal list-inside flex flex-col gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <li>
                      {isFa
                        ? 'از منوی مرورگر کروم دکمه سه نقطه بالا را لمس کنید.'
                        : 'Tap the three dots menu in Chrome.'}
                    </li>
                    <li>
                      {isFa
                        ? 'گزینه «نصب برنامه» یا «Install App» را انتخاب فرمایید.'
                        : 'Click "Install App" or "Add to Home screen".'}
                    </li>
                  </ol>
                </>
              )}
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {isFa ? 'متوجه شدم' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-400 font-bold text-xs animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{isFa ? 'برنامه با موفقیت نصب گردید!' : 'App installed successfully!'}</span>
        </div>
      )}
    </>
  );
};
