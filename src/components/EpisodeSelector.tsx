import React, { useState } from 'react';
import { EpisodeData, Language } from '../types';
import { PlayerAlignment } from '../types/game';
import { EPISODES_DATA } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { StoryLogicManager } from '../game/StoryLogicManager';
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
  ChevronRight,
} from 'lucide-react';
import {
  SarlohHeader,
  ManuscriptFrame,
  KatibehCartouche,
  ShamsehBadge,
} from './ShahnamehManuscriptFrame';

interface Props {
  selectedEpisodeId: number;
  highScore: number;
  completedEpisodes: number[];
  lang: Language;
  alignment?: PlayerAlignment;
  onSelectEpisode: (ep: EpisodeData) => void;
  onStartEpisode: (ep: EpisodeData) => void;
  onOpenNaqqal: (ep: EpisodeData) => void;
  onBack: () => void;
}

export const EpisodeSelector: React.FC<Props> = ({
  selectedEpisodeId,
  highScore,
  completedEpisodes,
  lang,
  alignment = 'good',
  onSelectEpisode,
  onStartEpisode,
  onOpenNaqqal,
  onBack,
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'fa' || lang === 'ar';
  const [activeEpId, setActiveEpId] = useState<number>(selectedEpisodeId || 1);
  const activeEpisode = EPISODES_DATA.find((e) => e.id === activeEpId) || EPISODES_DATA[0];
  const activeProfile = StoryLogicManager.getStageProfile(activeEpisode.id, alignment, lang);

  const isUnlocked = (ep: EpisodeData) => {
    if (ep.id === 1) return true;
    return highScore >= ep.unlockRequirementScore || completedEpisodes.includes(ep.id - 1);
  };

  const handleSelect = (ep: EpisodeData) => {
    sound.playCoin();
    setActiveEpId(ep.id);
    onSelectEpisode(ep);
  };

  const coupletParts = activeProfile.prologueCouplet
    ? activeProfile.prologueCouplet.split(/\s*[—/|-]\s*/).filter(Boolean)
    : [];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 zar-afshan-bg backdrop-blur-md flex flex-col overflow-hidden select-none text-slate-100"
    >
      {/* Royal Illuminated Sarloh Crown Banner */}
      <SarlohHeader
        compact
        variant={alignment === 'evil' ? 'crimson' : 'gold'}
      />

      {/* Top Manuscript Navigation Bar */}
      <header className="px-4 py-2.5 md:px-8 border-b-2 border-amber-500/50 bg-[#060c1d]/95 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playSlash(1.2);
              onBack();
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-400/60 rounded-xl text-amber-200 text-xs md:text-sm font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <ChevronRight className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
            <span>{t.return_to_menu}</span>
          </button>
          <div>
            <h1 className="text-base md:text-xl font-black text-amber-200 nastaliq-title drop-shadow flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-400" />
              {t.episodes_modal_title}
            </h1>
            <p className="text-[11px] md:text-xs text-amber-300/75">
              {t.episodes_modal_subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0e1b38] border border-amber-400/60 rounded-xl px-3.5 py-1.5 text-xs text-amber-200 font-bold flex items-center gap-1.5 shadow-inner">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.score}:</span>
            <span className="text-yellow-300 font-mono tabular-nums text-sm">{highScore}</span>
          </div>
        </div>
      </header>

      {/* Main Grid: Left Seven-Khan Manuscript Index + Right Illuminated Folio */}
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Left Column: Seven Labors Roadmap */}
        <ManuscriptFrame
          variant="obsidian"
          showLachakCorners={true}
          className="lg:col-span-7 flex flex-col"
          contentClassName="p-4 flex flex-col gap-3"
        >
          <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2 border-b border-amber-500/30 pb-2">
            <Swords className="w-4 h-4 text-amber-400" />
            {t.episodes_Select_hint}
          </h2>

          <div className="flex flex-col gap-2.5">
            {EPISODES_DATA.map((ep) => {
              const unlocked = isUnlocked(ep);
              const isSelected = ep.id === activeEpId;
              const isCompleted = completedEpisodes.includes(ep.id);
              const epProfile = StoryLogicManager.getStageProfile(ep.id, alignment, lang);

              return (
                <div
                  key={ep.id}
                  onClick={() => unlocked && handleSelect(ep)}
                  className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1c1408] via-[#0d1b3a] to-[#1c1408] border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.28)] scale-[1.01]'
                      : unlocked
                      ? 'bg-[#081024]/90 hover:bg-[#0d1936] border-amber-500/30 hover:border-amber-400/70'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShamsehBadge
                      label={ep.khanNumber ?? ep.id}
                      variant={
                        !unlocked
                          ? 'locked'
                          : isSelected
                          ? alignment === 'evil'
                            ? 'crimson'
                            : 'gold'
                          : 'turquoise'
                      }
                      size="md"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold">
                          {t.chapter_label} {ep.khanNumber}
                        </span>
                        <h3 className="text-sm font-black text-amber-100">
                          {epProfile.chapterTitle}
                        </h3>
                      </div>
                      <p className="text-[11px] text-amber-300/80 line-clamp-1 mt-0.5 font-medium">
                        {epProfile.heroConfig.heroName} ⚔️ {epProfile.bossConfig.bossDisplayName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {t.conquered_label}
                      </span>
                    )}
                    {!unlocked && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-300 font-bold bg-rose-950/80 border border-rose-500/50 px-2.5 py-0.5 rounded-lg tabular-nums">
                        <Lock className="w-3.5 h-3.5" />
                        {t.episodes_locked_btn} ({ep.unlockRequirementScore})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ManuscriptFrame>

        {/* Right Column: Selected Khan Illuminated Manuscript Folio */}
        <ManuscriptFrame
          variant={alignment === 'evil' ? 'crimson' : 'lapis'}
          showSarloh={true}
          sarlohTitle={activeProfile.chapterTitle}
          sarlohSubtitle={`${t.chapter_label} ${activeEpisode.khanNumber} / 7`}
          className="lg:col-span-5 flex flex-col justify-between"
          contentClassName="p-5 flex flex-col justify-between h-full gap-4"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 border-b border-amber-500/30 pb-2.5">
              <div className="flex items-center gap-1.5 text-xs text-amber-200 font-semibold">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{t[`stage_${activeEpisode.id}_era`] || activeEpisode.locationFa}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950/80 border border-amber-500/40 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] text-slate-400">{t.damage}:</span>
                <span className="text-xs font-black text-amber-300 font-mono tabular-nums">
                  ⚔️ {activeEpisode.recommendedPower}
                </span>
              </div>
            </div>

            {/* Two-Hemistich Katibeh Couplet */}
            <KatibehCartouche
              hemistich1={coupletParts[0] || activeProfile.prologueCouplet}
              hemistich2={coupletParts[1]}
              variant={alignment === 'evil' ? 'crimson' : 'gold'}
            />

            {/* Assigned Hero & Boss Info */}
            <div className="bg-slate-950/85 jadval-double-border rounded-xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    {t.stage_assigned_hero_label}
                  </span>
                  <span className="text-sm font-black text-amber-100">
                    {activeProfile.heroConfig.heroName}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/90 text-amber-300 border border-amber-400/40 font-bold">
                  {activeProfile.heroConfig.heroTitle}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-amber-500/25">
                <div>
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
                    {t.stage_final_boss_label}
                  </span>
                  <span className="text-sm font-black text-rose-200">
                    {activeProfile.bossConfig.bossDisplayName}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/90 text-rose-300 border border-rose-500/40 font-bold">
                  {activeProfile.enemyRoster.factionName}
                </span>
              </div>
            </div>

            {/* Narrative Prose Preview */}
            <div className="bg-slate-950/75 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-100/90 leading-relaxed">
              {activeProfile.prologueProse}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-amber-500/30">
            <button
              onClick={() => {
                naqqalAudio.playZangMorshed(1.0);
                onOpenNaqqal(activeEpisode);
              }}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 border border-amber-400/70 rounded-xl text-amber-100 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-lg"
            >
              <Volume2 className="w-4 h-4 text-yellow-300" />
              <span>{t.naqqal_play_btn}</span>
            </button>

            <button
              onClick={() => {
                sound.playDohol(60);
                onStartEpisode(activeEpisode);
              }}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 border border-amber-200 rounded-xl text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-[0_0_24px_rgba(245,158,11,0.45)]"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{t.episodes_start_btn}</span>
            </button>
          </div>
        </ManuscriptFrame>
      </div>
    </div>
  );
};
