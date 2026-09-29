import { useState, useEffect } from 'react';
import { ArrowUpRight, Wallet, AlertCircle, Info, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/api';
import type { Transaction } from '@/types';
import { toast } from 'sonner';

const withdrawalMethods = [
  {
    id: 'Bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    color: 'from-orange-500 to-yellow-500',
    minAmount: 50,
    processingTime: '24 hours',
    network: 'Bitcoin Network',
    fee: 'Network fee only'
  },
  {
    id: 'Ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    color: 'from-purple-500 to-blue-500',
    minAmount: 50,
    processingTime: '24 hours',
    network: 'ERC20 Network',
    fee: 'Network fee only'
  },
  {
    id: 'USDT',
    name: 'USDT (Tether)',
    symbol: 'USDT',
    icon: '₮',
    color: 'from-green-500 to-teal-500',
    minAmount: 50,
    processingTime: '24 hours',
    network: 'ERC20 Network',
    fee: 'Network fee only'
  },
  {
    id: 'Bank Transfer',
    name: 'Bank Transfer',
    symbol: 'USD',
    icon: '$',
    color: 'from-blue-500 to-cyan-500',
    minAmount: 100,
    processingTime: '24-48 hours',
    network: 'SWIFT/Wire',
    fee: '$25 + bank fees'
  }
];

// Tier configuration matching backend
const TIER_CONFIG = {
  None: { name: 'No Tier', minBalance: 0, maxWithdrawal: 0, color: 'text-gray-400' },
  Starter: { name: 'Starter', minBalance: 50, maxWithdrawal: 1000, color: 'text-blue-400' },
  Premium: { name: 'Premium', minBalance: 2000, maxWithdrawal: 5000, color: 'text-purple-400' },
  Standard: { name: 'Standard', minBalance: 5000, maxWithdrawal: 15000, color: 'text-gold' },
  VIP: { name: 'VIP', minBalance: 10000, maxWithdrawal: 50000, color: 'text-green-400' }
};

const WithdrawalsPage = () => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('Bitcoin');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await userService.getTransactions({ type: 'Withdrawal', limit: 5 });
      if (response.success) {
        setWithdrawals(response.transactions);
      }
    } catch (error) {
      console.error('Fetch withdrawals error:', error);
      toast.error('Failed to load withdrawal history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async () => {
    const methodData = withdrawalMethods.find(m => m.id === selectedMethod);
    
    if (!amount || parseFloat(amount) < (methodData?.minAmount || 50)) {
      toast.error(`Minimum withdrawal amount is $${methodData?.minAmount || 50}`);
      return;
    }

    if (!address) {
      toast.error('Please enter a withdrawal address');
      return;
    }

    // FIXED: Use correct property names from your User interface (bonusBalance + totalEarned)
    const maxWithdrawal = (user?.bonusBalance || 0) + (user?.totalEarned || 0);
    if (parseFloat(amount) > maxWithdrawal) {
      toast.error(`Maximum withdrawal amount is $${maxWithdrawal.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      const response = await userService.createWithdrawal({
        amount: parseFloat(amount),
        withdrawalMethod: selectedMethod,
        withdrawalAddress: address
      });

      if (response.success) {
        toast.success('Withdrawal request submitted successfully! Pending admin approval.');
        setAmount('');
        setAddress('');
        fetchWithdrawals();
      } else {
        toast.error(response.message || 'Failed to submit withdrawal');
      }
    } catch (error) {
      console.error('Withdrawal action error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="badge-pending">Pending</span>;
      case 'Approved':
      case 'Completed':
        return <span className="badge-approved">Approved</span>;
      case 'Rejected':
        return <span className="badge-rejected">Rejected</span>;
      default:
        return <span className="text-muted-foreground text-xs">{status}</span>;
    }
  };

  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod);
  
  // Get user tier info
  const userTier = user?.investmentTier || 'None';
  const tierInfo = TIER_CONFIG[userTier as keyof typeof TIER_CONFIG] || TIER_CONFIG.None;
  
  // FIXED: Calculate available from bonusBalance + totalEarned (deposits are LOCKED)
  // Using correct property names from your User interface
  const totalBonus = user?.bonusBalance || 0;        // bonusBalance (not totalBonus)
  const totalEarnings = user?.totalEarned || 0;      // totalEarned (not totalEarnings)
  const totalBalance = user?.totalBalance || 0;
 // const totalDeposited = user?.totalDeposited || 0;  // totalDeposited (locked)
  
  // Available = Bonus + Earned only (deposits excluded)
  const maxWithdrawal = totalBonus + totalEarnings;
  
  // FIXED: Get tier limit from TIER_CONFIG instead of user.withdrawalLimit
  const withdrawalLimit = tierInfo.maxWithdrawal;

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-danger/20 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-danger" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">Request Withdrawal</h2>
            <p className="text-muted-foreground">
              Withdraw your earnings to your preferred payment method
            </p>
          </div>
        </div>
      </div>

      {/* Tier Info Banner */}
      <div className="glass-card p-4 border-l-4 border-gold">
        <div className="flex items-center gap-3">
          <Crown className={`w-6 h-6 ${tierInfo.color}`} />
          <div>
            <p className="text-black font-medium">
              Current Tier: <span className={tierInfo.color}>{tierInfo.name}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Min. Balance: ${tierInfo.minBalance.toLocaleString()} | 
              Max Withdrawal: ${tierInfo.maxWithdrawal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Balance Info - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="balance-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs text-gray-600">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-black">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Deposits + Earnings + Bonus
          </p>
        </div>

        <div className="balance-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <Info className="w-5 h-5 text-gold" />
            </div>
            <span className="text-xs text-gray-600">Available to Withdraw</span>
          </div>
          <p className="text-2xl font-bold text-black">
            ${maxWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          {/* FIXED: Updated text to reflect actual logic (no minimum, deposits locked) */}
          <p className="text-xs text-gray-500 mt-1">
            Bonus + Earnings (Deposits locked)
          </p>
        </div>

        <div className="balance-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs text-gray-600">Tier Limit</span>
          </div>
          <p className="text-2xl font-bold text-black">
            ${withdrawalLimit.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Per transaction limit
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Input */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-black mb-4">
              Withdrawal Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold text-xl font-bold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount (min $${selectedMethodData?.minAmount})`}
                className="input-trading w-full pl-10 pr-4 py-4 text-xl"
                min={selectedMethodData?.minAmount}
                max={maxWithdrawal}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Min: ${selectedMethodData?.minAmount} | Max: ${maxWithdrawal.toFixed(2)}
              </p>
              <button
                onClick={() => setAmount(maxWithdrawal.toString())}
                className="text-xs text-gold hover:underline"
              >
                Max
              </button>
            </div>
            {parseFloat(amount) > withdrawalLimit && (
              <p className="text-xs text-red-400 mt-2">
                ⚠️ Amount exceeds your tier limit of ${withdrawalLimit.toLocaleString()}
              </p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-black mb-4">
              Select Withdrawal Method
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              {withdrawalMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-gold bg-gold/10'
                      : 'border-border hover:border-gold/50'
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center text-lg`}>
                    {method.icon}
                  </div>
                  <p className="text-black font-medium text-sm">{method.name}</p>
                  <p className="text-gray-600 text-xs">Min: ${method.minAmount}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Address Input */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-black mb-4">
              {selectedMethod === 'Bank Transfer' ? 'Bank Account Details' : `${selectedMethodData?.name} Address`}
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={
                selectedMethod === 'Bank Transfer'
                  ? 'Enter your bank account details (Account Name, Account Number, Bank Name, SWIFT Code)'
                  : `Enter your ${selectedMethodData?.name} wallet address`
              }
              className="input-trading w-full h-24 resize-none"
            />
            <div className="mt-4 p-4 bg-navy-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="text-white font-medium mb-1">Important:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Double-check your {selectedMethod === 'Bank Transfer' ? 'bank details' : 'wallet address'}</li>
                    <li>Processing time: {selectedMethodData?.processingTime}</li>
                    <li>Fee: {selectedMethodData?.fee}</li>
                    <li>Withdrawals require admin approval (24-48 hours)</li>
                    {/* FIXED: Removed minimum balance requirement line since user can withdraw to $0 */}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full btn-trading py-4"
            disabled={
              loading || 
              !amount || 
              !address || 
              parseFloat(amount) > maxWithdrawal ||
              parseFloat(amount) > withdrawalLimit
            }
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Submit Withdrawal Request
              </>
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Withdrawal Info */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Withdrawal Info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Method</span>
                <span className="text-black font-medium">{selectedMethodData?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Network</span>
                <span className="text-black font-medium">{selectedMethodData?.network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Min. Amount</span>
                <span className="text-black font-medium">${selectedMethodData?.minAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Processing</span>
                <span className="text-black font-medium">{selectedMethodData?.processingTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Fee</span>
                <span className="text-black font-medium">{selectedMethodData?.fee}</span>
              </div>
            </div>
          </div>

          {/* Tier Requirements */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Tier Requirements</h3>
            <div className="space-y-3">
              {Object.entries(TIER_CONFIG).filter(([key]) => key !== 'None').map(([key, tier]) => (
                <div 
                  key={key} 
                  className={`p-3 rounded-lg ${userTier === key ? 'bg-gold/20 border border-gold' : 'bg-navy-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${tier.color}`}>{tier.name}</span>
                    {userTier === key && <Crown className="w-4 h-4 text-gold" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Min: ${tier.minBalance.toLocaleString()} | Limit: ${tier.maxWithdrawal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Withdrawals */}
          <div className="glass-card p-6 mb-20">
            <h3 className="text-lg font-semibold text-black mb-4">Recent Withdrawals</h3>
            {historyLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
              </div>
            ) : withdrawals.length > 0 ? (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal._id} className="p-3 bg-navy-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        ${withdrawal.amount.toLocaleString()}
                      </span>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                No withdrawal history
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsPage;