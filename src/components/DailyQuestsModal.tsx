import React, { useState, useEffect } from 'react';
import { DailyQuest, Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import { X, Calendar, Clock, Award, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  quests: DailyQuest[];
  lastResetTimestamp: number;
  lang: Language;
  onClose: () => void;
  onClaimQuest: (questId: string) => void;
  onStartDailyChallenge: () => void;
}

export const DailyQuestsModal: React.FC<Props> = ({
  quests,
  lastResetTimestamp,
  lang,
  onClose,
  onClaimQuest,
  onStartDailyChallenge,
}) => {
  const t = TRANSLATIONS[lang];
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Calculate remaining time until next midnight / 24h reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = Math.max(0, tomorrow.getTime() - now.getTime());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = (questId: string) => {
    sound.playVictory();
    onClaimQuest(questId);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-amber-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-amber-400">
                {t.daily_quests}
              </h2>
              <span className="text-xs text-slate-400">
                چالش‌های روزمره دلاوران شاهنامه همراه با جوایز دوبل
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

        {/* 24-Hour Countdown Banner */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{t.daily_reset_countdown}:</span>
          </div>

          {/* Time digits */}
          <div className="flex items-center gap-1.5 font-mono text-sm font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 shadow-inner">
            <span>{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Quests List */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-3">
          {quests.map(quest => {
            const isCompleted = quest.currentCount >= quest.targetCount || quest.isCompleted;
            const progressPct = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

            return (
              <div
                key={quest.id}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    isCompleted ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-100">
                        {t[quest.titleKey] || quest.titleKey}
                      </h4>
                      <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                        {Math.min(quest.currentCount, quest.targetCount)} / {quest.targetCount}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {t[quest.descKey] || quest.descKey}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Claim or Action */}
                <div className="flex items-center gap-3 shrink-0 justify-end">
                  <div className="text-right text-xs font-mono text-amber-400 font-bold hidden sm:block">
                    +{quest.rewardGold}🪙 +{quest.rewardGems}💎
                  </div>

                  {quest.isClaimed ? (
                    <span className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {t.claimed}
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(quest.id)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5 animate-bounce"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.claim_reward}</span>
                    </button>
                  ) : (
                    <button
                      onClick={onStartDailyChallenge}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>ورود به میدان</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            ماموریت‌ها هر شب رأس ساعت ۲۴ نوسازی می‌شوند.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
