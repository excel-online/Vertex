import { useState } from 'react';
import { Crown, Check, Star, ArrowRight, Zap, Shield, Headphones, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const upgradeTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: 100,
    minDeposit: 100,
    referralBonus: 3,
    color: 'from-slate-500 to-zinc-600',
    features: [
      'Low Trade Returns',
      'Basic Support',
      'Daily Market Updates',
      'Email Notifications'
    ],
    notIncluded: ['No Risk Management', 'No Training']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 5000,
    minDeposit: 5000,
    referralBonus: 5,
    color: 'from-amber-500 to-yellow-600',
    popular: true,
    features: [
      'No Risk Management',
      'Priority Support',
      'Weekly Reports',
      'SMS Notifications',
      'Personal Account Manager'
    ],
    notIncluded: ['No Training']
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 20000,
    minDeposit: 20000,
    referralBonus: 7,
    color: 'from-blue-500 to-indigo-600',
    features: [
      'No Risk Management',
      '24/7 Premium Support',
      'Daily Reports',
      'Personal Account Manager',
      'Advanced Analytics'
    ],
    notIncluded: []
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 50000,
    minDeposit: 50000,
    referralBonus: 8,
    color: 'from-purple-500 to-pink-600',
    features: [
      'Free Training',
      'Encrypted MT4 Robot',
      'Dedicated Support Team',
      'Instant Withdrawals',
      'Custom Investment Plans',
      'Exclusive Market Insights'
    ],
    notIncluded: []
  }
];

const benefits = [
  { icon: TrendingUp, title: 'Higher Returns', desc: 'Better profit percentages' },
  { icon: Shield, title: 'Risk Management', desc: 'Advanced protection tools' },
  { icon: Headphones, title: 'Priority Support', desc: '24/7 dedicated assistance' },
  { icon: Zap, title: 'Instant Features', desc: 'Unlock premium tools' }
];

const AccountUpgrade = () => {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentTier = user?.investmentTier || 'None';
  const currentTierIndex = upgradeTiers.findIndex(t => t.name === currentTier);

  const handleUpgrade = async () => {
    if (!selectedTier) {
      toast.error('Please select a tier to upgrade');
      return;
    }

    const tier = upgradeTiers.find(t => t.id === selectedTier);
    if (!tier) return;

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Upgrade to ${tier.name} initiated! Please complete the payment.`);
      setSelectedTier(null);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      
      {/* Current Tier Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900/80 to-blue-900/60 border border-purple-500/30 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1">Current Package Tier</p>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{currentTier}</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-left md:text-right">
            <p className="text-slate-400 text-xs font-medium">Total Deposited</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">${user?.totalDeposited?.toLocaleString() || 0}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner flex-shrink-0">
            <Crown className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 text-center shadow-xl backdrop-blur-xl flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base mb-1">{benefit.title}</h4>
              <p className="text-slate-400 text-xs">{benefit.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Upgrade Tiers Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Choose Your Upgrade</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upgradeTiers.map((tier, index) => {
            const isCurrent = tier.name === currentTier;
            const isLocked = index > currentTierIndex + 1 && currentTierIndex !== -1;
            
            return (
              <div
                key={tier.id}
                onClick={() => !isCurrent && !isLocked && setSelectedTier(tier.id)}
                className={`relative rounded-3xl bg-slate-900/80 border transition-all shadow-xl backdrop-blur-xl flex flex-col justify-between overflow-hidden ${
                  isCurrent
                    ? 'border-emerald-500/50 bg-emerald-500/[0.03]'
                    : isLocked
                    ? 'border-white/5 opacity-50 cursor-not-allowed'
                    : selectedTier === tier.id
                    ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/[0.05]'
                    : 'border-white/10 hover:border-purple-500/40 cursor-pointer hover:bg-white/[0.02]'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full">
                    Popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                    Active
                  </div>
                )}

                <div className={`h-2.5 w-full bg-gradient-to-r ${tier.color}`}></div>
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-white">{tier.name}</h4>
                    
                    <div>
                      <span className="text-3xl font-extrabold text-white">${tier.minDeposit.toLocaleString()}</span>
                      <span className="text-slate-400 text-xs ml-1.5">min deposit</span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      +{tier.referralBonus}% Referral Bonus
                    </div>

                    <ul className="space-y-2.5 pt-2">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {tier.notIncluded.map((feature, i) => (
                        <li key={`not-${i}`} className="flex items-center gap-2.5 text-xs text-slate-600 line-through">
                          <span className="w-4 h-4 flex-shrink-0 text-center font-bold">×</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`w-full py-3 rounded-2xl font-bold text-xs text-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : isLocked
                      ? 'bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed'
                      : selectedTier === tier.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500/30'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}>
                    {isCurrent ? 'Current Plan' : isLocked ? 'Locked' : selectedTier === tier.id ? 'Selected' : 'Select Tier'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Action Card */}
      {selectedTier && (
        <div className="rounded-3xl bg-slate-900/80 border border-purple-500/40 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Selected Package</p>
              <p className="text-2xl font-extrabold text-white mt-0.5">
                {upgradeTiers.find(t => t.id === selectedTier)?.name}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Minimum Required Capital</p>
              <p className="text-2xl font-extrabold text-purple-400 mt-0.5">
                ${upgradeTiers.find(t => t.id === selectedTier)?.minDeposit.toLocaleString()}
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpgrade}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all cursor-pointer"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing Upgrade...
              </span>
            ) : (
              <>
                Proceed to Upgrade
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Information Banner */}
      <div className="rounded-3xl bg-purple-500/10 border border-purple-500/20 p-6 sm:p-8 flex items-start gap-5 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-400">
          <Star className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-purple-200 text-base">Why Upgrade Your Tier?</h4>
          <p className="text-xs sm:text-sm text-purple-300/80 leading-relaxed">
            Higher tier levels unlock elite trading returns, priority withdrawal processing speeds, personal managers, and exclusive investment insights. Your package status automatically scales based on cumulative equity.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AccountUpgrade;
