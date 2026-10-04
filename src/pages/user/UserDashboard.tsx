import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  BarChart3,
  CheckCircle,
  MapPin,
  Users,
  Crown,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Plus,
  Send,
  User as UserIcon
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
  theme = "light"
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
    <div className="tradingview-widget-container w-full h-full min-h-[380px]" ref={containerRef}>
      <div className="tradingview-widget-container__widget w-full h-full"></div>
      <div className="tradingview-widget-copyright text-[10px] opacity-70 mt-1 text-right">
        <a
          href={`https://www.tradingview.com/symbols/${symbol}/`}
          rel="noopener nofollow"
          target="_blank"
          className="text-purple-600 hover:underline"
        >
          {symbol} Chart
        </a>
        <span className="text-slate-500"> by TradingView</span>
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
      "colorTheme": "light",
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
    <div className="tradingview-widget-container w-full my-2 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm" ref={containerRef}>
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
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Standard':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Premium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Starter':
        return 'text-slate-700 bg-slate-100 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A4FE6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16 max-w-7xl mx-auto px-4 sm:px-6 text-slate-800">

      {/* 1. TOP HEADER — reference style: soft lavender gradient band */}
      <div className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2 pb-6 bg-gradient-to-b from-[#DCD7FA] via-[#EFEDFC] to-transparent rounded-b-[2.5rem]">
        <div className="flex items-center justify-between gap-3">
          <NavLink to="/dashboard/settings" className="flex items-center gap-3 group min-w-0">
            <div className="w-11 h-11 shrink-0 rounded-full bg-[#5A4FE6] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 truncate">
                Hi, <span className="truncate">{user?.firstName || 'Trader'}</span>
                <span className="inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" /> Verified
                </span>
              </h1>
            </div>
          </NavLink>

          <NavLink
            to="/dashboard/rewards"
            className="shrink-0 bg-[#5A4FE6] hover:bg-[#4B3FD1] text-white px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 font-semibold text-xs transition-all"
          >
            <Gift className="w-3.5 h-3.5 text-purple-200" />
            Earn ${user?.bonusBalance?.toLocaleString() || '155.00'}
          </NavLink>
        </div>
      </div>

      {/* TradingView Ticker Widget (untouched) */}
      <TradingViewTicker />

      {/* 2. MAIN BALANCE & ACCOUNT OVERVIEW CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Toggle balance visibility"
            >
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {showBalance ? `$${dashboardData?.user.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}` : '••••••••'}
            </h2>
            <span className="text-emerald-700 text-xs font-semibold flex items-center bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" /> Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            {/* Total Deposited — reference currency-card style */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs font-medium">Total Deposited</span>
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {showBalance ? `$${dashboardData?.user.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}` : '••••'}
              </p>
            </div>

            {/* Total Earnings — reference currency-card style */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs font-medium">Total Earnings</span>
                <div className="w-9 h-9 rounded-full bg-purple-50 text-[#5A4FE6] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {showBalance ? `$${dashboardData?.user.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}` : '••••'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Info Box */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-slate-900 font-bold text-sm mb-1">Account Overview</h3>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 text-xs font-medium">Tier</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getTierColor(user?.investmentTier || 'None')}`}>
                {user?.investmentTier || 'Starter'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 text-xs font-medium">Country</span>
              </div>
              <span className="text-slate-900 font-semibold text-xs">{user?.country || 'Nigeria'}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-600 text-xs font-medium">Referrals</span>
              </div>
              <span className="text-slate-900 font-semibold text-xs">{user?.referralCount || 0}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Security</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Protected
            </span>
          </div>
        </div>

      </div>

      {/* 3. CORE ACTION BUTTONS — reference circular-button style */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
        <h3 className="text-slate-900 font-bold text-sm mb-5">Quick Actions</h3>
        <div className="flex items-start justify-between sm:justify-around gap-2">
          <NavLink to="/dashboard/deposits" className="group flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-full bg-[#5A4FE6] text-white flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-slate-800 text-xs font-semibold text-center">Add Money</span>
          </NavLink>

          <NavLink to="/dashboard/withdrawals" className="group flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#E4E2F7] text-[#5A4FE6] flex items-center justify-center group-hover:border-[#5A4FE6] group-hover:scale-105 transition-all">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-slate-800 text-xs font-semibold text-center">Send / Withdraw</span>
          </NavLink>

          <NavLink to="/dashboard/signals" className="group flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#E4E2F7] text-[#5A4FE6] flex items-center justify-center group-hover:border-[#5A4FE6] group-hover:scale-105 transition-all">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-slate-800 text-xs font-semibold text-center">Signal Purchase</span>
          </NavLink>
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS FEED */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-900 font-bold text-sm">Recent Transactions</h3>
          <NavLink to="/dashboard/history" className="text-xs text-[#5A4FE6] hover:text-[#4B3FD1] font-semibold">
            See all
          </NavLink>
        </div>

        <div className="space-y-2.5">
          {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
            dashboardData.recentTransactions.slice(0, 3).map((tx) => (
              <div key={tx._id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    tx.type === 'Deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {tx.type === 'Deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-slate-900 text-xs font-semibold">{tx.type}</p>
                    <p className="text-slate-500 text-[11px]">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold mb-0.5 ${tx.type === 'Deposit' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-400 text-xs font-medium">
              No recent transactions found.
            </div>
          )}
        </div>
      </div>

      {/* 5. LIVE MARKET CHART PANEL */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#5A4FE6]" />
            <h3 className="text-slate-900 font-bold text-sm">Market Candle Chart</h3>
          </div>

          <div className="flex flex-wrap gap-1">
            {quickSymbols.map((item) => (
              <button
                key={item.symbol}
                onClick={() => {
                  setChartSymbol(item.symbol);
                  setChartExchange(item.exchange);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all ${
                  chartSymbol === item.symbol
                    ? 'bg-[#5A4FE6] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full p-2">
          <TradingViewChart
            symbol={chartSymbol}
            exchange={chartExchange}
            interval="30"
            theme="light"
          />
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;
