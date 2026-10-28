import React from 'react';
import { TouchControlSettings, Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import { Sliders, RotateCcw, Check, X, Smartphone, Eye, Maximize2, MoveHorizontal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: TouchControlSettings;
  onUpdateSettings: (newSettings: TouchControlSettings) => void;
  onResetSettings: () => void;
  lang: Language;
}

export const TouchSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  lang,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.fa;
  const isRtl = lang === 'fa' || lang === 'ar';

  return (
    <div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fadeIn"
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0b101e] border-2 border-amber-500/70 rounded-2xl max-w-md w-full p-5 text-slate-100 shadow-2xl flex flex-col gap-4 animate-fadeInScale max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-300">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-amber-300">
                {t.touch_settings_title}
              </h3>
              <p className="text-[11px] text-slate-400">
                سفارشی‌سازی شفافیت، ابعاد و حالت دسته مجازی
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            aria-label={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Setting 1: Opacity Slider */}
        <div className="flex flex-col gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              {t.touch_settings_opacity}
            </span>
            <span className="text-amber-400 font-mono font-bold">
              {Math.round(settings.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={settings.opacity}
            onChange={(e) =>
              onUpdateSettings({ ...settings, opacity: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>۲۰٪ (شیشه‌ای)</span>
            <span>۶۰٪</span>
            <span>۱۰۰٪ (واضح)</span>
          </div>
        </div>

        {/* Setting 2: Button Scale */}
        <div className="flex flex-col gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.touch_settings_scale}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'normal', 'large'] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => onUpdateSettings({ ...settings, scale: sc })}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  settings.scale === sc
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                {sc === 'compact' && t.scale_compact}
                {sc === 'normal' && t.scale_normal}
                {sc === 'large' && t.scale_large}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 3: D-pad / Joystick Mode (Dynamic Floating vs Fixed) */}
        <div className="flex flex-col gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.touch_mode}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ ...settings, mode: 'floating' })}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                settings.mode === 'floating'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <span>{t.mode_floating}</span>
              <span className="text-[10px] opacity-80">ظاهر شدن زیر لمس دست</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ ...settings, mode: 'fixed' })}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                settings.mode === 'fixed'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <span>{t.mode_fixed}</span>
              <span className="text-[10px] opacity-80">دکمه‌های ثابت در گوشه</span>
            </button>
          </div>
        </div>

        {/* Setting 4: Handedness (Right vs Left Handed) */}
        <div className="flex flex-col gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <MoveHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.handedness}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ ...settings, layout: 'right-handed' })}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                settings.layout === 'right-handed'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {t.right_handed}
            </button>
            <button
              onClick={() => onUpdateSettings({ ...settings, layout: 'left-handed' })}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                settings.layout === 'left-handed'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {t.left_handed}
            </button>
          </div>
        </div>

        {/* Setting 5: Vertical Bottom Offset */}
        <div className="flex flex-col gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-200">{t.vertical_offset}</span>
            <span className="text-amber-400 font-mono font-bold">
              +{settings.verticalOffset}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="4"
            value={settings.verticalOffset}
            onChange={(e) =>
              onUpdateSettings({ ...settings, verticalOffset: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>چسبیده به پایین (0px)</span>
            <span>معمولی (16px)</span>
            <span>بالاتر (60px)</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onResetSettings}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.reset_controls}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-transform active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{t.save_controls}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
