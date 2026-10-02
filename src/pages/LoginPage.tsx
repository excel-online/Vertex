import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, Lock, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

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
  return { id: Date.now(), country, action, amount, timestamp: new Date() };
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [notifications, setNotifications] = useState([]);
  const [candles, setCandles] = useState([]);

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

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setNotifications([generateNotification()]);
    }, 5000);

    const interval = setInterval(() => {
      setNotifications(prev => [...prev, generateNotification()].slice(-3));
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const timeout = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [notifications]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email: formData.email, password: formData.password });
      if (response.success) {
        toast.success('Login successful!');
        navigate(response.user?.isAdmin ? '/admin' : '/dashboard');
      } else {
        toast.error(response.message || 'Login failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const sampleGoogleUser = {
        email: "googleuser@gmail.com",
        firstName: "Google",
        lastName: "User"
      };

      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/auth/google`, sampleGoogleUser);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        toast.success('Google login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f172a] to-[#1e293b] z-0" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <NavLink to="/" className="inline-flex items-center gap-2">
            <img src="/logo1.png" alt="Vellumtrade" className="w-12 h-12 rounded-lg object-contain" />
            <span className="text-2xl font-bold text-white">Vellumtrade</span>
          </NavLink>
        </div>

        <div className="backdrop-blur-xl bg-navy-50/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <NavLink to="/forgot-password" className="text-xs text-amber-500 hover:text-amber-400 font-medium">
                  Forgot password?
                </NavLink>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* "Or" Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-[#0f172a] text-slate-500 uppercase text-xs tracking-wider font-mono">or</span></div>
          </div>

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white text-sm font-semibold py-3 px-4 rounded-lg transition-all shadow-lg group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <NavLink to="/register" className="text-amber-500 hover:text-amber-400 font-medium">Register here</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
