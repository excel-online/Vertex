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
    color: 'from-gray-500 to-gray-600',
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
    color: 'from-amber-500 to-amber-600',
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
    color: 'from-blue-500 to-blue-600',
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
    color: 'from-purple-500 to-purple-600',
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
    <div className="space-y-6">
      {/* Current Tier Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">Current Package</p>
            <h2 className="text-3xl font-bold">{currentTier}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-blue-200 text-sm">Total Deposited</p>
              <p className="text-2xl font-bold">${user?.totalDeposited?.toLocaleString() || 0}</p>
            </div>
            <div className="w-16 h-16 bg-navy-50/20 rounded-xl flex items-center justify-center">
              <Crown className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-4 gap-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{benefit.title}</h4>
              <p className="text-gray-500 text-sm">{benefit.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Upgrade Tiers */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Choose Your Upgrade</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upgradeTiers.map((tier, index) => {
            const isCurrent = tier.name === currentTier;
            const isLocked = index > currentTierIndex + 1 && currentTierIndex !== -1;
            
            return (
              <div
                key={tier.id}
                onClick={() => !isCurrent && !isLocked && setSelectedTier(tier.id)}
                className={`relative bg-navy-50 rounded-xl shadow-sm border-2 transition-all ${
                  isCurrent
                    ? 'border-green-500'
                    : isLocked
                    ? 'border-gray-200 opacity-60 cursor-not-allowed'
                    : selectedTier === tier.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 cursor-pointer'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                    Current
                  </div>
                )}

                <div className={`h-2 rounded-t-xl bg-gradient-to-r ${tier.color}`}></div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{tier.name}</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600">${tier.minDeposit.toLocaleString()}</span>
                    <span className="text-gray-500">+ min</span>
                  </div>

                  <div className="mb-4">
                    <span className="text-green-600 font-semibold">{tier.referralBonus}%</span>
                    <span className="text-gray-500 text-sm"> Referral Bonus</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {tier.notIncluded.map((feature, i) => (
                      <li key={`not-${i}`} className="flex items-center gap-2 text-sm text-gray-400 line-through">
                        <span className="w-4 h-4 flex-shrink-0">×</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className={`w-full py-3 rounded-lg font-medium text-center transition-colors ${
                    isCurrent
                      ? 'bg-green-100 text-green-700'
                      : isLocked
                      ? 'bg-gray-100 text-gray-400'
                      : selectedTier === tier.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {isCurrent ? 'Current Plan' : isLocked ? 'Locked' : selectedTier === tier.id ? 'Selected' : 'Select'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Action */}
      {selectedTier && (
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-600">Selected Package</p>
              <p className="text-xl font-bold text-gray-800">
                {upgradeTiers.find(t => t.id === selectedTier)?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Minimum Deposit Required</p>
              <p className="text-2xl font-bold text-blue-600">
                ${upgradeTiers.find(t => t.id === selectedTier)?.minDeposit.toLocaleString()}
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpgrade}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
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

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Why Upgrade?</h4>
            <p className="text-blue-700 text-sm">
              Higher tiers unlock better returns, priority support, and exclusive features. 
              Your investment tier is automatically determined based on your total deposited amount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountUpgrade;
