import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HeroDef, HeroId, GraphicsTier, Language } from '../types/game';
import { HEROES } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { DuelEngine, ClashState } from '../game/DuelEngine';
import { sound } from '../utils/audio';
import {
  Sword,
  Shield,
  Zap,
  Flame,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Skull,
  Play,
  Swords,
  Sparkles,
} from 'lucide-react';

interface DuelRival {
  id: string;
  name: string;
  title: string;
  color: string;
  accentColor: string;
  heroId: HeroId | string;
  heroDef?: HeroDef;
}

const RIVALS: DuelRival[] = [
  {
    id: 'sohrab',
    name: 'سهراب یل',
    title: 'تهمتن جوان توران',
    color: '#0891b2',
    accentColor: '#38bdf8',
    heroId: 'sohrab',
    heroDef: HEROES.find(h => h.id === 'sohrab'),
  },
  {
    id: 'div_sepid',
    name: 'دیو سپید',
    title: 'سالار مازندران',
    color: '#475569',
    accentColor: '#ef4444',
    heroId: 'div_sepid',
  },
  {
    id: 'esfandiar',
    name: 'اسفندیار رویین‌تن',
    title: 'شاهزاده رویین‌تن کیانی',
    color: '#b45309',
    accentColor: '#fef08a',
    heroId: 'esfandiar',
  },
  {
    id: 'gordafarid',
    name: 'گردآفرید شیرزن',
    title: 'مدافع دژ سپید',
    color: '#059669',
    accentColor: '#34d399',
    heroId: 'gordafarid',
    heroDef: HEROES.find(h => h.id === 'gordafarid'),
  },
];

interface Props {
  playerHeroId: HeroId;
  graphicsTier: GraphicsTier;
  lang: Language;
  onExit: () => void;
  onVictoryReward?: (gold: number, gems: number) => void;
  initialOpponentId?: string;
}

export const DuelArena: React.FC<Props> = ({
  playerHeroId,
  graphicsTier,
  lang,
  onExit,
  onVictoryReward,
  initialOpponentId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<DuelEngine | null>(null);

  const [selectedOpponent, setSelectedOpponent] = useState<DuelRival>(() => {
    return (
      RIVALS.find(r => r.id === initialOpponentId) ||
      RIVALS.find(r => r.id !== playerHeroId) ||
      RIVALS[0]
    );
  });

  const [isDuelActive, setIsDuelActive] = useState(false);
  const [duelResult, setDuelResult] = useState<'victory' | 'defeat' | null>(null);
  const [clashState, setClashState] = useState<ClashState>({
    active: false,
    playerProgress: 50,
    timeRemaining: 0,
    tapCount: 0,
  });

  // Fighter Telemetry for HUD
  const [p1Hp, setP1Hp] = useState(100);
  const [p1Stam, setP1Stam] = useState(100);
  const [p1Rage, setP1Rage] = useState(0);

  const [p2Hp, setP2Hp] = useState(100);
  const [p2Stam, setP2Stam] = useState(100);

  const playerHero = HEROES.find(h => h.id === playerHeroId) || HEROES[0];

  const handleStartDuel = useCallback(() => {
    if (!canvasRef.current) return;

    setDuelResult(null);
    setIsDuelActive(true);

    const engine = new DuelEngine(canvasRef.current);
    engineRef.current = engine;

    engine.onClashUpdate = (state) => {
      setClashState(state);
    };

    engine.onDuelEnd = (winner) => {
      if (winner === 'player') {
        setDuelResult('victory');
        onVictoryReward?.(300, 15);
      } else {
        setDuelResult('defeat');
      }
      setIsDuelActive(false);
    };

    engine.initDuel(
      {
        name: playerHero.nameKey === 'rostam' ? 'رستم دستان' : playerHero.nameKey === 'sohrab' ? 'سهراب یل' : 'گردآفرید',
        title: 'پهلوان ایران‌زمین',
        color: playerHero.color,
        accentColor: playerHero.accentColor,
        heroId: playerHero.id,
        heroDef: playerHero,
      },
      {
        name: selectedOpponent.name,
        title: selectedOpponent.title,
        color: selectedOpponent.color,
        accentColor: selectedOpponent.accentColor,
        heroId: selectedOpponent.heroId,
        heroDef: selectedOpponent.heroDef,
      },
      graphicsTier
    );

    engine.start();
  }, [playerHero, selectedOpponent, graphicsTier, onVictoryReward]);

  // Keep HUD updated with engine telemetry
  useEffect(() => {
    if (!isDuelActive) return;

    const interval = setInterval(() => {
      if (engineRef.current) {
        setP1Hp(Math.round(engineRef.current.fighter1.hp));
        setP1Stam(Math.round(engineRef.current.fighter1.stamina));
        setP1Rage(Math.round(engineRef.current.fighter1.rage));

        setP2Hp(Math.round(engineRef.current.fighter2.hp));
        setP2Stam(Math.round(engineRef.current.fighter2.stamina));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isDuelActive]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        engineRef.current.playerMove(-1);
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        engineRef.current.playerMove(1);
      } else if (e.code === 'KeyW' || e.code === 'Space' || e.code === 'ArrowUp') {
        if (engineRef.current.clashState.active) {
          engineRef.current.onClashTap();
        } else {
          engineRef.current.playerJump();
        }
      } else if (e.code === 'KeyJ') {
        if (engineRef.current.clashState.active) {
          engineRef.current.onClashTap();
        } else {
          engineRef.current.playerAttack('light');
        }
      } else if (e.code === 'KeyK') {
        engineRef.current.playerAttack('heavy');
      } else if (e.code === 'KeyL') {
        engineRef.current.playerParry(true);
      } else if (e.code === 'KeyU') {
        engineRef.current.playerSpecial();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engineRef.current) return;
      if (e.code === 'KeyA' || e.code === 'KeyD' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        engineRef.current.playerMove(0);
      } else if (e.code === 'KeyL') {
        engineRef.current.playerParry(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#070b16] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Top Bar Navigation */}
      <header className="p-3 md:p-4 bg-slate-900/95 border-b border-amber-500/30 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (engineRef.current) engineRef.current.stop();
              onExit();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>بازگشت به اردوگاه</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black text-amber-300">
                میدان دوئل تن‌به‌تن پهلوانان شاهنامه
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">
                سیستم مبارزه حماسی با مکانیک قفل سلاح‌ها (Blade Clash)
              </span>
            </div>
          </div>
        </div>

        {/* Rival Quick Selector */}
        {!isDuelActive && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">حریف رزم:</span>
            <div className="flex gap-1.5">
              {RIVALS.map(rival => (
                <button
                  key={rival.id}
                  onClick={() => setSelectedOpponent(rival)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedOpponent.id === rival.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-1 ring-amber-300'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {rival.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Duel HUD: Health, Stamina & Rage Bars */}
      {isDuelActive && (
        <div className="absolute top-16 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Player Fighter Card */}
          <div className="flex items-center gap-3 bg-slate-950/90 border border-amber-500/50 p-2.5 rounded-2xl backdrop-blur-md w-64 sm:w-76 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-2xl font-bold shrink-0">
              🦁
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-amber-300 truncate">
                  {playerHero.nameKey === 'rostam' ? 'رستم دستان' : playerHero.nameKey === 'sohrab' ? 'سهراب یل' : 'گردآفرید'}
                </span>
                <span className="font-mono text-emerald-400 tabular-nums">{p1Hp}%</span>
              </div>

              {/* HP Bar */}
              <div className="w-full h-3 bg-slate-900 rounded-lg overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded transition-all duration-150"
                  style={{ width: `${p1Hp}%` }}
                />
              </div>

              {/* Stamina & Rage Bars */}
              <div className="flex gap-1.5">
                <div className="flex-1 h-1.5 bg-slate-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-100"
                    style={{ width: `${p1Stam}%` }}
                  />
                </div>
                <div className="flex-1 h-1.5 bg-slate-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-100"
                    style={{ width: `${p1Rage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VS Crest */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 flex items-center justify-center font-black text-slate-950 shadow-xl border-2 border-yellow-300 text-xs shrink-0">
            VS
          </div>

          {/* Opponent Fighter Card */}
          <div className="flex items-center gap-3 bg-slate-950/90 border border-rose-500/50 p-2.5 rounded-2xl backdrop-blur-md w-64 sm:w-76 shadow-2xl flex-row-reverse text-right">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/60 flex items-center justify-center text-2xl font-bold shrink-0">
              ⚔️
            </div>
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
              <div className="flex justify-between items-center text-xs font-black flex-row-reverse">
                <span className="text-rose-300 truncate">{selectedOpponent.name}</span>
                <span className="font-mono text-rose-400 tabular-nums">{p2Hp}%</span>
              </div>

              {/* HP Bar */}
              <div className="w-full h-3 bg-slate-900 rounded-lg overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-l from-rose-600 to-rose-400 rounded transition-all duration-150"
                  style={{ width: `${p2Hp}%` }}
                />
              </div>

              {/* Stamina Bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-all duration-100 float-right"
                  style={{ width: `${p2Stam}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Duel Canvas */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={900}
          height={480}
          className="w-full h-full max-w-5xl object-contain bg-slate-950 shadow-2xl"
        />

        {/* Start Duel Pre-Match Screen */}
        {!isDuelActive && !duelResult && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-xl">
              ⚔️
            </div>
            <h3 className="text-xl md:text-2xl font-black text-amber-300">
              رویارویی تن‌به‌تن: {playerHero.nameKey === 'rostam' ? 'رستم دستان' : playerHero.nameKey} در برابر {selectedOpponent.name}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mt-2 leading-relaxed italic">
              «به گود اندر آ و هنر برنمای / که جز نیزه و تیغ ناید به کار»
              <br />
              هنگام برخورد همزمان سلاح‌ها، تیغه‌ها قفل شده و با تپ سریع حریف را به عقب بران!
            </p>

            <button
              onClick={handleStartDuel}
              className="mt-6 py-3.5 px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center gap-2.5 animate-gold-pulse"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>ورود به میدان مبارزه</span>
            </button>
          </div>
        )}

        {/* Blade Clash Active QTE Overlay (قفل شدن تیغه‌ها) */}
        {clashState.active && (
          <div className="absolute inset-0 bg-amber-950/40 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-40 animate-pulse pointer-events-auto">
            <div className="bg-slate-950/95 border-2 border-yellow-400 p-5 rounded-2xl max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-3">
              <div className="text-3xl animate-bounce">⚡ ⚔️ ⚡</div>
              <h4 className="text-base font-black text-yellow-300">
                قفل شدن حماسی تیغه‌ها! (Blade Clash)
              </h4>
              <p className="text-xs text-slate-300">
                سریعاً دکمه زیر یا کلید Space / J را پیاپی بزنید!
              </p>

              {/* Tension gauge */}
              <div className="w-full h-5 bg-slate-900 border border-amber-500/60 rounded-lg overflow-hidden p-1 shadow-inner relative">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-emerald-400 rounded transition-all duration-75"
                  style={{ width: `${clashState.playerProgress}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-slate-950">
                  {Math.round(clashState.playerProgress)}%
                </div>
              </div>

              {/* Big Tap Button */}
              <button
                onClick={() => engineRef.current?.onClashTap()}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-slate-950 font-black text-lg rounded-xl shadow-2xl active:scale-95 cursor-pointer transition-transform"
              >
                💥 فشار تیغه! (تپ سریع) 💥
              </button>
            </div>
          </div>
        )}

        {/* Duel Result Modal (Victory or Defeat) */}
        {duelResult && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50 animate-fadeIn">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-2xl mb-3 ${
                duelResult === 'victory'
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-yellow-200'
                  : 'bg-gradient-to-tr from-red-700 to-rose-900 border-2 border-rose-500'
              }`}
            >
              {duelResult === 'victory' ? '🏆' : '💀'}
            </div>

            <h3 className="text-2xl font-black text-slate-100">
              {duelResult === 'victory' ? 'پیروزی درخشان پهلوانی!' : 'شکست در نبرد تن‌به‌تن'}
            </h3>

            <p className="text-xs text-slate-300 mt-2 max-w-sm">
              {duelResult === 'victory'
                ? `با دلاوری و قدرت تمام، ${selectedOpponent.name} را در گود نبرد به زانو درآوردی!`
                : `${selectedOpponent.name} با حیله و نیروی برتر بر شما چیره شد. دگر بار بخت خویش بیازمای!`}
            </p>

            {duelResult === 'victory' && (
              <div className="my-4 px-4 py-2 bg-slate-900 border border-amber-500/50 rounded-xl flex items-center gap-4 text-xs font-bold text-amber-300 font-mono">
                <span>+۳۰۰ سکه طلا 🪙</span>
                <span>+۱۵ گوهر کیانی 💎</span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleStartDuel}
                className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>نبرد مجدد</span>
              </button>

              <button
                onClick={onExit}
                className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                بازگشت به اردوگاه
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Duel Bottom Controls (Keyboard guide & Mobile On-screen buttons) */}
      <footer className="p-3 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono hidden md:flex">
          <span className="text-amber-400 font-bold">راهنمای کلیدها:</span>
          <span>A/D حرکت</span>
          <span>·</span>
          <span>Space پرش</span>
          <span>·</span>
          <span>J ضربه سبک</span>
          <span>·</span>
          <span>K ضربه سنگین</span>
          <span>·</span>
          <span>L دفاع و دفع (Parry)</span>
          <span>·</span>
          <span>U فرّه ایزدی</span>
        </div>

        {/* Mobile On-screen Combat Buttons */}
        <div className="w-full md:w-auto flex items-center justify-center gap-2">
          <button
            onTouchStart={() => engineRef.current?.playerMove(-1)}
            onTouchEnd={() => engineRef.current?.playerMove(0)}
            onMouseDown={() => engineRef.current?.playerMove(-1)}
            onMouseUp={() => engineRef.current?.playerMove(0)}
            className="w-12 h-10 bg-slate-800 active:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-bold text-sm flex items-center justify-center cursor-pointer"
            aria-label="Move Left"
          >
            ←
          </button>

          <button
            onTouchStart={() => engineRef.current?.playerMove(1)}
            onTouchEnd={() => engineRef.current?.playerMove(0)}
            onMouseDown={() => engineRef.current?.playerMove(1)}
            onMouseUp={() => engineRef.current?.playerMove(0)}
            className="w-12 h-10 bg-slate-800 active:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-bold text-sm flex items-center justify-center cursor-pointer"
            aria-label="Move Right"
          >
            →
          </button>

          <button
            onClick={() => engineRef.current?.playerJump()}
            className="px-3 h-10 bg-slate-800 active:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 cursor-pointer"
          >
            پرش
          </button>

          <button
            onClick={() => engineRef.current?.playerAttack('light')}
            className="px-3.5 h-10 bg-amber-500/20 active:bg-amber-500/40 border border-amber-500/80 rounded-xl text-xs font-black text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <Sword className="w-3.5 h-3.5" />
            <span>سبک</span>
          </button>

          <button
            onClick={() => engineRef.current?.playerAttack('heavy')}
            className="px-3.5 h-10 bg-amber-600 active:bg-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-md"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>سنگین</span>
          </button>

          <button
            onTouchStart={() => engineRef.current?.playerParry(true)}
            onTouchEnd={() => engineRef.current?.playerParry(false)}
            onMouseDown={() => engineRef.current?.playerParry(true)}
            onMouseUp={() => engineRef.current?.playerParry(false)}
            className="px-3.5 h-10 bg-sky-600/30 active:bg-sky-600/60 border border-sky-500 rounded-xl text-xs font-bold text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>دفاع</span>
          </button>

          <button
            onClick={() => engineRef.current?.playerSpecial()}
            className="px-3 h-10 bg-gradient-to-r from-red-600 to-amber-600 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-md"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>فرّه</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
