import React, { useState } from 'react';
import { MonetizationState, Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import { X, BarChart3, DollarSign, Wallet, Eye, Save, CheckCircle2, ArrowDownToLine, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

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
  const [isSaved, setIsSaved] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState(false);

  const totalVaultBalance = (monetization.creatorVaultBalanceUsd + monetization.adRevenueUsd).toFixed(2);

  const handleSave = () => {
    onSaveSettings({
      ...monetization,
      creatorWallets: wallets,
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
                {t.dev_desc}
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
                {t.auto_deposit_active}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tabular-nums mt-1">
                ${totalVaultBalance} USD
              </div>
              <span className="text-[11px] text-slate-400">
                (معادل تتر TRC20 / TON در صندوق تسویه شما)
              </span>
            </div>

            <button
              onClick={handleWithdraw}
              className="w-full sm:w-auto py-3 px-5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs md:text-sm rounded-xl transition-transform active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{t.withdraw_btn}</span>
            </button>
          </div>

          {withdrawMsg && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold text-center rounded-lg animate-bounce flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.withdraw_success}</span>
            </div>
          )}

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block">{t.ad_revenue}</span>
              <span className="text-lg font-bold text-sky-400 font-mono tabular-nums">
                ${monetization.adRevenueUsd.toFixed(2)} USD
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {monetization.adViewsCount} بار مشاهده آگهی
              </span>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 block">فروش مستقیم اقلام بازیکنان</span>
              <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                ${monetization.creatorVaultBalanceUsd.toFixed(2)} USD
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                واریز مستقیم به حساب سازنده
              </span>
            </div>
          </div>

          {/* Live Player Purchase Ledger (Auto-Deposit Transactions) */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
              {t.recent_transactions}
            </h3>

            <div className="flex flex-col gap-2 mt-1">
              {monetization.transactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200 block">{tx.itemTitle}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {tx.timestamp} · از ولت: {tx.payerWallet}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 block">
                      +${tx.amountUsd.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tx.cryptoCurrency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Address Configuration for Payouts */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400" />
              آدرس‌های کیف پول شخصی شما جهت واریز نهایی مبالغ
            </h3>

            <div className="flex flex-col gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                  آدرس تتر ترون شما (USDT TRC-20):
                </label>
                <input
                  type="text"
                  value={wallets.usdtTrc20}
                  onChange={e => setWallets({ ...wallets, usdtTrc20: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                  آدرس کیف پول تلگرام شما (TON Wallet):
                </label>
                <input
                  type="text"
                  value={wallets.ton}
                  onChange={e => setWallets({ ...wallets, ton: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-sky-200 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-2 py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.save_settings}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            سیستم تسویه ارزی سازنده با کارمزد صفر شبکه ترون و تون یکپارچه است.
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
