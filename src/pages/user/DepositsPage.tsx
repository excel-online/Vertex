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
    color: 'from-orange-500 to-yellow-500',
    minAmount: 100,
    processingTime: '10-30 minutes',
    network: 'Bitcoin Network'
  },
  {
    id: 'Ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    color: 'from-purple-500 to-blue-500',
    minAmount: 100,
    processingTime: '5-15 minutes',
    network: 'ERC20 Network'
  },
  {
    id: 'USDT',
    name: 'USDT (Tether)',
    symbol: 'USDT',
    icon: '₮',
    color: 'from-green-500 to-teal-500',
    minAmount: 100,
    processingTime: '5-15 minutes',
    network: 'ERC20 Network'
  }
];

const DepositsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('Bitcoin');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState(''); // ✅ NEW: Transaction ID state
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

    // ✅ NEW: Validate transaction hash is provided
    if (!transactionHash.trim()) {
      toast.error('Please enter your Transaction ID / Hash');
      return;
    }

    setLoading(true);
    try {
      const response = await userService.createDeposit({
        amount: parseFloat(amount),
        depositMethod: selectedMethod,
        transactionHash: transactionHash.trim() // ✅ NEW: Send transaction hash to backend
      });

      if (response.success) {
        toast.success('Deposit request created successfully!');
        setAmount('');
        setTransactionHash(''); // ✅ NEW: Clear transaction hash after success
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
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6 text-success" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">Make a Deposit</h2>
            <p className="text-muted-foreground">
              Choose your preferred payment method and deposit funds to your account
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Deposit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Input */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-black mb-4">
              Deposit Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold text-xl font-bold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (min $100)"
                className="input-trading w-full pl-10 pr-4 py-4 text-xl"
                min="100"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Minimum deposit: $100.00
            </p>
          </div>

          {/* ✅ NEW: Transaction Hash Input */}
          <div className="glass-card p-6 border-gold/30">
            <label className="block text-sm font-medium text-black mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 text-gold" />
              Transaction ID / Hash
            </label>
            <div className="relative">
              <input
                type="text"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder={`Enter your ${selectedMethod} transaction ID from your wallet`}
                className="input-trading w-full px-4 py-4"
              />
            </div>
            <div className="mt-3 p-3 bg-navy-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  After sending {selectedMethodData?.symbol} from your wallet, paste the 
                  <strong className="text-white"> Transaction ID (TxID)</strong> or 
                  <strong className="text-white"> Transaction Hash</strong> here. 
                  This helps our team verify your deposit quickly.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-black mb-4">
              Select Payment Method
            </label>
            <div className="grid sm:grid-cols-3 gap-4">
              {depositMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setTransactionHash(''); // ✅ NEW: Clear transaction hash when method changes
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-gold bg-gold/10'
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
                    {method.icon}
                  </div>
                  <p className="text-black font-medium text-sm">{method.name}</p>
                  <p className="text-gray-600 text-xs">{method.network}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Address */}
          {currentAddress && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-black">
                  {selectedMethodData?.name} Deposit Address
                </label>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="text-gold text-sm hover:underline flex items-center gap-1"
                >
                  <QrCode className="w-4 h-4" />
                  {showQR ? 'Hide QR' : 'Show QR'}
                </button>
              </div>

              {/* QR Code Display */}
              {showQR && (
                <div className="mb-6 p-6 bg-navy-50 rounded-xl flex justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-navy flex items-center justify-center mb-2">
                      <img src={walletAddresses?.[selectedMethod as keyof WalletAddresses]?.qrCode} alt={`${selectedMethod} QR Code`} className="w-40 h-40" />
                      
                    </div>
                    <p className="text-navy text-xs">Scan to deposit {selectedMethodData?.symbol}</p>
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="flex items-center gap-3">
                <div className="flex-1 p-4 bg-navy-50 rounded-lg">
                  <p className="text-white font-mono text-sm break-all">
                    {currentAddress.address}
                  </p>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="p-4 bg-gold/10 hover:bg-gold/20 rounded-lg transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <Copy className="w-5 h-5 text-gold" />
                  )}
                </button>
              </div>

              <div className="mt-4 p-4 bg-navy-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="text-white font-medium mb-1">Important:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Send only {selectedMethodData?.symbol} to this address</li>
                      <li>Minimum deposit: ${selectedMethodData?.minAmount}</li>
                      <li>Processing time: {selectedMethodData?.processingTime}</li>
                      <li>Deposits will be credited after network confirmations</li>
                      <li className="text-gold">Don't forget to paste your Transaction ID above!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmitDeposit}
            className="w-full btn-success py-4"
            disabled={loading || !amount || !transactionHash.trim()} // ✅ NEW: Disable if no transaction hash
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <>
                <ArrowDownLeft className="w-5 h-5 mr-2" />
                Confirm Deposit Request
              </>
            )}
          </Button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Deposit Info */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Deposit Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Selected Method</span>
                <span className="text-black font-medium">{selectedMethodData?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Network</span>
                <span className="text-black font-medium">{selectedMethodData?.network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Min. Amount</span>
                <span className="text-black font-medium">${selectedMethodData?.minAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Processing Time</span>
                <span className="text-black font-medium">{selectedMethodData?.processingTime}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="glass-card p-6 border-gold/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-black font-medium mb-2">Security Notice</h4>
                <p className="text-sm text-gray-600">
                  Always double-check the deposit address before sending funds. 
                  Vellumtrade will never ask you to send funds to a different address.
                </p>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-black mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Contact our support team if you have any questions about deposits.
            </p>
            <a 
              href="https://wa.me/15742384154" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:underline text-sm"
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