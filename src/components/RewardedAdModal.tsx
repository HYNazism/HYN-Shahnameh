import React, { useState, useEffect } from 'react';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import { Video, Award, CheckCircle2, Sparkles, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  lang: Language;
  onClose: () => void;
  onRewardClaimed: (gold: number, gems: number) => void;
  isRespawn?: boolean;
}

export const RewardedAdModal: React.FC<Props> = ({
  lang,
  onClose,
  onRewardClaimed,
  isRespawn = false,
}) => {
  const t = TRANSLATIONS[lang];
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
      sound.playCoin();
    }
  }, [secondsRemaining]);

  const handleClaim = () => {
    sound.playVictory();
    onRewardClaimed(500, 10);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-amber-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Ad Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              {isRespawn ? 'تبلیغ احیای فوری پهلوان' : t.ad_center_title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <span className="text-xs font-mono text-amber-400 font-bold px-2 py-0.5 bg-slate-800 rounded">
                پایان تا {secondsRemaining} ثانیه
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                پاداش آماده است!
              </span>
            )}
          </div>
        </div>

        {/* Ad Video Content Screen (Simulated High-Tech Sponsor for Iranian Game) */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center border-b border-slate-800 overflow-hidden">
          {/* Animated decorative waves */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15),transparent_70%)] pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-3xl shadow-2xl mb-3 animate-bounce">
            🛡️
          </div>

          <h3 className="text-lg font-black text-amber-300 tracking-wide">
            صرافی بین‌المللی و کیف پول امن رمزارز کیانی
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mt-1 leading-relaxed">
            خرید و فروش مستقیم تتر USDT، بیت‌کوین و تون بدون کارمزد با تسویه آنی در شبکه.
          </p>

          <div className="mt-4 px-3 py-1 bg-sky-950/80 border border-sky-400/40 rounded-full text-[11px] text-sky-200 font-mono">
            اسپانسر رسمی بازی شاهنامه · درآمد دلاری برای بازی‌ساز
          </div>
        </div>

        {/* Ad Footer & Reward Action */}
        <div className="p-4 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-left text-xs font-semibold">
              <span className="text-amber-400 block font-mono tabular-nums">+۵۰۰ طلا 🪙 · +۱۰ گوهر 💎</span>
              <span className="text-[10px] text-slate-400">به صندوقچه افزوده می‌شود</span>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={!isCompleted}
            className={`py-2.5 px-5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-transform cursor-pointer ${
              isCompleted
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.ad_close}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
