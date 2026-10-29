import React from 'react';

interface SarlohHeaderProps {
  title?: string;
  subtitle?: string;
  variant?: 'gold' | 'crimson' | 'turquoise';
  compact?: boolean;
  className?: string;
}

/**
 * Authentic Safavid/Timurid Illuminated Sarloh (سرلوح تذهیب شاهنامه)
 * Combines Tabriz School mineral pigments (Lapis Lazuli, Cinnabar, Turquoise, 24k Gold Leaf)
 * with Baysonghori Herat geometric symmetry and Eslimi arabesques.
 */
export const SarlohHeader: React.FC<SarlohHeaderProps> = ({
  title,
  subtitle,
  variant = 'gold',
  compact = false,
  className = '',
}) => {
  const primaryColor =
    variant === 'crimson' ? '#dc2626' : variant === 'turquoise' ? '#0d9488' : '#d4af37';
  const secondaryColor =
    variant === 'crimson' ? '#f59e0b' : variant === 'turquoise' ? '#fbbf24' : '#38bdf8';
  const deepBg =
    variant === 'crimson' ? '#1f060a' : variant === 'turquoise' ? '#041f1e' : '#09132c';

  return (
    <div className={`relative w-full select-none overflow-hidden ${className}`}>
      {/* SVG Crown Illumination (Sarloh Dome & Shorafeh Pinnacles) */}
      <svg
        viewBox="0 0 800 72"
        className={`w-full ${compact ? 'h-7 sm:h-9' : 'h-10 sm:h-14'} block`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`sarloh-bg-${variant}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#040711" />
            <stop offset="20%" stopColor={deepBg} />
            <stop offset="50%" stopColor="#12224d" />
            <stop offset="80%" stopColor={deepBg} />
            <stop offset="100%" stopColor="#040711" />
          </linearGradient>
          <linearGradient id={`sarloh-gold-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Base Lapis Lazuli Band */}
        <rect x="0" y="16" width="800" height="54" fill={`url(#sarloh-bg-${variant})`} />

        {/* Top Shorafeh (Serrated Timurid Crown Pinnacles) */}
        <path
          d="M 0 16 L 80 16 L 95 4 L 110 16 L 190 16 L 210 2 L 230 16 L 310 16 L 350 2 L 400 0 L 450 2 L 490 16 L 570 16 L 590 2 L 610 16 L 690 16 L 705 4 L 720 16 L 800 16"
          fill={`url(#sarloh-bg-${variant})`}
          stroke={`url(#sarloh-gold-${variant})`}
          strokeWidth="1.8"
        />

        {/* Double-line Jadval Ruling */}
        <line x1="0" y1="19" x2="800" y2="19" stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.85" />
        <line x1="0" y1="67" x2="800" y2="67" stroke={primaryColor} strokeWidth="1.5" strokeOpacity="0.9" />
        <line x1="0" y1="70" x2="800" y2="70" stroke="#fef08a" strokeWidth="0.6" strokeOpacity="0.55" />

        {/* Central Toranj Medallion Arch */}
        <path
          d="M 270 67 C 300 18, 355 6, 400 4 C 445 6, 500 18, 530 67 Z"
          fill="#060c1e"
          stroke={`url(#sarloh-gold-${variant})`}
          strokeWidth="2"
        />
        <path
          d="M 290 67 C 315 26, 360 12, 400 10 C 440 12, 485 26, 510 67"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="1"
          strokeDasharray="4 3"
          strokeOpacity="0.75"
        />

        {/* Eslimi Arabesque Scrolls (Left & Right Wings) */}
        <g stroke={`url(#sarloh-gold-${variant})`} fill="none" strokeWidth="1.3" opacity="0.8">
          <path d="M 35 44 Q 75 24, 115 44 T 195 44 T 265 44" />
          <path d="M 35 44 Q 75 62, 115 44 T 195 44" stroke={secondaryColor} strokeWidth="0.9" />
          <path d="M 535 44 Q 575 24, 615 44 T 695 44 T 765 44" />
          <path d="M 605 44 Q 645 62, 685 44 T 765 44" stroke={secondaryColor} strokeWidth="0.9" />
        </g>

        {/* Shah-Abbasi Floral Rosettes & Turquoise/Cinnabar Jewels */}
        {[75, 155, 235, 400, 565, 645, 725].map((cx, idx) => (
          <g key={cx}>
            <circle
              cx={cx}
              cy={idx === 3 ? 38 : 43}
              r={idx === 3 ? 11 : 6}
              fill={idx % 2 === 0 ? '#dc2626' : '#0d9488'}
              stroke="#fde047"
              strokeWidth="1.3"
            />
            <circle cx={cx} cy={idx === 3 ? 38 : 43} r={idx === 3 ? 4 : 2.2} fill="#fef08a" />
          </g>
        ))}
      </svg>

      {/* Optional Overlaid Inscription */}
      {(title || subtitle) && (
        <div className="relative -mt-3 sm:-mt-4 pb-2 px-4 text-center flex flex-col items-center justify-center">
          {subtitle && (
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-amber-300/90 drop-shadow">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-amber-100 nastaliq-title drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {title}
            </h2>
          )}
        </div>
      )}
    </div>
  );
};

interface ManuscriptFrameProps {
  children: React.ReactNode;
  variant?: 'lapis' | 'crimson' | 'parchment' | 'obsidian';
  showSarloh?: boolean;
  sarlohTitle?: string;
  sarlohSubtitle?: string;
  showLachakCorners?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * Royal Shahnameh Illuminated Manuscript Folio Wrapper (قاب‌بندی نسخه خطی و جدول‌کشی زرین)
 * Features multi-ruled Jadval borders, Lachak corner medallions, and Zar-Afshan gold flecks.
 */
export const ManuscriptFrame: React.FC<ManuscriptFrameProps> = ({
  children,
  variant = 'lapis',
  showSarloh = false,
  sarlohTitle,
  sarlohSubtitle,
  showLachakCorners = true,
  className = '',
  contentClassName = '',
}) => {
  const bgStyle =
    variant === 'crimson'
      ? 'bg-gradient-to-b from-[#1a070b]/95 via-[#0f0508]/95 to-[#080305]/98 border-red-700/70'
      : variant === 'parchment'
      ? 'bg-gradient-to-b from-[#1e160d]/95 via-[#140f09]/95 to-[#0c0905]/98 border-amber-500/75'
      : variant === 'obsidian'
      ? 'bg-gradient-to-b from-[#0b101d]/95 via-[#060913]/95 to-[#03050a]/98 border-amber-600/65'
      : 'bg-gradient-to-b from-[#0b1631]/95 via-[#070d20]/95 to-[#040711]/98 border-amber-500/75';

  const cornerColor = variant === 'crimson' ? '#ef4444' : '#d4af37';
  const accentJewel = variant === 'crimson' ? '#f59e0b' : '#0d9488';

  return (
    <div
      className={`relative rounded-xl border-2 shadow-[0_18px_50px_rgba(0,0,0,0.9),inset_0_0_28px_rgba(212,175,55,0.12)] overflow-hidden ${bgStyle} ${className}`}
    >
      {/* Inner Double Jadval Hairline Frame */}
      <div className="pointer-events-none absolute inset-[4px] rounded-[9px] border border-amber-300/35 z-10" />
      <div className="pointer-events-none absolute inset-[7px] rounded-[7px] border border-amber-500/20 z-10" />

      {/* Subtle Zar-Afshan (Gold Leaf Specks) Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage:
            'radial-gradient(#fde047 0.75px, transparent 0.75px), radial-gradient(#d97706 0.6px, transparent 0.6px)',
          backgroundSize: '28px 28px, 42px 42px',
          backgroundPosition: '0 0, 14px 18px',
        }}
      />

      {/* Four Corner Illuminated Lachak Medallions (لچک‌های تذهیب چهارگوشه) */}
      {showLachakCorners && (
        <>
          {/* Top-Left Lachak */}
          <svg
            viewBox="0 0 44 44"
            className="pointer-events-none absolute top-1.5 left-1.5 w-7 h-7 sm:w-9 sm:h-9 z-20 opacity-90"
          >
            <path d="M 2 2 L 38 2 C 24 8, 12 20, 2 38 Z" fill="#071128" stroke={cornerColor} strokeWidth="1.5" />
            <path d="M 6 6 L 26 6 C 17 11, 11 17, 6 26 Z" fill={accentJewel} fillOpacity="0.45" stroke="#fef08a" strokeWidth="0.9" />
            <circle cx="10" cy="10" r="2.5" fill="#fde047" />
          </svg>
          {/* Top-Right Lachak */}
          <svg
            viewBox="0 0 44 44"
            className="pointer-events-none absolute top-1.5 right-1.5 w-7 h-7 sm:w-9 sm:h-9 z-20 opacity-90 -scale-x-100"
          >
            <path d="M 2 2 L 38 2 C 24 8, 12 20, 2 38 Z" fill="#071128" stroke={cornerColor} strokeWidth="1.5" />
            <path d="M 6 6 L 26 6 C 17 11, 11 17, 6 26 Z" fill={accentJewel} fillOpacity="0.45" stroke="#fef08a" strokeWidth="0.9" />
            <circle cx="10" cy="10" r="2.5" fill="#fde047" />
          </svg>
          {/* Bottom-Left Lachak */}
          <svg
            viewBox="0 0 44 44"
            className="pointer-events-none absolute bottom-1.5 left-1.5 w-7 h-7 sm:w-9 sm:h-9 z-20 opacity-90 -scale-y-100"
          >
            <path d="M 2 2 L 38 2 C 24 8, 12 20, 2 38 Z" fill="#071128" stroke={cornerColor} strokeWidth="1.5" />
            <path d="M 6 6 L 26 6 C 17 11, 11 17, 6 26 Z" fill={accentJewel} fillOpacity="0.45" stroke="#fef08a" strokeWidth="0.9" />
            <circle cx="10" cy="10" r="2.5" fill="#fde047" />
          </svg>
          {/* Bottom-Right Lachak */}
          <svg
            viewBox="0 0 44 44"
            className="pointer-events-none absolute bottom-1.5 right-1.5 w-7 h-7 sm:w-9 sm:h-9 z-20 opacity-90 -scale-x-100 -scale-y-100"
          >
            <path d="M 2 2 L 38 2 C 24 8, 12 20, 2 38 Z" fill="#071128" stroke={cornerColor} strokeWidth="1.5" />
            <path d="M 6 6 L 26 6 C 17 11, 11 17, 6 26 Z" fill={accentJewel} fillOpacity="0.45" stroke="#fef08a" strokeWidth="0.9" />
            <circle cx="10" cy="10" r="2.5" fill="#fde047" />
          </svg>
        </>
      )}

      {showSarloh && (
        <SarlohHeader
          title={sarlohTitle}
          subtitle={sarlohSubtitle}
          variant={variant === 'crimson' ? 'crimson' : 'gold'}
        />
      )}

      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
};

interface KatibehCartoucheProps {
  hemistich1: string;
  hemistich2?: string;
  variant?: 'gold' | 'crimson' | 'lapis';
  className?: string;
}

/**
 * Authentic Shahnameh Poetic Couplet Cartouche (کتیبه دو مصرعی شاهنامه)
 * Renders a classic two-column Persian verse tablet with scalloped Toranj ends and central Shamseh divider.
 */
export const KatibehCartouche: React.FC<KatibehCartoucheProps> = ({
  hemistich1,
  hemistich2,
  variant = 'gold',
  className = '',
}) => {
  const borderClass =
    variant === 'crimson'
      ? 'border-red-500/75 bg-gradient-to-r from-[#22060a]/95 via-[#330910]/95 to-[#22060a]/95 text-red-100'
      : variant === 'lapis'
      ? 'border-amber-400/75 bg-gradient-to-r from-[#071128]/95 via-[#0e1f47]/95 to-[#071128]/95 text-amber-100'
      : 'border-amber-400/80 bg-gradient-to-r from-[#171107]/95 via-[#261b0a]/95 to-[#171107]/95 text-amber-100';

  return (
    <div
      className={`relative rounded-lg border-2 px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_6px_22px_rgba(0,0,0,0.85),inset_0_0_15px_rgba(212,175,55,0.18)] ${borderClass} ${className}`}
    >
      <div className="pointer-events-none absolute inset-[2px] rounded-[5px] border border-amber-300/30" />

      {hemistich2 ? (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-3 text-center">
          <p className="text-xs sm:text-sm font-bold tracking-wide leading-relaxed drop-shadow">{hemistich1}</p>
          <span className="hidden sm:inline-flex items-center justify-center w-5 h-5 rounded-full border border-amber-400/70 bg-amber-950/80 text-[10px] text-amber-300">
            ❖
          </span>
          <p className="text-xs sm:text-sm font-bold tracking-wide leading-relaxed drop-shadow">{hemistich2}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="text-amber-400/80 text-xs">❖</span>
          <p className="text-xs sm:text-sm font-bold tracking-wide leading-relaxed drop-shadow">{hemistich1}</p>
          <span className="text-amber-400/80 text-xs">❖</span>
        </div>
      )}
    </div>
  );
};

interface ShamsehBadgeProps {
  label: string | number;
  variant?: 'gold' | 'crimson' | 'turquoise' | 'locked';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 8-Pointed Timurid Sunburst Star Medallion (شمسه هشت‌پر شاهنامه)
 */
export const ShamsehBadge: React.FC<ShamsehBadgeProps> = ({
  label,
  variant = 'gold',
  size = 'md',
}) => {
  const sizeClass =
    size === 'sm' ? 'w-7 h-7 text-[11px]' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-xs';
  const fill =
    variant === 'crimson'
      ? '#7f1d1d'
      : variant === 'turquoise'
      ? '#115e59'
      : variant === 'locked'
      ? '#1e293b'
      : '#78350f';
  const stroke =
    variant === 'crimson'
      ? '#f87171'
      : variant === 'turquoise'
      ? '#2dd4bf'
      : variant === 'locked'
      ? '#64748b'
      : '#fde047';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${sizeClass}`}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
        {/* Two rotated squares forming an 8-pointed Rub el Hizb / Shamseh star */}
        <rect
          x="8"
          y="8"
          width="32"
          height="32"
          rx="2"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
        />
        <rect
          x="8"
          y="8"
          width="32"
          height="32"
          rx="2"
          transform="rotate(45 24 24)"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
        />
        <circle cx="24" cy="24" r="12" fill="#060c1d" stroke={stroke} strokeWidth="1.2" />
      </svg>
      <span className="relative z-10 font-black tabular-nums text-amber-100">{label}</span>
    </div>
  );
};
