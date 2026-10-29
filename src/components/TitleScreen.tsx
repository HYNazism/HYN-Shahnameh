import React, { useEffect, useRef } from 'react';
import { HeroId, PlayerProgress, Language, GraphicsTier, PlayerAlignment } from '../types/game';
import { HEROES, STAGES } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { CURRENT_RELEASE_INFO } from '../constants/releaseInfo';
import { QahvehKhanehRenderer } from '../game/QahvehKhanehRenderer';
import { StoryLogicManager } from '../game/StoryLogicManager';
import { LanguageSelector } from './LanguageSelector';
import { GraphicsSelector } from './GraphicsSelector';
import { PWAInstallButton } from './PWAInstallButton';
import {
  SarlohHeader,
  ManuscriptFrame,
  KatibehCartouche,
  ShamsehBadge,
} from './ShahnamehManuscriptFrame';
import {
  Sword,
  Shield,
  Zap,
  Calendar,
  ShoppingBag,
  Wallet,
  Video,
  BarChart3,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Swords,
  Sparkles,
  Flame,
  Skull,
  ChevronLeft,
  ChevronRight,
  Github,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  selectedHeroId?: HeroId;
  onSelectHero?: (id: HeroId) => void;
  alignment?: PlayerAlignment;
  onSelectAlignment?: (alignment: PlayerAlignment) => void;
  selectedStageId: number;
  onSelectStage: (id: number) => void;
  graphicsTier: GraphicsTier;
  onSelectGraphicsTier: (tier: GraphicsTier) => void;
  progress: PlayerProgress;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  onStartGame: () => void;
  onOpenDuel: () => void;
  onOpenArmory: () => void;
  onOpenCrypto: () => void;
  onOpenRewardedAd: () => void;
  onOpenDevDashboard: () => void;
  onOpenDailyQuests: () => void;
  onOpenPlayerStore: () => void;
  onOpenEpisodes?: () => void;
  onOpenSkillTree?: () => void;
  onOpenNaqqal?: () => void;
  onOpenReleases?: () => void;
}

export const TitleScreen: React.FC<Props> = ({
  alignment = 'good',
  onSelectAlignment,
  selectedStageId,
  onSelectStage,
  graphicsTier,
  onSelectGraphicsTier,
  progress,
  lang,
  onSelectLang,
  onStartGame,
  onOpenDuel,
  onOpenArmory,
  onOpenCrypto,
  onOpenRewardedAd,
  onOpenDevDashboard,
  onOpenDailyQuests,
  onOpenPlayerStore,
  onOpenEpisodes,
  onOpenSkillTree,
  onOpenReleases,
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'fa' || lang === 'ar';
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());
  const portraitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const strikeTimerRef = useRef<number>(0);

  const storyProfile = StoryLogicManager.getStageProfile(selectedStageId, alignment, lang);
  const activeHeroRenderId =
    storyProfile.heroConfig.heroRenderId ||
    storyProfile.heroConfig.baseHeroId ||
    storyProfile.heroId ||
    'rostam';
  const currentHero = HEROES.find(h => h.id === storyProfile.heroConfig.baseHeroId) || HEROES[0];

  // Trigger a heroic weapon flourish when switching stages or alignment
  useEffect(() => {
    strikeTimerRef.current = 0.34;
  }, [selectedStageId, alignment, activeHeroRenderId]);

  // Live Qahveh-Khaneh Pahlavan Showcase Canvas Loop
  useEffect(() => {
    const canvas = portraitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let last = performance.now();

    const renderPortrait = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = now * 0.001;

      if (strikeTimerRef.current > 0) {
        strikeTimerRef.current = Math.max(0, strikeTimerRef.current - dt);
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Dark Illuminated Qahveh-Khaneh Arch Backdrop
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.48, 10, w * 0.5, h * 0.5, w * 0.65);
      if (alignment === 'evil') {
        bgGrad.addColorStop(0, '#4c0519');
        bgGrad.addColorStop(0.6, '#1f040d');
        bgGrad.addColorStop(1, '#070a14');
      } else if (activeHeroRenderId === 'rostam') {
        bgGrad.addColorStop(0, '#451a03');
        bgGrad.addColorStop(0.6, '#1c0a04');
        bgGrad.addColorStop(1, '#070a14');
      } else if (activeHeroRenderId === 'sohrab') {
        bgGrad.addColorStop(0, '#082f49');
        bgGrad.addColorStop(0.6, '#061526');
        bgGrad.addColorStop(1, '#070a14');
      } else {
        bgGrad.addColorStop(0, '#064e3b');
        bgGrad.addColorStop(0.6, '#031d17');
        bgGrad.addColorStop(1, '#070a14');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Ornate Golden Tazhib Mihrab Arch & Shamseh Halo
      ctx.save();
      const haloX = w * 0.5;
      const haloY = h * 0.42;
      const haloGrad = ctx.createRadialGradient(haloX, haloY, 4, haloX, haloY, 46);
      if (alignment === 'evil') {
        haloGrad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
        haloGrad.addColorStop(0.6, 'rgba(159, 18, 57, 0.14)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.38)');
        haloGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.14)');
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(haloX, haloY, 46, 0, Math.PI * 2);
      ctx.fill();

      // Rotating 12-point Shamseh Sunburst Ring
      ctx.strokeStyle = alignment === 'evil' ? 'rgba(251, 113, 133, 0.35)' : 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const ang = (i * Math.PI) / 6 + time * 0.25;
        ctx.beginPath();
        ctx.moveTo(haloX + Math.cos(ang) * 24, haloY + Math.sin(ang) * 24);
        ctx.lineTo(haloX + Math.cos(ang) * 40, haloY + Math.sin(ang) * 40);
        ctx.stroke();
      }
      ctx.restore();

      ctx.strokeStyle = alignment === 'evil' ? 'rgba(225, 29, 72, 0.65)' : 'rgba(217, 119, 6, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(5, 5, w - 10, h - 10);

      // Engraved Royal Stone Pedestal
      const pedGrad = ctx.createLinearGradient(18, h - 24, w - 18, h - 12);
      pedGrad.addColorStop(0, '#0f172a');
      pedGrad.addColorStop(0.5, '#334155');
      pedGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = pedGrad;
      ctx.fillRect(18, h - 24, w - 36, 11);
      ctx.strokeStyle = alignment === 'evil' ? '#fb7185' : '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(18, h - 24, w - 36, 11);

      // Render Assigned Stage Character in Full Mature Qahveh-Khaneh Detail
      ctx.save();
      ctx.translate(w * 0.5, h - 66);
      QahvehKhanehRenderer.renderHero({
        ctx,
        heroId: activeHeroRenderId,
        facing: 1,
        animFrame: time * 4,
        vx: 0,
        vy: 0,
        isGrounded: true,
        isAttacking: strikeTimerRef.current > 0,
        attackType: 'heavy',
        attackTimer: strikeTimerRef.current,
        rageRatio: 0.75,
        graphicsTier: 'ultra',
        time,
        scale: 1.95,
      });
      ctx.restore();

      animId = requestAnimationFrame(renderPortrait);
    };

    animId = requestAnimationFrame(renderPortrait);
    return () => cancelAnimationFrame(animId);
  }, [activeHeroRenderId, alignment]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const activeQuestsCount = progress.dailyQuests.filter(q => !q.isClaimed).length;
  const completedStagesCount = progress.completedStages.length;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full h-full overflow-y-auto overflow-x-hidden zar-afshan-bg text-slate-100 flex flex-col justify-between p-3 md:p-5 select-none"
    >
      {/* Subtle Background Ornamentation */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.22),transparent_65%)]" />

      {/* Royal Safavid/Timurid Sarloh Crown Banner */}
      <div className="relative z-10 w-full max-w-7xl mx-auto -mt-1 mb-1">
        <SarlohHeader
          compact
          variant={alignment === 'evil' ? 'crimson' : 'gold'}
        />
      </div>

      {/* Initial Role Selection Modal (Good vs Evil) when player first starts */}
      {!progress.hasChosenAlignment && onSelectAlignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <ManuscriptFrame
            variant="lapis"
            showSarloh={true}
            sarlohTitle={t.choose_alignment_title}
            sarlohSubtitle={t.app_title}
            className="max-w-2xl w-full text-center"
            contentClassName="p-6 md:p-8 flex flex-col gap-6"
          >
            <p className="text-xs md:text-sm text-amber-100/85 max-w-lg mx-auto leading-relaxed">
              {t.choose_alignment_subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Good Path Card */}
              <button
                onClick={() => {
                  sound.playVictory();
                  onSelectAlignment('good');
                }}
                className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/80 to-slate-950/95 hover:from-amber-900/85 hover:to-slate-900 border-2 border-amber-400/80 hover:border-amber-300 transition-all cursor-pointer flex flex-col items-center gap-3 text-center shadow-xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-amber-300 nastaliq-title">
                    {t.alignment_good_title}
                  </h3>
                  <span className="text-[11px] text-amber-200/80 font-bold block mt-0.5">
                    {t.alignment_good_subtitle}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.alignment_good_desc}
                </p>
              </button>

              {/* Evil Path Card */}
              <button
                onClick={() => {
                  sound.playSlash();
                  onSelectAlignment('evil');
                }}
                className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/80 to-slate-950/95 hover:from-rose-900/85 hover:to-slate-900 border-2 border-rose-500/80 hover:border-rose-400 transition-all cursor-pointer flex flex-col items-center gap-3 text-center shadow-xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/60 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-rose-400 nastaliq-title">
                    {t.alignment_evil_title}
                  </h3>
                  <span className="text-[11px] text-rose-200/80 font-bold block mt-0.5">
                    {t.alignment_evil_subtitle}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.alignment_evil_desc}
                </p>
              </button>
            </div>
          </ManuscriptFrame>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-amber-500/40">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-300/60">
            <div className="w-full h-full bg-[#060c1d] rounded-[10px] flex items-center justify-center text-xl">
              ⚔️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-2xl font-black tracking-tight text-amber-100 nastaliq-title drop-shadow">
                {t.app_title}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono tabular-nums px-2 py-0.5 bg-amber-500/15 border border-amber-400/40 text-amber-300 rounded">
                {t.version_badge}
              </span>
            </div>
            <p className="text-[11px] text-amber-300/80 font-medium">
              {t.game_subtitle} · {t.game_subtitle_full}
            </p>
          </div>
        </div>

        {/* Currency Vault & System Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900/90 border border-amber-500/30 rounded-xl text-xs font-semibold shadow-inner backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="text-sm">🪙</span>
              <span className="font-mono tabular-nums font-bold">{progress.gold.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">{t.gold}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-sky-400">
              <span className="text-sm">💎</span>
              <span className="font-mono tabular-nums font-bold">{progress.gems.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">{t.gems}</span>
            </div>
            {progress.isVipBenefactor && (
              <>
                <span className="text-slate-700">|</span>
                <span className="text-amber-300 text-[11px] font-bold flex items-center gap-1">
                  <span>👑</span>
                  <span className="hidden sm:inline">{t.vip_royal_patron}</span>
                </span>
              </>
            )}
          </div>

          <PWAInstallButton lang={lang} />

          <GraphicsSelector
            currentTier={graphicsTier}
            onSelectTier={onSelectGraphicsTier}
            lang={lang}
          />

          <button
            onClick={handleToggleSound}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
            title={isMuted ? t.sound_off : t.sound_on}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <LanguageSelector currentLang={lang} onSelectLang={onSelectLang} />
        </div>
      </header>

      {/* Main Grid: Role & Stage-Assigned Character Showcase + 7 Chapters Map & CTAs */}
      <main className="relative z-10 w-full max-w-7xl mx-auto my-auto py-3 md:py-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Alignment Role Switcher & Stage-Assigned Character Showcase (6 cols) */}
        <ManuscriptFrame
          variant={alignment === 'evil' ? 'crimson' : 'lapis'}
          showSarloh={true}
          sarlohTitle={storyProfile.heroConfig.heroName}
          sarlohSubtitle={storyProfile.heroConfig.heroTitle}
          className="lg:col-span-6 flex flex-col justify-between"
          contentClassName="p-4 flex flex-col gap-3 justify-between h-full"
        >
          {/* Alignment / Role Switcher (Good vs Evil) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-amber-200">
                {t.alignment_switch_label}
              </span>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/75 border border-emerald-500/40 px-2 py-0.5 rounded-lg">
                {t.no_mid_stage_giants_badge}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#050a18]/90 jadval-double-border rounded-xl">
              <button
                onClick={() => {
                  onSelectAlignment?.('good');
                  sound.playVictory();
                }}
                className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  alignment === 'good'
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-amber-200/70 hover:text-amber-100 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.alignment_good_title}</span>
              </button>

              <button
                onClick={() => {
                  onSelectAlignment?.('evil');
                  sound.playSlash();
                }}
                className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  alignment === 'evil'
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md font-black'
                    : 'text-rose-200/70 hover:text-rose-100 hover:bg-slate-800/60'
                }`}
              >
                <Flame className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.alignment_evil_title}</span>
              </button>
            </div>
          </div>

          {/* Stage-Assigned Character Card Container */}
          <div className="flex-1 p-3.5 md:p-4 bg-[#050a18]/90 border border-amber-500/40 rounded-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Stage-Assigned Character Header + Live Mihrab-Arch Miniature Canvas Portrait */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-3 border-b border-amber-500/25">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/40">
                      {t.stage_assigned_hero_label} ({t.chapter_label} {selectedStageId})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-black text-amber-200 nastaliq-title">
                      {storyProfile.heroConfig.heroName}
                    </h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/40">
                      {storyProfile.heroConfig.heroTitle}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/85 leading-relaxed mt-2 italic">
                    «{storyProfile.heroConfig.heroDesc}»
                  </p>

                  {/* Stage Exclusive Final Boss Badge */}
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-950/55 border border-rose-500/45 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Skull className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-rose-300 block font-bold">
                          {t.stage_final_boss_label}
                        </span>
                        <span className="text-xs font-black text-amber-100">
                          {storyProfile.bossConfig.bossDisplayName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Mihrab-Arch Pahlavan Canvas Showcase */}
                <div
                  onClick={() => {
                    strikeTimerRef.current = 0.34;
                    sound.playSlash();
                  }}
                  title={t.portrait_click_hint}
                  className={`relative w-36 h-44 mihrab-arch-frame overflow-hidden border-2 shadow-[0_12px_30px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(212,175,55,0.22)] shrink-0 cursor-pointer group bg-[#060b19] ${
                    alignment === 'evil' ? 'border-rose-500/80' : 'border-amber-400/85'
                  }`}
                >
                  <canvas
                    ref={portraitCanvasRef}
                    width={160}
                    height={180}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute bottom-0 inset-x-0 text-center text-[9px] text-amber-200 font-mono bg-slate-950/85 py-0.5 border-t border-amber-500/30">
                    {t.portrait_click_hint}
                  </span>
                </div>
              </div>

              {/* Combat Gear & Signature Skill */}
              <div className="grid grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-amber-500/25">
                <div className="flex items-start gap-2.5 p-2.5 damascus-surface rounded-xl border border-amber-500/35">
                  <div className="p-2 bg-amber-500/15 border border-amber-400/40 rounded-lg text-amber-300 shrink-0">
                    <Sword className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-amber-300/75 block">{t.equipped}</span>
                    <span className="text-xs font-bold text-amber-100 truncate block">
                      {storyProfile.heroConfig.weaponName}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 damascus-surface rounded-xl border border-sky-500/35">
                  <div className="p-2 bg-sky-500/15 border border-sky-400/40 rounded-lg text-sky-300 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-sky-300/75 block">{t.special_skill_label}</span>
                    <span className="text-xs font-bold text-sky-200 truncate block">
                      {storyProfile.heroConfig.specialName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Combat Telemetry Attributes (HP, Attack, Speed) */}
            <div className="grid grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-amber-500/25 text-center">
              <div className="bg-slate-950/85 p-2 rounded-xl border border-amber-500/30 flex flex-col items-center">
                <span className="text-[10px] text-amber-200/75 block mb-0.5">{t.hp_stat}</span>
                <span className="text-sm md:text-base font-black text-emerald-400 font-mono tabular-nums">
                  {storyProfile.heroConfig.maxHp}
                </span>
                <span className="text-[9px] text-slate-400">{t.stat_hp_sub}</span>
              </div>

              <div className="bg-slate-950/85 p-2 rounded-xl border border-amber-500/30 flex flex-col items-center">
                <span className="text-[10px] text-amber-200/75 block mb-0.5">{t.damage}</span>
                <span className="text-sm md:text-base font-black text-rose-400 font-mono tabular-nums">
                  {storyProfile.heroConfig.attackPower}
                </span>
                <span className="text-[9px] text-slate-400">{t.stat_dmg_sub}</span>
              </div>

              <div className="bg-slate-950/85 p-2 rounded-xl border border-amber-500/30 flex flex-col items-center">
                <span className="text-[10px] text-amber-200/75 block mb-0.5">{t.speed_stat}</span>
                <span className="text-sm md:text-base font-black text-sky-400 font-mono tabular-nums">
                  {storyProfile.heroConfig.speed}x
                </span>
                <span className="text-[9px] text-slate-400">{t.stat_spd_sub}</span>
              </div>
            </div>
          </div>
        </ManuscriptFrame>

        {/* Right Column: 7 Chapters Illuminated Atlas & Battles (6 cols) */}
        <ManuscriptFrame
          variant="obsidian"
          showSarloh={true}
          sarlohTitle={t.atlas_title}
          sarlohSubtitle={`${completedStagesCount} / 7 ${t.conquered_label}`}
          className="lg:col-span-6 flex flex-col justify-between"
          contentClassName="p-4 flex flex-col gap-3 justify-between h-full"
        >
          {/* Chapter Atlas Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-200">
                  {t.atlas_title}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/15 border border-amber-400/35 text-amber-300 rounded font-mono tabular-nums">
                  {completedStagesCount} / 7 {t.conquered_label}
                </span>
              </div>
              <span className="text-[11px] text-amber-400 font-mono tabular-nums font-bold">
                {t.chapter_label} {selectedStageId}
              </span>
            </div>

            {/* Scrollable Stage Atlas List */}
            <div className="flex flex-col gap-1.5 max-h-[255px] overflow-y-auto pr-1">
              {STAGES.map((stage) => {
                const isSelected = stage.id === selectedStageId;
                const isCompleted = progress.completedStages.includes(stage.id);
                const stProfile = StoryLogicManager.getStageProfile(stage.id, alignment, lang);

                return (
                  <div
                    key={stage.id}
                    onClick={() => {
                      onSelectStage(stage.id);
                      sound.playTonbak(false);
                    }}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#1c1307] via-[#0c1938] to-[#1c1307] border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.25)]'
                        : 'bg-[#060c1d]/85 border-amber-500/25 hover:border-amber-400/60 hover:bg-[#0a1430]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShamsehBadge
                        label={stage.id}
                        variant={
                          isSelected
                            ? alignment === 'evil'
                              ? 'crimson'
                              : 'gold'
                            : isCompleted
                            ? 'turquoise'
                            : 'locked'
                        }
                        size="sm"
                      />
                      <div>
                        <h3 className="text-xs font-bold text-amber-100 flex items-center gap-2 flex-wrap">
                          <span>{stProfile.chapterTitle}</span>
                          {stage.id === 4 && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-red-950 border border-red-500/60 text-red-300 rounded">
                              {t.tragic_battle_badge}
                            </span>
                          )}
                        </h3>
                        <span className="text-[10px] text-amber-300/85 font-medium block">
                          {stProfile.heroConfig.heroName} ⚔️ {stProfile.bossConfig.bossDisplayName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-mono tabular-nums text-amber-300">
                      <span>+{stage.goldReward}🪙</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isRtl ? (
                        <ChevronLeft className="w-3.5 h-3.5 text-amber-400/60" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-amber-400/60" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Buttons: Episodic Seven Labors, Duel Fighting, Skill Tree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {onOpenEpisodes && (
              <button
                onClick={onOpenEpisodes}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs md:text-sm rounded-xl shadow-xl transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-amber-300 animate-gold-pulse"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{t.btn_seven_labors}</span>
              </button>
            )}

            <button
              onClick={onOpenDuel}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs md:text-sm rounded-xl shadow-xl transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-amber-400/30"
            >
              <Swords className="w-4 h-4 text-amber-200" />
              <span>{t.btn_duel_mode}</span>
            </button>

            {onOpenSkillTree && (
              <button
                onClick={onOpenSkillTree}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-emerald-100 font-bold text-xs rounded-xl shadow-lg border border-emerald-500/40 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>{t.btn_skill_tree} ({progress.skillPoints || 0} {t.skill_points_unit})</span>
              </button>
            )}

            <button
              onClick={onStartGame}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl shadow-md border border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              <span>{t.start_battle} ({t.campaign_mode_suffix})</span>
            </button>
          </div>

          {/* Secondary Hub Navigation (7 Modules) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={onOpenDailyQuests}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm relative"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{t.btn_daily_quests}</span>
              {activeQuestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={onOpenPlayerStore}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>{t.btn_kiani_store}</span>
            </button>

            <button
              onClick={onOpenArmory}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{t.hero_armory}</span>
            </button>

            <button
              onClick={onOpenCrypto}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-sky-500/40 rounded-xl text-xs font-bold text-sky-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Wallet className="w-4 h-4 text-sky-400" />
              <span>{t.crypto_center}</span>
            </button>

            <button
              onClick={onOpenRewardedAd}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>{t.watch_ad_reward}</span>
            </button>

            <button
              onClick={onOpenDevDashboard}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 rounded-xl text-xs font-bold text-purple-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>{t.btn_dev_vault}</span>
            </button>

            <button
              onClick={onOpenReleases}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm col-span-2 sm:col-span-1"
              title={t.btn_github_releases}
            >
              <Github className="w-4 h-4 text-emerald-400" />
              <span>{t.btn_github_releases}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono tabular-nums text-[10px]">
                {CURRENT_RELEASE_INFO.tag}
              </span>
            </button>
          </div>
        </ManuscriptFrame>
      </main>

      {/* Footer Royal Katibeh Verse & Controls Hint */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <KatibehCartouche
          hemistich1={t.ferdowsi_quote}
          variant="gold"
          className="py-1.5 px-3"
        />
        <div className="flex items-center gap-2 font-mono text-[11px] text-amber-200/80 bg-slate-950/80 border border-amber-500/30 px-3 py-1.5 rounded-lg">
          <span>{t.footer_controls_summary}</span>
        </div>
      </footer>
    </div>
  );
};
