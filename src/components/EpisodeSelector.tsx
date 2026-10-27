import React, { useState } from 'react';
import { EpisodeData, Language } from '../types';
import { EPISODES_DATA } from '../constants/gameData';
import { sound } from '../utils/audio';
import { naqqalAudio } from '../utils/naqqalAudio';
import {
  MapPin,
  Swords,
  Award,
  Scroll,
  Lock,
  CheckCircle,
  Play,
  Volume2,
  Trees,
  Sun,
  Flame,
  Sparkles,
  Shield,
  Zap,
  Crown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface Props {
  selectedEpisodeId: number;
  highScore: number;
  completedEpisodes: number[];
  lang: Language;
  onSelectEpisode: (ep: EpisodeData) => void;
  onStartEpisode: (ep: EpisodeData) => void;
  onOpenNaqqal: (ep: EpisodeData) => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Trees: <Trees className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
};

export const EpisodeSelector: React.FC<Props> = ({
  selectedEpisodeId,
  highScore,
  completedEpisodes,
  lang,
  onSelectEpisode,
  onStartEpisode,
  onOpenNaqqal,
  onBack,
}) => {
  const [activeEpId, setActiveEpId] = useState<number>(selectedEpisodeId || 1);
  const activeEpisode = EPISODES_DATA.find(e => e.id === activeEpId) || EPISODES_DATA[0];

  const isUnlocked = (ep: EpisodeData) => {
    if (ep.id === 1) return true;
    return highScore >= ep.unlockRequirementScore || completedEpisodes.includes(ep.id - 1);
  };

  const handleSelect = (ep: EpisodeData) => {
    sound.playCoin();
    setActiveEpId(ep.id);
    onSelectEpisode(ep);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16]/95 backdrop-blur-md flex flex-col overflow-hidden select-none text-slate-100">
      {/* Top Bar with Persian Illumination style */}
      <header className="px-4 py-3 md:px-8 border-b border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playSlash(1.2);
              onBack();
            }}
            className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-amber-500/40 rounded-xl text-amber-200 text-xs md:text-sm font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            <span>بازگشت به بارگاه</span>
          </button>
          <div>
            <h1 className="text-base md:text-xl font-black text-amber-300 drop-shadow flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-400" />
              پرده‌خوانی هفت‌خان رستم و حماسه‌های کهن
            </h1>
            <p className="text-[11px] md:text-xs text-amber-200/70">
              خان‌های اسطوره‌ای مازندران • چالش‌های مهارتی پهلوانی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-950/70 border border-amber-500/50 rounded-xl px-3 py-1 text-xs text-amber-300 font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>بالاترین فرّه کسب‌شده:</span>
            <span className="text-yellow-300 font-mono text-sm">{highScore}</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Map Path + Right Details Card */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Left Column: Seven Labors Roadmap */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-amber-500/20 pb-2">
            <Swords className="w-4 h-4 text-amber-400" />
            مسیر خوان‌های اساطیری زابلستان تا مازندران
          </h2>

          <div className="flex flex-col gap-2.5">
            {EPISODES_DATA.map((ep) => {
              const unlocked = isUnlocked(ep);
              const isSelected = ep.id === activeEpId;
              const isCompleted = completedEpisodes.includes(ep.id);

              return (
                <div
                  key={ep.id}
                  onClick={() => unlocked && handleSelect(ep)}
                  className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/50 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.01]'
                      : unlocked
                      ? 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-700/80 hover:border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                          : unlocked
                          ? 'bg-slate-800 text-amber-300 border-amber-500/30'
                          : 'bg-slate-900 text-slate-500 border-slate-700'
                      }`}
                    >
                      {ICON_MAP[ep.icon] || <Scroll className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          خوان {ep.khanNumber}
                        </span>
                        <h3 className="text-sm font-black text-slate-100">{ep.titleFa}</h3>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {ep.subtitleFa}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" />
                        پیروز
                      </span>
                    )}
                    {!unlocked && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-400 font-bold bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-lg">
                        <Lock className="w-3.5 h-3.5" />
                        نیاز: {ep.unlockRequirementScore} امتیاز
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Khan Detail & Perde-khani */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#141b2c] to-[#0c101d] border-2 border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle Persian miniature motif backdrop */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 border-b border-amber-500/20 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  خوان {activeEpisode.khanNumber} از هفت‌خان رستم
                </span>
                <h2 className="text-lg font-black text-amber-200 mt-0.5">
                  {activeEpisode.titleFa}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeEpisode.locationFa}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">توان پیشنهادی</span>
                <span className="text-sm font-black text-amber-300 font-mono">
                  ⚔️ {activeEpisode.recommendedPower}
                </span>
              </div>
            </div>

            {/* Couplet & Shahnameh Lore */}
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5">
              <p className="text-xs text-amber-300 font-bold italic leading-relaxed text-center font-serif">
                «{activeEpisode.couplet}»
              </p>
              <div className="text-[10px] text-amber-400/80 text-center mt-1">
                — شاهنامه فردوسی بزرگ
              </div>
            </div>

            {/* Boss Info */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-400 font-bold block">اهریمن رویارو (باس)</span>
                <span className="text-sm font-black text-slate-100">{activeEpisode.bossNameFa}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-500/30 font-bold">
                {activeEpisode.bossTitleFa}
              </span>
            </div>

            {/* Skill Challenges */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-yellow-400" />
                چالش‌های مهارتی این خوان (کسب امتیاز مهارت):
              </h4>
              <div className="flex flex-col gap-2">
                {activeEpisode.challenges.map(ch => (
                  <div
                    key={ch.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{ch.titleFa}</div>
                      <div className="text-[11px] text-slate-400">{ch.descFa}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-300 font-mono font-bold text-[11px] bg-yellow-950/50 border border-yellow-500/30 px-2 py-0.5 rounded-lg">
                      <span>+{ch.rewardSkillPoints} مهارت</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-2.5 mt-4 pt-3 border-t border-amber-500/20">
            <button
              onClick={() => {
                naqqalAudio.playZangMorshed(1.0);
                onOpenNaqqal(activeEpisode);
              }}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 border border-amber-400/60 rounded-xl text-amber-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-lg"
            >
              <Volume2 className="w-4 h-4 text-yellow-300" />
              <span>شنیدن پرده‌خوانی و نقالی</span>
            </button>

            <button
              onClick={() => {
                sound.playDohol(60);
                onStartEpisode(activeEpisode);
              }}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 border border-emerald-400/80 rounded-xl text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-xl shadow-emerald-950/50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ورود به میدان نبرد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
