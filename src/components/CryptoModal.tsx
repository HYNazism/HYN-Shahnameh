import React, { useState } from 'react';
import { MonetizationState, Language } from '../types/game';
import { TRANSLATIONS } from '../constants/translations';
import { X, Wallet, Copy, Check, QrCode, HeartHandshake, ShieldCheck, ExternalLink, Sparkles, Coins } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  monetization: MonetizationState;
  lang: Language;
  onClose: () => void;
  onConnectWallet: (type: 'metamask' | 'ton' | 'tron') => void;
  onDisconnectWallet: () => void;
  onSendTipDonation: (amountUsd: number, network: string) => void;
}

export const CryptoModal: React.FC<Props> = ({
  monetization,
  lang,
  onClose,
  onConnectWallet,
  onDisconnectWallet,
  onSendTipDonation,
}) => {
  const t = TRANSLATIONS[lang];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<'trc20' | 'ton' | 'bep20' | 'eth' | 'btc'>('trc20');
  const [tipAmount, setTipAmount] = useState<number>(5);
  const [isProcessingTip, setIsProcessingTip] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sound.playCoin();
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleConfirmTip = () => {
    setIsProcessingTip(true);
    sound.playVictory();
    setTimeout(() => {
      onSendTipDonation(tipAmount, selectedNetwork.toUpperCase());
      setIsProcessingTip(false);
      setSuccessMsg(t.donation_success);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 800);
  };

  const currentAddress =
    selectedNetwork === 'trc20'
      ? monetization.creatorWallets.usdtTrc20
      : selectedNetwork === 'ton'
      ? monetization.creatorWallets.ton
      : selectedNetwork === 'bep20'
      ? monetization.creatorWallets.usdtBep20
      : selectedNetwork === 'eth'
      ? monetization.creatorWallets.eth
      : monetization.creatorWallets.btc;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#0b101e] border border-sky-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-sky-400">
                {t.crypto_title}
              </h2>
              <span className="text-xs text-slate-400">
                درگاه وب۳ و دریافت درآمد دلاری و کریپتو برای توسعه‌دهنده در ایران
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
        <div className="p-4 md:p-6 overflow-y-auto flex flex-col gap-6">
          {/* Section 1: Web3 Wallet Connect */}
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                وضعیت اتصال کیف پول شخصی شما (Web3 Wallet)
              </span>
              {monetization.connectedWallet ? (
                <button
                  onClick={onDisconnectWallet}
                  className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                >
                  {t.disconnect}
                </button>
              ) : null}
            </div>

            {monetization.connectedWallet ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-300">
                    {monetization.connectedWallet}
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {monetization.walletBalance} USDT
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                <button
                  onClick={() => onConnectWallet('metamask')}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>🦊 MetaMask / EVM</span>
                </button>
                <button
                  onClick={() => onConnectWallet('ton')}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-sky-950 border border-sky-600/40 rounded-lg text-xs font-bold text-sky-300 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>💎 TON Connect</span>
                </button>
                <button
                  onClick={() => onConnectWallet('tron')}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-rose-950 border border-rose-600/40 rounded-lg text-xs font-bold text-rose-300 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>⚡ TronLink / TRC20</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Direct Creator Crypto Donation & Tip Jar */}
          <div className="p-4 bg-slate-900/60 border border-amber-500/30 rounded-xl flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  {t.tip_creator_title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {t.tip_creator_desc}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-bold shrink-0">
                بدون واسطه
              </span>
            </div>

            {/* Network Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-lg text-xs">
              <button
                onClick={() => setSelectedNetwork('trc20')}
                className={`py-1.5 px-2 rounded-md font-bold transition-colors cursor-pointer ${
                  selectedNetwork === 'trc20' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                USDT (TRC20)
              </button>
              <button
                onClick={() => setSelectedNetwork('ton')}
                className={`py-1.5 px-2 rounded-md font-bold transition-colors cursor-pointer ${
                  selectedNetwork === 'ton' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TON
              </button>
              <button
                onClick={() => setSelectedNetwork('bep20')}
                className={`py-1.5 px-2 rounded-md font-bold transition-colors cursor-pointer ${
                  selectedNetwork === 'bep20' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                USDT (BEP20)
              </button>
              <button
                onClick={() => setSelectedNetwork('eth')}
                className={`py-1.5 px-2 rounded-md font-bold transition-colors cursor-pointer ${
                  selectedNetwork === 'eth' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ETH
              </button>
              <button
                onClick={() => setSelectedNetwork('btc')}
                className={`py-1.5 px-2 rounded-md font-bold transition-colors cursor-pointer ${
                  selectedNetwork === 'btc' ? 'bg-orange-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BTC
              </button>
            </div>

            {/* Address Display & Copy */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                {/* SVG QR Code Simulation */}
                <div className="w-full h-full bg-slate-950 flex flex-col justify-between p-1 rounded">
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 border-2 border-white" />
                    <div className="w-3.5 h-3.5 border-2 border-white" />
                  </div>
                  <div className="w-2 h-2 bg-amber-400 mx-auto" />
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 border-2 border-white" />
                    <div className="w-2 h-2 bg-white" />
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full overflow-hidden">
                <span className="text-[10px] text-slate-500 block">
                  آدرس واریز مستقیم به توسعه‌دهنده ({selectedNetwork.toUpperCase()}):
                </span>
                <span className="text-xs font-mono text-amber-200 break-all select-all font-semibold">
                  {currentAddress}
                </span>
              </div>

              <button
                onClick={() => copyToClipboard(currentAddress, selectedNetwork)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-2"
              >
                {copiedKey === selectedNetwork ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.address_copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copy_address}</span>
                  </>
                )}
              </button>
            </div>

            {/* In-Game Tip Preset & Royal Patron Unlock */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                {t.tip_amounts}:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 50].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setTipAmount(amt)}
                    className={`py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                      tipAmount === amt
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    ${amt} USDT
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirmTip}
                disabled={isProcessingTip}
                className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs md:text-sm rounded-xl transition-transform active:scale-98 cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>
                  {isProcessingTip
                    ? 'در حال پردازش تراکنش شبکه...'
                    : `${t.send_donation_btn} ($${tipAmount} دلار)`}
                </span>
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center rounded-lg animate-bounce">
                {successMsg}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            تراکنش‌ها بدون کارمزد اضافی مستقیماً به آدرس شخصی شما واریز می‌شوند.
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
