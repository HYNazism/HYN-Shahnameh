import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameEngine } from '../game/GameEngine';
import { TouchControlSettings, Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import { loadTouchSettings, saveTouchSettings, DEFAULT_TOUCH_SETTINGS } from '../utils/storage';
import { TouchSettingsModal } from './TouchSettingsModal';
import { Sliders, Shield, Zap, Sword } from 'lucide-react';

interface Props {
  engine: GameEngine | null;
  specialSkillName: string;
  heroId: string;
  lang?: Language;
}

export const MobileControls: React.FC<Props> = ({
  engine,
  specialSkillName,
  heroId,
  lang = 'fa',
}) => {
  const t = TRANSLATIONS[lang];
  const [settings, setSettings] = useState<TouchControlSettings>(() => loadTouchSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Floating joystick state
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeDirection, setActiveDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);

  const joystickZoneRef = useRef<HTMLDivElement | null>(null);
  const activeTouchIdRef = useRef<number | null>(null);

  // Trigger haptic if supported
  const triggerHaptic = useCallback(() => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(12);
      }
    } catch (e) {
      // Ignored if vibration is disabled by browser policy
    }
  }, []);

  const handleUpdateSettings = (newSettings: TouchControlSettings) => {
    setSettings(newSettings);
    saveTouchSettings(newSettings);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_TOUCH_SETTINGS);
    saveTouchSettings(DEFAULT_TOUCH_SETTINGS);
  };

  // Action Button Handlers with Touch and Mouse support
  const handleActionDown = (key: keyof GameEngine['input']) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic();
    if (engine) engine.input[key] = true;
  };

  const handleActionUp = (key: keyof GameEngine['input']) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (engine) engine.input[key] = false;
  };

  // Joystick touch handlers
  const handleZoneTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    if (!touch || activeTouchIdRef.current !== null) return;

    activeTouchIdRef.current = touch.identifier;
    triggerHaptic();

    if (settings.mode === 'floating') {
      const rect = joystickZoneRef.current?.getBoundingClientRect();
      if (rect) {
        setJoystickCenter({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
    } else {
      // Fixed mode: center is fixed in the zone
      const rect = joystickZoneRef.current?.getBoundingClientRect();
      if (rect) {
        setJoystickCenter({
          x: rect.width / 2,
          y: rect.height / 2,
        });
      }
    }

    setKnobPos({ x: 0, y: 0 });
    setIsJoystickActive(true);
  };

  const handleZoneTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (activeTouchIdRef.current === null || !engine) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchIdRef.current) {
        const rect = joystickZoneRef.current?.getBoundingClientRect();
        if (!rect) return;

        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;

        const deltaX = currentX - joystickCenter.x;
        const deltaY = currentY - joystickCenter.y;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDist = 42;

        let clampedX = deltaX;
        let clampedY = deltaY;
        if (dist > maxDist) {
          clampedX = (deltaX / dist) * maxDist;
          clampedY = (deltaY / dist) * maxDist;
        }

        setKnobPos({ x: clampedX, y: clampedY });

        // Directional Thresholds
        const threshold = 14;
        if (clampedX < -threshold) {
          engine.input.left = true;
          engine.input.right = false;
          setActiveDirection('left');
        } else if (clampedX > threshold) {
          engine.input.right = true;
          engine.input.left = false;
          setActiveDirection('right');
        } else {
          engine.input.left = false;
          engine.input.right = false;
          setActiveDirection(null);
        }

        // Vertical Threshold (Jump up)
        if (clampedY < -24) {
          engine.input.jump = true;
        } else {
          engine.input.jump = false;
        }
        break;
      }
    }
  };

  const handleZoneTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
        activeTouchIdRef.current = null;
        setIsJoystickActive(false);
        setKnobPos({ x: 0, y: 0 });
        setActiveDirection(null);
        if (engine) {
          engine.input.left = false;
          engine.input.right = false;
          engine.input.jump = false;
        }
        break;
      }
    }
  };

  // Scale multiplier
  const scaleClass =
    settings.scale === 'compact'
      ? 'scale-90 origin-bottom'
      : settings.scale === 'large'
      ? 'scale-110 origin-bottom'
      : 'scale-100 origin-bottom';

  // Handedness layout
  const isLeftHanded = settings.layout === 'left-handed';

  return (
    <>
      {/* Floating Settings Button (Top-Right or Accessible edge) */}
      <div className="absolute top-16 end-3 z-35 pointer-events-auto">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-8 h-8 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-lg active:scale-95 transition-transform backdrop-blur-md cursor-pointer"
          title="Touch Settings"
          aria-label="Touch Settings"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Main Touch Overlay */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-30 select-none overflow-hidden safe-bottom safe-px"
        style={{
          opacity: settings.opacity,
          paddingBottom: `max(12px, calc(env(safe-area-inset-bottom) + ${settings.verticalOffset}px))`,
        }}
      >
        <div
          className={`flex items-end justify-between w-full px-2 md:px-6 transition-all ${
            isLeftHanded ? 'flex-row-reverse' : 'flex-row'
          } ${scaleClass}`}
        >
          {/* Movement Zone (Virtual D-pad / Floating Joystick) */}
          <div
            ref={joystickZoneRef}
            onTouchStart={handleZoneTouchStart}
            onTouchMove={handleZoneTouchMove}
            onTouchEnd={handleZoneTouchEnd}
            onTouchCancel={handleZoneTouchEnd}
            className="w-44 h-40 relative pointer-events-auto touch-none flex items-center justify-center"
          >
            {settings.mode === 'floating' ? (
              // Dynamic Floating Joystick
              <div
                className={`absolute transition-opacity duration-150 ${
                  isJoystickActive ? 'opacity-100' : 'opacity-45'
                }`}
                style={{
                  left: isJoystickActive ? `${joystickCenter.x - 55}px` : '18px',
                  top: isJoystickActive ? `${joystickCenter.y - 55}px` : '18px',
                }}
              >
                {/* Outer Ring */}
                <div className="w-28 h-28 rounded-full bg-slate-950/80 border-2 border-amber-500/60 shadow-2xl backdrop-blur-md relative flex items-center justify-center">
                  {/* Directional Guides */}
                  <span
                    className={`absolute left-2 text-xs font-black transition-colors ${
                      activeDirection === 'left' ? 'text-amber-300 scale-125' : 'text-slate-500'
                    }`}
                  >
                    ◀
                  </span>
                  <span
                    className={`absolute right-2 text-xs font-black transition-colors ${
                      activeDirection === 'right' ? 'text-amber-300 scale-125' : 'text-slate-500'
                    }`}
                  >
                    ▶
                  </span>
                  <span className="absolute top-2 text-xs font-black text-slate-500">▲</span>

                  {/* Inner Movable Thumb Knob */}
                  <div
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 border-2 border-yellow-200 shadow-xl flex items-center justify-center transition-transform duration-75"
                    style={{
                      transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-950/40 border border-amber-200" />
                  </div>
                </div>
              </div>
            ) : (
              // Fixed D-Pad layout
              <div className="flex gap-3 items-center">
                <button
                  onTouchStart={handleActionDown('left')}
                  onTouchEnd={handleActionUp('left')}
                  onMouseDown={handleActionDown('left')}
                  onMouseUp={handleActionUp('left')}
                  className="w-16 h-16 bg-slate-950/90 border-2 border-amber-500/60 rounded-2xl flex items-center justify-center text-amber-300 font-black text-2xl active:bg-amber-600 active:text-slate-950 active:scale-90 transition-transform shadow-2xl backdrop-blur-md cursor-pointer"
                  aria-label="Move Left"
                >
                  ◀
                </button>
                <button
                  onTouchStart={handleActionDown('right')}
                  onTouchEnd={handleActionUp('right')}
                  onMouseDown={handleActionDown('right')}
                  onMouseUp={handleActionUp('right')}
                  className="w-16 h-16 bg-slate-950/90 border-2 border-amber-500/60 rounded-2xl flex items-center justify-center text-amber-300 font-black text-2xl active:bg-amber-600 active:text-slate-950 active:scale-90 transition-transform shadow-2xl backdrop-blur-md cursor-pointer"
                  aria-label="Move Right"
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons Cluster (Ergonomic Arc Layout) */}
          <div className="flex items-end gap-2 pointer-events-auto touch-none select-none">
            {/* Column 1: Farreh Godly Skill */}
            <div className="flex flex-col gap-2">
              <button
                onTouchStart={handleActionDown('special')}
                onTouchEnd={handleActionUp('special')}
                onMouseDown={handleActionDown('special')}
                onMouseUp={handleActionUp('special')}
                className="w-13 h-13 bg-gradient-to-br from-amber-600 to-amber-900 border-2 border-amber-400/90 rounded-2xl flex flex-col items-center justify-center text-amber-100 font-bold active:scale-90 shadow-xl cursor-pointer transition-transform"
                aria-label={specialSkillName}
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-[10px] font-black leading-tight truncate max-w-[44px]">{t.btn_farreh}</span>
              </button>

              {/* Parry / Deflect Button */}
              <button
                onTouchStart={handleActionDown('parry')}
                onTouchEnd={handleActionUp('parry')}
                onMouseDown={handleActionDown('parry')}
                onMouseUp={handleActionUp('parry')}
                className="w-13 h-13 bg-indigo-950/90 border-2 border-indigo-400/80 rounded-2xl flex flex-col items-center justify-center text-indigo-200 font-bold active:bg-indigo-600 active:text-white transition-transform active:scale-90 shadow-xl backdrop-blur-md cursor-pointer"
                aria-label={t.btn_parry}
              >
                <Shield className="w-4 h-4 text-indigo-300" />
                <span className="text-[10px] font-black leading-tight">{t.btn_parry}</span>
              </button>
            </div>

            {/* Column 2: Quick Attack / Bow & Arrow */}
            <div className="flex flex-col gap-2">
              <button
                onTouchStart={handleActionDown('quickAttack')}
                onTouchEnd={handleActionUp('quickAttack')}
                onMouseDown={handleActionDown('quickAttack')}
                onMouseUp={handleActionUp('quickAttack')}
                className="w-14 h-14 bg-sky-950/90 border-2 border-sky-400/80 rounded-2xl flex flex-col items-center justify-center text-sky-200 font-bold active:bg-sky-500 active:text-slate-950 transition-transform active:scale-90 shadow-xl backdrop-blur-md cursor-pointer"
                aria-label={heroId === 'gordafarid' ? t.btn_arrow : t.btn_dash}
              >
                <span className="text-lg">{heroId === 'gordafarid' ? '🏹' : '⚡'}</span>
                <span className="text-[10px] font-bold leading-tight">
                  {heroId === 'gordafarid' ? t.btn_arrow : t.btn_dash}
                </span>
              </button>

              {/* Jump Button */}
              <button
                onTouchStart={handleActionDown('jump')}
                onTouchEnd={handleActionUp('jump')}
                onMouseDown={handleActionDown('jump')}
                onMouseUp={handleActionUp('jump')}
                className="w-14 h-14 bg-emerald-950/90 border-2 border-emerald-400/80 rounded-2xl flex flex-col items-center justify-center text-emerald-200 font-bold active:bg-emerald-500 active:text-slate-950 transition-transform active:scale-90 shadow-xl backdrop-blur-md cursor-pointer"
                aria-label={t.btn_jump}
              >
                <span className="text-xl font-black">▲</span>
                <span className="text-[10px] font-bold leading-tight">{t.btn_jump}</span>
              </button>
            </div>

            {/* Column 3: Primary Melee Attack (Largest target) */}
            <div>
              <button
                onTouchStart={handleActionDown('attack')}
                onTouchEnd={handleActionUp('attack')}
                onMouseDown={handleActionDown('attack')}
                onMouseUp={handleActionUp('attack')}
                className="w-18 h-18 bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 border-2 border-rose-400/90 rounded-3xl flex flex-col items-center justify-center text-rose-100 font-black active:bg-rose-600 active:scale-90 transition-transform shadow-2xl backdrop-blur-md cursor-pointer"
                aria-label={t.btn_attack}
              >
                <Sword className="w-6 h-6 text-rose-200 stroke-[2.5]" />
                <span className="text-xs font-black mt-0.5">{t.btn_attack}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <TouchSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
        lang={lang}
      />
    </>
  );
};
