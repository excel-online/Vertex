import { useState } from 'react';
import { BarChart3, Check, AlertCircle, TrendingUp, Clock, Shield } from 'lucide-react';
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
    color: 'from-blue-500 to-blue-600'
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
    color: 'from-amber-500 to-amber-600',
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
    color: 'from-purple-500 to-purple-600'
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
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Trading Signals</h3>
            <p className="text-gray-600">
              Get access to our expert trading signals with high accuracy rates. Our team of professional 
              traders analyzes the market 24/7 to provide you with the best entry and exit points.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">High Accuracy</h4>
          <p className="text-gray-600 text-sm">Our signals have an average success rate of 85%</p>
        </div>
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Real-time Alerts</h4>
          <p className="text-gray-600 text-sm">Get instant notifications when signals are generated</p>
        </div>
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Risk Management</h4>
          <p className="text-gray-600 text-sm">Each signal includes stop-loss and take-profit levels</p>
        </div>
      </div>

      {/* Packages */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Select a Package</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {signalPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative bg-navy-50 rounded-xl shadow-sm border-2 cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`h-2 rounded-t-xl bg-gradient-to-r ${pkg.color}`}></div>
              
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h4>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-blue-600">${pkg.price}</span>
                  <span className="text-gray-500">/ {pkg.duration}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={`w-full py-3 rounded-lg font-medium text-center transition-colors ${
                  selectedPackage === pkg.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Button */}
      {selectedPackage && (
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-600">Selected Package</p>
              <p className="text-xl font-bold text-gray-800">
                {signalPackages.find(p => p.id === selectedPackage)?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                ${signalPackages.find(p => p.id === selectedPackage)?.price}
              </p>
            </div>
          </div>
          <Button
            onClick={handlePurchase}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              'Purchase Now'
            )}
          </Button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">Important Notice</h4>
            <p className="text-amber-700 text-sm">
              Trading signals are for informational purposes only. Past performance does not guarantee 
              future results. Always do your own research and never invest more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalPurchase;
