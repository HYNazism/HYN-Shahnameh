import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Bell, Play, Pause, Sparkles, BookOpen } from 'lucide-react';
import { naqqalAudio } from '../utils/naqqalAudio';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';

interface Props {
  title: string;
  couplet: string;
  poet: string;
  fullProse?: string;
  compact?: boolean;
  lang?: Language;
}

export const NaqqalNarrator: React.FC<Props> = ({
  title,
  couplet,
  poet,
  fullProse,
  compact = false,
  lang = 'fa',
}) => {
  const t = TRANSLATIONS[lang];
  const [isPlaying, setIsPlaying] = useState(false);
  const [staffTapped, setStaffTapped] = useState(false);
  const [gesturePhase, setGesturePhase] = useState<'idle' | 'pointing' | 'reciting' | 'dramatic'>('idle');
  const animFrameRef = useRef<number | null>(null);

  // Stop speech when unmounted
  useEffect(() => {
    return () => {
      naqqalAudio.stopAll();
    };
  }, []);

  const handleToggleRecitation = () => {
    if (isPlaying) {
      naqqalAudio.stopAll();
      setIsPlaying(false);
      setGesturePhase('idle');
    } else {
      setIsPlaying(true);
      setGesturePhase('pointing');
      setStaffTapped(true);
      setTimeout(() => setStaffTapped(false), 500);

      // Trigger narration with couplet first, then prose
      const textToRecite = fullProse ? `${couplet}. ${fullProse}` : couplet;

      naqqalAudio.reciteText(textToRecite, {
        onStart: () => {
          setIsPlaying(true);
          setGesturePhase('reciting');
        },
        onEnd: () => {
          setIsPlaying(false);
          setGesturePhase('idle');
        },
        onBoundary: (charIdx) => {
          // Gesture rhythm updates
          if (charIdx % 30 === 0) {
            setGesturePhase(prev => (prev === 'reciting' ? 'dramatic' : 'reciting'));
            if (charIdx % 60 === 0) {
              setStaffTapped(true);
              setTimeout(() => setStaffTapped(false), 350);
            }
          }
        },
      });
    }
  };

  const handleRingBell = () => {
    naqqalAudio.playZangMorshed(1.2);
    setStaffTapped(true);
    setTimeout(() => setStaffTapped(false), 400);
  };

  return (
    <div className={`w-full bg-gradient-to-b from-[#141b2d] to-[#0c101c] border-2 border-amber-500/50 rounded-2xl ${compact ? 'p-3' : 'p-4 md:p-5'} relative overflow-hidden shadow-2xl select-none`}>
      {/* Decorative Persian Carpet Borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Animated Naqqal Character Stage Canvas / SVG */}
        <div className="relative flex-shrink-0 flex flex-col items-center">
          <div className="relative w-36 h-44 rounded-2xl bg-[#080d19] border border-amber-500/40 p-2 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Background Archway in Zoorkhaneh style */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-transparent to-transparent pointer-events-none"></div>

            {/* Sound Wave Ripple when Reciting */}
            {isPlaying && (
              <div className="absolute w-24 h-24 rounded-full border border-amber-400/30 animate-ping pointer-events-none"></div>
            )}

            {/* Hand-Crafted Animated SVG of the Persian Naqqal */}
            <svg
              viewBox="0 0 120 150"
              className="w-full h-full relative z-10 filter drop-shadow-md"
            >
              <defs>
                <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="50%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#311502" />
                </linearGradient>
                <linearGradient id="shawlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
              </defs>

              {/* Shadow underneath */}
              <ellipse cx="60" cy="142" rx="35" ry="6" fill="rgba(0,0,0,0.4)" />

              {/* Robe / Cloak (عبای نقالی) */}
              <path
                d="M 38 65 Q 22 100 24 140 L 96 140 Q 98 100 82 65 Z"
                fill="url(#robeGrad)"
                stroke="#b45309"
                strokeWidth="1.5"
              />

              {/* Pahlavani Sash / شال پهلوانی */}
              <rect x="36" y="94" width="48" height="8" rx="2" fill="url(#shawlGrad)" stroke="#fef08a" strokeWidth="1" />
              <line x1="60" y1="94" x2="60" y2="120" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

              {/* Body / Torso with Breathing Motion */}
              <g className={isPlaying ? 'animate-pulse' : ''}>
                {/* White Shirt Collar */}
                <path d="M 50 56 L 60 72 L 70 56 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              </g>

              {/* Bearded Elder Head */}
              <g>
                {/* Face */}
                <circle cx="60" cy="46" r="14" fill="#fed7aa" />
                {/* Cheerful/Epic White Beard (ریش سپید نقال) */}
                <path
                  d="M 48 48 Q 60 76 72 48 Q 68 54 60 58 Q 52 54 48 48 Z"
                  fill="#f1f5f9"
                  stroke="#cbd5e1"
                  strokeWidth="0.8"
                />
                {/* Mustache */}
                <path d="M 52 50 Q 60 54 68 50" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
                {/* Expressive Eyes */}
                <circle cx="55" cy="42" r="1.5" fill="#0f172a" />
                <circle cx="65" cy="42" r="1.5" fill="#0f172a" />
                {/* Eyebrows */}
                <line x1="53" y1="39" x2="57" y2="39" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="63" y1="39" x2="67" y2="39" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />

                {/* Traditional Wool/Felt Cap (کلاه نمدی سنتی) */}
                <ellipse cx="60" cy="34" rx="14" ry="7" fill="#3f3f46" stroke="#d4af37" strokeWidth="1.5" />
                <path d="M 46 34 Q 60 22 74 34 Z" fill="#27272a" />
              </g>

              {/* Right Arm: Expressive gesturing hand */}
              <g
                style={{
                  transformOrigin: '40px 68px',
                  transform:
                    gesturePhase === 'pointing'
                      ? 'rotate(-25deg)'
                      : gesturePhase === 'reciting'
                      ? 'rotate(-10deg)'
                      : gesturePhase === 'dramatic'
                      ? 'rotate(-35deg)'
                      : 'rotate(0deg)',
                  transition: 'transform 0.4s ease-in-out',
                }}
              >
                <path d="M 40 68 Q 28 85 22 80" stroke="#78350f" strokeWidth="6" strokeLinecap="round" fill="none" />
                <circle cx="20" cy="80" r="3.5" fill="#fed7aa" />
              </g>

              {/* Left Arm & Staff (چوب‌دستی نقالی / مِطراق) */}
              <g
                style={{
                  transformOrigin: '78px 68px',
                  transform: staffTapped
                    ? 'translateY(4px) rotate(4deg)'
                    : gesturePhase === 'dramatic'
                    ? 'rotate(-15deg)'
                    : gesturePhase === 'pointing'
                    ? 'rotate(-8deg)'
                    : 'rotate(0deg)',
                  transition: 'transform 0.25s ease-out',
                }}
              >
                {/* Arm */}
                <path d="M 78 68 Q 90 85 94 92" stroke="#78350f" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Hand grasping staff */}
                <circle cx="94" cy="92" r="3.5" fill="#fed7aa" />

                {/* Wooden Staff (چوب دستی) */}
                <line
                  x1="94"
                  y1="18"
                  x2="94"
                  y2="142"
                  stroke="#b45309"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Brass Staff Head and Rings */}
                <circle cx="94" cy="18" r="4.5" fill="#fef08a" stroke="#d4af37" strokeWidth="1" />
                <line x1="91" y1="26" x2="97" y2="26" stroke="#fef08a" strokeWidth="2" />
                <line x1="91" y1="32" x2="97" y2="32" stroke="#fef08a" strokeWidth="2" />
              </g>

              {/* Impact Dust Shockwave when Staff taps ground */}
              {staffTapped && (
                <g>
                  <circle cx="94" cy="142" r="8" fill="none" stroke="#fef08a" strokeWidth="2" className="animate-ping" />
                  <line x1="88" y1="141" x2="82" y2="139" stroke="#fbbf24" strokeWidth="1.5" />
                  <line x1="100" y1="141" x2="106" y2="139" stroke="#fbbf24" strokeWidth="1.5" />
                </g>
              )}
            </svg>
          </div>

          <span className="text-[10px] text-amber-300 font-bold mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {t.naqqal_badge}
          </span>
        </div>

        {/* Story Text, Verse Calligraphy & Controls */}
        <div className="flex-1 flex flex-col gap-2.5">
          {/* Header & Bell Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400/90 tracking-wider block">
                {t.naqqal_subtitle}
              </span>
              <h3 className="text-sm md:text-base font-black text-slate-100">
                {title}
              </h3>
            </div>

            {/* Quick Zang Morshed Button */}
            <button
              onClick={handleRingBell}
              title={t.zang_morshed_btn}
              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-sm"
            >
              <Bell className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{t.zang_morshed_btn}</span>
            </button>
          </div>

          {/* Epic Couplet Display */}
          <div className="p-3 bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 border border-amber-500/40 rounded-xl text-center shadow-inner relative">
            <p className="text-xs md:text-sm font-bold text-amber-200 leading-relaxed font-serif italic whitespace-pre-line">
              {couplet}
            </p>
            <span className="text-[10px] text-amber-400/80 font-medium block mt-1">
              — {poet}
            </span>
          </div>

          {/* Full Prose (if available & expanded) */}
          {fullProse && !compact && (
            <p className="text-xs text-slate-300 leading-relaxed text-justify line-clamp-3">
              {fullProse}
            </p>
          )}

          {/* Audio Narration Trigger Button */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleToggleRecitation}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-98'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>{t.naqqal_stop_btn}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{t.naqqal_play_btn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
