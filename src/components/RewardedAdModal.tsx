import React, { useState, useEffect } from 'react';
import { Language, MonetizationState } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import {
  Video,
  Award,
  CheckCircle2,
  Sparkles,
  X,
  Globe2,
  Wallet,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../utils/audio';
import {
  detectPlayerGeo,
  getTargetedCryptoAds,
  CryptoAdCampaign,
  getExplorerUrl,
} from '../utils/cryptoAdEngine';

interface Props {
  lang: Language;
  monetization: MonetizationState;
  onClose: () => void;
  onRewardClaimed: (gold: number, gems: number, campaign: CryptoAdCampaign) => void;
  isRespawn?: boolean;
}

export const RewardedAdModal: React.FC<Props> = ({
  lang,
  monetization,
  onClose,
  onRewardClaimed,
  isRespawn = false,
}) => {
  const t = TRANSLATIONS[lang];
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [activeCampaign, setActiveCampaign] = useState<CryptoAdCampaign | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<CryptoAdCampaign[]>([]);
  const [geoString, setGeoString] = useState<string>('🇮🇷 ایران (شناسایی خودکار)');

  useEffect(() => {
    let isMounted = true;

    detectPlayerGeo().then(geo => {
      if (!isMounted) return;
      setGeoString(`${geo.flag} ${geo.countryName} (${geo.countryCode})`);
      const ads = getTargetedCryptoAds(geo, monetization.adPayoutNetwork);
      setAllCampaigns(ads);
      if (ads.length > 0) {
        // Pick campaign matching preferred payout network if possible
        const matching = ads.find(a => a.payoutNetworkKey === monetization.adPayoutNetwork) || ads[0];
        setActiveCampaign(matching);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [monetization.adPayoutNetwork]);

  useEffect(() => {
    if (secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
      sound.playCoin();
    }
  }, [secondsRemaining]);

  const handleClaim = () => {
    sound.playVictory();
    if (activeCampaign) {
      onRewardClaimed(500, 10, activeCampaign);
    } else {
      onRewardClaimed(500, 10, {
        id: 'ad_default',
        networkName: 'TON Ads',
        targetCountry: 'ایران',
        countryFlag: '🇮🇷',
        title: 'تبلیغ کریپتو با پرداخت مستقیم',
        description: 'پرداخت خودکار به کیف پول سازنده',
        ctaText: 'مشاهده',
        badge: 'تسویه اتوماتیک',
        logo: '💎',
        bgGradient: 'from-sky-950 to-slate-900',
        payoutCurrency: 'TON',
        payoutNetworkKey: 'ton',
        rewardValueUsd: 0.045,
      });
    }
    onClose();
  };

  const handleSwitchCampaign = () => {
    if (allCampaigns.length < 2 || !activeCampaign) return;
    const currentIndex = allCampaigns.findIndex(c => c.id === activeCampaign.id);
    const nextIndex = (currentIndex + 1) % allCampaigns.length;
    setActiveCampaign(allCampaigns[nextIndex]);
    sound.playSlash();
  };

  const recipientWallet =
    activeCampaign?.payoutNetworkKey === 'ton'
      ? monetization.creatorWallets.ton
      : activeCampaign?.payoutNetworkKey === 'usdtTrc20'
      ? monetization.creatorWallets.usdtTrc20
      : activeCampaign?.payoutNetworkKey === 'usdtBep20'
      ? monetization.creatorWallets.usdtBep20
      : activeCampaign?.payoutNetworkKey === 'btc'
      ? monetization.creatorWallets.btc
      : monetization.creatorWallets.eth;

  const explorerLink = activeCampaign
    ? getExplorerUrl(activeCampaign.payoutNetworkKey, recipientWallet)
    : '#';

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-amber-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Ad Header with Geo Detection */}
        <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              {isRespawn ? 'تبلیغ احیای فوری پهلوان' : t.ad_center_title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1 font-mono">
              <Globe2 className="w-3 h-3 text-sky-400" />
              {geoString}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <span className="text-xs font-mono text-amber-400 font-bold px-2 py-0.5 bg-slate-800 rounded">
                پایان تا {secondsRemaining} ثانیه
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                آماده دریافت پاداش
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Crypto Sponsor Card */}
        <div
          className={`relative aspect-video bg-gradient-to-br ${
            activeCampaign?.bgGradient || 'from-slate-900 via-indigo-950 to-slate-950'
          } flex flex-col items-center justify-center p-6 text-center border-b border-slate-800 overflow-hidden`}
        >
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

          {/* Network tag top-left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
              {activeCampaign?.networkName || 'Web3 Crypto Ads'}
            </span>
            <button
              onClick={handleSwitchCampaign}
              className="p-1 rounded bg-black/50 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer"
              title="تغییر اسپانسر رمزارزی"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Animated Mascot / Token Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-3xl shadow-2xl mb-3 animate-bounce">
            {activeCampaign?.logo || '🛡️'}
          </div>

          <h3 className="text-base md:text-lg font-black text-amber-300 tracking-wide px-2">
            {activeCampaign?.title || 'اسپانسر رسمی و درگاه کریپتو شاهنامه'}
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mt-1.5 leading-relaxed">
            {activeCampaign?.description ||
              'خرید و فروش مستقیم تتر USDT، بیت‌کوین و تون با تسویه آنی در شبکه.'}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-400/40 rounded-full text-[10px] text-emerald-300 font-mono font-bold">
              +{activeCampaign?.rewardValueUsd ? `$${activeCampaign.rewardValueUsd.toFixed(3)}` : '$0.045'} دلار
              واریز خودکار به سازنده
            </span>
          </div>
        </div>

        {/* Live Wallet Recipient Notice (Creator Transparency) */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300 overflow-hidden">
            <Wallet className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-400 shrink-0">کیف پول متصل سازنده:</span>
            <span className="font-mono text-amber-300 truncate max-w-[170px] sm:max-w-[220px]" title={recipientWallet}>
              {recipientWallet}
            </span>
          </div>

          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 font-bold hover:underline shrink-0"
          >
            <span>مشاهده در اکسپلورر</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Ad Footer & Reward Action */}
        <div className="p-4 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-left text-xs font-semibold">
              <span className="text-amber-400 block font-mono tabular-nums">+۵۰۰ طلا 🪙 · +۱۰ گوهر 💎</span>
              <span className="text-[10px] text-slate-400">پاداش تماشای تبلیغ برای بازیکن</span>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={!isCompleted}
            className={`py-2.5 px-5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-transform cursor-pointer ${
              isCompleted
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.ad_close}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
