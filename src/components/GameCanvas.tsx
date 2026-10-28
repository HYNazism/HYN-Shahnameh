import React, { useEffect, useRef, useState } from 'react';
import { HeroDef, StageDef, Language, GraphicsTier } from '../types/game';
import { GameEngine } from '../game/GameEngine';
import { TRANSLATIONS } from '../constants/translations';
import { MobileControls } from './MobileControls';
import { GraphicsSelector } from './GraphicsSelector';
import { Pause, Play, Volume2, VolumeX, ShieldAlert, Zap, BookOpen, X, Scroll, Flame, Swords } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  hero: HeroDef;
  stage: StageDef;
  graphicsTier: GraphicsTier;
  onSelectGraphicsTier: (tier: GraphicsTier) => void;
  weaponBonusDamage: number;
  armorDamageReduction: number;
  hasSimurghBoots: boolean;
  hasSimurghFeather?: boolean;
  lang: Language;
  onGameOver: (score: number, gold: number, gems: number) => void;
  onVictory: (score: number, gold: number, gems: number) => void;
  onReturnToMenu: () => void;
  onFinisherLanded: () => void;
  onStartBossDuel?: (bossHeroId: string) => void;
}

export const GameCanvas: React.FC<Props> = ({
  hero,
  stage,
  graphicsTier,
  onSelectGraphicsTier,
  weaponBonusDamage,
  armorDamageReduction,
  hasSimurghBoots,
  hasSimurghFeather = false,
  lang,
  onGameOver,
  onVictory,
  onReturnToMenu,
  onFinisherLanded,
  onStartBossDuel,
}) => {
  const t = TRANSLATIONS[lang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Vitality & Telemetry HUD State
  const [hp, setHp] = useState(hero.maxHp);
  const [maxHp, setMaxHp] = useState(hero.maxHp);
  const [rage, setRage] = useState(0);
  const [runGold, setRunGold] = useState(0);
  const [runGems, setRunGems] = useState(0);
  const [bossHp, setBossHp] = useState<number | undefined>(undefined);
  const [bossMaxHp, setBossMaxHp] = useState<number | undefined>(undefined);

  // Combo HUD state
  const [comboCount, setComboCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1.0);

  // In-battle narrative subtitle banner
  const [inBattleSubtitle, setInBattleSubtitle] = useState<string | null>(null);

  // Dialogue Banner (for Chapter 4 or story stages)
  const [showDialogue, setShowDialogue] = useState(!!stage.dialogueProseKey);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  // Refs for combat callbacks to prevent engine recreation during combo/finisher updates
  const onGameOverRef = useRef(onGameOver);
  const onVictoryRef = useRef(onVictory);
  const onFinisherLandedRef = useRef(onFinisherLanded);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
    onVictoryRef.current = onVictory;
    onFinisherLandedRef.current = onFinisherLanded;
  });

  // Portrait orientation warning state
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth && window.innerWidth < 800;
  });
  const [dismissRotatePrompt, setDismissRotatePrompt] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 800);
    };
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const isRtl = lang === 'fa' || lang === 'ar';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1200;
    canvas.height = 650;

    const engine = new GameEngine(
      canvas,
      hero,
      stage,
      graphicsTier,
      weaponBonusDamage,
      armorDamageReduction,
      (score, gold, gems) => {
        onGameOverRef.current(score, gold, gems);
      },
      (score, gold, gems) => {
        onVictoryRef.current(score, gold, gems);
      },
      (curHp, mHp, curRage, g, gm, bHp, bMHp) => {
        setHp(curHp);
        setMaxHp(mHp);
        setRage(curRage);
        setRunGold(g);
        setRunGems(gm);
        setBossHp(bHp);
        setBossMaxHp(bMHp);
      },
      (count, mult) => {
        setComboCount(count);
        setComboMultiplier(mult);
      },
      () => {
        onFinisherLandedRef.current();
      },
      (subtitleText: string) => {
        setInBattleSubtitle(subtitleText);
      },
      hasSimurghBoots
    );

    engineRef.current = engine;
    engine.hasSimurghFeather = hasSimurghFeather;
    engine.start();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'KeyA', 'KeyD', 'KeyJ', 'KeyK', 'KeyL', 'KeyC', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') engine.input.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') engine.input.right = true;
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') engine.input.jump = true;
      if (e.code === 'KeyJ') engine.input.attack = true;
      if (e.code === 'KeyK') engine.input.quickAttack = true;
      if (e.code === 'KeyL') engine.input.special = true;
      if (e.code === 'KeyC') engine.input.parry = true;
      if (e.code === 'Escape') {
        const paused = engine.togglePause();
        setIsPaused(paused);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') engine.input.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') engine.input.right = false;
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') engine.input.jump = false;
      if (e.code === 'KeyJ') engine.input.attack = false;
      if (e.code === 'KeyK') engine.input.quickAttack = false;
      if (e.code === 'KeyL') engine.input.special = false;
      if (e.code === 'KeyC') engine.input.parry = false;
    };

    const handleBlur = () => {
      engine.input.left = false;
      engine.input.right = false;
      engine.input.jump = false;
      engine.input.attack = false;
      engine.input.quickAttack = false;
      engine.input.special = false;
      engine.input.parry = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      engine.stop();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
    // Re-create engine only when hero ID, stage ID or simurgh boots change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero.id, stage.id, hasSimurghBoots]);

  // Dynamically update combat bonuses without resetting player position
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateCombatBonuses(weaponBonusDamage, armorDamageReduction);
    }
  }, [weaponBonusDamage, armorDamageReduction]);

  // Dynamically update Simurgh feather
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.hasSimurghFeather = hasSimurghFeather;
    }
  }, [hasSimurghFeather]);

  // Synchronize dynamic graphics tier updates
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setGraphicsTier(graphicsTier);
    }
  }, [graphicsTier]);

  // Auto-dismiss in-battle subtitle banner after 5.5 seconds
  useEffect(() => {
    if (!inBattleSubtitle) return;
    const timer = setTimeout(() => {
      setInBattleSubtitle(null);
    }, 5500);
    return () => clearTimeout(timer);
  }, [inBattleSubtitle]);

  const handleTogglePause = () => {
    if (engineRef.current) {
      const p = engineRef.current.togglePause();
      setIsPaused(p);
    }
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const hpPercentage = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const ragePercentage = Math.max(0, Math.min(100, rage));

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full h-full flex flex-col items-center justify-center bg-[#050811] overflow-hidden select-none"
    >
      {/* Portrait Orientation Helper Notification */}
      {isPortrait && !dismissRotatePrompt && (
        <div className="absolute top-2 inset-x-3 z-45 flex items-center justify-between gap-2 p-2.5 bg-amber-950/95 border-2 border-amber-400 text-amber-200 text-xs rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-base animate-bounce">📱</span>
            <span>{t.rotate_prompt}</span>
          </div>
          <button
            onClick={() => setDismissRotatePrompt(true)}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer transition-colors shrink-0"
          >
            {t.rotate_dismiss}
          </button>
        </div>
      )}

      {/* Top HUD Cluster */}
      <div className="absolute top-0 inset-x-0 safe-top safe-px p-3 md:p-5 flex items-start justify-between pointer-events-none z-20">
        {/* Start Edge: Player Vitality & Farreh Frame */}
        <div className="flex flex-col gap-1.5 pointer-events-auto bg-slate-950/90 p-2.5 md:p-3 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-md min-w-[190px] md:min-w-[250px]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-amber-300 flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 ring-amber-500/40"
                style={{ backgroundColor: hero.color }}
              />
              <span className="truncate max-w-[110px] md:max-w-none">{t[hero.nameKey]}</span>
            </span>
            <span className="text-slate-300 font-mono tabular-nums text-xs">
              {hp} / {maxHp}
            </span>
          </div>

          {/* Health Gauge with Segments */}
          <div className="w-full bg-slate-900 rounded-lg h-3 overflow-hidden border border-slate-700/80 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded transition-all duration-150"
              style={{ width: `${hpPercentage}%` }}
            />
          </div>

          {/* Farreh (Rage) Gauge */}
          <div className="flex items-center justify-between text-[11px] text-amber-200 mt-0.5 font-medium">
            <span className="flex items-center gap-1 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.rage_farreh}</span>
            </span>
            <span className="font-mono tabular-nums font-bold">{rage}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-lg h-2 overflow-hidden border border-amber-900/40 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-400 rounded transition-all duration-100"
              style={{ width: `${ragePercentage}%` }}
            />
          </div>
        </div>

        {/* Center: Boss HP Bar if active */}
        {bossHp !== undefined && bossMaxHp !== undefined && bossHp > 0 && (() => {
          const bossDisplayName =
            stage.id === 4
              ? hero.id === 'gordafarid'
                ? 'سهراب یل (هماورد دژ سپید)'
                : hero.id === 'sohrab'
                ? 'گردآفرید شیرزن (مدافع دژ سپید)'
                : 'سهراب یل پهلوان توران'
              : t[stage.bossNameKey];

          const bossDuelId =
            stage.id === 4
              ? hero.id === 'sohrab'
                ? 'gordafarid'
                : 'sohrab'
              : stage.id === 3
              ? 'div_sepid'
              : stage.id === 5
              ? 'esfandiar'
              : 'div_sepid';

          const duelButtonText =
            stage.id === 4
              ? hero.id === 'gordafarid'
                ? 'دوئل حماسی با سهراب در دژ سپید'
                : hero.id === 'sohrab'
                ? 'دوئل تن‌به‌تن با گردآفرید شیرزن'
                : 'دوئل سرنوشت‌ساز رستم و سهراب'
              : stage.id === 3
              ? 'دوئل با دیو سپید مازندران'
              : stage.id === 5
              ? 'دوئل با اسفندیار رویین‌تن'
              : 'دوئل تن‌به‌تن با هماورد (قفل تیغه‌ها)';

          return (
            <div className="pointer-events-auto flex flex-col items-center gap-1.5 bg-red-950/90 px-3 md:px-4 py-2 rounded-2xl border border-red-500/70 shadow-2xl backdrop-blur-md max-w-sm w-full mx-2 md:mx-4 animate-fadeIn">
              <div className="flex items-center justify-between w-full text-xs font-bold text-red-200">
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="truncate">{bossDisplayName}</span>
                </div>
                <span className="font-mono tabular-nums text-red-300 text-xs shrink-0">
                  {bossHp} / {bossMaxHp}
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-lg h-2.5 overflow-hidden border border-red-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded transition-all duration-150"
                  style={{ width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%` }}
                />
              </div>

              {onStartBossDuel && (
                <button
                  onClick={() => onStartBossDuel(bossDuelId)}
                  className="mt-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 border border-amber-300/40"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{duelButtonText}</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* End Edge: Gold, Gems & Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 bg-slate-950/90 rounded-xl border border-amber-500/35 shadow-md backdrop-blur-md">
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
              <span>🪙</span>
              <span className="font-mono tabular-nums">{runGold}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1 text-xs text-sky-400 font-bold">
              <span>💎</span>
              <span className="font-mono tabular-nums">{runGems}</span>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
            title={isMuted ? t.sound_off : t.sound_on}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={handleTogglePause}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
            title={isPaused ? t.resume : t.pause}
            aria-label="Pause Toggle"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Floating Combo Counter Gauge */}
      {comboCount > 1 && (
        <div
          className={`absolute top-24 ${
            isRtl ? 'right-4 md:right-8' : 'left-4 md:left-8'
          } z-20 pointer-events-none animate-fadeInScale`}
        >
          <div className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 border border-amber-300 rounded-xl shadow-2xl flex items-center gap-2 text-slate-950 font-black text-xs md:text-sm">
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>
              {t.combo_label} x{comboCount}
            </span>
            <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
              x{comboMultiplier.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* In-Battle Story Waypoint Narrative Subtitle Banner */}
      {inBattleSubtitle && (
        <div className="absolute top-24 inset-x-4 max-w-xl mx-auto z-25 pointer-events-none animate-fadeIn">
          <div className="bg-slate-950/95 border border-amber-500/70 px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md text-center flex items-center justify-center gap-2.5">
            <Scroll className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs md:text-sm text-amber-100 italic font-medium leading-relaxed">
              {inBattleSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Story Dialogue Banner (for Chapter 4 Rostam & Sohrab) */}
      {showDialogue && stage.dialogueProseKey && (
        <div className="absolute top-24 inset-x-4 max-w-xl mx-auto z-30 pointer-events-auto bg-slate-950/95 border-2 border-amber-500/70 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-2.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <BookOpen className="w-4 h-4" />
              <span>دیالوگ منظوم شاهنامه · نبرد سرنوشت‌ساز سهراب و رستم</span>
            </div>
            <button
              onClick={() => setShowDialogue(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs md:text-sm text-amber-100 italic leading-relaxed text-center py-1">
            {t[stage.dialogueProseKey]}
          </p>

          <button
            onClick={() => setShowDialogue(false)}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer hover:from-amber-400 hover:to-amber-500 transition-colors"
          >
            بستن دیالوگ و آغاز رزم پهلوانان
          </button>
        </div>
      )}

      {/* Main Game Canvas Container with Automatic Ratio Scale */}
      <div className="relative w-full h-full flex items-center justify-center p-0 m-0 overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain max-h-screen bg-black shadow-2xl touch-none select-none"
          style={{ aspectRatio: '1200 / 650' }}
        />

        <div className="hidden md:flex absolute bottom-3 inset-x-0 justify-center pointer-events-none z-10 safe-bottom">
          <div className="px-4 py-1.5 bg-slate-950/85 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono tracking-wide shadow-lg backdrop-blur-sm">
            {t.controls_hint}
          </div>
        </div>

        {/* Mobile Floating Virtual D-Pad & Action Controls */}
        <MobileControls
          engine={engineRef.current}
          specialSkillName={t[hero.specialKey]}
          heroId={hero.id}
          lang={lang}
        />
      </div>

      {/* Pause Modal Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-[#0b101e] border-2 border-amber-500/60 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl flex flex-col gap-4 animate-fadeInScale">
            <h2 className="text-2xl font-black text-amber-400 tracking-wide">{t.pause}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{t[stage.descKey]}</p>

            {/* In-game Graphics Quality Selector */}
            <div className="flex flex-col gap-1.5 items-center">
              <span className="text-[11px] text-slate-400">{t.graphics_quality}:</span>
              <GraphicsSelector
                currentTier={graphicsTier}
                onSelectTier={onSelectGraphicsTier}
                lang={lang}
              />
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              <button
                onClick={handleTogglePause}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                {t.resume}
              </button>
              <button
                onClick={onReturnToMenu}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors cursor-pointer"
              >
                {t.return_to_menu}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

