import { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Share2, 
  Users, 
  Award, 
  Sparkles,
  ArrowRight,
  BarChart3,
  ArrowLeft,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define types for your real data records
interface WithdrawalRecord {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
}

interface RewardRecord {
  id: string;
  amount: number;
  source: string; // e.g., "Referral Bonus - John Doe"
  date: string;
}

const Rewards = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'main' | 'history'>('main');
  const [historyTab, setHistoryTab] = useState<'withdrawals' | 'rewarded'>('withdrawals');
  
  // Real data state (you can replace these with your API call values or user state)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [rewardsList, setRewardsList] = useState<RewardRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [referralStats] = useState({
    totalReferrals: user?.referralCount || 0,
    totalEarned: user?.referralBonus || 0,
    onboardingCount: 0,
    rewardedCount: user?.referralCount || 0,
  });

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode || 'TRADER'}`;

  // Optional: Fetch real data when navigating to history view
  useEffect(() => {
    if (viewMode === 'history') {
      fetchRewardHistoryData();
    }
  }, [viewMode]);

  const fetchRewardHistoryData = async () => {
    setIsLoadingHistory(true);
    try {
      // Replace this block with your actual API endpoint calls:
      // const res = await fetch('/api/user/reward-history', { headers: { Authorization: `Bearer ${token}` } });
      // const data = await res.json();
      // setWithdrawals(data.withdrawals);
      // setRewardsList(data.rewards);

      // Simulating real data check (using user data or empty state if none)
      // If user has a bonus, we can push a sample history item or load real ones
      if (user?.referralBonus && user.referralBonus > 0) {
        setRewardsList([
          {
            id: '1',
            amount: user.referralBonus,
            source: 'Initial Referral Bonus Pool',
            date: new Date().toLocaleDateString(),
          }
        ]);
      }
    } catch (err) {
      toast.error('Failed to load history data');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Vellumtrade',
          text: 'Join me on Vellumtrade and start growing your investment portfolio today!',
          url: referralLink,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // If viewMode is 'history', render the history views with dynamic list rendering or empty state fallbacks
  if (viewMode === 'history') {
    return (
      <div className="space-y-6 pb-16 max-w-2xl mx-auto text-slate-800">
        {/* Top Bar with Back Button */}
        <div className="flex items-center gap-3 pt-2 pb-2 border-b border-slate-100">
          <button 
            onClick={() => setViewMode('main')}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-900">Reward history</h2>
        </div>

        {/* Tabs: Withdrawals vs Rewarded */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setHistoryTab('withdrawals')}
            className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
              historyTab === 'withdrawals' ? 'text-purple-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Withdrawals
            {historyTab === 'withdrawals' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setHistoryTab('rewarded')}
            className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
              historyTab === 'rewarded' ? 'text-purple-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Rewarded
            {historyTab === 'rewarded' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 rounded-full" />
            )}
          </button>
        </div>

        {/* Content Area: Real Records or Empty State */}
        {isLoadingHistory ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : historyTab === 'withdrawals' ? (
          withdrawals.length > 0 ? (
            <div className="space-y-3 pt-2">
              {withdrawals.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">${item.amount.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{item.method} • {item.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-50/80 text-indigo-400 flex items-center justify-center border border-indigo-100/50 shadow-inner">
                <FileText className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No withdrawal history</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">You currently do not have any withdrawals</p>
              </div>
            </div>
          )
        ) : (
          rewardsList.length > 0 ? (
            <div className="space-y-3 pt-2">
              {rewardsList.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">+${item.amount.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 font-medium">{item.source}</p>
                    <p className="text-[11px] text-slate-400">{item.date}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-50/80 text-indigo-400 flex items-center justify-center border border-indigo-100/50 shadow-inner">
                <FileText className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No reward history</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">You currently do not have any rewards</p>
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  // Main Rewards View
  return (
    <div className="space-y-6 pb-16 max-w-2xl mx-auto text-slate-800">
      
      {/* Top Header & Available Balance Banner with Photo & Overlay */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80" 
            alt="Rewards Background" 
            className="w-full h-full object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-indigo-900/85 to-purple-800/90 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-200">Available Balance</span>
            <div className="w-12 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <div className="w-6 h-4 rounded bg-blue-500/80"></div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ${referralStats.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-purple-200/80 text-xs mt-1">Earned from referral bonuses & commissions</p>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => toast.info('Claim reward feature is ready for your next payout milestone!')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition-all shadow-md bg-white text-purple-900 shadow-purple-900/20 hover:bg-purple-50"
            >
              <span>Claim reward</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('history')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition-all bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            >
              <span>Reward history</span>
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Promo Card: Invite Friends and Earn */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Invite friends and earn $155</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
              Earn rewards through our referral program! Invite your friends and get bonuses for each referral when they verify their account and meet the investment requirements.
            </p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Referral link</label>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-slate-700 font-mono text-xs sm:text-sm truncate mr-2">{referralLink}</span>
          </div>

          {/* Secondary Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
              <span>Share</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-purple-600" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => toast.info("Terms: Rewards are credited after referees complete verification and initial deposit.")}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-50 hover:bg-purple-50 hover:text-purple-600 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>T & C's</span>
            </button>
          </div>
        </div>
      </div>

      {/* Your Invite History Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Your invite history</h3>
          <button 
            onClick={() => toast.info(`Total referrals registered: ${referralStats.totalReferrals}`)}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700"
          >
            See all invites
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-2xl font-extrabold text-slate-900">{referralStats.totalReferrals}</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Invited</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-2xl font-extrabold text-slate-900">{referralStats.onboardingCount}</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Onboarding</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <p className="text-2xl font-extrabold text-slate-900">{referralStats.rewardedCount}</p>
            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Rewarded</p>
          </div>
        </div>
      </div>

      {/* Code Display Box */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">My Referral Code</p>
            <p className="text-lg font-mono font-bold text-slate-900 mt-0.5">{user?.referralCode || 'TRADER'}</p>
          </div>
        </div>
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-semibold text-xs transition-colors"
        >
          Copy Code
        </button>
      </div>

    </div>
  );
};

export default Rewards;
