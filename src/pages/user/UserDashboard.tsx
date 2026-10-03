import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  History,
  Settings,
  BarChart3,
  CheckCircle,
  MapPin,
  Users,
  Crown,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/api';
import type { DashboardData } from '@/types';
import { toast } from 'sonner';

// TradingView Chart Component
const TradingViewChart = ({
  symbol = "AAPL",
  exchange = "NASDAQ",
  interval = "30",
  theme = "dark"
}: {
  symbol?: string;
  exchange?: string;
  interval?: string;
  theme?: 'light' | 'dark';
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": `${exchange}:${symbol}`,
      "interval": interval,
      "timezone": "exchange",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "withdateranges": true,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "details": true,
      "hotlist": true,
      "calendar": false,
      "studies": [
        "AO@tv-basicstudies",
        "MACD@tv-basicstudies"
      ],
      "show_popup_button": true,
      "popup_width": "1000",
      "popup_height": "650"
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbol, exchange, interval, theme]);

  return (
    <div className="tradingview-widget-container w-full h-full min-h-[400px]" ref={containerRef}>
      <div className="tradingview-widget-container__widget w-full h-full"></div>
      <div className="tradingview-widget-copyright text-[10px] opacity-70 mt-2 text-right">
        <a
          href={`https://www.tradingview.com/symbols/${symbol}/`}
          rel="noopener nofollow"
          target="_blank"
          className="text-purple-400 hover:underline"
        >
          {symbol} Chart
        </a>
        <span className="text-gray-400"> by TradingView</span>
      </div>
    </div>
  );
};

// TradingView Ticker Widget Component
const TradingViewTicker = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
        { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "BTC/USD" },
        { "proName": "BITSTAMP:ETHUSD", "title": "ETH/USD" },
        { "proName": "NASDAQ:AAPL", "title": "Apple" },
        { "proName": "NASDAQ:GOOGL", "title": "Google" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full my-4 rounded-2xl overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-lg" ref={containerRef}>
      <div className="tradingview-widget-container__widget w-full"></div>
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartSymbol, setChartSymbol] = useState("AAPL");
  const [chartExchange, setChartExchange] = useState("NASDAQ");
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userService.getDashboard();
      if (response.success) {
        setDashboardData(response.dashboard);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Standard':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Premium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Starter':
        return 'text-slate-300 bg-slate-500/10 border-slate-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const quickSymbols = [
    { symbol: "AAPL", exchange: "NASDAQ", label: "Apple" },
    { symbol: "BTCUSD", exchange: "BINANCE", label: "Bitcoin" },
    { symbol: "EURUSD", exchange: "FX", label: "EUR/USD" },
    { symbol: "GOOGL", exchange: "NASDAQ", label: "Google" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* 1. TOP HEADER BAR: Profile & Greeting linking to Profile Page + Rewards Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 pb-1 border-b border-white/5">
        <NavLink to="/dashboard/settings" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-purple-500/30 group-hover:scale-105 transition-transform">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Welcome back</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
              Hi, <span className="text-white font-bold group-hover:text-purple-400 transition-colors">{user?.firstName || 'Trader'}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-3 h-3 mr-1" /> Verified
              </span>
            </h1>
          </div>
        </NavLink>

        <div className="flex items-center gap-3">
          <NavLink 
            to="/dashboard/rewards" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 font-semibold text-sm transition-all transform hover:scale-[1.02]"
          >
            <Gift className="w-4 h-4 text-purple-200" />
            Earn ${user?.bonusBalance?.toLocaleString() || '0.00'}
          </NavLink>
        </div>
      </div>

      {/* TradingView Ticker Widget */}
      <TradingViewTicker />

      {/* 2. MAIN BALANCE & MULTI-CURRENCY STYLE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/60 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium tracking-wide">Total Balance</span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Toggle balance visibility"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {showBalance ? `$${dashboardData?.user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}` : '••••••••'}
            </h2>
            <span className="text-emerald-400 text-sm font-medium flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Total Deposited</p>
                <p className="text-white font-bold text-lg mt-0.5">
                  {showBalance ? `$${dashboardData?.user.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}` : '••••'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Total Earnings</p>
                <p className="text-white font-bold text-lg mt-0.5">
                  {showBalance ? `$${dashboardData?.user.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}` : '••••'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Info Box */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base mb-2">Account Overview</h3>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-slate-300 text-sm">Tier</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTierColor(user?.investmentTier || 'None')}`}>
                {user?.investmentTier || 'Starter'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-slate-300 text-sm">Country</span>
              </div>
              <span className="text-white font-medium text-sm">{user?.country || 'Global'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-slate-300 text-sm">Referrals</span>
              </div>
              <span className="text-white font-semibold text-sm">{user?.referralCount || 0}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Security</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Protected
            </span>
          </div>
        </div>

      </div>

      {/* 3. CORE ACTION BUTTONS (Add money, Send/Withdraw, Signal Purchase, Upgrade) */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl">
        <h3 className="text-white font-semibold text-base mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NavLink to="/dashboard/deposits" className="group">
            <div className="bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 text-center transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <span className="text-white text-sm font-medium">Add Money</span>
            </div>
          </NavLink>

          <NavLink to="/dashboard/withdrawals" className="group">
            <div className="bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 text-center transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <span className="text-white text-sm font-medium">Send / Withdraw</span>
            </div>
          </NavLink>

          <NavLink to="/dashboard/signals" className="group">
            <div className="bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 text-center transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-white text-sm font-medium">Signal Purchase</span>
            </div>
          </NavLink>

          <NavLink to="/dashboard/upgrade" className="group">
            <div className="bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 text-center transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Crown className="w-6 h-6" />
              </div>
              <span className="text-white text-sm font-medium">Account Upgrade</span>
            </div>
          </NavLink>
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS FEED (Matching the notebook layout with "See All" link) */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-base">Recent Transactions</h3>
          <NavLink to="/dashboard/history" className="text-xs text-purple-400 hover:text-purple-300 font-medium">
            See all
          </NavLink>
        </div>

        <div className="space-y-3">
          {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
            dashboardData.recentTransactions.slice(0, 3).map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'Deposit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {tx.type === 'Deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{tx.type}</p>
                    <p className="text-slate-400 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm">
              No recent transactions found.
            </div>
          )}
        </div>
      </div>

      {/* 5. LIVE MARKET CHART PANEL */}
      <div className="rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold text-base">Market Candle Chart</h3>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {quickSymbols.map((item) => (
              <button
                key={item.symbol}
                onClick={() => {
                  setChartSymbol(item.symbol);
                  setChartExchange(item.exchange);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  chartSymbol === item.symbol
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[420px] w-full p-2">
          <TradingViewChart 
            symbol={chartSymbol}
            exchange={chartExchange}
            interval="30"
            theme="dark"
          />
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;
