import React, { useEffect, useRef, useState } from 'react';
import { HeroDef, StageDef, Language, GraphicsTier, PlayerAlignment } from '../types/game';
import { GameEngine } from '../game/GameEngine';
import { TRANSLATIONS } from '../constants/translations';
import { MobileControls } from './MobileControls';
import { GraphicsSelector } from './GraphicsSelector';
import { Pause, Play, Volume2, VolumeX, ShieldAlert, Zap, BookOpen, X, Scroll, Flame, Swords } from 'lucide-react';
import { sound } from '../utils/audio';
import { StoryLogicManager } from '../game/StoryLogicManager';
import { ManuscriptFrame, KatibehCartouche } from './ShahnamehManuscriptFrame';

interface Props {
  hero: HeroDef;
  stage: StageDef;
  alignment?: PlayerAlignment;
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
  alignment = 'good',
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

  const storyProfile = StoryLogicManager.getStageProfile(stage, alignment, lang);

  // Dialogue Banner (filtered & personalized by StoryLogicManager)
  const [showDialogue, setShowDialogue] = useState(!!storyProfile.dialogueProse);

  useEffect(() => {
    setShowDialogue(!!storyProfile.dialogueProse);
  }, [stage.id, alignment, storyProfile.dialogueProse]);

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
      hasSimurghBoots,
      lang,
      alignment
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
    // Re-create engine only when hero ID, stage ID, alignment, lang or simurgh boots change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero.id, stage.id, alignment, lang, hasSimurghBoots]);

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
        {/* Start Edge: Player Vitality & Farreh Illuminated Jadval Frame */}
        <div className="flex flex-col gap-1.5 pointer-events-auto bg-[#060c1d]/95 p-2.5 md:p-3 rounded-xl jadval-double-border backdrop-blur-md min-w-[195px] md:min-w-[260px]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-amber-200 flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 ring-amber-400/60"
                style={{ backgroundColor: hero.color }}
              />
              <span className="truncate max-w-[140px] md:max-w-none nastaliq-title text-sm">
                {hero.customDisplayName || storyProfile.heroConfig.heroName || t[hero.nameKey]}
              </span>
            </span>
            <span className="text-amber-100 font-mono tabular-nums text-xs">
              {hp} / {maxHp}
            </span>
          </div>

          {/* Health Gauge with Royal Mineral Pigments */}
          <div className="w-full bg-slate-950 rounded-md h-3 overflow-hidden border border-amber-500/45 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-700 via-teal-500 to-emerald-300 rounded-xs transition-all duration-150"
              style={{ width: `${hpPercentage}%` }}
            />
          </div>

          {/* Farreh-ye Izadi / Ahrimanic Wrath Gauge */}
          <div className="flex items-center justify-between text-[11px] text-amber-200 mt-0.5 font-medium">
            <span className="flex items-center gap-1 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.rage_farreh}</span>
            </span>
            <span className="font-mono tabular-nums font-bold">{rage}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-md h-2 overflow-hidden border border-amber-600/50 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-300 rounded-xs transition-all duration-100"
              style={{ width: `${ragePercentage}%` }}
            />
          </div>
        </div>

        {/* Center: Exclusive Final Boss Illuminated Confrontation Bar */}
        {bossHp !== undefined && bossMaxHp !== undefined && bossHp > 0 && (() => {
          const bossDisplayName = storyProfile.bossConfig.bossDisplayName;
          const bossDuelId = storyProfile.bossConfig.duelOpponentId;
          const duelButtonText = storyProfile.bossConfig.duelButtonLabel;

          return (
            <div className="pointer-events-auto flex flex-col items-center gap-1.5 bg-[#1f060a]/95 px-3.5 md:px-4 py-2.5 rounded-xl border-2 border-red-500/80 shadow-[0_10px_35px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(220,38,38,0.25)] backdrop-blur-md max-w-sm w-full mx-2 md:mx-4 animate-fadeIn">
              <div className="flex items-center justify-between w-full text-xs font-bold text-amber-200">
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="truncate nastaliq-title text-sm">{bossDisplayName}</span>
                </div>
                <span className="font-mono tabular-nums text-red-200 text-xs shrink-0">
                  {bossHp} / {bossMaxHp}
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-md h-3 overflow-hidden border border-amber-500/50 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-red-700 via-rose-500 to-amber-400 rounded-xs transition-all duration-150"
                  style={{ width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%` }}
                />
              </div>

              {onStartBossDuel && (
                <button
                  onClick={() => onStartBossDuel(bossDuelId)}
                  className="mt-1 px-3 py-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 border border-amber-200"
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

      {/* In-Battle Story Waypoint Narrative Katibeh Banner */}
      {inBattleSubtitle && (
        <div className="absolute top-24 inset-x-4 max-w-xl mx-auto z-25 pointer-events-none animate-fadeIn">
          <KatibehCartouche
            hemistich1={inBattleSubtitle}
            variant={alignment === 'evil' ? 'crimson' : 'lapis'}
          />
        </div>
      )}

      {/* Story Dialogue Illuminated Folio Banner */}
      {showDialogue && storyProfile.dialogueProse && (
        <div className="absolute top-24 inset-x-4 max-w-xl mx-auto z-30 pointer-events-auto animate-fadeIn">
          <ManuscriptFrame
            variant={alignment === 'evil' ? 'crimson' : 'lapis'}
            showLachakCorners={true}
            contentClassName="p-4 flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{storyProfile.dialogueHeader}</span>
              </div>
              <button
                onClick={() => setShowDialogue(false)}
                className="text-amber-300/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs md:text-sm text-amber-100 italic leading-relaxed text-center py-1">
              {storyProfile.dialogueProse}
            </p>

            <button
              onClick={() => setShowDialogue(false)}
              className="w-full py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer hover:from-amber-400 hover:to-yellow-300 transition-colors"
            >
              {t.close_dialogue_start_battle}
            </button>
          </ManuscriptFrame>
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
          specialSkillName={hero.customSpecialName || storyProfile.heroConfig.specialName || t[hero.specialKey]}
          heroId={storyProfile.heroConfig.heroRenderId || hero.id}
          lang={lang}
        />
      </div>

      {/* Pause Modal Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-slate-950/88 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4">
          <ManuscriptFrame
            variant="lapis"
            showSarloh={true}
            sarlohTitle={t.pause}
            className="max-w-sm w-full text-center animate-fadeInScale"
            contentClassName="p-6 flex flex-col gap-4"
          >
            <p className="text-xs text-amber-100/85 leading-relaxed">{t[stage.descKey]}</p>

            {/* In-game Graphics Quality Selector */}
            <div className="flex flex-col gap-1.5 items-center">
              <span className="text-[11px] text-amber-300/80">{t.graphics_quality}:</span>
              <GraphicsSelector
                currentTier={graphicsTier}
                onSelectTier={onSelectGraphicsTier}
                lang={lang}
              />
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              <button
                onClick={handleTogglePause}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                {t.resume}
              </button>
              <button
                onClick={onReturnToMenu}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-amber-500/35 text-amber-200 font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t.return_to_menu}
              </button>
            </div>
          </ManuscriptFrame>
        </div>
      )}
    </div>
  );
};

