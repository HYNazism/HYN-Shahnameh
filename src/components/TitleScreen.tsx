import React from 'react';
import { HeroDef, HeroId, StageDef, PlayerProgress, Language, GraphicsTier } from '../types/game';
import { HEROES, STAGES } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { LanguageSelector } from './LanguageSelector';
import { GraphicsSelector } from './GraphicsSelector';
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
}) => {
  const t = TRANSLATIONS[lang];
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());

  const currentHero = HEROES.find(h => h.id === selectedHeroId) || HEROES[0];

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const activeDailyQuestsCount = progress.dailyQuests.filter(q => !q.isClaimed).length;

  return (
    <div className="relative w-full min-h-screen bg-[#070a14] text-slate-100 flex flex-col justify-between overflow-x-hidden p-3 md:p-6 select-none">
      {/* Top Bar: Brand, Vault & Tools */}
      <header className="w-full max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 shadow-md text-xl">
            ⚔️
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-amber-400">
              {t.app_title}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              {t.game_subtitle}
            </p>
          </div>
        </div>

        {/* Currency Vault & Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs font-semibold shadow-inner">
            <div className="flex items-center gap-1.5 text-amber-400">
              <span>🪙</span>
              <span className="font-mono tabular-nums">{progress.gold}</span>
              <span className="text-[10px] text-slate-400">{t.gold}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-sky-400">
              <span>💎</span>
              <span className="font-mono tabular-nums">{progress.gems}</span>
              <span className="text-[10px] text-slate-400">{t.gems}</span>
            </div>
            {progress.isVipBenefactor && (
              <>
                <span className="text-slate-700">|</span>
                <span className="text-amber-300 text-[10px] font-bold">
                  👑 حامی
                </span>
              </>
            )}
          </div>

          <GraphicsSelector
            currentTier={graphicsTier}
            onSelectTier={onSelectGraphicsTier}
            lang={lang}
          />

          <button
            onClick={handleToggleSound}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? t.sound_off : t.sound_on}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <LanguageSelector currentLang={lang} onSelectLang={onSelectLang} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto my-auto py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Hero Select & Lore (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Hero Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            {HEROES.map(hero => {
              const isSelected = hero.id === selectedHeroId;
              return (
                <button
                  key={hero.id}
                  onClick={() => {
                    onSelectHero(hero.id);
                    sound.playSlash();
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-lg scale-102'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hero.color }} />
                  {t[hero.nameKey]}
                </button>
              );
            })}
          </div>

          {/* Hero Lore Card */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl relative overflow-hidden backdrop-blur-sm shadow-xl">
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: currentHero.color }}
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-amber-300">
                    {t[currentHero.nameKey]}
                  </h2>
                  <p className="text-xs text-amber-500/90 font-medium mt-0.5">
                    {t[currentHero.titleKey]}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-md"
                  style={{ backgroundColor: currentHero.color, color: '#090d16' }}
                >
                  {currentHero.id === 'rostam' ? '🦁' : currentHero.id === 'sohrab' ? '🦅' : '🏹'}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {t[currentHero.descKey]}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-1 pt-3 border-t border-slate-800/80">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-amber-400 shrink-0">
                    <Sword className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t.equipped}</span>
                    <span className="text-xs font-bold text-slate-200">{t[currentHero.weaponKey]}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-sky-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">مهارت ویژه</span>
                    <span className="text-xs font-bold text-sky-300">{t[currentHero.specialKey]}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t.hp_stat}</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">{currentHero.maxHp}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t.damage}</span>
                  <span className="text-sm font-bold text-rose-400 font-mono tabular-nums">{currentHero.attackPower}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{t.speed_stat}</span>
                  <span className="text-sm font-bold text-sky-400 font-mono tabular-nums">{currentHero.speed}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 7 Epic Chapters Atlas & Primary Play (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3.5">
          {/* Chapter Atlas Selector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300">
                اطلس هفت فصل شاهنامه فردوسی
              </span>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                فصل {selectedStageId} از ۷
              </span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
              {STAGES.map(stage => {
                const isSelected = stage.id === selectedStageId;
                const isCompleted = progress.completedStages.includes(stage.id);

                return (
                  <div
                    key={stage.id}
                    onClick={() => onSelectStage(stage.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {stage.id}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-200">
                          {t[stage.nameKey]}
                        </h3>
                        <span className="text-[10px] text-amber-400/90 block">
                          {stage.chapterEra}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-amber-400">
                      <span>+{stage.goldReward}🪙</span>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Battle & 1v1 Duel CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={onStartGame}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 animate-gold-pulse"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{t.start_battle} (کمپین داستانی)</span>
            </button>

            <button
              onClick={onOpenDuel}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 via-amber-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm rounded-2xl shadow-xl transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-amber-400/40"
            >
              <Swords className="w-4 h-4 text-amber-200" />
              <span>دوئل تن‌به‌تن پهلوانان ⚔️</span>
            </button>
          </div>

          {/* Hub Buttons Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={onOpenDailyQuests}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>ماموریت ۲۴ ساعته</span>
            </button>

            <button
              onClick={onOpenPlayerStore}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-emerald-500/50 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>بازارچه کیانی</span>
            </button>

            <button
              onClick={onOpenArmory}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{t.hero_armory}</span>
            </button>

            <button
              onClick={onOpenCrypto}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-sky-500/40 rounded-xl text-xs font-bold text-sky-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Wallet className="w-4 h-4 text-sky-400" />
              <span>{t.crypto_center}</span>
            </button>

            <button
              onClick={onOpenRewardedAd}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>{t.watch_ad_reward}</span>
            </button>

            <button
              onClick={onOpenDevDashboard}
              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-purple-500/40 rounded-xl text-xs font-bold text-purple-300 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>صندوق سازنده</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Quote */}
      <footer className="w-full max-w-6xl mx-auto py-2.5 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <span className="italic">
          «پی افکندم از نظم کاخی بلند / که از باد و باران نیابد گزند» — ابوالقاسم فردوسی
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          A/D حرکت · Space پرش · J کامبوی ۳ ضربه‌ای · K تیر · L فرّه
        </span>
      </footer>
    </div>
  );
};
