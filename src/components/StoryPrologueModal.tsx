import React from 'react';
import { Language, StageDef, PlayerAlignment } from '../types/game';
import { StoryLogicManager } from '../game/StoryLogicManager';
import { TRANSLATIONS } from '../constants/translations';
import { X, Scroll, Play, Shield, UserCheck, Swords, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { NaqqalNarrator } from './NaqqalNarrator';
import { ManuscriptFrame, KatibehCartouche, ShamsehBadge } from './ShahnamehManuscriptFrame';

interface Props {
  stage: StageDef;
  alignment?: PlayerAlignment;
  lang: Language;
  onClose: () => void;
  onStartBattle: () => void;
}

export const StoryPrologueModal: React.FC<Props> = ({
  stage,
  alignment = 'good',
  lang,
  onClose,
  onStartBattle,
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'fa' || lang === 'ar';
  const profile = StoryLogicManager.getStageProfile(stage, alignment, lang);
  const chapterEraText = stage.chapterEraKey ? t[stage.chapterEraKey] : stage.chapterEra;

  // Split couplet into two hemistichs if separated by — or / or ،
  const coupletParts = profile.couplet
    ? profile.couplet.split(/\s*[—/|-]\s*/).filter(Boolean)
    : [];

  const handleStart = () => {
    sound.playVictory();
    onStartBattle();
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 bg-[#03060f]/92 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 select-none animate-fadeIn"
    >
      <ManuscriptFrame
        variant={alignment === 'evil' ? 'crimson' : 'lapis'}
        showSarloh={true}
        sarlohTitle={profile.title}
        sarlohSubtitle={`${t.prologue_header_prefix} · ${chapterEraText}`}
        className="max-w-2xl w-full max-h-[92vh] flex flex-col"
        contentClassName="flex flex-col max-h-[82vh] overflow-hidden"
      >
        {/* Top Bar Inside Folio */}
        <div className="px-4 py-2.5 border-b border-amber-500/30 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShamsehBadge
              label={stage.id}
              variant={alignment === 'evil' ? 'crimson' : 'gold'}
              size="sm"
            />
            <span className="text-xs font-bold text-amber-200/90">
              {profile.chapterTitle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-amber-300/80 hover:text-amber-100 hover:bg-amber-950/60 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Illuminated Katibeh Verse, Naqqal & Combat Roster */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
          {/* Two-Hemistich Royal Katibeh Cartouche */}
          {profile.couplet && (
            <KatibehCartouche
              hemistich1={coupletParts[0] || profile.couplet}
              hemistich2={coupletParts[1]}
              variant={alignment === 'evil' ? 'crimson' : 'gold'}
            />
          )}

          {/* Animated Naqqal Character & Audio Narration Engine */}
          <NaqqalNarrator
            title={profile.title}
            couplet={profile.couplet}
            poet={profile.poet}
            fullProse={profile.fullProse}
            lang={lang}
          />

          {/* Story-Assigned Chapter Character Banner */}
          <div className="p-3.5 bg-[#080f24]/90 jadval-double-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-amber-300/80 uppercase tracking-wider block">
                  {t.stage_assigned_hero_label}
                </span>
                <span className="text-xs md:text-sm font-black text-amber-200">
                  {profile.heroConfig.heroName} —{' '}
                  <span className="text-amber-100/85 font-semibold">
                    {profile.heroConfig.heroTitle}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.no_mid_stage_giants_badge}</span>
            </div>
          </div>

          {/* Faction & Boss Preview from StoryLogicManager */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-center gap-2 p-3 bg-slate-950/90 border border-amber-500/35 rounded-xl">
              <Swords className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-400">{t.vanguard_faction_label}:</span>
              <span className="font-bold text-amber-200 truncate">
                {profile.enemyRoster.factionName}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950/90 border border-red-500/40 rounded-xl">
              <div className="flex items-center gap-2 truncate">
                <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-slate-400">{t.final_boss_opponent_label}:</span>
                <span className="font-bold text-rose-300 truncate">
                  {profile.bossConfig.bossDisplayName}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-mono tabular-nums text-amber-300 font-bold shrink-0">
                <span>+{stage.goldReward}🪙</span>
                <span>+{stage.gemReward}💎</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer & Start Battle CTA */}
        <div className="p-4 border-t border-amber-500/30 bg-slate-950/90 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {t.close}
          </button>

          <button
            onClick={handleStart}
            className="py-2.5 px-6 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-300 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.45)] border border-amber-200 transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t.start_stage}</span>
          </button>
        </div>
      </ManuscriptFrame>
    </div>
  );
};
