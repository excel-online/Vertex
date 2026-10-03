import { useState } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  TrendingUp, 
  Award, 
  Sparkles,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Rewards = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'claim' | 'history'>('claim');
  
  const [referralStats, setReferralStats] = useState({
    totalReferrals: user?.referralCount || 0,
    totalEarned: user?.referralBonus || 0,
    onboardingCount: 0,
    rewardedCount: user?.referralCount || 0,
  });

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode || 'TRADER'}`;

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
        // Fallback to copy if share cancelled
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-2xl mx-auto text-slate-800">
      
      {/* Top Header & Available Balance Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
        {/* Background mature image overlay with blend mode */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80')` }}></div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-4">
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
            <p className="text-purple-200 text-xs mt-1">Earned from referral bonuses & commissions</p>
          </div>

          {/* Action Tabs / Buttons Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setActiveTab('claim')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition-all shadow-md ${
                activeTab === 'claim'
                  ? 'bg-white text-purple-900 shadow-purple-900/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <span>Claim reward</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-purple-900 shadow-purple-900/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
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
              Earn rewards through our referral program! Invite your friends and get bonuses for each referral when they verify their account and meet the investment requirements[span_2](start_span)[span_2](end_span).
            </p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Referral link</label>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-slate-700 font-mono text-xs sm:text-sm truncate mr-2">{referralLink}</span>
          </div>

          {/* Secondary Action Buttons (Share, Copy, T&Cs) */}
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
              onClick={() => toast.info('Terms: Rewards are credited after referees complete verification and initial deposit.')}
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

        {/* 3-Column Metrics Grid */}
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
