import React, { useState } from 'react';
import { PlayerProgress, Language, WeaponDef, SkillDef } from '../types/game';
import { WEAPONS, SKILLS } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { X, Sword, Shield, Zap, Sparkles, Crosshair, Hammer, Flame, Sun, ShieldAlert, ChevronUp, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import { ManuscriptFrame } from './ShahnamehManuscriptFrame';

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

  const isRtl = lang === 'fa' || lang === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
    >
      <ManuscriptFrame
        variant="lapis"
        showSarloh={true}
        sarlohTitle={t.hero_armory}
        sarlohSubtitle={t.armory_subtitle}
        className="max-w-2xl w-full max-h-[90vh] flex flex-col"
        contentClassName="flex flex-col max-h-[82vh] overflow-hidden"
      >
        {/* Top Bar with Currency & Close */}
        <div className="p-4 border-b border-amber-500/30 flex items-center justify-between bg-[#060c1c]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black text-amber-200 nastaliq-title">
                {t.hero_armory}
              </h3>
              <p className="text-[11px] text-amber-100/75">
                {t.armory_subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-950/90 border border-amber-500/40 rounded-lg">
              <span className="text-amber-400 font-mono tabular-nums">{progress.gold.toLocaleString()} 🪙</span>
              <span className="text-slate-600">|</span>
              <span className="text-sky-400 font-mono tabular-nums">{progress.gems.toLocaleString()} 💎</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-amber-200/70 hover:text-amber-200 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-amber-500/25 bg-[#050a18]/90 p-2 gap-2">
          <button
            onClick={() => setTab('weapons')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'weapons'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-md font-black'
                : 'text-amber-200/75 hover:text-amber-100 hover:bg-slate-900'
            }`}
          >
            <Sword className="w-4 h-4" />
            <span>{t.armory_tab_weapons}</span>
          </button>
          <button
            onClick={() => setTab('skills')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              tab === 'skills'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-md font-black'
                : 'text-amber-200/75 hover:text-amber-100 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{t.armory_tab_skills}</span>
          </button>
        </div>

        {/* Error notification if not enough currency */}
        {errorMsg && (
          <div className="bg-rose-950/90 border-b border-rose-500/50 text-rose-200 text-xs py-2 px-4 text-center font-bold animate-pulse">
            {errorMsg}
          </div>
        )}

        {/* Content Area */}
        <div className="p-4 md:p-5 overflow-y-auto flex flex-col gap-3 flex-1">
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
                  className="p-4 damascus-surface border border-amber-500/35 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-400/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950/90 border border-amber-500/40 rounded-xl shrink-0">
                      {getWeaponIcon(weapon.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-amber-100">
                          {t[weapon.nameKey]}
                        </h4>
                        <span className="text-xs text-amber-400 font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/30">
                          {t.level_label} {curLevel} / {weapon.maxLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {t[weapon.descKey]}
                      </p>
                      {weapon.damagePerLevel > 0 && (
                        <span className="text-[11px] text-emerald-400 font-bold block mt-1.5">
                          +{totalDamageBonus} {t.bonus_damage_label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action / Upgrade button */}
                  <div className="flex items-center gap-3 shrink-0 justify-end">
                    {isMax ? (
                      <span className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        {t.max_level}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleWeaponUpgrade(weapon)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md flex items-center gap-2 border border-amber-300"
                      >
                        <ChevronUp className="w-4 h-4" />
                        <span>{t.upgrade} {curLevel + 1}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-950 font-black">
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
                  className="p-4 damascus-surface border border-amber-500/35 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-400/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-slate-950/90 border border-amber-500/40 rounded-xl shrink-0">
                      {getSkillIcon(skill.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-amber-100">
                          {t[skill.nameKey]}
                        </h4>
                        <span className="text-[11px] text-amber-300 font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/30">
                          {t.cooldown_label}: {skill.cooldown}{t.seconds_short}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
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
                        className="px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer shadow-md flex items-center gap-2 border border-sky-400/50"
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
        <div className="p-3.5 border-t border-amber-500/30 bg-[#050a18]/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </ManuscriptFrame>
    </div>
  );
};

