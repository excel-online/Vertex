import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Gift,
  History,
  Settings,
  Receipt,
  BarChart3,
  Star,
  CheckCircle,
  MapPin,
  Users,
  Crown,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
          className="text-blue-400 hover:underline"
        >
          {symbol} Chart
        </a>
        <span className="text-gray-500"> by TradingView</span>
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
      "isTransparent": false,
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
    <div className="tradingview-widget-container w-full" ref={containerRef}>
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
        return 'text-purple-600';
      case 'Standard':
        return 'text-blue-600';
      case 'Premium':
        return 'text-amber-600';
      case 'Starter':
        return 'text-gray-600';
      default:
        return 'text-gray-500';
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Profile Header Card */}
      <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-navy-50 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-bold text-blue-600">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
                <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Verified</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-blue-100">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user?.country || 'Not specified'}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {user?.accountType || 'CryptoCurrency Investment'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <NavLink to="/dashboard/deposits">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </NavLink>
              <NavLink to="/dashboard/withdrawals">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${dashboardData?.user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Available for withdrawal
          </p>
        </div>

        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Total Deposit</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${dashboardData?.user.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Lifetime deposits</p>
        </div>

        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Total Bonus</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${dashboardData?.user.bonusBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Referral & promo bonuses</p>
        </div>

        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Total Earning</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${dashboardData?.user.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
          <p className="text-xs text-gray-400 mt-1">From investments</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NavLink to="/dashboard/history">
          <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-800">Trading History</p>
            <p className="text-sm text-gray-500">View your trades</p>
          </div>
        </NavLink>

        <NavLink to="/dashboard/settings">
          <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <p className="font-semibold text-gray-800">Settings</p>
            <p className="text-sm text-gray-500">Manage account</p>
          </div>
        </NavLink>

        <NavLink to="/dashboard/transactions" className="col-span-2">
          <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors cursor-pointer group h-full">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-800">View Transactions</p>
            <p className="text-sm text-gray-500">All transactions</p>
          </div>
        </NavLink>

        {/* 
        <NavLink to="/dashboard/signals">
          <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <p className="font-semibold text-gray-800">Signal Purchase</p>
            <p className="text-sm text-gray-500">Buy trading signals</p>
          </div>
        </NavLink>
        */}
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-500" />
                <span className="text-gray-600">Package</span>
              </div>
              <span className={`font-semibold ${getTierColor(user?.investmentTier || 'None')}`}>
                {user?.investmentTier || 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Signal</span>
              </div>
              <span className="font-semibold text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600">Total Referrals</span>
              </div>
              <span className="font-semibold text-gray-800">{user?.referralCount || 0}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Account Type</span>
              </div>
              <span className="font-semibold text-gray-800">{user?.accountType || 'Investment'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Account Status</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Live TradingView Chart */}
        <div className="bg-[#131722] rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="absolute top-3 right-3 z-20 flex gap-1">
            {quickSymbols.map((item) => (
              <button
                key={item.symbol}
                onClick={() => {
                  setChartSymbol(item.symbol);
                  setChartExchange(item.exchange);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  chartSymbol === item.symbol
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 backdrop-blur-sm'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="h-[400px] w-full">
            <TradingViewChart 
              symbol={chartSymbol}
              exchange={chartExchange}
              interval="30"
              theme="dark"
            />
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 my-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Referral Program</h3>
            <p className="text-blue-100 text-sm">Invite friends and earn up to 8% referral bonus!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-navy-50/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-blue-200 text-xs">Your Code</p>
              <p className="text-white font-mono font-semibold">{user?.referralCode}</p>
            </div>
            <div className="bg-navy-50/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-blue-200 text-xs">Earned</p>
              <p className="text-white font-semibold">${user?.referralBonus?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TradingView Ticker Widget at Footer */}
      <div className="mt-8">
        <TradingViewTicker />
      </div>
    </div>
  );
};

export default UserDashboard;