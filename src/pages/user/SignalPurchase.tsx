import { useState } from 'react';
import { BarChart3, Check, AlertCircle, TrendingUp, Clock, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const signalPackages = [
  {
    id: 'basic',
    name: 'Basic Signals',
    price: 50,
    duration: '7 Days',
    features: [
      '3-5 Signals per day',
      'Forex & Crypto pairs',
      'Entry & Exit points',
      'Email notifications'
    ],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'premium',
    name: 'Premium Signals',
    price: 150,
    duration: '30 Days',
    features: [
      '8-12 Signals per day',
      'All trading pairs',
      'Detailed analysis',
      'SMS + Email alerts',
      'Risk management tips'
    ],
    color: 'from-amber-500 to-orange-600',
    popular: true
  },
  {
    id: 'vip',
    name: 'VIP Signals',
    price: 500,
    duration: '90 Days',
    features: [
      'Unlimited signals',
      'All markets covered',
      '1-on-1 consultation',
      'Priority support',
      'Custom strategies',
      'Personal analyst'
    ],
    color: 'from-purple-500 to-fuchsia-600'
  }
];

const SignalPurchase = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error('Please select a signal package');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Signal package purchased successfully! You will receive signals shortly.');
      setSelectedPackage(null);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      
      {/* Info Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 shadow-inner">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white tracking-tight">Professional Trading Signals</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Get access to our expert trading signals with high accuracy rates. Our team of professional 
            traders analyzes the market 24/7 to provide you with the best entry and exit points.
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-white text-base">High Accuracy</h4>
          <p className="text-slate-400 text-xs leading-relaxed">Our signals maintain an average success rate of 85% across markets</p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-white text-base">Real-time Alerts</h4>
          <p className="text-slate-400 text-xs leading-relaxed">Get instant notifications the moment new signals are generated</p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-white text-base">Risk Management</h4>
          <p className="text-slate-400 text-xs leading-relaxed">Each signal includes calculated stop-loss and take-profit levels</p>
        </div>

      </div>

      {/* Packages Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Select a Package</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {signalPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative rounded-3xl bg-slate-900/80 border-2 cursor-pointer transition-all shadow-xl backdrop-blur-xl overflow-hidden flex flex-col justify-between ${
                selectedPackage === pkg.id
                  ? 'border-purple-500 shadow-purple-500/10 ring-2 ring-purple-500/20'
                  : 'border-white/10 hover:border-purple-500/40'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`h-2.5 w-full bg-gradient-to-r ${pkg.color}`}></div>
              
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-xl font-extrabold text-white mb-2">{pkg.name}</h4>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-4xl font-black text-white">${pkg.price}</span>
                    <span className="text-slate-400 text-sm">/ {pkg.duration}</span>
                  </div>

                  <ul className="space-y-3.5 border-t border-white/10 pt-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`w-full py-3.5 rounded-2xl font-semibold text-center text-sm transition-all border ${
                  selectedPackage === pkg.id
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}>
                  {selectedPackage === pkg.id ? 'Selected Package' : 'Select Package'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Checkout Card */}
      {selectedPackage && (
        <div className="rounded-3xl bg-slate-900/80 border border-purple-500/40 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Selected Package</p>
              <p className="text-2xl font-bold text-white mt-1">
                {signalPackages.find(p => p.id === selectedPackage)?.name}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Investment</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                ${signalPackages.find(p => p.id === selectedPackage)?.price}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handlePurchase}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/25 transition-all cursor-pointer"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing Order...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Complete Purchase Now
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Disclaimer Notice */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-300 text-sm">Important Notice</h4>
          <p className="text-amber-200/80 text-xs leading-relaxed">
            Trading signals are for informational and educational purposes only. Past performance does not guarantee 
            future market results. Always do your own thorough research and never trade or invest more than you can comfortably afford to lose.
          </p>
        </div>
      </div>

    </div>
  );
};

export default SignalPurchase;
