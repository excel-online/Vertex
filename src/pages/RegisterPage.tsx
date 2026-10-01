import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

// Notification data
const countries = [
  'Portugal', 'USA', 'Germany', 'Brazil', 'Japan', 'Australia', 'Canada', 
  'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Singapore', 
  'UAE', 'South Africa', 'Mexico', 'India', 'China', 'UK', 'Sweden'
];

const actions = [
  { type: 'invested', text: 'just invested', color: 'text-green-400' },
  { type: 'withdrew', text: 'just withdrew', color: 'text-red-400' },
  { type: 'trading', text: 'is trading with', color: 'text-cyan-400' }
];

const generateRandomAmount = () => {
  const amounts = [500, 1000, 2500, 5000, 7500, 10000, 12500, 15000, 20000, 25000, 50000];
  return amounts[Math.floor(Math.random() * amounts.length)];
};

const generateNotification = () => {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const amount = generateRandomAmount();
  return {
    id: Date.now(),
    country,
    action,
    amount,
    timestamp: new Date()
  };
};

const countriesList = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
  'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Austria',
  'Belgium', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Ireland',
  'New Zealand', 'Japan', 'South Korea', 'Singapore', 'Hong Kong',
  'United Arab Emirates', 'Saudi Arabia', 'South Africa', 'Nigeria',
  'Kenya', 'Ghana', 'India', 'China', 'Brazil', 'Mexico', 'Argentina',
  'Colombia', 'Chile', 'Peru', 'Turkey', 'Israel', 'Russia', 'Poland',
  'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia',
  'Greece', 'Portugal', 'Malaysia', 'Thailand', 'Indonesia',
  'Philippines', 'Vietnam', 'Taiwan', 'Pakistan', 'Bangladesh',
  'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Other'
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar' }
];

const accountTypes = [
  'CryptoCurrency Investment',
  'Forex Trading',
  'Stock Trading',
  'Binary Option Trading',
  'Bitcoin Mining'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    country: '',
    currencyType: 'USD',
    accountType: 'CryptoCurrency Investment',
    referralCode: '',
    agreeTerms: false
  });

  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [candles, setCandles] = useState<any[]>([]);

  // Generate candlestick data
  useEffect(() => {
    const generateCandles = () => {
      const newCandles = [];
      for (let i = 0; i < 20; i++) {
        newCandles.push({
          id: i,
          height: Math.random() * 150 + 50,
          left: (i * 5) + Math.random() * 2,
          delay: Math.random() * 2,
          duration: Math.random() * 3 + 2,
          isGreen: Math.random() > 0.5
        });
      }
      setCandles(newCandles);
    };
    generateCandles();
  }, []);

  // Notification system - appears every minute
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      const firstNotif = generateNotification();
      setNotifications([firstNotif]);
    }, 5000);

    const interval = setInterval(() => {
      const newNotif = generateNotification();
      setNotifications(prev => {
        const updated = [...prev, newNotif].slice(-3);
        return updated;
      });
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Auto-remove notifications after 8 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timeout = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [notifications]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please enter your password');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.phoneNumber) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!formData.country) {
      toast.error('Please select your country');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      // Integration sample payload for Google authentication
      const googleUserSample = {
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User'
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`, googleUserSample);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success('Google registration successful!');
        navigate('/dashboard');
      }
    } catch {
      toast.error('Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        currencyType: formData.currencyType,
        accountType: formData.accountType,
        referralCode: formData.referralCode || undefined
      });

      if (response.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Registration failed');
        if (response.errors) {
          response.errors.forEach((err: any) => toast.error(err.msg));
        }
      }
    } catch  {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Trading Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f172a] to-[#1e293b] z-0" />
        
        <div 
          className="absolute inset-0 opacity-20 z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="absolute inset-0 z-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px bg-cyan-500/10 animate-pulse"
              style={{ top: `${i * 10}%`, animationDelay: `${i * 0.2}s` }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px bg-cyan-500/10 animate-pulse"
              style={{ left: `${i * 10}%`, animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>

        <div className="absolute inset-0 z-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`price-${i}`}
              className="absolute text-cyan-400/30 text-xs font-mono animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            >
              {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-40">
          <div className="relative w-full h-full max-w-6xl">
            {candles.map((candle) => (
              <div
                key={candle.id}
                className="absolute bottom-20 transition-all duration-1000 ease-in-out"
                style={{
                  left: `${candle.left}%`,
                  height: `${candle.height}px`,
                  animationName: 'candleMove',
                  animationDuration: `${candle.duration}s`,
                  animationDelay: `${candle.delay}s`,
                  animationIterationCount: 'infinite',
                  animationDirection: 'alternate'
                }}
              >
                <div 
                  className={`w-3 mx-auto rounded-sm ${
                    candle.isGreen ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]'
                  }`}
                  style={{ height: '60%' }}
                />
                <div 
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-px h-full ${
                    candle.isGreen ? 'bg-cyan-400/50' : 'bg-red-400/50'
                  }`}
                />
              </div>
            ))}
            
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </linearGradient>
              </defs>
              <path
                d="M0,300 Q200,250 400,280 T800,200 T1200,250 T1600,180 T2000,220"
                fill="none"
                stroke="rgba(6, 182, 212, 0.4)"
                strokeWidth="2"
                className="animate-pulse"
              />
              <path
                d="M0,300 Q200,250 400,280 T800,200 T1200,250 T1600,180 T2000,220 L2000,400 L0,400 Z"
                fill="url(#lineGradient)"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-radial-gradient z-0 pointer-events-none" 
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(10, 14, 26, 0.4) 50%, rgba(10, 14, 26, 0.9) 100%)'
          }}
        />
      </div>

      {/* Live Notifications - Top Right */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {notifications.map((notif, index) => (
          <div
            key={notif.id}
            className="pointer-events-auto bg-navy-50/95 backdrop-blur-sm border-l-4 border-blue-500 rounded-lg shadow-2xl p-4 min-w-[300px] max-w-[350px] animate-slide-in"
            style={{
              animationDelay: `${index * 0.1}s`,
              transform: `translateY(${index * 10}px)`
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">
                  Someone from <span className="font-bold text-blue-600">{notif.country}</span>{' '}
                  <span className={notif.action.color}>{notif.action.text}</span>
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  ${notif.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notif.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <NavLink to="/" className="inline-flex items-center gap-2">
            <img 
              src="/logo1.png" 
              alt="Vellumtrade" 
              className="w-12 h-12 rounded-lg object-contain"
            />
            <span className="text-2xl font-bold text-white">Vellumtrade</span>
          </NavLink>
        </div>

        {/* Register Card */}
        <div className="backdrop-blur-xl bg-navy-50/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400">Start your investment journey</p>
          </div>

          {/* Google Auth Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-white font-medium py-3 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.15C3.21 21.34 7.32 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.6H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.4l4.07-3.16z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.21 2.66 1.2 6.6l4.07 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              Continue with Google
            </button>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase">Or with email</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-amber-500 text-navy' : 'bg-slate-700 text-slate-400'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-amber-500 text-navy' : 'bg-slate-700 text-slate-400'
            }`}>
              2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Next Button */}
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Next Step
                </Button>
              </>
            ) : (
              <>
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Country & Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Country
                    </label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors z-10" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                        required
                      >
                        <option value="">Select Country</option>
                        {countriesList.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Currency
                    </label>
                    <select
                      name="currencyType"
                      value={formData.currencyType}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  >
                    {accountTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="Enter referral code"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-900/50 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                    required
                  />
                  <span className="text-sm text-slate-400">
                    I agree to the{' '}
                    <a href="/terms-of-use" className="text-amber-500 hover:text-amber-400 transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy-policy" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>
                  </span>
                </label>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-slate-600 text-white hover:bg-slate-800 hover:border-slate-500"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6">
            Already have an account?{' '}
            <NavLink to="/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
              Sign in
            </NavLink>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <NavLink to="/" className="text-sm text-slate-500 hover:text-amber-500 transition-colors">
            ← Back to home
          </NavLink>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes candleMove {
          0% {
            transform: translateY(0) scaleY(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-20px) scaleY(1.1);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0.6;
          }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
