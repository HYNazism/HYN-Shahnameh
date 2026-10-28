import React, { useEffect, useRef } from 'react';
import { HeroId, PlayerProgress, Language, GraphicsTier } from '../types/game';
import { HEROES, STAGES } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { QahvehKhanehRenderer } from '../game/QahvehKhanehRenderer';
import { LanguageSelector } from './LanguageSelector';
import { GraphicsSelector } from './GraphicsSelector';
import { PWAInstallButton } from './PWAInstallButton';
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
  Award,
  ChevronLeft,
  Github,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  selectedHeroId: HeroId;
  onSelectHero: (id: HeroId) => void;
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
  selectedHeroId,
  onSelectHero,
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
  onOpenNaqqal,
  onOpenReleases,
}) => {
  const t = TRANSLATIONS[lang];
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());
  const portraitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const strikeTimerRef = useRef<number>(0);

  const currentHero = HEROES.find(h => h.id === selectedHeroId) || HEROES[0];

  // Trigger a heroic weapon flourish when switching heroes
  useEffect(() => {
    strikeTimerRef.current = 0.34;
  }, [selectedHeroId]);

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
      if (selectedHeroId === 'rostam') {
        bgGrad.addColorStop(0, '#451a03');
        bgGrad.addColorStop(0.6, '#1c0a04');
        bgGrad.addColorStop(1, '#070a14');
      } else if (selectedHeroId === 'sohrab') {
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

      // Ornate Golden Tazhib Arch Frame
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(5, 5, w - 10, h - 10);

      // Stone Pedestal
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, h - 22, w - 40, 10);
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(20, h - 22, w - 40, 10);

      // Render Hero in Full Mature Qahveh-Khaneh Detail
      ctx.save();
      ctx.translate(w * 0.5, h - 64);
      QahvehKhanehRenderer.renderHero({
        ctx,
        heroId: selectedHeroId,
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
  }, [selectedHeroId]);

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const activeQuestsCount = progress.dailyQuests.filter(q => !q.isClaimed).length;
  const completedStagesCount = progress.completedStages.length;

  return (
    <div className="relative w-full min-h-screen bg-[#070a14] text-slate-100 flex flex-col justify-between overflow-x-hidden p-3 md:p-6 select-none">
      {/* Subtle Background Ornamentation */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15),transparent_65%)]" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center text-xl">
              ⚔️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                {t.app_title}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded">
                v1.0.5 Release
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {t.game_subtitle} · اقتباس اصیل از شاهنامه فردوسی
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
                  <span className="hidden sm:inline">حامی سلطنتی</span>
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

      {/* Main Grid: Hero Showcase + 7 Chapters Map & CTAs */}
      <main className="relative z-10 w-full max-w-7xl mx-auto my-auto py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Hero Showcase & Lore (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-3">
          {/* Hero Selection Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
            {HEROES.map(hero => {
              const isSelected = hero.id === selectedHeroId;
              return (
                <button
                  key={hero.id}
                  onClick={() => {
                    onSelectHero(hero.id);
                    sound.playSlash();
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hero.color }} />
                  <span className="truncate">{t[hero.nameKey]}</span>
                </button>
              );
            })}
          </div>

          {/* Hero Card Container */}
          <div className="flex-1 p-4 md:p-5 bg-gradient-to-b from-slate-900/80 to-[#0a0f1d] border border-amber-500/30 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-2xl flex flex-col justify-between">
            {/* Ambient Hero Glow */}
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: currentHero.color }}
            />

            <div>
              {/* Hero Header + Live Qahveh-Khaneh Canvas Portrait */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-3 border-b border-slate-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-black text-amber-300">
                      {t[currentHero.nameKey]}
                    </h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/20">
                      {t[currentHero.titleKey]}
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80 font-medium mt-1">
                    {currentHero.id === 'rostam'
                      ? 'پهلوان نامدار سیستان · دارنده زره ببر بیان، کلاه‌خود دیو سپید و گرز گاوسار'
                      : currentHero.id === 'sohrab'
                      ? 'سپهدار جوان توران · دارنده جوشن فیروزه‌ای، بازوبند مهره رستم و شمشیر دمشقی'
                      : 'شیرزن سلحشور ایران · دارنده جوشن یشمی زرنگار، سنان دوشاخ و کمان کیانی'}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5 italic">
                    «{t[currentHero.descKey]}»
                  </p>
                </div>

                {/* Interactive Qahveh-Khaneh Pahlavan Canvas Showcase */}
                <div
                  onClick={() => {
                    strikeTimerRef.current = 0.34;
                    sound.playSlash();
                  }}
                  title="کلیک برای نمایش ضربه سلاح پهلوان"
                  className="relative w-36 h-40 rounded-xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shrink-0 cursor-pointer group bg-[#070a14]"
                >
                  <canvas
                    ref={portraitCanvasRef}
                    width={160}
                    height={180}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute bottom-1 inset-x-0 text-center text-[9px] text-amber-300/80 font-mono bg-slate-950/70 py-0.5">
                    نگاره قهوه‌خانه‌ای (ضربه با کلیک)
                  </span>
                </div>
              </div>

              {/* Combat Gear & Signature Skill */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-start gap-2.5 p-2 bg-slate-950/50 rounded-xl border border-slate-800/80">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-amber-400 shrink-0">
                    <Sword className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block">{t.equipped}</span>
                    <span className="text-xs font-bold text-slate-200 truncate block">
                      {t[currentHero.weaponKey]}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-slate-950/50 rounded-xl border border-slate-800/80">
                  <div className="p-2 bg-slate-800/80 rounded-lg text-sky-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block">مهارت ویژه</span>
                    <span className="text-xs font-bold text-sky-300 truncate block">
                      {t[currentHero.specialKey]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Combat Telemetry Attributes (HP, Attack, Speed) */}
            <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-800 text-center">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 block mb-0.5">{t.hp_stat}</span>
                <span className="text-sm md:text-base font-black text-emerald-400 font-mono tabular-nums">
                  {currentHero.maxHp}
                </span>
                <span className="text-[9px] text-slate-500">جان پهلوان</span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 block mb-0.5">{t.damage}</span>
                <span className="text-sm md:text-base font-black text-rose-400 font-mono tabular-nums">
                  {currentHero.attackPower}
                </span>
                <span className="text-[9px] text-slate-500">قدرت پایه</span>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 block mb-0.5">{t.speed_stat}</span>
                <span className="text-sm md:text-base font-black text-sky-400 font-mono tabular-nums">
                  {currentHero.speed}x
                </span>
                <span className="text-[9px] text-slate-500">چابکی در رزم</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: 7 Chapters Atlas & Battles (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-3 justify-between">
          {/* Chapter Atlas Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  اطلس هفت فصل شاهنامه فردوسی
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded font-mono">
                  {completedStagesCount} / ۷ فتح‌شده
                </span>
              </div>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                فصل {selectedStageId}
              </span>
            </div>

            {/* Scrollable Stage Atlas List */}
            <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
              {STAGES.map(stage => {
                const isSelected = stage.id === selectedStageId;
                const isCompleted = progress.completedStages.includes(stage.id);

                return (
                  <div
                    key={stage.id}
                    onClick={() => {
                      onSelectStage(stage.id);
                      sound.playTonbak(false);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/90 shadow-lg ring-1 ring-amber-500/40 translate-x-[-2px]'
                        : 'bg-slate-900/50 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {stage.id}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          <span>{t[stage.nameKey]}</span>
                          {stage.id === 4 && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-red-950 border border-red-500/50 text-red-300 rounded">
                              رزم تراژیک
                            </span>
                          )}
                        </h3>
                        <span className="text-[10px] text-amber-400/90 font-medium">
                          {stage.chapterEra}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-mono tabular-nums text-amber-400">
                      <span>+{stage.goldReward}🪙</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
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
                <span>هفت‌خان رستم و پرده‌خوانی 📜</span>
              </button>
            )}

            <button
              onClick={onOpenDuel}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs md:text-sm rounded-xl shadow-xl transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-amber-400/30"
            >
              <Swords className="w-4 h-4 text-amber-200" />
              <span>دوئل تن‌به‌تن (قفل تیغه‌ها) ⚔️</span>
            </button>

            {onOpenSkillTree && (
              <button
                onClick={onOpenSkillTree}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-700 hover:to-teal-800 text-emerald-100 font-bold text-xs rounded-xl shadow-lg border border-emerald-500/40 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>درخت مهارت‌های اساطیری ({progress.skillPoints || 0} امتیاز)</span>
              </button>
            )}

            <button
              onClick={onStartGame}
              className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl shadow-md border border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              <span>{t.start_battle} (کمپین داستانی)</span>
            </button>
          </div>

          {/* Secondary Hub Navigation (6 Modules) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={onOpenDailyQuests}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm relative"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>ماموریت ۲۴ ساعته</span>
              {activeQuestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={onOpenPlayerStore}
              className="py-2.5 px-3 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>بازارچه کیانی</span>
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
              <span>صندوق سازنده</span>
            </button>

            <button
              onClick={onOpenReleases}
              className="py-2.5 px-3 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-400/60 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm col-span-2 sm:col-span-1"
              title="دانلود مستقیم خروجی‌های تمام دستگاه‌ها و انتشارهای گیت‌هاب (v1.0.0 تا v1.0.5)"
            >
              <Github className="w-4 h-4 text-emerald-400" />
              <span>ریلیزهای گیت‌هاب (v1.0.5)</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer Verse & Controls Hint */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto pt-2.5 border-t border-slate-900/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <span className="italic text-amber-400/80">
          «پی افکندم از نظم کاخی بلند / که از باد و باران نیابد گزند» — حکیم ابوالقاسم فردوسی
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>حرکت: A/D</span>
          <span>·</span>
          <span>پرش: Space</span>
          <span>·</span>
          <span>ضربه: J</span>
          <span>·</span>
          <span>تیر/دش: K</span>
          <span>·</span>
          <span>فرّه: L</span>
        </div>
      </footer>
    </div>
  );
};
