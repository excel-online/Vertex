import { useState, useEffect } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  TrendingUp, 
  Award, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/api';
import { toast } from 'sonner';

const Rewards = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: user?.referralCount || 0,
    totalEarned: user?.referralBonus || 0,
    pendingBonus: 0,
  });

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode || 'TRADER'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 pb-1 border-b border-white/5">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Affiliate & Growth</p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
            Referral Rewards & Bonuses
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-purple-400" /> Earn up to 8% Commission
        </div>
      </div>

      {/* Hero Banner with Illustration & Link Generation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <Gift className="w-3.5 h-3.5" /> Invite & Earn
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Grow Your Network, Multiply Your Income
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Share your unique referral link with friends, family, or your community. Receive instant commission bonuses straight to your balance every time they fund their accounts!
            </p>

            {/* Referral Link Box */}
            <div className="pt-2 space-y-2">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Your Exclusive Invite Link</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between backdrop-blur-md">
                  <span className="text-white font-mono text-sm truncate mr-2">{referralLink}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 text-sm shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Graphic / Illustration Container */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md h-72 sm:h-80 rounded-3xl bg-gradient-to-tr from-purple-600/20 via-indigo-600/10 to-transparent border border-white/10 flex items-center justify-center p-6 shadow-2xl backdrop-blur-xl group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent rounded-3xl"></div>
              
              {/* Floating stylized SVG Illustration representation */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/30 transform group-hover:scale-105 transition-transform duration-300">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Instant Payouts</h4>
                  <p className="text-slate-400 text-xs mt-1 max-w-[240px]">Commissions are automatically settled into your bonus wallet balance.</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-emerald-400 font-medium">Program Active & Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Referrals</p>
            <p className="text-3xl font-extrabold text-white mt-1">{referralStats.totalReferrals}</p>
            <p className="text-slate-400 text-xs mt-1">Friends registered</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner">
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Earned</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">${referralStats.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-slate-400 text-xs mt-1">Lifetime rewards</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Referral Code</p>
            <p className="text-2xl font-mono font-bold text-white mt-1">{user?.referralCode || 'N/A'}</p>
            <p className="text-purple-400 text-xs mt-1">Share with friends</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
            <Award className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Referral Activity / Info Breakdown */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
        <h3 className="text-lg font-bold text-white">How It Works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">1</div>
            <h4 className="text-white font-semibold text-base">Share Your Link</h4>
            <p className="text-slate-400 text-sm">Send your unique invite code or link to colleagues, friends, or share it on your socials.</p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</div>
            <h4 className="text-white font-semibold text-base">Friends Join & Deposit</h4>
            <p className="text-slate-400 text-sm">When your referees create an account and complete their investment deposit, you qualify.</p>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
            <h4 className="text-white font-semibold text-base">Collect Rewards</h4>
            <p className="text-slate-400 text-sm">Get credited automatically with bonus percentages directly in your rewards wallet.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Rewards;
