import React, { useState } from 'react';
import { PlayerProgress, Language } from '../types/game';
import { SkillBranch } from '../types';
import { SKILL_NODES, SkillSystem } from '../game/SkillSystem';
import { TRANSLATIONS } from '../constants/translations';
import { sound } from '../utils/audio';
import { ManuscriptFrame } from './ShahnamehManuscriptFrame';
import {
  Sparkles,
  Zap,
  Award,
  Coins,
  CheckCircle,
  Lock,
  X,
} from 'lucide-react';

interface Props {
  progress: PlayerProgress;
  lang?: Language;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<Props> = ({
  progress,
  lang = 'fa',
  onUpdateProgress,
  onClose,
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'fa' || lang === 'ar';
  const [selectedBranch, setSelectedBranch] = useState<SkillBranch>('delavari');
  const [activeNodeId, setActiveNodeId] = useState<string>('delavari_1');

  const branches: { id: SkillBranch; title: string; subtitle: string; color: string }[] = [
    { id: 'delavari', title: t.skill_branch_delavari, subtitle: t.skill_branch_delavari_sub, color: 'from-amber-600 to-rose-700' },
    { id: 'afsoon', title: t.skill_branch_afsoon, subtitle: t.skill_branch_afsoon_sub, color: 'from-yellow-500 to-amber-700' },
    { id: 'chalaki', title: t.skill_branch_chalaki, subtitle: t.skill_branch_chalaki_sub, color: 'from-sky-600 to-indigo-800' },
    { id: 'paydari', title: t.skill_branch_paydari, subtitle: t.skill_branch_paydari_sub, color: 'from-emerald-600 to-teal-800' },
  ];

  const nodesInBranch = SKILL_NODES.filter(n => n.branch === selectedBranch);
  const activeNode = SKILL_NODES.find(n => n.id === activeNodeId) || nodesInBranch[0];
  const unlockedMap = progress.unlockedSkillNodes || {};
  const isUnlocked = !!unlockedMap[activeNode.id];
  const unlockCheck = SkillSystem.canUnlock(activeNode.id, progress, lang);

  const getNodeName = (node: typeof activeNode) =>
    lang === 'fa' || lang === 'ar' ? node.nameFa : node.nameEn;

  const getNodeDesc = (node: typeof activeNode) =>
    lang === 'fa' || lang === 'ar' ? node.descFa : node.descEn;

  const formatEffectSummary = (node: typeof activeNode) => {
    const eff = node.effects;
    if (eff.stat === 'attack') return `+${eff.value} ${t.damage}`;
    if (eff.stat === 'hp') return `+${eff.value} ${t.hp_stat}`;
    if (eff.stat === 'speed') return `+${eff.value} ${t.speed_stat}`;
    if (eff.stat === 'defense') return `+${eff.value}% Defense`;
    if (eff.stat === 'critChance') return `+${Math.round(eff.value * 100)}% Crit`;
    if (eff.stat === 'parryWindow') return `+${eff.value}ms Parry`;
    if (eff.stat === 'rageGain') return `+${eff.value}% ${t.rage_farreh}`;
    return t.special_skill_label;
  };

  const handleUnlock = () => {
    const updated = SkillSystem.unlockNode(activeNode.id, progress);
    if (updated) {
      sound.playParrySuccess();
      sound.playComboFinisher();
      onUpdateProgress(updated);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 select-none text-slate-100"
    >
      <ManuscriptFrame
        variant="lapis"
        showSarloh={true}
        sarlohTitle={t.skill_tree_title}
        sarlohSubtitle={t.skill_tree_subtitle}
        className="w-full max-w-5xl max-h-[92vh] flex flex-col"
        contentClassName="flex flex-col max-h-[84vh] overflow-hidden"
      >
        {/* Top Bar */}
        <div className="px-5 py-3.5 border-b border-amber-500/30 bg-[#060c1c]/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm md:text-lg font-black text-amber-200 nastaliq-title">
                {t.skill_tree_title}
              </h2>
              <p className="text-[11px] text-amber-100/75">
                {t.skill_tree_subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 px-3 py-1 rounded-xl text-xs font-bold text-amber-300">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>{t.skill_points_label}</span>
              <span className="font-mono text-sm text-yellow-300 tabular-nums">{progress.skillPoints || 0}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 border border-amber-500/40 px-3 py-1 rounded-xl text-xs font-bold text-amber-300">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{t.gold}:</span>
              <span className="font-mono text-sm text-yellow-300 tabular-nums">{progress.gold.toLocaleString()}</span>
            </div>

            <button
              onClick={() => {
                sound.playSlash(1.2);
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-amber-500/20 border border-amber-500/40 text-amber-200 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Branch Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-[#050a18]/95 border-b border-amber-500/25">
          {branches.map(b => {
            const isSelected = b.id === selectedBranch;
            return (
              <button
                key={b.id}
                onClick={() => {
                  sound.playCoin();
                  setSelectedBranch(b.id);
                  const firstNode = SKILL_NODES.find(n => n.branch === b.id);
                  if (firstNode) setActiveNodeId(firstNode.id);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-r ${b.color} text-white border-amber-300 shadow-lg scale-[1.01]`
                    : 'bg-slate-900/90 text-amber-200/80 border-amber-500/25 hover:border-amber-400/60'
                }`}
              >
                <span>{b.title}</span>
                <span className="text-[10px] opacity-80 font-normal truncate max-w-full">{b.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Skill Tree Nodes Display */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-y-auto flex-1">
          {/* Nodes Visual Path (4 Tiers) */}
          <div className="md:col-span-7 flex flex-col justify-center items-center gap-3.5 py-2 relative">
            <div className="absolute inset-y-6 w-1 bg-gradient-to-b from-amber-500/20 via-amber-400/50 to-amber-500/20 z-0 rounded-full" />

            {nodesInBranch.map(node => {
              const nodeUnlocked = !!unlockedMap[node.id];
              const isCurrent = node.id === activeNodeId;
              const canUnlock = SkillSystem.canUnlock(node.id, progress, lang).can;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    sound.playSlash(1.1);
                    setActiveNodeId(node.id);
                  }}
                  className={`relative z-10 w-full max-w-md p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#1c1307] via-[#0c1938] to-[#1c1307] border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                      : nodeUnlocked
                      ? 'bg-slate-900/90 border-emerald-500/60 hover:border-emerald-400'
                      : canUnlock
                      ? 'bg-slate-900/85 border-amber-500/45 hover:border-amber-400/80'
                      : 'bg-slate-950/85 border-slate-800 opacity-65'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg border-2 shrink-0 ${
                        nodeUnlocked
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                          : isCurrent
                          ? 'bg-amber-500 border-amber-300 text-slate-950'
                          : canUnlock
                          ? 'bg-amber-950 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {nodeUnlocked ? (
                        <CheckCircle className="w-5 h-5 text-emerald-300" />
                      ) : canUnlock ? (
                        <Zap className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-400/30 text-amber-300">
                          {t.skill_tier_label} {node.tier}
                        </span>
                        <h4 className="text-sm font-black text-amber-100">{getNodeName(node)}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                        {getNodeDesc(node)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {nodeUnlocked ? (
                      <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                        {t.skill_unlocked_badge}
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-0.5 font-mono">
                        <span className="text-[10px] text-yellow-300 font-bold">
                          ★ {node.costSkillPoints} {t.skill_points_unit}
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold">
                          🪙 {node.costGold}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Detail & Action Panel */}
          <div className="md:col-span-5 damascus-surface border border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div className="flex flex-col gap-4">
              <div className="border-b border-amber-500/25 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {t.skill_tier_label} {activeNode.tier} • {branches.find(b => b.id === activeNode.branch)?.title}
                  </span>
                  {isUnlocked && (
                    <span className="text-xs text-emerald-300 font-bold flex items-center gap-1 bg-emerald-950/70 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t.skill_unlocked_badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-amber-200 mt-1 nastaliq-title">
                  {getNodeName(activeNode)}
                </h3>
              </div>

              {/* Description */}
              <div className="bg-slate-950/85 border border-amber-500/25 rounded-xl p-3.5">
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {getNodeDesc(activeNode)}
                </p>
              </div>

              {/* Effect Bonus Highlight */}
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-amber-300 font-bold">{t.stats}:</span>
                <span className="text-yellow-300 font-mono font-bold">
                  {formatEffectSummary(activeNode)}
                </span>
              </div>

              {/* Cost requirement badge */}
              {!isUnlocked && (
                <div className="flex items-center justify-between text-xs bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/25">
                  <span className="text-amber-200/80">{t.gold_cost}:</span>
                  <div className="flex items-center gap-3 font-mono font-bold">
                    <span className="text-yellow-300">★ {activeNode.costSkillPoints} {t.skill_points_unit}</span>
                    <span className="text-amber-400">🪙 {activeNode.costGold} {t.gold}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Unlock Button */}
            <div className="mt-5 pt-3 border-t border-amber-500/25">
              {isUnlocked ? (
                <div className="w-full py-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.skill_unlocked_badge}</span>
                </div>
              ) : (
                <button
                  onClick={handleUnlock}
                  disabled={!unlockCheck.can}
                  className={`w-full py-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                    unlockCheck.can
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border border-amber-300 active:scale-95'
                      : 'bg-slate-900 text-slate-500 border border-slate-700 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {unlockCheck.can ? t.skill_unlock_action : unlockCheck.reason}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </ManuscriptFrame>
    </div>
  );
};

