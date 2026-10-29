/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  GameView,
  HeroId,
  Language,
  GraphicsTier,
  PlayerProgress,
  PlayerAlignment,
  MonetizationState,
  PlayerStoreItem,
} from './types/game';
import { HEROES, STAGES, DEFAULT_DAILY_QUESTS } from './constants/gameData';
import { TRANSLATIONS } from './constants/translations';
import {
  loadProgress,
  saveProgress,
  loadMonetization,
  saveMonetization,
  loadLanguage,
  saveLanguage,
  loadGraphicsTier,
  saveGraphicsTier,
} from './utils/storage';
import { CryptoAdCampaign } from './utils/cryptoAdEngine';
import { TitleScreen } from './components/TitleScreen';
import { GameCanvas } from './components/GameCanvas';
import { ArmoryModal } from './components/ArmoryModal';
import { CryptoModal } from './components/CryptoModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { DevDashboardModal } from './components/DevDashboardModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { PlayerStoreModal } from './components/PlayerStoreModal';
import { StoryPrologueModal } from './components/StoryPrologueModal';
import { DuelArena } from './components/DuelArena';
import { EpisodeSelector } from './components/EpisodeSelector';
import { SkillTreeModal } from './components/SkillTreeModal';
import { NaqqalNarrator } from './components/NaqqalNarrator';
import { GitHubReleasesModal } from './components/GitHubReleasesModal';
import { EpisodeData } from './types';
import { SkillSystem } from './game/SkillSystem';
import { StoryLogicManager } from './game/StoryLogicManager';
import { EPISODES_DATA } from './constants/gameData';
import { Trophy, Skull, Sparkles, RefreshCw, ArrowRight, Video, X } from 'lucide-react';
import { sound } from './utils/audio';
import { ManuscriptFrame } from './components/ShahnamehManuscriptFrame';

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadLanguage());
  const [view, setView] = useState<GameView>('TITLE');
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const loaded = loadProgress();
    // Ensure daily quests are populated
    if (!loaded.dailyQuests || loaded.dailyQuests.length === 0) {
      loaded.dailyQuests = DEFAULT_DAILY_QUESTS;
    }
    return loaded;
  });
  const [monetization, setMonetization] = useState<MonetizationState>(() => loadMonetization());

  // End of run stats
  const [lastRunStats, setLastRunStats] = useState<{
    score: number;
    gold: number;
    gems: number;
    stageId: number;
  }>({ score: 0, gold: 0, gems: 0, stageId: 1 });

  // Modals state
  const [showArmory, setShowArmory] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [showDevDashboard, setShowDevDashboard] = useState(false);
  const [showDailyQuests, setShowDailyQuests] = useState(false);
  const [showPlayerStore, setShowPlayerStore] = useState(false);
  const [showStoryPrologue, setShowStoryPrologue] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showReleases, setShowReleases] = useState(false);
  const [activeNaqqalEpisode, setActiveNaqqalEpisode] = useState<EpisodeData | null>(null);
  const [adForRespawn, setAdForRespawn] = useState(false);
  const [duelOpponentId, setDuelOpponentId] = useState<string | undefined>(undefined);

  // Graphics Quality Tier state (persisted & auto-detected)
  const [graphicsTier, setGraphicsTier] = useState<GraphicsTier>(() => loadGraphicsTier());

  // Sync RTL / LTR document direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'fa' || lang === 'ar') ? 'rtl' : 'ltr';
  }, [lang]);

  // Daily Quests 24-Hour Reset Check
  useEffect(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - progress.lastDailyResetTimestamp > oneDay) {
      setProgress(prev => ({
        ...prev,
        dailyQuests: DEFAULT_DAILY_QUESTS,
        lastDailyResetTimestamp: now,
      }));
    }
  }, [progress.lastDailyResetTimestamp]);

  // Persist storage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveMonetization(monetization);
  }, [monetization]);

  const t = TRANSLATIONS[lang];

  const handleSelectLang = (newLang: Language) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  const handleSelectGraphicsTier = (tier: GraphicsTier) => {
    setGraphicsTier(tier);
    saveGraphicsTier(tier);
  };

  const handleSelectHero = (heroId: HeroId) => {
    setProgress(prev => ({ ...prev, selectedHero: heroId }));
  };

  const handleSelectAlignment = (alignment: PlayerAlignment) => {
    setProgress(prev => ({
      ...prev,
      alignment,
      hasChosenAlignment: true,
    }));
  };

  const handleSelectStage = (stageId: number) => {
    setProgress(prev => ({ ...prev, currentStage: stageId }));
  };

  const handleStartGame = () => {
    setShowStoryPrologue(true);
  };

  // Upgrades
  const handleUpgradeWeapon = (weaponId: string, costGold: number, costGems: number) => {
    setProgress(prev => ({
      ...prev,
      gold: prev.gold - costGold,
      gems: prev.gems - costGems,
      weaponLevels: {
        ...prev.weaponLevels,
        [weaponId]: (prev.weaponLevels[weaponId] || 0) + 1,
      },
    }));
  };

  const handleUnlockSkill = (skillId: string, costGold: number) => {
    setProgress(prev => ({
      ...prev,
      gold: prev.gold - costGold,
      unlockedSkills: {
        ...prev.unlockedSkills,
        [skillId]: true,
      },
    }));
  };

  // Web3 Wallet
  const handleConnectWallet = (type: 'metamask' | 'ton' | 'tron') => {
    const mockAddr =
      type === 'metamask'
        ? '0x7Ab...7E9A'
        : type === 'ton'
        ? 'UQDR4...6svK'
        : 'TEZgr...FrL';
    setMonetization(prev => ({
      ...prev,
      connectedWallet: mockAddr,
      walletType: type,
      walletBalance: '150.00',
    }));
    sound.playVictory();
  };

  const handleDisconnectWallet = () => {
    setMonetization(prev => ({
      ...prev,
      connectedWallet: null,
      walletType: null,
      walletBalance: '0.00',
    }));
  };

  // Player Store In-App Purchases (AUTOMATICALLY CREDITED TO CREATOR REVENUE VAULT)
  const handlePurchaseStoreItem = (item: PlayerStoreItem, paymentNetwork: string) => {
    // 1. Deliver items to player
    setProgress(prev => ({
      ...prev,
      gold: prev.gold + item.rewardGold,
      gems: prev.gems + item.rewardGems,
      isVipBenefactor: item.isVipPass ? true : prev.isVipBenefactor,
    }));

    // 2. Direct Auto-Deposit of purchase price to Creator's Revenue Vault!
    const newTx = {
      id: `tx_${Date.now()}`,
      itemTitle: t[item.titleKey] || item.titleKey,
      amountUsd: item.priceUsd,
      cryptoCurrency: paymentNetwork,
      timestamp: 'Now',
      payerWallet: monetization.connectedWallet || 'T9x...4Lm9',
    };

    setMonetization(prev => ({
      ...prev,
      creatorVaultBalanceUsd: prev.creatorVaultBalanceUsd + item.priceUsd,
      transactions: [newTx, ...prev.transactions].slice(0, 15),
    }));
  };

  // Direct Tip Donation
  const handleSendTipDonation = (amountUsd: number, network: string) => {
    const newTx = {
      id: `tx_tip_${Date.now()}`,
      itemTitle: t.vip_royal_patron,
      amountUsd,
      cryptoCurrency: network,
      timestamp: 'Now',
      payerWallet: monetization.connectedWallet || 'T9x...4Lm9',
    };

    setMonetization(prev => ({
      ...prev,
      creatorVaultBalanceUsd: prev.creatorVaultBalanceUsd + amountUsd,
      transactions: [newTx, ...prev.transactions].slice(0, 15),
    }));

    setProgress(prev => ({
      ...prev,
      gold: prev.gold + 1000,
      gems: prev.gems + 50,
      isVipBenefactor: true,
      donorBadge: `${t.vip_royal_patron} (${network})`,
    }));
  };

  // Rewarded Ad claim with Crypto Auto-Payout into Creator's Wallet
  const handleAdRewardClaimed = (gold: number, gems: number, campaign?: CryptoAdCampaign) => {
    setProgress(prev => ({
      ...prev,
      gold: prev.gold + gold,
      gems: prev.gems + gems,
    }));

    const rewardUsd = campaign?.rewardValueUsd || 0.045;
    const currency = campaign?.payoutCurrency || 'TON';
    const network = campaign?.payoutNetworkKey || monetization.adPayoutNetwork || 'ton';
    const recipient = monetization.creatorWallets[network] || monetization.creatorWallets.ton;

    const newTx = {
      id: `tx_ad_${Date.now()}`,
      itemTitle: `${campaign?.networkName || 'TON Ads'}`,
      amountUsd: rewardUsd,
      cryptoCurrency: `${currency} (${network.toUpperCase()})`,
      timestamp: 'Now',
      payerWallet: recipient,
    };

    setMonetization(prev => ({
      ...prev,
      adViewsCount: prev.adViewsCount + 1,
      adRevenueUsd: prev.adRevenueUsd + rewardUsd,
      transactions: [newTx, ...prev.transactions].slice(0, 15),
    }));
  };

  // Creator Withdraws Funds
  const handleWithdrawFunds = () => {
    setMonetization(prev => ({
      ...prev,
      creatorVaultBalanceUsd: 0,
      adRevenueUsd: 0,
    }));
  };

  // Daily Quests Claiming
  const handleClaimDailyQuest = (questId: string) => {
    const quest = progress.dailyQuests.find(q => q.id === questId);
    if (!quest || quest.isClaimed) return;

    setProgress(prev => ({
      ...prev,
      gold: prev.gold + quest.rewardGold * 2, // Double Rewards!
      gems: prev.gems + quest.rewardGems * 2,
      dailyQuests: prev.dailyQuests.map(q => q.id === questId ? { ...q, isClaimed: true } : q),
    }));
  };

  // Combo finisher callback to advance daily quest 1
  const handleFinisherLanded = useCallback(() => {
    setProgress(prev => {
      const updatedQuests = prev.dailyQuests.map(q => {
        if (q.id === 'daily_combo_finisher' && !q.isCompleted) {
          const nextCount = q.currentCount + 1;
          return {
            ...q,
            currentCount: nextCount,
            isCompleted: nextCount >= q.targetCount,
          };
        }
        return q;
      });

      return {
        ...prev,
        totalFinisherCombosLanded: prev.totalFinisherCombosLanded + 1,
        dailyQuests: updatedQuests,
      };
    });
  }, []);

  // Run outcomes
  const handleGameOver = useCallback((score: number, runGold: number, runGems: number) => {
    setLastRunStats(prev => ({
      score,
      gold: runGold,
      gems: runGems,
      stageId: prev.stageId,
    }));
    setProgress(prev => ({
      ...prev,
      gold: prev.gold + runGold,
      gems: prev.gems + runGems,
      highScore: Math.max(prev.highScore, score),
    }));
    setView('GAME_OVER');
  }, []);

  const handleVictory = useCallback((score: number, runGold: number, runGems: number) => {
    setLastRunStats(prev => ({
      score,
      gold: runGold,
      gems: runGems,
      stageId: prev.stageId,
    }));

    setProgress(prev => {
      const completed = prev.completedStages.includes(prev.currentStage)
        ? prev.completedStages
        : [...prev.completedStages, prev.currentStage];

      // Update boss slayer and score quests
      const updatedQuests = prev.dailyQuests.map(q => {
        if (q.id === 'daily_boss_slayer' && !q.isCompleted) {
          const nextCount = q.currentCount + 1;
          return { ...q, currentCount: nextCount, isCompleted: nextCount >= q.targetCount };
        }
        if (q.id === 'daily_score_champion' && !q.isCompleted) {
          const nextScore = Math.max(q.currentCount, score);
          return { ...q, currentCount: nextScore, isCompleted: nextScore >= q.targetCount };
        }
        return q;
      });

      return {
        ...prev,
        gold: prev.gold + runGold,
        gems: prev.gems + runGems,
        completedStages: completed,
        highScore: Math.max(prev.highScore, score),
        dailyQuests: updatedQuests,
      };
    });
    setView('VICTORY');
  }, []);

  const currentAlignment: PlayerAlignment = progress.alignment || 'good';
  const selectedStage = STAGES.find(s => s.id === progress.currentStage) || STAGES[0];
  const stageProfile = StoryLogicManager.getStageProfile(selectedStage.id, currentAlignment, lang);
  const assignedBaseHero = HEROES.find(h => h.id === stageProfile.heroConfig.heroRenderId) || HEROES[0];

  const skillBonuses = SkillSystem.getAggregatedBonuses(progress);

  // Shared weapon upgrade bonus across all stage-assigned characters
  const maceLvl = progress.weaponLevels['weapon_mace'] || 1;
  const scimitarLvl = progress.weaponLevels['weapon_scimitar'] || 1;
  const bowLvl = progress.weaponLevels['weapon_bow'] || 1;
  const sharedWeaponLvl = Math.max(maceLvl, scimitarLvl, bowLvl);
  const weaponBonusDamage = sharedWeaponLvl * 8 + skillBonuses.bonusAttack;

  const armorLvl = progress.weaponLevels['weapon_armor'] || 0;
  const armorDamageReduction = Math.min(0.65, armorLvl * 0.08 + skillBonuses.bonusDefense / 100);

  const bootsLvl = progress.weaponLevels['weapon_boots'] || 0;
  const hasSimurghBoots = bootsLvl >= 1 || skillBonuses.bonusSpeed > 0;
  const hasSimurghFeather = !!skillBonuses.activePerks['simurgh_revive'];

  const battleHero = {
    ...assignedBaseHero,
    maxHp: assignedBaseHero.maxHp + skillBonuses.bonusHp,
    color: stageProfile.heroConfig.color,
    accentColor: stageProfile.heroConfig.accentColor,
    customDisplayName: stageProfile.heroConfig.heroName,
    customTitle: stageProfile.heroConfig.heroTitle,
    customWeaponName: stageProfile.heroConfig.weaponName,
    customSpecialName: stageProfile.heroConfig.specialName,
  };

  const isRtl = lang === 'fa' || lang === 'ar';
  const activeNaqqalProfile = activeNaqqalEpisode
    ? StoryLogicManager.getStageProfile(activeNaqqalEpisode.id, currentAlignment, lang)
    : null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full h-[100dvh] overflow-hidden bg-[#050811] text-slate-100 flex flex-col font-sans select-none"
    >
      {view === 'TITLE' && (
        <TitleScreen
          selectedHeroId={assignedBaseHero.id}
          onSelectHero={handleSelectHero}
          alignment={currentAlignment}
          onSelectAlignment={handleSelectAlignment}
          selectedStageId={progress.currentStage}
          onSelectStage={handleSelectStage}
          graphicsTier={graphicsTier}
          onSelectGraphicsTier={handleSelectGraphicsTier}
          progress={progress}
          lang={lang}
          onSelectLang={handleSelectLang}
          onStartGame={handleStartGame}
          onOpenArmory={() => setShowArmory(true)}
          onOpenDuel={() => setView('DUEL')}
          onOpenCrypto={() => setShowCrypto(true)}
          onOpenRewardedAd={() => {
            setAdForRespawn(false);
            setShowRewardedAd(true);
          }}
          onOpenDevDashboard={() => setShowDevDashboard(true)}
          onOpenDailyQuests={() => setShowDailyQuests(true)}
          onOpenPlayerStore={() => setShowPlayerStore(true)}
          onOpenEpisodes={() => setShowEpisodes(true)}
          onOpenSkillTree={() => setShowSkillTree(true)}
          onOpenReleases={() => setShowReleases(true)}
        />
      )}

      {view === 'DUEL' && (
        <DuelArena
          playerHeroId={assignedBaseHero.id}
          playerHeroRenderId={stageProfile.heroConfig.heroRenderId}
          playerCustomName={stageProfile.heroConfig.heroName}
          playerCustomTitle={stageProfile.heroConfig.heroTitle}
          graphicsTier={graphicsTier}
          lang={lang}
          initialOpponentId={duelOpponentId}
          onExit={() => {
            setDuelOpponentId(undefined);
            setView('TITLE');
          }}
          onVictoryReward={(gold, gems) => {
            setProgress(prev => ({
              ...prev,
              gold: prev.gold + gold,
              gems: prev.gems + gems,
              skillPoints: (prev.skillPoints || 0) + 1,
            }));
          }}
        />
      )}

      {view === 'PLAYING' && (
        <GameCanvas
          hero={battleHero}
          stage={selectedStage}
          alignment={currentAlignment}
          graphicsTier={graphicsTier}
          onSelectGraphicsTier={handleSelectGraphicsTier}
          weaponBonusDamage={weaponBonusDamage}
          armorDamageReduction={armorDamageReduction}
          hasSimurghBoots={hasSimurghBoots}
          hasSimurghFeather={hasSimurghFeather}
          lang={lang}
          onGameOver={handleGameOver}
          onVictory={handleVictory}
          onReturnToMenu={() => setView('TITLE')}
          onFinisherLanded={handleFinisherLanded}
          onStartBossDuel={(bossId) => {
            setDuelOpponentId(bossId);
            setView('DUEL');
          }}
        />
      )}

      {/* Victory Screen Modal */}
      {view === 'VICTORY' && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <ManuscriptFrame
            variant="lapis"
            showSarloh={true}
            sarlohTitle={t.victory}
            sarlohSubtitle={`${stageProfile.chapterTitle} — ${t.conquered_label}!`}
            className="max-w-md w-full text-center"
            contentClassName="p-6 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl shadow-xl border-2 border-yellow-200">
              🏆
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-amber-300 nastaliq-title">
                {t.victory}
              </h2>
              <p className="text-xs text-amber-100/80 mt-1">
                {stageProfile.chapterTitle} — {t.conquered_label}!
              </p>
            </div>

            <div className="w-full damascus-surface border border-amber-500/40 rounded-xl p-4 flex justify-around">
              <div className="text-center">
                <span className="text-[11px] text-amber-200/75 block">{t.gold}</span>
                <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                  +{lastRunStats.gold} 🪙
                </span>
              </div>
              <div className="text-center border-x border-amber-500/25 px-4">
                <span className="text-[11px] text-amber-200/75 block">{t.gems}</span>
                <span className="text-lg font-bold text-sky-400 font-mono tabular-nums">
                  +{lastRunStats.gems} 💎
                </span>
              </div>
              <div className="text-center">
                <span className="text-[11px] text-amber-200/75 block">{t.score}</span>
                <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  {lastRunStats.score}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button
                onClick={() => {
                  setAdForRespawn(false);
                  setShowRewardedAd(true);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs md:text-sm rounded-xl transition-transform active:scale-98 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4 fill-slate-950" />
                <span>{t.watch_ad_reward}</span>
              </button>

              {progress.currentStage < 7 && (
                <button
                  onClick={() => {
                    setProgress(prev => ({ ...prev, currentStage: prev.currentStage + 1 }));
                    setShowStoryPrologue(true);
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-xs md:text-sm rounded-xl transition-transform active:scale-98 cursor-pointer shadow-md flex items-center justify-center gap-2 border border-amber-200"
                >
                  <span>
                    {t.next_stage}: {StoryLogicManager.getStageProfile(progress.currentStage + 1, currentAlignment, lang).chapterTitle}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}

              <button
                onClick={() => setView('TITLE')}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t.return_to_menu}
              </button>
            </div>
          </ManuscriptFrame>
        </div>
      )}

      {/* Defeat Screen Modal */}
      {view === 'GAME_OVER' && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <ManuscriptFrame
            variant="crimson"
            showSarloh={true}
            sarlohTitle={t.defeat}
            sarlohSubtitle={stageProfile.chapterTitle}
            className="max-w-md w-full text-center"
            contentClassName="p-6 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500/60 flex items-center justify-center text-3xl shadow-xl">
              <Skull className="w-9 h-9 text-red-400" />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-red-400 nastaliq-title">
                {t.defeat}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {t.defeat_encouragement}
              </p>
            </div>

            <div className="w-full damascus-surface border border-rose-500/40 rounded-xl p-3 flex justify-around text-xs">
              <div>
                <span className="text-slate-400 block">{t.gold}:</span>
                <span className="text-amber-400 font-mono font-bold">+{lastRunStats.gold} 🪙</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.score}:</span>
                <span className="text-slate-200 font-mono font-bold">{lastRunStats.score}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button
                onClick={() => {
                  setAdForRespawn(true);
                  setShowRewardedAd(true);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-xs md:text-sm rounded-xl transition-transform active:scale-98 cursor-pointer shadow-lg flex items-center justify-center gap-2 border border-amber-200"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{t.respawn_with_ad}</span>
              </button>

              <button
                onClick={() => setView('PLAYING')}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.restart_stage}</span>
              </button>

              <button
                onClick={() => setView('TITLE')}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-slate-400 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t.return_to_menu}
              </button>
            </div>
          </ManuscriptFrame>
        </div>
      )}

      {/* Armory Modal */}
      {showArmory && (
        <ArmoryModal
          progress={progress}
          lang={lang}
          onClose={() => setShowArmory(false)}
          onUpgradeWeapon={handleUpgradeWeapon}
          onUnlockSkill={handleUnlockSkill}
        />
      )}

      {/* Crypto & Web3 Modal */}
      {showCrypto && (
        <CryptoModal
          monetization={monetization}
          lang={lang}
          onClose={() => setShowCrypto(false)}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
          onSendTipDonation={handleSendTipDonation}
        />
      )}

      {/* Rewarded Ads Modal */}
      {showRewardedAd && (
        <RewardedAdModal
          lang={lang}
          monetization={monetization}
          isRespawn={adForRespawn}
          onClose={() => setShowRewardedAd(false)}
          onRewardClaimed={(g, gm, campaign) => {
            handleAdRewardClaimed(g, gm, campaign);
            if (adForRespawn && view === 'GAME_OVER') {
              setView('PLAYING');
            }
          }}
        />
      )}

      {/* Developer Auto-Deposit Revenue Hub Modal */}
      {showDevDashboard && (
        <DevDashboardModal
          monetization={monetization}
          lang={lang}
          onClose={() => setShowDevDashboard(false)}
          onSaveSettings={updated => setMonetization(updated)}
          onWithdrawFunds={handleWithdrawFunds}
        />
      )}

      {/* GitHub Multi-Platform Releases Modal */}
      {showReleases && (
        <GitHubReleasesModal
          lang={lang}
          onClose={() => setShowReleases(false)}
        />
      )}

      {/* 24-Hour Daily Quests Hub Modal */}
      {showDailyQuests && (
        <DailyQuestsModal
          quests={progress.dailyQuests}
          lastResetTimestamp={progress.lastDailyResetTimestamp}
          lang={lang}
          onClose={() => setShowDailyQuests(false)}
          onClaimQuest={handleClaimDailyQuest}
          onStartDailyChallenge={() => {
            setShowDailyQuests(false);
            setView('PLAYING');
          }}
        />
      )}

      {/* Player In-App Store (Purchases Auto-Deposit to Creator) */}
      {showPlayerStore && (
        <PlayerStoreModal
          lang={lang}
          onClose={() => setShowPlayerStore(false)}
          onPurchaseItem={handlePurchaseStoreItem}
        />
      )}

      {/* Story Naqqali Illustrated Prologue Curtain Modal */}
      {showStoryPrologue && (
        <StoryPrologueModal
          stage={selectedStage}
          alignment={currentAlignment}
          lang={lang}
          onClose={() => setShowStoryPrologue(false)}
          onStartBattle={() => {
            setShowStoryPrologue(false);
            setView('PLAYING');
          }}
        />
      )}

      {/* Seven Labors Episodic Roadmap Modal */}
      {showEpisodes && (
        <EpisodeSelector
          selectedEpisodeId={progress.selectedEpisodeId || progress.currentStage}
          highScore={progress.highScore}
          completedEpisodes={progress.completedStages}
          lang={lang}
          alignment={currentAlignment}
          onSelectEpisode={(ep) => {
            setProgress(prev => ({
              ...prev,
              selectedEpisodeId: ep.id,
              currentStage: ep.id,
            }));
          }}
          onStartEpisode={(ep) => {
            setProgress(prev => ({
              ...prev,
              selectedEpisodeId: ep.id,
              currentStage: ep.id,
            }));
            setShowEpisodes(false);
            setView('PLAYING');
          }}
          onOpenNaqqal={(ep) => {
            setActiveNaqqalEpisode(ep);
          }}
          onBack={() => setShowEpisodes(false)}
        />
      )}

      {/* Mythic Skill Tree Modal */}
      {showSkillTree && (
        <SkillTreeModal
          progress={progress}
          lang={lang}
          onUpdateProgress={(newProgress) => setProgress(newProgress)}
          onClose={() => setShowSkillTree(false)}
        />
      )}

      {/* Active Naqqal Perde-khani Recitation Modal */}
      {activeNaqqalEpisode && activeNaqqalProfile && (
        <div className="fixed inset-0 z-50 bg-[#060913]/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <ManuscriptFrame
            variant="lapis"
            showSarloh={true}
            sarlohTitle={activeNaqqalProfile.chapterTitle}
            sarlohSubtitle={`${t.chapter_label} ${activeNaqqalEpisode.khanNumber} / 7`}
            className="w-full max-w-2xl"
            contentClassName="p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  {t.chapter_label} {activeNaqqalEpisode.khanNumber} / 7
                </span>
                <h3 className="text-base font-black text-amber-200 nastaliq-title">
                  {activeNaqqalProfile.chapterTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveNaqqalEpisode(null)}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-200 hover:bg-amber-500/20 flex items-center justify-center cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <NaqqalNarrator
              title={activeNaqqalProfile.chapterTitle}
              couplet={activeNaqqalProfile.prologueCouplet}
              poet={activeNaqqalProfile.prologuePoet}
              fullProse={activeNaqqalProfile.prologueProse}
              lang={lang}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setProgress(prev => ({
                    ...prev,
                    selectedEpisodeId: activeNaqqalEpisode.id,
                    currentStage: activeNaqqalEpisode.id,
                  }));
                  setActiveNaqqalEpisode(null);
                  setShowEpisodes(false);
                  setView('PLAYING');
                }}
                className="py-2.5 px-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer active:scale-95 transition-all border border-amber-200"
              >
                {t.episodes_start_btn}
              </button>
            </div>
          </ManuscriptFrame>
        </div>
      )}
    </div>
  );
}
