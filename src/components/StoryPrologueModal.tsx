import React from 'react';
import { HeroId, Language, StageDef } from '../types/game';
import { StoryLogicManager } from '../game/StoryLogicManager';
import { TRANSLATIONS } from '../constants/translations';
import { X, Scroll, Play, Shield, UserCheck, Swords } from 'lucide-react';
import { sound } from '../utils/audio';
import { NaqqalNarrator } from './NaqqalNarrator';

interface Props {
  stage: StageDef;
  selectedHeroId: HeroId;
  onSelectHero: (id: HeroId) => void;
  lang: Language;
  onClose: () => void;
  onStartBattle: () => void;
}

export const StoryPrologueModal: React.FC<Props> = ({
  stage,
  selectedHeroId,
  onSelectHero,
  lang,
  onClose,
  onStartBattle,
}) => {
  const t = TRANSLATIONS[lang];
  const profile = StoryLogicManager.getStageProfile(stage, selectedHeroId, lang);

  const handleStart = () => {
    sound.playVictory();
    onStartBattle();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 select-none animate-fadeIn">
      <div className="bg-[#0b101e] border-2 border-amber-500/60 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Decorative Golden Corner Accents */}
        <div className="absolute top-2 right-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>
        <div className="absolute top-2 left-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>
        <div className="absolute bottom-2 right-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>
        <div className="absolute bottom-2 left-2 text-amber-500/30 text-xs font-serif pointer-events-none">❖</div>

        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-wider block">
                پرده‌خوانی و نقالی شاهنامه فردوسی · {stage.chapterEra}
              </span>
              <h2 className="text-base md:text-lg font-black text-slate-100">
                {profile.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Illustrated Verse & Full Prose */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
          {/* Animated Naqqal Character & Audio Narration Engine */}
          <NaqqalNarrator
            title={profile.title}
            couplet={profile.couplet}
            poet={profile.poet}
            fullProse={profile.fullProse}
          />

          {/* Hero Selection Choice */}
          <div className="p-3.5 bg-slate-900/80 border border-amber-500/40 rounded-xl flex flex-col gap-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              انتخاب پهلوان و زاویه روایت شاهنامه در این مرحله:
            </span>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <button
                onClick={() => {
                  onSelectHero('gordafarid');
                  sound.playArrow();
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedHeroId === 'gordafarid'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-lg'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🏹 گردآفرید شیرزن</span>
              </button>
              <button
                onClick={() => {
                  onSelectHero('sohrab');
                  sound.playSlash();
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedHeroId === 'sohrab'
                    ? 'bg-sky-600 text-white ring-2 ring-sky-300 shadow-lg'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🦅 سهراب یل</span>
              </button>
              <button
                onClick={() => {
                  onSelectHero('rostam');
                  sound.playMaceSmash();
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedHeroId === 'rostam'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-lg font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🦁 رستم دستان</span>
              </button>
            </div>
          </div>

          {/* Faction & Boss Preview from StoryLogicManager */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <Swords className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-400">سپاه پیش‌رو:</span>
              <span className="font-bold text-amber-200 truncate">{profile.enemyRoster.factionName}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 truncate">
                <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-slate-400">هماورد:</span>
                <span className="font-bold text-rose-400 truncate">{profile.bossConfig.bossDisplayName}</span>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-amber-400 font-bold shrink-0 mr-2">
                <span>+{stage.goldReward}🪙</span>
                <span>+{stage.gemReward}💎</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer & Start Battle CTA */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {t.close}
          </button>

          <button
            onClick={handleStart}
            className="py-2.5 px-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t.start_stage}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
