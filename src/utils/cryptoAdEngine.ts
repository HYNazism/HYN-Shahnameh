import { PlayerGeoInfo, CreatorWallets, AdPayoutNetwork } from '../types/game';

export interface CryptoAdCampaign {
  id: string;
  networkName: 'TON Ads' | 'A-Ads (TRC20)' | 'CoinZilla (BEP20)' | 'Bitmedia (BTC)' | 'Web3 AdEx';
  targetCountry: string;
  countryFlag: string;
  title: string;
  description: string;
  ctaText: string;
  badge: string;
  logo: string;
  bgGradient: string;
  payoutCurrency: 'TON' | 'USDT-TRC20' | 'USDT-BEP20' | 'BTC' | 'ETH';
  payoutNetworkKey: AdPayoutNetwork;
  rewardValueUsd: number;
}

// In-memory cache for detected geo
let cachedGeo: PlayerGeoInfo | null = null;

export async function detectPlayerGeo(): Promise<PlayerGeoInfo> {
  if (cachedGeo) return cachedGeo;

  // 1. Try public lightweight IP API with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const code = data.country_code || 'IR';
      const name = data.country_name || (code === 'IR' ? 'Iran' : 'Global');
      const tier = code === 'IR' ? 'mena' : ['US', 'CA', 'GB', 'DE', 'FR', 'NL'].includes(code) ? 'tier1' : 'global';
      const flag = getFlagEmoji(code);

      cachedGeo = { countryCode: code, countryName: name, flag, regionTier: tier };
      return cachedGeo;
    }
  } catch {
    // Non-blocking fallback to timezone & language
  }

  // 2. Fallback using browser timezone and locale
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const lang = navigator.language || '';

  if (tz.includes('Tehran') || lang.startsWith('fa')) {
    cachedGeo = { countryCode: 'IR', countryName: 'ایران', flag: '🇮🇷', regionTier: 'mena' };
  } else if (tz.startsWith('America/')) {
    cachedGeo = { countryCode: 'US', countryName: 'United States', flag: '🇺🇸', regionTier: 'tier1' };
  } else if (tz.startsWith('Europe/')) {
    cachedGeo = { countryCode: 'DE', countryName: 'Germany / Europe', flag: '🇪🇺', regionTier: 'tier1' };
  } else if (tz.includes('Dubai') || tz.includes('Istanbul')) {
    cachedGeo = { countryCode: 'AE', countryName: 'Middle East', flag: '🇦🇪', regionTier: 'mena' };
  } else {
    cachedGeo = { countryCode: 'GLOBAL', countryName: 'بین‌المللی', flag: '🌍', regionTier: 'global' };
  }

  return cachedGeo;
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Generate targeted campaigns based on detected country & selected payout wallet
export function getTargetedCryptoAds(
  geo: PlayerGeoInfo,
  preferredPayout: AdPayoutNetwork
): CryptoAdCampaign[] {
  const isIran = geo.countryCode === 'IR' || geo.regionTier === 'mena';

  if (isIran) {
    return [
      {
        id: 'ad_ton_iran',
        networkName: 'TON Ads',
        targetCountry: 'ایران و خاورمیانه',
        countryFlag: '🇮🇷',
        title: 'صرافی و درگاه تون‌کیپر (Tonkeeper) و تلگرام ولت',
        description: 'واریز و برداشت مستقیم TON و خرید استارز بدون تحریم با تسویه آنی در شبکه تلگرام.',
        ctaText: 'ورود به بات رسمی تلگرام',
        badge: 'تسویه اتوماتیک در کیف پول TON سازنده',
        logo: '💎',
        bgGradient: 'from-sky-950 via-slate-900 to-sky-900',
        payoutCurrency: 'TON',
        payoutNetworkKey: 'ton',
        rewardValueUsd: 0.045,
      },
      {
        id: 'ad_trc20_iran',
        networkName: 'A-Ads (TRC20)',
        targetCountry: 'کاربران داخل ایران',
        countryFlag: '🇮🇷',
        title: 'صرافی کیانی و تبادل تتر USDT بدون احراز هویت سنگین',
        description: 'خرید فوری تتر روی شبکه TRC20 ترون با کمترین کارمزد و پشتیبانی ۲۴ ساعته کارت‌های عضو شتاب.',
        ctaText: 'مشاهده نرخ لحظه‌ای تتر',
        badge: 'تسویه خودکار در کیف پول TRC-20 سازنده',
        logo: '⚡',
        bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
        payoutCurrency: 'USDT-TRC20',
        payoutNetworkKey: 'usdtTrc20',
        rewardValueUsd: 0.040,
      },
      {
        id: 'ad_bep20_iran',
        networkName: 'CoinZilla (BEP20)',
        targetCountry: 'ایران و حوزه بین‌الملل',
        countryFlag: '🇮🇷',
        title: 'استخر نقدینگی و توکن‌های بازی در شبکه هوشمند بایننس',
        description: 'انتقال سریع توکن‌های BEP-20 با کارمزد ناچیز BNB و اتصال به تراست ولت.',
        ctaText: 'اتصال کیف پول',
        badge: 'تسویه در ولت BEP-20 بایننس اسمارت‌چین',
        logo: '🟡',
        bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
        payoutCurrency: 'USDT-BEP20',
        payoutNetworkKey: 'usdtBep20',
        rewardValueUsd: 0.038,
      },
    ];
  }

  // Tier 1 & Global Campaigns
  return [
    {
      id: 'ad_ton_global',
      networkName: 'TON Ads',
      targetCountry: 'Global Web3 & Telegram',
      countryFlag: geo.flag,
      title: 'TON Open League & Telegram Mini Apps Ecosystem',
      description: 'The fastest blockchain with 900M Telegram users. Stake $TON and claim Web3 gaming rewards.',
      ctaText: 'Explore TON Ecosystem',
      badge: 'Auto-credited to Creator TON Wallet',
      logo: '💎',
      bgGradient: 'from-sky-950 via-slate-900 to-blue-900',
      payoutCurrency: 'TON',
      payoutNetworkKey: 'ton',
      rewardValueUsd: 0.065,
    },
    {
      id: 'ad_btc_global',
      networkName: 'Bitmedia (BTC)',
      targetCountry: 'Worldwide Crypto Traders',
      countryFlag: geo.flag,
      title: 'Institutional Bitcoin Cold Storage & SegWit Solutions',
      description: 'Zero counterparty risk Bitcoin custody with instant lightning network payouts.',
      ctaText: 'View Institutional Vault',
      badge: 'Auto-paid to Creator Bitcoin SegWit Address',
      logo: '₿',
      bgGradient: 'from-orange-950 via-slate-900 to-amber-950',
      payoutCurrency: 'BTC',
      payoutNetworkKey: 'btc',
      rewardValueUsd: 0.070,
    },
    {
      id: 'ad_evm_global',
      networkName: 'Web3 AdEx',
      targetCountry: 'EVM & DeFi Users',
      countryFlag: geo.flag,
      title: 'Decentralized Cross-Chain Swaps on BSC & Ethereum',
      description: 'Swap USDT, ETH, and BNB instantly across 15 chains with automated MEV protection.',
      ctaText: 'Launch DEX Portal',
      badge: 'Auto-credited to Creator EVM Vault',
      logo: '🔷',
      bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
      payoutCurrency: 'ETH',
      payoutNetworkKey: 'eth',
      rewardValueUsd: 0.060,
    },
  ];
}

// Generate realistic on-chain receipt hash
export function generateTxHash(network: AdPayoutNetwork): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return network === 'ton' ? hash.toUpperCase() : `0x${hash}`;
}

export function getExplorerUrl(network: AdPayoutNetwork, address: string): string {
  switch (network) {
    case 'ton':
      return `https://tonviewer.com/${address}`;
    case 'usdtTrc20':
      return `https://tronscan.org/#/address/${address}`;
    case 'usdtBep20':
      return `https://bscscan.com/address/${address}`;
    case 'eth':
      return `https://etherscan.io/address/${address}`;
    case 'btc':
      return `https://mempool.space/address/${address}`;
    default:
      return '#';
  }
}
