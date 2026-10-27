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
    <div className="absolute inset-x-0 bottom-4 px-4 md:px-8 flex justify-between items-end pointer-events-none z-30 select-none">
      {/* D-Pad Horizontal: Left / Right Navigation */}
      <div className="flex gap-2.5 pointer-events-auto">
        <button
          onTouchStart={handleTouchStart('left')}
          onTouchEnd={handleTouchEnd('left')}
          onMouseDown={handleTouchStart('left')}
          onMouseUp={handleTouchEnd('left')}
          className="w-14 h-14 bg-slate-950/80 border border-amber-500/50 rounded-2xl flex items-center justify-center text-amber-300 font-black text-xl active:bg-amber-600 active:text-slate-950 transition-transform active:scale-90 shadow-xl backdrop-blur-md cursor-pointer"
          aria-label="حرکت به چپ"
        >
          ◀
        </button>
        <button
          onTouchStart={handleTouchStart('right')}
          onTouchEnd={handleTouchEnd('right')}
          onMouseDown={handleTouchStart('right')}
          onMouseUp={handleTouchEnd('right')}
          className="w-14 h-14 bg-slate-950/80 border border-amber-500/50 rounded-2xl flex items-center justify-center text-amber-300 font-black text-xl active:bg-amber-600 active:text-slate-950 transition-transform active:scale-90 shadow-xl backdrop-blur-md cursor-pointer"
          aria-label="حرکت به راست"
        >
          ▶
        </button>
      </div>

      {/* Action Buttons: Jump, Melee Attack, Quick/Ranged Attack, Farreh Burst */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Special Skill: Farreh */}
        <button
          onTouchStart={handleTouchStart('special')}
          onTouchEnd={handleTouchEnd('special')}
          onMouseDown={handleTouchStart('special')}
          onMouseUp={handleTouchEnd('special')}
          className="w-13 h-13 bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-400/80 rounded-2xl flex flex-col items-center justify-center text-amber-100 font-bold active:scale-90 shadow-lg cursor-pointer"
          aria-label="مهارت ویژه فرّه"
        >
          <span className="text-base">⚡</span>
          <span className="text-[10px] font-black leading-tight truncate max-w-[42px]">فرّه</span>
        </button>

        {/* Quick Attack / Arrow */}
        <button
          onTouchStart={handleTouchStart('quickAttack')}
          onTouchEnd={handleTouchEnd('quickAttack')}
          onMouseDown={handleTouchStart('quickAttack')}
          onMouseUp={handleTouchEnd('quickAttack')}
          className="w-14 h-14 bg-sky-950/85 border border-sky-400/70 rounded-2xl flex flex-col items-center justify-center text-sky-200 font-bold active:bg-sky-500 active:text-slate-950 transition-transform active:scale-90 shadow-lg backdrop-blur-md cursor-pointer"
          aria-label="ضربه سریع یا تیر"
        >
          <span className="text-lg">{heroId === 'gordafarid' ? '🏹' : '⚡'}</span>
          <span className="text-[10px] font-bold">{heroId === 'gordafarid' ? 'تیر' : 'دش'}</span>
        </button>

        {/* Primary Melee Attack */}
        <button
          onTouchStart={handleTouchStart('attack')}
          onTouchEnd={handleTouchEnd('attack')}
          onMouseDown={handleTouchStart('attack')}
          onMouseUp={handleTouchEnd('attack')}
          className="w-16 h-16 bg-gradient-to-br from-rose-700 to-rose-900 border border-rose-400/80 rounded-2xl flex flex-col items-center justify-center text-rose-100 font-black active:bg-rose-600 active:text-white transition-transform active:scale-90 shadow-2xl backdrop-blur-md cursor-pointer"
          aria-label="حمله اصلی"
        >
          <span className="text-xl">⚔️</span>
          <span className="text-[10px] font-black">حمله</span>
        </button>

        {/* Parry / Deflect Button */}
        <button
          onTouchStart={handleTouchStart('parry')}
          onTouchEnd={handleTouchEnd('parry')}
          onMouseDown={handleTouchStart('parry')}
          onMouseUp={handleTouchEnd('parry')}
          className="w-13 h-13 bg-indigo-950/85 border border-indigo-400/80 rounded-2xl flex flex-col items-center justify-center text-indigo-200 font-bold active:bg-indigo-500 active:text-white transition-transform active:scale-90 shadow-lg backdrop-blur-md cursor-pointer"
          aria-label="دفع تیغ و پری"
        >
          <span className="text-base">🛡️</span>
          <span className="text-[10px] font-black leading-tight">پری</span>
        </button>

        {/* Jump Button */}
        <button
          onTouchStart={handleTouchStart('jump')}
          onTouchEnd={handleTouchEnd('jump')}
          onMouseDown={handleTouchStart('jump')}
          onMouseUp={handleTouchEnd('jump')}
          className="w-14 h-14 bg-emerald-950/85 border border-emerald-400/70 rounded-2xl flex flex-col items-center justify-center text-emerald-200 font-bold active:bg-emerald-500 active:text-slate-950 transition-transform active:scale-90 shadow-lg backdrop-blur-md cursor-pointer"
          aria-label="پرش"
        >
          <span className="text-lg">▲</span>
          <span className="text-[10px] font-bold">پرش</span>
        </button>
      </div>
    </div>
  );
};
