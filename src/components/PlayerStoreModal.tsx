import React, { useState } from 'react';
import { PlayerStoreItem, Language } from '../types/game';
import { STORE_ITEMS } from '../constants/gameData';
import { TRANSLATIONS } from '../constants/translations';
import { X, ShoppingBag, Coins, Sparkles, Award, Shield, CheckCircle2, ArrowDownToLine, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  lang: Language;
  onClose: () => void;
  onPurchaseItem: (item: PlayerStoreItem, paymentNetwork: string) => void;
}

export const PlayerStoreModal: React.FC<Props> = ({ lang, onClose, onPurchaseItem }) => {
  const t = TRANSLATIONS[lang];
  const [selectedCurrency, setSelectedCurrency] = useState<'USDT' | 'TON' | 'ETH'>('USDT');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getStoreIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coins': return <Coins className="w-6 h-6 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-sky-400" />;
      case 'Award': return <Award className="w-6 h-6 text-yellow-400" />;
      case 'Shield': return <Shield className="w-6 h-6 text-rose-400" />;
      default: return <ShoppingBag className="w-6 h-6 text-amber-400" />;
    }
  };

  const handleBuy = (item: PlayerStoreItem) => {
    sound.playVictory();
    onPurchaseItem(item, selectedCurrency);
    setSuccessMsg(`${t[item.titleKey] || item.titleKey}: ${t.purchase_success}`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-emerald-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-emerald-400">
                {t.store_title}
              </h2>
              <span className="text-xs text-slate-400">
                {t.store_desc}
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

        {/* Payment Network & Creator Auto-Deposit Notice */}
        <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
            <span>واریز خودکار به حساب سازنده با:</span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg text-xs font-bold">
            {(['USDT', 'TON', 'ETH'] as const).map(curr => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedCurrency === curr ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold text-center animate-pulse flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Items Grid */}
        <div className="p-4 md:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {STORE_ITEMS.map(item => (
            <div
              key={item.id}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between gap-4 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
                  {getStoreIcon(item.icon)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {t[item.titleKey] || item.titleKey}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {t[item.descKey] || item.descKey}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono font-bold text-amber-400">
                    {item.rewardGold > 0 && <span>+{item.rewardGold} 🪙</span>}
                    {item.rewardGems > 0 && <span>+{item.rewardGems} 💎</span>}
                  </div>
                </div>
              </div>

              {/* Purchase button */}
              <button
                onClick={() => handleBuy(item)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-transform active:scale-98 cursor-pointer shadow-md flex items-center justify-between"
              >
                <span>{t.buy_item}</span>
                <span className="font-mono text-slate-950 bg-emerald-300 px-2 py-0.5 rounded font-black">
                  ${item.priceUsd} ({item.cryptoPrice})
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            تراکنش‌ها بدون واسطه ثبت شده و به موجودی صندوق سازنده افزوده می‌شوند.
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
