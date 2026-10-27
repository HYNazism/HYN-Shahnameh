import React from 'react';
import { Language } from '../types/game';
import { Globe } from 'lucide-react';

interface Props {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ currentLang, onSelectLang }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'fa', label: 'پارسی' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/60 rounded-lg text-xs backdrop-blur-md">
      <Globe className="w-3.5 h-3.5 text-amber-400 mx-1 shrink-0" />
      {languages.map(l => (
        <button
          key={l.code}
          onClick={() => onSelectLang(l.code)}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
            currentLang === l.code
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
