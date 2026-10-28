import React, { useState } from 'react';
import { MonetizationState, Language, AdPayoutNetwork } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import {
  X,
  BarChart3,
  DollarSign,
  Wallet,
  Eye,
  Save,
  CheckCircle2,
  ArrowDownToLine,
  ArrowUpRight,
  ShieldCheck,
  Globe2,
  ExternalLink,
  Coins,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { getExplorerUrl } from '../utils/cryptoAdEngine';

interface Props {
  monetization: MonetizationState;
  lang: Language;
  onClose: () => void;
  onSaveSettings: (updated: MonetizationState) => void;
  onWithdrawFunds: () => void;
}

export const DevDashboardModal: React.FC<Props> = ({
  monetization,
  lang,
  onClose,
  onSaveSettings,
  onWithdrawFunds,
}) => {
  const t = TRANSLATIONS[lang];
  const [wallets, setWallets] = useState(monetization.creatorWallets);
  const [selectedPayout, setSelectedPayout] = useState<AdPayoutNetwork>(
    monetization.adPayoutNetwork || 'ton'
  );
  const [isSaved, setIsSaved] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState(false);

  const totalVaultBalance = (monetization.creatorVaultBalanceUsd + monetization.adRevenueUsd).toFixed(2);

  const handleSave = () => {
    onSaveSettings({
      ...monetization,
      creatorWallets: wallets,
      adPayoutNetwork: selectedPayout,
    });
    sound.playVictory();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleWithdraw = () => {
    sound.playVictory();
    onWithdrawFunds();
    setWithdrawMsg(true);
    setTimeout(() => setWithdrawMsg(false), 4000);
  };

  const activePayoutWalletAddress = wallets[selectedPayout] || wallets.ton;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-purple-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-purple-400">
                {t.dev_title}
              </h2>
              <span className="text-xs text-slate-400">
                سیستم واریز خودکار رمزارز بر اساس موقعیت جغرافیایی بازیکنان
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
          {/* Main Creator Vault Box */}
          <div className="p-5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                صندوق تجمیع درآمد زنده متصل به ولت‌های شما
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tabular-nums mt-1">
                ${totalVaultBalance} USD
              </div>
              <span className="text-[11px] text-slate-400">
                (تسویه آنلاین مستقیم روی شبکه {selectedPayout.toUpperCase()})
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleWithdraw}
                className="w-full sm:w-auto py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>تسویه فوری به کیف پول</span>
              </button>
              <a
                href={getExplorerUrl(selectedPayout, activePayoutWalletAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <span>اکسپلورر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {withdrawMsg && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold text-center rounded-lg animate-bounce flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تسویه حساب خودکار با موفقیت به آدرس {selectedPayout.toUpperCase()} شما ثبت شد!</span>
            </div>
          )}

          {/* Breakdown Stats & Geo Network Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block">{t.ad_revenue}</span>
              <span className="text-lg font-bold text-sky-400 font-mono tabular-nums">
                ${monetization.adRevenueUsd.toFixed(2)} USD
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {monetization.adViewsCount} بار نمایش موفق تبلیغ
              </span>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block">فروش مستقیم اقلام</span>
              <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                ${monetization.creatorVaultBalanceUsd.toFixed(2)} USD
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                خرید بسته‌های زرین و سکه
              </span>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-emerald-400" />
                پراکندگی بازدیدکنندگان
              </span>
              <span className="text-xs font-bold text-emerald-300 block mt-1">
                🇮🇷 ۶۸٪ ایران | 🌍 ۳۲٪ بین‌الملل
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                تطبیق خودکار شبکه پرداخت با منطقه
              </span>
            </div>
          </div>

          {/* Preferred Auto-Payout Network Selection */}
          <div className="p-4 bg-slate-900/70 border border-purple-500/30 rounded-xl flex flex-col gap-3">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
              <Coins className="w-4 h-4 text-purple-400" />
              انتخاب شبکه پیش‌فرض برای دریافت خودکار درآمد تبلیغات:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'ton', label: 'TON Wallet', color: 'sky' },
                { id: 'usdtTrc20', label: 'USDT (TRC20)', color: 'emerald' },
                { id: 'usdtBep20', label: 'USDT (BEP20)', color: 'yellow' },
                { id: 'eth', label: 'Ethereum', color: 'indigo' },
                { id: 'btc', label: 'Bitcoin (BTC)', color: 'orange' },
              ].map(net => {
                const isSelected = selectedPayout === net.id;
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedPayout(net.id as AdPayoutNetwork)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-400 text-white ring-1 ring-purple-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{net.label}</span>
                    {isSelected && <span className="text-[9px] text-emerald-400 font-bold">● فعال</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Address Configuration for Payouts */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400" />
              آدرس‌های رسمی ۵ گانه کیف پول‌های شما
            </h3>

            <div className="flex flex-col gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-sky-400 block mb-0.5">
                  کیف پول رسمی TON (تلگرام و تون‌کیپر):
                </label>
                <input
                  type="text"
                  value={wallets.ton}
                  onChange={e => setWallets({ ...wallets, ton: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-sky-200 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-emerald-400 block mb-0.5">
                  کیف پول تتر ترون (USDT TRC-20):
                </label>
                <input
                  type="text"
                  value={wallets.usdtTrc20}
                  onChange={e => setWallets({ ...wallets, usdtTrc20: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-emerald-200 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-yellow-400 block mb-0.5">
                  کیف پول تتر شبکه بایننس اسمارت چین (USDT BEP-20):
                </label>
                <input
                  type="text"
                  value={wallets.usdtBep20}
                  onChange={e => setWallets({ ...wallets, usdtBep20: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-yellow-200 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-orange-400 block mb-0.5">
                  کیف پول بیت‌کوین (Bitcoin BTC Native SegWit):
                </label>
                <input
                  type="text"
                  value={wallets.btc}
                  onChange={e => setWallets({ ...wallets, btc: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-orange-200 focus:outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-indigo-400 block mb-0.5">
                  کیف پول اتریوم و EVM (ETH ERC-20):
                </label>
                <input
                  type="text"
                  value={wallets.eth}
                  onChange={e => setWallets({ ...wallets, eth: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-indigo-200 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSave}
                className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.save_settings}</span>
              </button>

              {isSaved && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  تنظیمات ذخیره شد
                </span>
              )}
            </div>
          </div>

          {/* Live Ledger */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
              تراکنش‌های واریز خودکار تبلیغات و حمایت بازیکنان
            </h3>

            <div className="flex flex-col gap-2 mt-1 max-h-48 overflow-y-auto">
              {monetization.transactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200 block">{tx.itemTitle}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {tx.timestamp} · مقصد: {tx.payerWallet.slice(0, 10)}...
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 block">
                      +${tx.amountUsd.toFixed(3)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tx.cryptoCurrency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            سیستم تسویه اتوماتیک با شبکه‌های TON، Tron، BSC، Bitcoin و Ethereum یکپارچه است.
          </span>
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
