import React, { useState } from 'react';
import { PlayerProgress, SkillBranch } from '../types';
import { SKILL_NODES, SkillSystem } from '../game/SkillSystem';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Zap,
  Shield,
  Heart,
  Hammer,
  Flame,
  Sun,
  ShieldAlert,
  Wind,
  ChevronRight,
  Crosshair,
  ShieldCheck,
  Activity,
  Award,
  Coins,
  CheckCircle,
  Lock,
  X,
} from 'lucide-react';

interface Props {
  progress: PlayerProgress;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onClose: () => void;
}

const BRANCHES: { id: SkillBranch; titleFa: string; titleEn: string; icon: string; color: string }[] = [
  { id: 'delavari', titleFa: 'دلاوری و زور پیلتن', titleEn: 'Valor & Combos', icon: 'Hammer', color: 'from-amber-600 to-rose-700' },
  { id: 'afsoon', titleFa: 'افسون و فرّ کیانی', titleEn: 'Divine Light & Simurgh', icon: 'Sun', color: 'from-yellow-500 to-amber-700' },
  { id: 'chalaki', titleFa: 'چالاکی و دفع تیغ (پری)', titleEn: 'Agility & Parry', icon: 'Wind', color: 'from-sky-600 to-indigo-800' },
  { id: 'paydari', titleFa: 'پایداری و ببر بیان', titleEn: 'Fortitude & Armor', icon: 'ShieldCheck', color: 'from-emerald-600 to-teal-800' },
];

export const SkillTreeModal: React.FC<Props> = ({
  progress,
  onUpdateProgress,
  onClose,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<SkillBranch>('delavari');
  const [activeNodeId, setActiveNodeId] = useState<string>('delavari_1');

  const nodesInBranch = SKILL_NODES.filter(n => n.branch === selectedBranch);
  const activeNode = SKILL_NODES.find(n => n.id === activeNodeId) || nodesInBranch[0];
  const unlockedMap = progress.unlockedSkillNodes || {};
  const isUnlocked = !!unlockedMap[activeNode.id];
  const unlockCheck = SkillSystem.canUnlock(activeNode.id, progress);

  const handleUnlock = () => {
    const updated = SkillSystem.unlockNode(activeNode.id, progress);
    if (updated) {
      sound.playParrySuccess();
      sound.playComboFinisher();
      onUpdateProgress(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14]/95 backdrop-blur-md flex items-center justify-center p-3 md:p-6 select-none text-slate-100">
      <div className="w-full max-w-5xl bg-gradient-to-b from-[#131a2b] to-[#0a0e19] border-2 border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-black text-amber-200">
                درخت مهارت‌های اساطیری پهلوان (فَرّ و هنرهای باستانی)
              </h2>
              <p className="text-xs text-amber-300/70">
                شاخه دلاوری، پر سیمرغ، پری برق‌آسا و جوشن ببر بیان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-500/50 px-3 py-1 rounded-xl text-xs font-bold text-amber-300">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>امتیاز مهارت:</span>
              <span className="font-mono text-sm text-yellow-300">{progress.skillPoints || 0}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-3 py-1 rounded-xl text-xs font-bold text-amber-300">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>زر کیانی:</span>
              <span className="font-mono text-sm text-yellow-300">{progress.gold}</span>
            </div>

            <button
              onClick={() => {
                sound.playSlash(1.2);
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Branch Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-slate-950/80 border-b border-slate-800">
          {BRANCHES.map(b => {
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
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-r ${b.color} text-white border-amber-400 shadow-lg scale-[1.02]`
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{b.titleFa}</span>
              </button>
            );
          })}
        </div>

        {/* Skill Tree Nodes Display */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-y-auto flex-1">
          {/* Nodes Visual Path (4 Tiers) */}
          <div className="md:col-span-7 flex flex-col justify-center items-center gap-4 py-4 relative">
            <div className="absolute inset-y-8 w-1 bg-gradient-to-b from-amber-500/20 via-amber-500/40 to-amber-500/20 z-0 rounded-full" />

            {nodesInBranch.map((node, index) => {
              const nodeUnlocked = !!unlockedMap[node.id];
              const isCurrent = node.id === activeNodeId;
              const canUnlock = SkillSystem.canUnlock(node.id, progress).can;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    sound.playSlash(1.1);
                    setActiveNodeId(node.id);
                  }}
                  className={`relative z-10 w-full max-w-md p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/80 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                      : nodeUnlocked
                      ? 'bg-slate-900/90 border-emerald-500/60 hover:border-emerald-400'
                      : canUnlock
                      ? 'bg-slate-900/80 border-amber-500/40 hover:border-amber-400/80 animate-pulse'
                      : 'bg-slate-950/80 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${
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
                        <CheckCircle className="w-6 h-6 text-emerald-300" />
                      ) : canUnlock ? (
                        <Zap className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                          سطح {node.tier}
                        </span>
                        <h4 className="text-sm font-black text-slate-100">{node.nameFa}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {node.descFa}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {nodeUnlocked ? (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                        فعال
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px] text-yellow-300 font-bold font-mono">
                          ★ {node.costSkillPoints} مهارت
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold font-mono">
                          🪙 {node.costGold} زر
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Detail & Action Panel */}
          <div className="md:col-span-5 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    سطح {activeNode.tier} • شاخه {BRANCHES.find(b => b.id === activeNode.branch)?.titleFa}
                  </span>
                  {isUnlocked && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      فراگرفته شده
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-amber-200 mt-1">
                  {activeNode.nameFa}
                </h3>
                <span className="text-[11px] text-slate-400 italic font-sans block">
                  {activeNode.nameEn}
                </span>
              </div>

              {/* Description */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {activeNode.descFa}
                </p>
              </div>

              {/* Effect Bonus Highlight */}
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-amber-300 font-bold">اثر دائمی در رزم:</span>
                <span className="text-yellow-300 font-mono font-bold">
                  {activeNode.effects.stat === 'attack' && `+${activeNode.effects.value} به توان تهاجمی`}
                  {activeNode.effects.stat === 'hp' && `+${activeNode.effects.value} حداکثر جان`}
                  {activeNode.effects.stat === 'speed' && `+${activeNode.effects.value} سرعت تاخت`}
                  {activeNode.effects.stat === 'defense' && `+${activeNode.effects.value} مقاومت زره`}
                  {activeNode.effects.stat === 'critChance' && `+${Math.round(activeNode.effects.value * 100)}% شانس ضربه مهلک`}
                  {activeNode.effects.stat === 'parryWindow' && `+${activeNode.effects.value}ms پنجره دفع تیغ`}
                  {activeNode.effects.stat === 'rageGain' && `+${activeNode.effects.value}% شارژ فرّه`}
                  {activeNode.effects.isSpecialPerk && 'قابلیت اسطوره‌ای ویژه'}
                </span>
              </div>

              {/* Cost requirement badge */}
              {!isUnlocked && (
                <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">هزینه بازگشایی:</span>
                  <div className="flex items-center gap-3 font-mono font-bold">
                    <span className="text-yellow-300">★ {activeNode.costSkillPoints} مهارت</span>
                    <span className="text-amber-400">🪙 {activeNode.costGold} زر</span>
                  </div>
                </div>
              )}
            </div>

            {/* Unlock Button */}
            <div className="mt-5 pt-3 border-t border-slate-800">
              {isUnlocked ? (
                <div className="w-full py-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  این مهارت در وجود پهلوان ریشه دوانده است
                </div>
              ) : (
                <button
                  onClick={handleUnlock}
                  disabled={!unlockCheck.can}
                  className={`w-full py-3 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                    unlockCheck.can
                      ? 'bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 border border-amber-300 active:scale-95'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {unlockCheck.can
                      ? 'فراگیری و بازگشایی مهارت'
                      : unlockCheck.reason || 'شرایط لازم فراهم نیست'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
