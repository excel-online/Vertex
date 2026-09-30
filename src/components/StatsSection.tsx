import { useEffect, useState } from 'react';
import { Globe, Users, TrendingUp, Building2 } from 'lucide-react';

const StatsSection = () => {
  const [counts, setCounts] = useState({
    countries: 0,
    satisfaction: 0,
    trades: 0,
    withdrawal: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        countries: Math.floor((80 / steps) * step),
        satisfaction: Math.floor((98 / steps) * step),
        trades: Math.floor((5066000 / steps) * step),
        withdrawal: Math.floor((18370000 / steps) * step),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          countries: 80,
          satisfaction: 98,
          trades: 5066000,
          withdrawal: 18370000,
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1920&q=80')`
      }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-blue-950/85"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-4xl font-bold tracking-wider mb-2">STATS</h2>
        <div className="w-16 h-1 bg-amber-500 mx-auto mb-16 rounded-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mb-6 bg-white/5 backdrop-blur-sm">
              <Globe className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-4xl font-extrabold mb-2">{counts.countries}+</h3>
            <p className="text-gray-300 font-medium tracking-wide text-sm uppercase">Active Countries</p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mb-6 bg-white/5 backdrop-blur-sm">
              <Users className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-4xl font-extrabold mb-2">{counts.satisfaction}%</h3>
            <p className="text-gray-300 font-medium tracking-wide text-sm uppercase">Client Satisfaction</p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mb-6 bg-white/5 backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-4xl font-extrabold mb-2">{counts.trades.toLocaleString()}+</h3>
            <p className="text-gray-300 font-medium tracking-wide text-sm uppercase">Trades</p>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mb-6 bg-white/5 backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-4xl font-extrabold mb-2">{counts.withdrawal.toLocaleString()}+</h3>
            <p className="text-gray-300 font-medium tracking-wide text-sm uppercase">Withdrawal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
