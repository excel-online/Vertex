import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Receipt,
  Settings,
  Crown,
  HelpCircle,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import WhatsAppButton from '@/components/WhatsAppButton';
import { NotificationBell } from '@/components/NotificationBell';

const DashboardLayout = () => {
  const { user, logout, isAdmin: userIsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Bottom navigation items mapped to your actual pages/routes for mobile view
  const mobileNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Deposit', path: '/dashboard/deposits', icon: ArrowDownLeft },
    { label: 'Withdraw', path: '/dashboard/withdrawals', icon: ArrowUpRight },
    { label: 'History', path: '/dashboard/history', icon: History },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path.includes('/deposits')) return 'Deposit';
    if (path.includes('/withdrawals')) return 'Withdraw';
    if (path.includes('/history')) return 'History';
    if (path.includes('/transactions')) return 'Transactions';
    if (path.includes('/upgrade')) return 'Upgrade';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/support')) return 'Support';
    if (path.includes('/users')) return 'Users';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      <WhatsAppButton />

      {/* TOP HEADER BAR (Mobile & Desktop) */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center overflow-hidden border border-purple-100">
            <img src="/logo1.png" alt="Vellumtrade" className="w-5 h-5 object-contain" />
          </div>
          <h1 className="text-base font-bold text-slate-800 tracking-tight">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <NotificationBell />
          </div>
          
          <button 
            onClick={() => navigate('/dashboard/settings')}
            className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors border border-purple-200"
          >
            <span className="text-purple-700 font-bold text-xs">
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 pb-28">
        <Outlet />
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR (Replaces hamburger menu completely) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-2 py-2 z-50 shadow-lg flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive 
                  ? 'text-purple-600 font-semibold bg-purple-50/80 scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
