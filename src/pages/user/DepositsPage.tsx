import { useState, useEffect } from 'react';
import { ArrowDownLeft, Copy, Check, QrCode, AlertCircle, Info, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/api';
import type { WalletAddresses } from '@/types';
import { toast } from 'sonner';

const depositMethods = [
  {
    id: 'Bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    color: 'from-orange-500 to-amber-500',
    minAmount: 100,
    processingTime: '10-30 minutes',
    network: 'Bitcoin Network'
  },
  {
    id: 'Ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    color: 'from-purple-500 to-indigo-500',
    minAmount: 100,
    processingTime: '5-15 minutes',
    network: 'ERC20 Network'
  },
  {
    id: 'USDT',
    name: 'USDT (Tether)',
    symbol: 'USDT',
    icon: '₮',
    color: 'from-emerald-500 to-teal-500',
    minAmount: 100,
    processingTime: '5-15 minutes',
    network: 'ERC20 Network'
  }
];

const DepositsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('Bitcoin');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [walletAddresses, setWalletAddresses] = useState<WalletAddresses | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchWalletAddresses();
  }, []);

  const fetchWalletAddresses = async () => {
    try {
      const response = await userService.getWalletAddresses();
      if (response.success) {
        setWalletAddresses(response.walletAddresses);
      }
    } catch (error) {
      toast.error('Failed to load wallet addresses');
    }
  };

  const handleCopyAddress = () => {
    const address = walletAddresses?.[selectedMethod as keyof WalletAddresses]?.address;
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitDeposit = async () => {
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum deposit amount is $100');
      return;
    }

    if (!transactionHash.trim()) {
      toast.error('Please enter your Transaction ID / Hash');
      return;
    }

    setLoading(true);
    try {
      const response = await userService.createDeposit({
        amount: parseFloat(amount),
        depositMethod: selectedMethod,
        transactionHash: transactionHash.trim()
      });

      if (response.success) {
        toast.success('Deposit request created successfully!');
        setAmount('');
        setTransactionHash('');
      } else {
        toast.error(response.message || 'Failed to create deposit');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedMethodData = depositMethods.find(m => m.id === selectedMethod);
  const currentAddress = walletAddresses?.[selectedMethod as keyof WalletAddresses];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
          <ArrowDownLeft className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Make a Deposit</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Choose your preferred payment method and securely fund your trading account
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Deposit Form Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Amount Input */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
            <label className="block text-sm font-semibold text-white tracking-wide">
              Deposit Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-xl font-extrabold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all font-semibold"
                min="100"
              />
            </div>
            <p className="text-xs text-slate-400">
              Minimum deposit amount is <span className="text-white font-bold">$100.00</span>
            </p>
          </div>

          {/* Transaction Hash Input */}
          <div className="rounded-3xl bg-slate-900/80 border border-purple-500/30 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
            <label className="block text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-400" />
              Transaction ID / Hash
            </label>
            <div className="relative">
              <input
                type="text"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder={`Enter your ${selectedMethod} transaction hash`}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-mono"
              />
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-200/90 leading-relaxed">
                After completing the transfer from your crypto wallet, paste your 
                <strong className="text-white font-semibold"> Transaction ID (TxID)</strong> or 
                <strong className="text-white font-semibold"> Transaction Hash</strong> above to fast-track verification.
              </p>
            </div>
          </div>

          {/* Payment Methods Grid */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
            <label className="block text-sm font-semibold text-white tracking-wide">
              Select Payment Method
            </label>
            <div className="grid sm:grid-cols-3 gap-4">
              {depositMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setTransactionHash('');
                  }}
                  className={`p-5 rounded-2xl border transition-all text-center flex flex-col items-center cursor-pointer ${
                    selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-500/10'
                      : 'border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 mb-3 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl shadow-md text-white font-bold`}>
                    {method.icon}
                  </div>
                  <p className="text-white font-bold text-sm">{method.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{method.network}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Address Display Card */}
          {currentAddress && (
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">
                  {selectedMethodData?.name} Deposit Address
                </label>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="text-purple-400 text-xs font-semibold hover:underline flex items-center gap-1.5 cursor-pointer bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20"
                >
                  <QrCode className="w-4 h-4" />
                  {showQR ? 'Hide QR' : 'Show QR Code'}
                </button>
              </div>

              {/* QR Code Container */}
              {showQR && (
                <div className="p-6 bg-slate-950/80 border border-white/10 rounded-2xl flex justify-center animate-in fade-in duration-200">
                  <div className="text-center space-y-2">
                    <div className="w-44 h-44 bg-white p-3 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <img src={walletAddresses?.[selectedMethod as keyof WalletAddresses]?.qrCode} alt={`${selectedMethod} QR Code`} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-slate-400 text-xs font-medium">Scan QR to send {selectedMethodData?.symbol}</p>
                  </div>
                </div>
              )}

              {/* Address Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 p-4 bg-slate-950/60 border border-white/10 rounded-2xl">
                  <p className="text-white font-mono text-xs sm:text-sm break-all">
                    {currentAddress.address}
                  </p>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-2xl transition-colors cursor-pointer text-purple-300 flex-shrink-0"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Instructions Box */}
              <div className="p-4 bg-slate-950/60 border border-white/10 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 space-y-1.5">
                    <p className="text-white font-semibold">Important Deposit Guidelines:</p>
                    <ul className="space-y-1 list-disc list-inside text-slate-400">
                      <li>Send only <span className="text-white font-medium">{selectedMethodData?.symbol}</span> to this specific address.</li>
                      <li>Minimum deposit: <span className="text-white font-medium">${selectedMethodData?.minAmount}</span>.</li>
                      <li>Processing time: <span className="text-white font-medium">{selectedMethodData?.processingTime}</span>.</li>
                      <li>Credits apply automatically after network node validations.</li>
                      <li className="text-purple-300 font-medium">Ensure you supply your correct Transaction Hash before submitting.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmitDeposit}
            className="w-full py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
            disabled={loading || !amount || !transactionHash.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing Request...
              </span>
            ) : (
              <>
                <ArrowDownLeft className="w-5 h-5 mr-2" />
                Confirm Deposit Request
              </>
            )}
          </Button>

        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          
          {/* Quick Specifications */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Deposit Specs</h3>
            <div className="space-y-3 pt-2 divide-y divide-white/5">
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Asset</span>
                <span className="text-white font-semibold text-xs">{selectedMethodData?.name}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Network</span>
                <span className="text-white font-semibold text-xs">{selectedMethodData?.network}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Minimum Limit</span>
                <span className="text-white font-semibold text-xs">${selectedMethodData?.minAmount}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Avg. Time</span>
                <span className="text-white font-semibold text-xs">{selectedMethodData?.processingTime}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-200 font-semibold text-sm mb-1">Security Alert</h4>
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  Always verify the target deposit address string before authorization. Platform admins will never request fund transfers to private personal addresses.
                </p>
              </div>
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight">Need Assistance?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Encountering verification delays or transaction glitches? Reach out to support directly.
            </p>
            <a 
              href="https://wa.me/15742384154" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-purple-400 hover:text-purple-300 text-xs font-bold pt-1 transition-colors"
            >
              Contact Support →
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DepositsPage;
