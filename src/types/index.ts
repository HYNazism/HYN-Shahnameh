// Comprehensive TypeScript definitions for Razmnameh: Shahnameh Epic Game
export * from './game';

export type CombatMoveType = 
  | 'idle' 
  | 'run' 
  | 'jump' 
  | 'fall'
  | 'light1' 
  | 'light2' 
  | 'light3_finisher' 
  | 'heavy_launcher' 
  | 'down_smash' 
  | 'dash_strike' 
  | 'parry' 
  | 'block' 
  | 'stagger' 
  | 'knockdown' 
  | 'super_farreh';

export type SkillBranch = 'delavari' | 'afsoon' | 'chalaki' | 'paydari';

export interface SkillNode {
  id: string;
  branch: SkillBranch;
  nameFa: string;
  nameEn: string;
  descFa: string;
  descEn: string;
  icon: string;
  tier: number; // 1 to 4
  costSkillPoints: number;
  costGold: number;
  prerequisiteId?: string;
  effects: {
    stat?: 'attack' | 'hp' | 'speed' | 'critChance' | 'parryWindow' | 'rageGain' | 'armor' | 'defense';
    value: number; // e.g. +15 attack or +10%
    isSpecialPerk?: boolean;
    perkCode?: 'rakhsh_charge' | 'simurgh_revive' | 'flaming_mace' | 'perfect_parry_stun' | 'babre_bayan_thorns' | 'arrow_rain';
  };
}

export interface EpisodeChallenge {
  id: string;
  titleFa: string;
  descFa: string;
  targetCount: number;
  currentCount: number;
  type: 'combo' | 'parry' | 'no_damage' | 'kill_count' | 'time_trial';
  rewardSkillPoints: number;
  rewardGold: number;
  isCompleted: boolean;
}

export interface EpisodeData {
  id: number;
  khanNumber?: number; // 1 to 7 for Rostam's Seven Labors, or 8+ for Sagas
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  locationFa: string;
  locationEn: string;
  bossId: string;
  bossNameFa: string;
  bossTitleFa: string;
  couplet: string;
  narrativeFa: string;
  bgTheme: 'desert' | 'forest' | 'cave' | 'volcano' | 'mountain' | 'fortress' | 'palace';
  unlockRequirementScore: number;
  challenges: EpisodeChallenge[];
  recommendedPower: number;
  icon: string;
}

export interface PlayerRPGStats {
  skillPoints: number;
  unlockedSkillNodes: Record<string, boolean>;
  level: number;
  xp: number;
  xpForNextLevel: number;
  baseStats: {
    attack: number;
    hp: number;
    defense: number;
    speed: number;
    critChance: number; // 0 to 1
    parryWindowMs: number; // e.g. 240ms default
  };
  equippedPerks: string[];
}
