import React from 'react';
import { GraphicsTier, Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import { Monitor } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  currentTier: GraphicsTier;
  onSelectTier: (tier: GraphicsTier) => void;
  lang: Language;
}

export const GraphicsSelector: React.FC<Props> = ({ currentTier, onSelectTier, lang }) => {
  const t = TRANSLATIONS[lang];

  const tiers: { id: GraphicsTier; labelKey: string }[] = [
    { id: 'low', labelKey: 'quality_low' },
    { id: 'medium', labelKey: 'quality_medium' },
    { id: 'high', labelKey: 'quality_high' },
    { id: 'ultra', labelKey: 'quality_ultra' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/60 rounded-lg text-xs backdrop-blur-md">
      <Monitor className="w-3.5 h-3.5 text-sky-400 mx-1 shrink-0" />
      {tiers.map(tier => {
        const isSelected = currentTier === tier.id;
        return (
          <button
            key={tier.id}
            onClick={() => {
              onSelectTier(tier.id);
              sound.playTonbak(false);
            }}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer text-[11px] ${
              isSelected
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t[tier.labelKey] || tier.id}
          </button>
        );
      })}
    </div>
  );
};
