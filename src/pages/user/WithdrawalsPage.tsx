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
  None: { name: 'No Tier', minBalance: 0, maxWithdrawal: 0, color: 'text-slate-400' },
  Starter: { name: 'Starter', minBalance: 50, maxWithdrawal: 1000, color: 'text-blue-400' },
  Premium: { name: 'Premium', minBalance: 2000, maxWithdrawal: 5000, color: 'text-purple-400' },
  Standard: { name: 'Standard', minBalance: 5000, maxWithdrawal: 15000, color: 'text-amber-400' },
  VIP: { name: 'VIP', minBalance: 10000, maxWithdrawal: 50000, color: 'text-emerald-400' }
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
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case 'Approved':
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Approved</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Rejected</span>;
      default:
        return <span className="text-slate-400 text-xs">{status}</span>;
    }
  };

  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod);
  
  const userTier = user?.investmentTier || 'None';
  const tierInfo = TIER_CONFIG[userTier as keyof typeof TIER_CONFIG] || TIER_CONFIG.None;
  
  const totalBonus = user?.bonusBalance || 0;
  const totalEarnings = user?.totalEarned || 0;
  const totalBalance = user?.totalBalance || 0;
  
  const maxWithdrawal = totalBonus + totalEarnings;
  const withdrawalLimit = tierInfo.maxWithdrawal;

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
          <ArrowUpRight className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Request Withdrawal</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Withdraw your earnings to your preferred payment method safely
          </p>
        </div>
      </div>

      {/* Tier Info Banner */}
      <div className="rounded-2xl bg-slate-900/80 border border-white/10 border-l-4 border-l-purple-500 p-4 sm:p-5 shadow-lg backdrop-blur-xl flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
          <Crown className={`w-5 h-5 ${tierInfo.color}`} />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
            Current Tier: <span className={`px-2 py-0.5 rounded-md text-xs font-bold bg-white/5 border border-white/10 ${tierInfo.color}`}>{tierInfo.name}</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Min. Balance: <span className="text-white font-medium">${tierInfo.minBalance.toLocaleString()}</span> | Max Withdrawal: <span className="text-white font-medium">${tierInfo.maxWithdrawal.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Balance Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Balance</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400 mt-1">Deposits + Earnings + Bonus</p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Available to Withdraw</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              ${maxWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400 mt-1">Bonus + Earnings (Deposits locked)</p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tier Limit</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ${withdrawalLimit.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">Per transaction limit</p>
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Withdrawal Form Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Amount Input Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
            <label className="block text-sm font-semibold text-white">
              Withdrawal Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-xl font-bold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount (min $${selectedMethodData?.minAmount})`}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-16 py-4 text-white text-xl font-medium focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500"
                min={selectedMethodData?.minAmount}
                max={maxWithdrawal}
              />
              <button
                onClick={() => setAmount(maxWithdrawal.toString())}
                className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-semibold transition-colors border border-purple-500/30"
              >
                MAX
              </button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Min: ${selectedMethodData?.minAmount} \vert{} Max:${maxWithdrawal.toFixed(2)}</span>
            </div>

            {parseFloat(amount) > withdrawalLimit && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl mt-2">
                ⚠️ Amount exceeds your tier transaction limit of ${withdrawalLimit.toLocaleString()}
              </p>
            )}
          </div>

          {/* Payment Methods Selection */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
            <label className="block text-sm font-semibold text-white">
              Select Withdrawal Method
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              {withdrawalMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                    selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-xl text-white font-bold shadow-md flex-shrink-0`}>
                    {method.icon}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{method.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Min: ${method.minAmount}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Address / Details Input */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-4">
            <label className="block text-sm font-semibold text-white">
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
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none placeholder:text-slate-500"
            />
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white mb-1">Important Withdrawal Guidelines:</p>
                  <ul className="space-y-1 list-disc list-inside text-slate-300">
                    <li>Double-check your {selectedMethod === 'Bank Transfer' ? 'bank account details' : 'wallet address'} before submitting.</li>
                    <li>Estimated Processing Time: <span className="text-white font-medium">{selectedMethodData?.processingTime}</span></li>
                    <li>Transfer Fee: <span className="text-white font-medium">{selectedMethodData?.fee}</span></li>
                    <li>All withdrawals require manual security review and admin approval (24–48 hours).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/20 transition-all cursor-pointer"
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
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing Request...
              </span>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Submit Withdrawal Request
              </>
            )}
          </Button>

        </div>

        {/* Sidebar Information Column */}
        <div className="space-y-6">
          
          {/* Method Info Summary */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Method Specifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs">Method</span>
                <span className="text-white font-semibold text-xs">{selectedMethodData?.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs">Network</span>
                <span className="text-white font-semibold text-xs">{selectedMethodData?.network}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs">Min. Amount</span>
                <span className="text-white font-semibold text-xs">${selectedMethodData?.minAmount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs">Processing Time</span>
                <span className="text-white font-semibold text-xs">{selectedMethodData?.processingTime}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs">Fee Structure</span>
                <span className="text-white font-semibold text-xs">{selectedMethodData?.fee}</span>
              </div>
            </div>
          </div>

          {/* Tier Requirements Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Tier Requirements</h3>
            <div className="space-y-2.5">
              {Object.entries(TIER_CONFIG).filter(([key]) => key !== 'None').map(([key, tier]) => (
                <div 
                  key={key} 
                  className={`p-3 rounded-2xl transition-all border ${
                    userTier === key 
                      ? 'bg-purple-600/10 border-purple-500/40 shadow-md' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${tier.color}`}>{tier.name}</span>
                    {userTier === key && <Crown className="w-4 h-4 text-purple-400" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Min Balance: ${tier.minBalance.toLocaleString()} \vert{} Limit:${tier.maxWithdrawal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Withdrawals Widget */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl mb-12">
            <h3 className="text-base font-bold text-white mb-4">Recent Withdrawals</h3>
            {historyLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              </div>
            ) : withdrawals.length > 0 ? (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal._id} className="p-3.5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold text-sm">
                        ${withdrawal.amount.toLocaleString()}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-6">
                No recent withdrawal records found.
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default WithdrawalsPage;
