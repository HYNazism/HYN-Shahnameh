import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart, Zap, Coins, Diamond, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  hp: number;
  maxHp: number;
  rage: number;
  gold: number;
  gems: number;
  comboCount: number;
  comboMultiplier: number;
  bossHp?: number;
  bossMaxHp?: number;
  bossName?: string;
  heroName: string;
  isMuted: boolean;
  onToggleSound: () => void;
  onPause: () => void;
}

export const HUD: React.FC<Props> = ({
  hp,
  maxHp,
  rage,
  gold,
  gems,
  comboCount,
  comboMultiplier,
  bossHp,
  bossMaxHp,
  bossName,
  heroName,
  isMuted,
  onToggleSound,
  onPause,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const ragePercent = Math.max(0, Math.min(100, (rage / 100) * 100));

  const getComboTitle = (count: number) => {
    if (count >= 12) return 'تهمتن بی‌همتا!';
    if (count >= 8) return 'خروش رزم‌آور!';
    if (count >= 5) return 'پیکار دلاورانه!';
    if (count >= 3) return 'توالی رزم!';
    return '';
  };

  return (
    <div className="absolute inset-x-0 top-0 p-3 md:p-5 pointer-events-none z-30 select-none flex flex-col gap-2">
      {/* Top Main Row */}
      <div className="flex items-start justify-between gap-3">
        {/* Hero Health & Farreh Status */}
        <div className="flex flex-col gap-1.5 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 p-2.5 md:p-3 rounded-2xl shadow-2xl min-w-[200px] md:min-w-[280px]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-amber-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              {heroName}
            </span>
            <span className="font-mono text-[11px] text-slate-300 font-bold">
              {hp} / {maxHp} HP
            </span>
          </div>

          {/* Health Bar with Persian Ornamental Gradient */}
          <div className="w-full h-3 md:h-3.5 bg-slate-900 rounded-full overflow-hidden border border-rose-500/30 relative">
            <div
              className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-amber-500 transition-all duration-200 rounded-full"
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* Farreh Gauge */}
          <div className="flex items-center justify-between text-[10px] text-amber-200/90 font-bold mt-0.5">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              فَرّ کیانی
            </span>
            <span className="font-mono">{Math.round(ragePercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-yellow-500/30">
            <div
              className={`h-full transition-all duration-200 rounded-full ${
                ragePercent >= 100
                  ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 shadow-md animate-pulse'
                  : 'bg-gradient-to-r from-amber-600 to-yellow-500'
              }`}
              style={{ width: `${ragePercent}%` }}
            />
          </div>
        </div>

        {/* Center: Dynamic Combo Counter */}
        {comboCount >= 2 && (
          <div className="flex flex-col items-center justify-center animate-bounce">
            <div className="px-3 py-1 bg-gradient-to-r from-amber-600 to-rose-600 border border-amber-300 rounded-xl shadow-xl flex items-center gap-1.5 text-white font-black text-xs md:text-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{comboCount} ضربه</span>
              <span className="font-mono text-yellow-200 font-bold">({comboMultiplier.toFixed(1)}x)</span>
            </div>
            <span className="text-[11px] text-amber-300 font-black drop-shadow mt-0.5 font-serif">
              {getComboTitle(comboCount)}
            </span>
          </div>
        )}

        {/* Right Corner: Currency & Quick Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/40 px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg">
            <div className="flex items-center gap-1 text-amber-300 font-mono">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{gold}</span>
            </div>
            <div className="flex items-center gap-1 text-sky-300 font-mono">
              <Diamond className="w-3.5 h-3.5 text-sky-400" />
              <span>{gems}</span>
            </div>
          </div>

          <button
            onClick={onToggleSound}
            className="w-9 h-9 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-amber-500/40 text-amber-300 flex items-center justify-center cursor-pointer transition-colors active:scale-95 shadow-lg"
            aria-label="تغییر وضعیت صدا"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onPause}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-bold cursor-pointer transition-colors active:scale-95 shadow-lg"
          >
            توقف
          </button>
        </div>
      </div>

      {/* Boss Health Bar (when Boss is active) */}
      {bossHp !== undefined && bossMaxHp !== undefined && (
        <div className="self-center w-full max-w-md bg-slate-950/90 backdrop-blur-md border-2 border-rose-500/60 p-2 rounded-2xl shadow-2xl flex flex-col gap-1 mt-1 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-rose-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {bossName || 'سالار تاریکی (باس)'}
            </span>
            <span className="font-mono text-[11px] text-slate-300">
              {bossHp} / {bossMaxHp} HP
            </span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-rose-600/50">
            <div
              className="h-full bg-gradient-to-r from-rose-800 via-rose-600 to-amber-500 transition-all duration-200 rounded-full"
              style={{ width: `${Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
