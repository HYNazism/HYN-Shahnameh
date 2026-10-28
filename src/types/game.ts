export type Language = 'fa' | 'en' | 'ar' | 'fr';

export type HeroId = 'rostam' | 'sohrab' | 'gordafarid';

export type GraphicsTier = 'low' | 'medium' | 'high' | 'ultra';

export interface HeroDef {
  id: HeroId;
  nameKey: string;
  titleKey: string;
  descKey: string;
  maxHp: number;
  attackPower: number;
  speed: number;
  jumpForce: number;
  hasDoubleJump?: boolean;
  weaponKey: string;
  specialKey: string;
  specialDescKey: string;
  color: string;
  accentColor: string;
  capeColor: string;
}

export interface WeaponDef {
  id: string;
  nameKey: string;
  descKey: string;
  heroOwner: HeroId | 'all';
  maxLevel: number;
  baseDamage: number;
  damagePerLevel: number;
  baseCostGold: number;
  baseCostGems: number;
  icon: string;
}

export interface SkillDef {
  id: string;
  nameKey: string;
  descKey: string;
  heroOwner: HeroId | 'all';
  costGold: number;
  cooldown: number;
  icon: string;
}

export interface ChapterNarrative {
  title: string;
  couplet: string;
  poet: string;
  fullProse: string;
  battleStartSubtitle: string;
  battleMidSubtitle: string;
  bossConfrontationSubtitle: string;
}

export interface StageDef {
  id: number;
  nameKey: string;
  descKey: string;
  bossNameKey: string;
  goldReward: number;
  gemReward: number;
  bgGradient: [string, string];
  platformColor: string;
  chapterEra: string;
  allowHeroDuelSelect?: boolean;
  dialogueProseKey?: string;
}

export interface DailyQuest {
  id: string;
  titleKey: string;
  descKey: string;
  targetCount: number;
  currentCount: number;
  rewardGold: number;
  rewardGems: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface PlayerStoreItem {
  id: string;
  titleKey: string;
  descKey: string;
  priceUsd: number;
  cryptoPrice: string;
  rewardGold: number;
  rewardGems: number;
  isVipPass?: boolean;
  icon: string;
}

export interface PlayerProgress {
  gold: number;
  gems: number;
  unlockedHeroes: HeroId[];
  selectedHero: HeroId;
  weaponLevels: Record<string, number>;
  unlockedSkills: Record<string, boolean>;
  completedStages: number[];
  currentStage: number;
  isVipBenefactor: boolean;
  donorBadge: string | null;
  highScore: number;
  dailyQuests: DailyQuest[];
  lastDailyResetTimestamp: number;
  totalFinisherCombosLanded: number;
  skillPoints?: number;
  unlockedSkillNodes?: Record<string, boolean>;
  playerLevel?: number;
  playerXp?: number;
  completedChallenges?: Record<string, boolean>;
  equippedPerks?: string[];
  selectedEpisodeId?: number;
}

export interface CreatorWallets {
  usdtTrc20: string;
  usdtBep20: string;
  ton: string;
  eth: string;
  btc: string;
}

export interface TransactionRecord {
  id: string;
  itemTitle: string;
  amountUsd: number;
  cryptoCurrency: string;
  timestamp: string;
  payerWallet: string;
}

export type AdPayoutNetwork = 'ton' | 'usdtTrc20' | 'usdtBep20' | 'eth' | 'btc';

export interface PlayerGeoInfo {
  countryCode: string;
  countryName: string;
  flag: string;
  regionTier: 'tier1' | 'tier2' | 'mena' | 'global';
}

export interface MonetizationState {
  connectedWallet: string | null;
  walletType: 'metamask' | 'ton' | 'tron' | null;
  walletBalance: string;
  creatorVaultBalanceUsd: number;
  adViewsCount: number;
  adRevenueUsd: number;
  adPayoutNetwork: AdPayoutNetwork;
  creatorWallets: CreatorWallets;
  transactions: TransactionRecord[];
}

export type GameView = 'TITLE' | 'PLAYING' | 'DUEL' | 'PAUSED' | 'VICTORY' | 'GAME_OVER' | 'ARMORY' | 'CRYPTO' | 'REWARDED_AD' | 'DEV_DASHBOARD' | 'DAILY_QUESTS' | 'STORE';

export interface TouchControlSettings {
  opacity: number; // 0.2 to 1.0
  scale: 'compact' | 'normal' | 'large';
  layout: 'right-handed' | 'left-handed';
  mode: 'floating' | 'fixed';
  verticalOffset: number; // 0 to 60 px from bottom
  hapticFeedback: boolean;
}

