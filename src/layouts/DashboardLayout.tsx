import { NotificationBell } from '@/components/NotificationBell';
import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Receipt,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Crown,
  Radio,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import WhatsAppButton from '@/components/WhatsAppButton';
import { TickerPanel } from '@/components/TickerPanel';

// Component for external link dropdown
const ExternalLinkDropdown = ({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ className?: string }> }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.external-dropdown-container')) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const exchanges = [
    { name: 'Luno', url: 'https://www.luno.com' },
    { name: 'Remitano', url: 'https://remitano.com' },
    { name: 'Moonpay', url: 'https://www.moonpay.com' },
    { name: 'Local Bitcoin', url: 'https://localbitcoins.com' },
    { name: 'Paxful', url: 'https://paxful.com' },
    { name: 'Coinbase', url: 'https://www.coinbase.com' },
    { name: 'Ramp', url: 'https://ramp.network' },
    { name: 'Banxa', url: 'https://banxa.com' },
    { name: 'Chainbits', url: 'https://chainbits.com' },
    { name: 'Bitcoin', url: 'https://bitcoin.org' },
    { name: 'Coinmama', url: 'https://www.coinmama.com' },
  ];

  return (
    <div className="external-dropdown-container relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 ${
          isOpen ? 'bg-gray-100' : ''
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium flex-1 text-left">{label}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 mx-3 bg-navy-50 border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {exchanges.map((exchange) => (
            <a
              key={exchange.name}
              href={exchange.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <span>{exchange.name}</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          ))}
          <div className="h-20"></div>
        </div>
      )}
    </div>
  );
};

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout = ({ isAdmin = false }: DashboardLayoutProps) => {
  const { user, logout, isAdmin: userIsAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tickerOpen, setTickerOpen] = useState(false);

  // LOCK BODY SCROLL when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const userNavItems = [
    { label: 'Account', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Deposit', path: '/dashboard/deposits', icon: ArrowDownLeft },
    { label: 'Withdraw', path: '/dashboard/withdrawals', icon: ArrowUpRight },
    { label: 'History', path: '/dashboard/history', icon: History },
    { label: 'Transactions', path: '/dashboard/transactions', icon: Receipt },
    { label: 'Account Upgrade', path: '/dashboard/upgrade', icon: Crown },
    { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
    { label: 'Contact Support', path: '/dashboard/support', icon: HelpCircle },
    { label: 'Where to Buy Coin', icon: Wallet, isExternalDropdown: true },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: User },
    { label: 'Transactions', path: '/admin/transactions', icon: Wallet },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/admin') return 'Overview';
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
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <WhatsAppButton />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-navy-50 border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <NavLink to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
           <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo1.png" 
                    alt="Vellumtrade" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
            <span className="text-xl font-bold text-gray-800">Vellumtrade</span>
          </NavLink>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.isExternalDropdown) {
              return (
                <ExternalLinkDropdown 
                  key={item.label} 
                  label={item.label} 
                  icon={Icon} 
                />
              );
            }
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard' || item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          {userIsAdmin && !isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Crown className="w-5 h-5" />
              <span className="font-medium">Admin Panel</span>
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-navy-50 border-r border-gray-200 flex flex-col max-h-screen">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
              <span className="text-lg font-bold text-gray-800">Vellumtrade</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto pb-24">
              {navItems.map((item) => {
                if (item.isExternalDropdown) {
                  return (
                    <ExternalLinkDropdown 
                      key={item.label} 
                      label={item.label} 
                      icon={item.icon} 
                    />
                  );
                }
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              {userIsAdmin && !isAdmin && (
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <NavLink 
                    to="/admin" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-3 px-4 py-3 text-gray-600"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </NavLink>
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 w-full min-h-screen flex flex-col">
        {/* FIXED Header */}
        <header className="h-16 bg-navy-50 border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 right-0 left-0 lg:left-64 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Ticker - wrapped in relative container so panel appears on top of page content */}
            <div className="relative">
              <button 
                onClick={() => setTickerOpen(!tickerOpen)} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Radio className={`w-5 h-5 ${tickerOpen ? 'text-blue-600' : 'text-gray-500'}`} />
              </button>
              {tickerOpen && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <TickerPanel />
                </div>
              )}
            </div>

            {/* NotificationBell - wrapped in relative container so dropdown appears on top of page content */}
            <div className="relative">
              <NotificationBell />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 font-bold text-xs">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-navy-50 border-gray-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />Dashboard
                </DropdownMenuItem>
                {userIsAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Crown className="w-4 h-4 mr-2" />Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content - mt-16 pushes content below fixed header on desktop */}
        <div className="mt-16 p-4 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;