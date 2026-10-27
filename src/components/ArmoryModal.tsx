import React, { useState } from 'react';
import { PlayerProgress, Language, WeaponDef, SkillDef } from '../types/game';
import { WEAPONS, SKILLS } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { X, Sword, Shield, Zap, Sparkles, Crosshair, Hammer, Flame, Sun, ShieldAlert, ChevronUp, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  progress: PlayerProgress;
  lang: Language;
  onClose: () => void;
  onUpgradeWeapon: (weaponId: string, costGold: number, costGems: number) => void;
  onUnlockSkill: (skillId: string, costGold: number) => void;
}

export const ArmoryModal: React.FC<Props> = ({
  progress,
  lang,
  onClose,
  onUpgradeWeapon,
  onUnlockSkill,
}) => {
  const t = TRANSLATIONS[lang];
  const [tab, setTab] = useState<'weapons' | 'skills'>('weapons');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getWeaponIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-400" />;
      case 'Sword': return <Sword className="w-5 h-5 text-sky-400" />;
      case 'Crosshair': return <Crosshair className="w-5 h-5 text-emerald-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-amber-300" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      default: return <Sword className="w-5 h-5 text-amber-400" />;
    }
  };

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-sky-400" />;
      case 'Sun': return <Sun className="w-5 h-5 text-yellow-300" />;
      default: return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleWeaponUpgrade = (weapon: WeaponDef) => {
    const curLevel = progress.weaponLevels[weapon.id] || 0;
    if (curLevel >= weapon.maxLevel) return;

    const goldCost = weapon.baseCostGold * (curLevel + 1);
    const gemCost = weapon.baseCostGems * (curLevel + 1);

    if (progress.gold < goldCost || progress.gems < gemCost) {
      setErrorMsg(t.not_enough_currency);
      sound.playHit();
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    onUpgradeWeapon(weapon.id, goldCost, gemCost);
    sound.playVictory();
  };

  const handleSkillUnlock = (skill: SkillDef) => {
    if (progress.unlockedSkills[skill.id]) return;

    if (progress.gold < skill.costGold) {
      setErrorMsg(t.not_enough_currency);
      sound.playHit();
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    onUnlockSkill(skill.id, skill.costGold);
    sound.playVictory();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-amber-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-amber-400">
                {t.hero_armory}
              </h2>
              <span className="text-xs text-slate-400">
                ارتقای سلاح‌های باستانی و فنون رزم شاهنامه
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Player balance */}
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg">
              <span className="text-amber-400 font-mono tabular-nums">{progress.gold} 🪙</span>
              <span className="text-slate-600">|</span>
              <span className="text-sky-400 font-mono tabular-nums">{progress.gems} 💎</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 p-2 gap-2">
          <button
            onClick={() => setTab('weapons')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'weapons'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sword className="w-4 h-4" />
            <span>سلاح‌ها و ادوات باستانی</span>
          </button>
          <button
            onClick={() => setTab('skills')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'skills'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>مهارت‌ها و فنون رزمی</span>
          </button>
        </div>

        {/* Error notification if not enough currency */}
        {errorMsg && (
          <div className="bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs py-2 px-4 text-center font-bold animate-pulse">
            {errorMsg}
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-3">
          {tab === 'weapons' ? (
            WEAPONS.map(weapon => {
              const curLevel = progress.weaponLevels[weapon.id] || 0;
              const isMax = curLevel >= weapon.maxLevel;
              const nextGoldCost = weapon.baseCostGold * (curLevel + 1);
              const nextGemCost = weapon.baseCostGems * (curLevel + 1);
              const totalDamageBonus = weapon.baseDamage + curLevel * weapon.damagePerLevel;

              return (
                <div
                  key={weapon.id}
                  className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
                      {getWeaponIcon(weapon.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">
                          {t[weapon.nameKey]}
                        </h4>
                        <span className="text-xs text-amber-400 font-mono font-bold">
                          {t.level_label} {curLevel} / {weapon.maxLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {t[weapon.descKey]}
                      </p>
                      {weapon.damagePerLevel > 0 && (
                        <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                          +{totalDamageBonus} قدرت آسیب نهایی
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action / Upgrade button */}
                  <div className="flex items-center gap-3 shrink-0 justify-end">
                    {isMax ? (
                      <span className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        {t.max_level}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleWeaponUpgrade(weapon)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <ChevronUp className="w-4 h-4" />
                        <span>{t.upgrade} {curLevel + 1}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-900 font-black">
                          ({nextGoldCost}🪙 {nextGemCost}💎)
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            SKILLS.map(skill => {
              const isUnlocked = !!progress.unlockedSkills[skill.id];

              return (
                <div
                  key={skill.id}
                  className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
                      {getSkillIcon(skill.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">
                          {t[skill.nameKey]}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          زمان خنک‌شدن: {skill.cooldown}ثانیه
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {t[skill.descKey]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 justify-end">
                    {isUnlocked ? (
                      <span className="px-4 py-2 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        {t.unlocked}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSkillUnlock(skill)}
                        className="px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{t.unlock}</span>
                        <span className="font-mono tabular-nums text-[11px] font-black">
                          ({skill.costGold}🪙)
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
