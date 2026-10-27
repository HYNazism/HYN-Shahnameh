import React from 'react';
import { GameEngine } from '../game/GameEngine';

interface Props {
  engine: GameEngine | null;
  specialSkillName: string;
  heroId: string;
}

export const MobileControls: React.FC<Props> = ({ engine, specialSkillName, heroId }) => {
  const handleTouchStart = (key: keyof GameEngine['input']) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (engine) engine.input[key] = true;
  };

  const handleTouchEnd = (key: keyof GameEngine['input']) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (engine) engine.input[key] = false;
  };

  return (
    <div className="absolute inset-x-0 bottom-3 px-4 flex justify-between items-end pointer-events-none z-30 select-none">
      {/* D-Pad Horizontal */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onTouchStart={handleTouchStart('left')}
          onTouchEnd={handleTouchEnd('left')}
          onMouseDown={handleTouchStart('left')}
          onMouseUp={handleTouchEnd('left')}
          className="w-14 h-14 bg-slate-900/80 border-2 border-amber-500/50 rounded-2xl flex items-center justify-center text-amber-300 font-bold text-xl active:bg-amber-600 active:text-slate-950 transition-transform active:scale-95 shadow-lg backdrop-blur-sm"
          aria-label="Move Left"
        >
          ◀
        </button>
        <button
          onTouchStart={handleTouchStart('right')}
          onTouchEnd={handleTouchEnd('right')}
          onMouseDown={handleTouchStart('right')}
          onMouseUp={handleTouchEnd('right')}
          className="w-14 h-14 bg-slate-900/80 border-2 border-amber-500/50 rounded-2xl flex items-center justify-center text-amber-300 font-bold text-xl active:bg-amber-600 active:text-slate-950 transition-transform active:scale-95 shadow-lg backdrop-blur-sm"
          aria-label="Move Right"
        >
          ▶
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Special Skill */}
        <button
          onTouchStart={handleTouchStart('special')}
          onTouchEnd={handleTouchEnd('special')}
          onMouseDown={handleTouchStart('special')}
          onMouseUp={handleTouchEnd('special')}
          className="w-13 h-13 bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center text-amber-100 font-bold text-xs active:scale-95 shadow-lg"
          aria-label="Special Skill"
        >
          <span className="text-base">⚡</span>
          <span className="text-[10px] leading-tight truncate max-w-[44px]">فرّه</span>
        </button>

        {/* Quick Attack / Arrow */}
        <button
          onTouchStart={handleTouchStart('quickAttack')}
          onTouchEnd={handleTouchEnd('quickAttack')}
          onMouseDown={handleTouchStart('quickAttack')}
          onMouseUp={handleTouchEnd('quickAttack')}
          className="w-14 h-14 bg-sky-900/90 border-2 border-sky-400 rounded-2xl flex flex-col items-center justify-center text-sky-200 font-bold text-xs active:bg-sky-500 active:text-slate-950 transition-transform active:scale-95 shadow-lg"
          aria-label="Quick Attack"
        >
          <span className="text-lg">{heroId === 'gordafarid' ? '🏹' : '⚡'}</span>
          <span className="text-[10px]">{heroId === 'gordafarid' ? 'تیر' : 'دش'}</span>
        </button>

        {/* Primary Melee Attack */}
        <button
          onTouchStart={handleTouchStart('attack')}
          onTouchEnd={handleTouchEnd('attack')}
          onMouseDown={handleTouchStart('attack')}
          onMouseUp={handleTouchEnd('attack')}
          className="w-16 h-16 bg-rose-900/90 border-2 border-rose-400 rounded-2xl flex flex-col items-center justify-center text-rose-100 font-bold text-sm active:bg-rose-600 active:text-white transition-transform active:scale-95 shadow-xl"
          aria-label="Attack"
        >
          <span className="text-xl">⚔️</span>
          <span className="text-[10px]">حمله</span>
        </button>

        {/* Jump Button */}
        <button
          onTouchStart={handleTouchStart('jump')}
          onTouchEnd={handleTouchEnd('jump')}
          onMouseDown={handleTouchStart('jump')}
          onMouseUp={handleTouchEnd('jump')}
          className="w-15 h-15 bg-emerald-900/90 border-2 border-emerald-400 rounded-2xl flex flex-col items-center justify-center text-emerald-200 font-bold text-xs active:bg-emerald-500 active:text-slate-950 transition-transform active:scale-95 shadow-lg"
          aria-label="Jump"
        >
          <span className="text-lg">▲</span>
          <span className="text-[10px]">پرش</span>
        </button>
      </div>
    </div>
  );
};
