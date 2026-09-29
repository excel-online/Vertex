import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2,
  Globe2,
  Users2,
  TrendingUp,
  Building,
  Mail,
  Send,
  X,
  Wallet,
  Star,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketService } from '@/services/api';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatButton from '@/components/ChatButton';
import CurrencyExchange from '@/components/CurrencyExchange';
import HeroSlider from '@/components/HeroSlider';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const fallbackCoins: Coin[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 65430, price_change_percentage_24h: 2.45, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3520, price_change_percentage_24h: -0.85, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
  { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 142.5, price_change_percentage_24h: 5.12, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 580, price_change_percentage_24h: 1.15, image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
  { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.58, price_change_percentage_24h: -2.30, image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' }
];

const countries = [
  'Portugal', 'USA', 'Germany', 'Brazil', 'Japan', 'Australia', 'Canada', 
  'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Singapore', 
  'UAE', 'South Africa', 'Mexico', 'India', 'China', 'UK', 'Sweden', 'Norway'
];

const actions = [
  { type: 'invested', text: 'allocated liquidity into', color: 'text-emerald-400' },
  { type: 'withdrew', text: 'successfully withdrew', color: 'text-rose-400' },
  { type: 'trading', text: 'executed market orders via', color: 'text-cyan-400' }
];

const generateRandomAmount = () => {
  const amounts = [500, 1000, 2500, 5000, 7500, 10000, 15000, 25000, 50000, 100000];
  return amounts[Math.floor(Math.random() * amounts.length)];
};

const generateNotification = () => {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const amount = generateRandomAmount();
  return { id: Math.random(), country, action, amount };
};

const investmentTiers = [
  {
    name: 'Starter',
    minAmount: 100,
    referralBonus: 3,
    features: ['Low Trade Returns', 'Basic Support', 'Daily Market Updates', 'Email Notifications'],
    notIncluded: ['No Risk Management', 'No Training']
  },
  {
    name: 'Premium',
    minAmount: 5000,
    referralBonus: 5,
    features: ['No Risk Management', 'Priority Support', 'Weekly Reports', 'SMS Notifications'],
    notIncluded: ['No Training'],
    popular: true
  },
  {
    name: 'Standard',
    minAmount: 20000,
    referralBonus: 7,
    features: ['No Risk Management', '24/7 Premium Support', 'Daily Reports', 'Personal Account Manager'],
    notIncluded: ['No Training']
  },
  {
    name: 'VIP',
    minAmount: 50000,
    referralBonus: 8,
    features: ['Free Training', 'Encrypted MT4 Robot', 'Dedicated Support Team', 'Instant Withdrawals', 'Custom Investment Plans'],
    notIncluded: []
  }
];

const animatedStats = [
  { icon: Globe2, value: 80, suffix: '+', label: 'ACTIVE COUNTRIES', duration: 2000 },
  { icon: Users2, value: 98, suffix: '%', label: 'CLIENT SATISFACTION', duration: 2000 },
  { icon: TrendingUp, value: 5066000, suffix: '+', label: 'TRADES EXECUTED', duration: 2500 },
  { icon: Building, value: 18370000, suffix: '+', label: 'TOTAL WITHDRAWALS', duration: 2500 }
];

const testimonials = [
  {
    name: 'Harrison Kelvin',
    image: '/testimonials/harrison.jpg',
    text: 'I got my investment right on time will be investing more next time.',
    rating: 5,
    amount: '$6,500',
    country: 'United Kingdom'
  },
  {
    name: 'Maria Amor',
    image: '/testimonials/maria.jpg',
    text: 'I just got my profit I will invite more friends and family to join.',
    rating: 5,
    amount: '$12,000',
    country: 'Germany'
  },
  {
    name: 'Lucy James',
    image: '/testimonials/lucy.jpg',
    text: 'Thanks to this platform withdrawal is successful and fast.',
    rating: 4,
    amount: '$8,200',
    country: 'Canada'
  },
  {
    name: 'Lucky Olive',
    image: '/testimonials/lucky.jpg',
    text: 'Am so happy investing with your platform, highly recommended!',
    rating: 5,
    amount: '$15,500',
    country: 'Australia'
  }
];

const AnimatedCounter = ({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  const formatNumber = (num: number) => num >= 1000000 ? num.toLocaleString() : num.toString();

  return <span ref={ref} className="tabular-nums">{formatNumber(count)}{suffix}</span>;
};

const LandingPage = () => {
  const [coins, setCoins] = useState<Coin[]>(fallbackCoins);
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await marketService.getTopCoins();
        const coinData = Array.isArray(response) ? response : response?.data || [];
        
        if (Array.isArray(coinData) && coinData.length > 0) {
          setCoins(coinData.slice(0, 20));
        }
      } catch (error) {
        console.error('Error fetching CoinGecko coins, keeping fallback data:', error);
      }
    };
    fetchCoins();
  }, []);

  // Initialize Google Translate Script
  useEffect(() => {
    if (!(window as any).google?.translate) {
      const addScript = document.createElement('script');
      addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      document.body.appendChild(addScript);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: 'en',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE 
          }, 
          'google_translate_element'
        );
      };
    } else if ((window as any).google?.translate) {
      try {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: 'en',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE 
          }, 
          'google_translate_element'
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const triggerNotification = () => {
      setCurrentNotification(generateNotification());
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    triggerNotification();
    const interval = setInterval(triggerNotification, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setTestimonialIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(testimonialTimer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  const currentTestimonial = testimonials[testimonialIndex];

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden w-full">
      {/* Live Activity Toast */}
      {currentNotification && (
        <div className={`fixed bottom-28 right-4 z-50 transition-all duration-500 transform ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
          <div className="bg-[#0d162b]/95 backdrop-blur-md border border-blue-500/30 rounded-xl p-3.5 shadow-2xl w-72 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <button
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="pl-1.5">
              <p className="text-xs text-slate-300">
                Trader from <span className="font-semibold text-white">{currentNotification.country}</span>{' '}
                <span className={currentNotification.action.color}>{currentNotification.action.text}</span>
              </p>
              <p className="text-sm font-black text-white mt-1">
                ${currentNotification.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Header & Marquee Stack */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Top Bar: Brand Logo + Translation + Auth Actions */}
        <div className="bg-[#060b13]/90 backdrop-blur-md border-b border-[#121c33] w-full">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:h-16 flex items-center justify-between gap-2 text-xs">
            {/* Brand Logo */}
            <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                B
              </div>
              <span className="font-extrabold text-white text-xs sm:text-sm tracking-wider">VELLUMTRADE</span>
            </NavLink>

            {/* Right side: Translation Widget + Auth Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <div id="google_translate_element" className="scale-[0.8] sm:scale-90 origin-right max-w-[90px] sm:max-w-none overflow-hidden"></div>
              
              <NavLink to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-[#121c33] text-[10px] sm:text-[11px] uppercase tracking-wider font-bold h-7 sm:h-8 px-2 sm:px-3 rounded-lg">
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-[11px] uppercase tracking-wider font-black h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg shadow-lg shadow-blue-600/20">
                  Register
                </Button>
              </NavLink>
            </div>
          </div>

          {/* Navigation Links Bar */}
          <div className="bg-[#0b1324]/90 backdrop-blur-md border-t border-[#121c33] w-full">
            <div className="max-w-7xl mx-auto px-4 h-11 sm:h-12 flex items-center justify-between">
              <nav className="flex items-center justify-between w-full text-[10px] sm:text-xs font-bold tracking-widest text-slate-300 uppercase px-1">
                <a href="#services" className="hover:text-blue-400 transition-colors">Services</a>
                <a href="#pricing" className="hover:text-blue-400 transition-colors">Portfolios</a>
                <a href="#testimonials" className="hover:text-blue-400 transition-colors">Reviews</a>
                <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        </div>

        {/* CoinGecko Marquee Ticker Bar */}
        <div className="w-full bg-[#04070d] border-b border-[#121c33] py-2 overflow-hidden shadow-md">
          <div className="flex animate-marquee whitespace-nowrap">
            <div className="flex items-center gap-8 px-4">
              {[...coins, ...coins].map((coin, index) => (
                <div key={`${coin.id}-${index}`} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 font-bold">{coin.symbol.toUpperCase()}/USD</span>
                  <span className="text-white">${coin.current_price?.toLocaleString()}</span>
                  <span className={(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {(coin.price_change_percentage_24h ?? 0) >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Slider Section with top spacing to prevent overlap with the fixed header */}
      <div className="pt-[140px] sm:pt-[128px]">
        <HeroSlider />
      </div>

      {/* Core Infrastructure Section */}
      <section 
        id="services" 
        className="py-12 md:py-24 px-4 max-w-7xl mx-auto mt-0 md:-mt-80 relative z-30"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 relative z-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Core Infrastructure</h2>
          <p className="text-slate-400 text-xs">Designed for maximum security, multi-currency versatility, and automated growth.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {[
            {
              icon: Wallet,
              title: 'Multi Currency Accounts',
              desc: 'Support for major traditional currencies (USD, EUR, GBP) alongside leading digital assets.'
            },
            {
              icon: ShieldCheck,
              title: 'Secure Account Funding',
              desc: 'Cryptocurrency deposits are processed securely and stored safely in your Vellumtrade vault.'
            },
            {
              icon: TrendingUp,
              title: 'Relax & Earn',
              desc: 'Leave the heavy lifting to our experienced market brokers while your profits compound.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl bg-[#0b1324]/95 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden backdrop-blur-md shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-colors" />
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Animated Metrics Counter Section with Background Image */}
      <section 
        className="py-20 relative overflow-hidden border-y border-[#121c33] bg-cover bg-center bg-no-repeat w-full"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(7, 13, 25, 0.92), rgba(4, 7, 13, 0.98)), url('https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2000&auto=format&fit=crop')` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {animatedStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="space-y-3 p-4 rounded-2xl bg-[#0b1324]/60 border border-[#121c33] backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#0b1324] border border-[#121c33] mx-auto flex items-center justify-center text-blue-400 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={stat.duration} />
                  </div>
                  <div className="text-[10px] font-mono uppercase text-slate-400 tracking-widest">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment Tiers Section */}
      <section id="pricing" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Investment Portfolios</h2>
          <p className="text-slate-400 text-xs">Choose a tailored portfolio tier designed for your financial targets.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {investmentTiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 relative ${
                tier.popular 
                  ? 'bg-[#0b1324] border-blue-500 shadow-2xl shadow-blue-500/10 scale-105 z-10' 
                  : 'bg-[#0b1324]/50 border-[#121c33] hover:border-slate-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black text-[9px] tracking-widest uppercase px-3.5 py-1 rounded-full shadow">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-2xl font-black text-blue-400 mb-2">
                  ${tier.minAmount.toLocaleString()} <span className="text-[11px] font-normal text-slate-500">min deposit</span>
                </div>
                <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-6">
                  {tier.referralBonus}% Referral Bonus
                </div>
                <ul className="space-y-3 mb-8 text-xs">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {feat}
                    </li>
                  ))}
                  {tier.notIncluded.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-slate-600 line-through">
                      <span className="w-4 h-4 flex-shrink-0 text-center">×</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <NavLink to="/register" className="block">
                <Button className={`w-full text-xs uppercase tracking-wider font-bold h-10 rounded-xl ${tier.popular ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' : 'bg-[#060b13] hover:bg-[#121c33] text-white border border-[#121c33]'}`}>
                  Select Plan
                </Button>
              </NavLink>
            </div>
          ))}
        </div>
      </section>

      {/* Currency Exchange Tool */}
      <section className="py-20 px-4 max-w-7xl mx-auto border-t border-[#121c33]">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Currency Exchange Calculator</h2>
          <p className="text-slate-400 text-xs">Calculate real-time conversions across supported fiat and crypto assets.</p>
        </div>
        <CurrencyExchange />
      </section>

      {/* Auto-Switching Testimonial Carousel */}
      <section id="testimonials" className="py-24 px-4 max-w-5xl mx-auto border-t border-[#121c33]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Client Success Stories</h2>
          <p className="text-slate-400 text-xs">Real experiences from traders utilizing our portfolios.</p>
        </div>

        <div className="bg-[#0b1324] border border-[#121c33] rounded-3xl p-8 sm:p-12 relative shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-blue-600/10 pointer-events-none">
            <Quote className="w-40 h-40" />
          </div>

          <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full border-2 border-blue-500 overflow-hidden shadow-xl">
                  <img src={currentTestimonial.image} alt={currentTestimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase shadow">
                  {currentTestimonial.country}
                </div>
              </div>
              <h3 className="text-base font-bold text-white">{currentTestimonial.name}</h3>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < currentTestimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                ))}
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              <p className="text-slate-200 text-base sm:text-lg italic leading-relaxed">
                &ldquo;{currentTestimonial.text}&rdquo;
              </p>

              <div className="flex flex-wrap items-center justify-between pt-6 border-t border-[#121c33] gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-500 block">Verified Payout</span>
                  <span className="text-emerald-400 font-black text-xl">{currentTestimonial.amount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setTestimonialIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="w-10 h-10 p-0 rounded-xl bg-[#060b13] hover:bg-[#121c33] border border-[#121c33] text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs font-mono text-slate-400 px-3">
                    {testimonialIndex + 1} / {testimonials.length}
                  </span>
                  <Button 
                    onClick={() => setTestimonialIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    className="w-10 h-10 p-0 rounded-xl bg-[#060b13] hover:bg-[#121c33] border border-[#121c33] text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <footer id="contact" className="bg-[#04070d] border-t border-[#121c33] text-slate-400 pt-16 pb-12 w-full">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                B
              </div>
              <span className="font-extrabold text-white text-sm tracking-wider">VELLUMTRADE</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Trusted investment firm offering automated multi-currency asset management and optimized market execution.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><NavLink to="/" className="hover:text-blue-400 transition-colors">Home</NavLink></li>
              <li><NavLink to="/about-us" className="hover:text-blue-400 transition-colors">About Us</NavLink></li>
              <li><NavLink to="/terms-of-use" className="hover:text-blue-400 transition-colors">Terms of Use</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li><NavLink to="/contact-us" className="hover:text-blue-400 transition-colors">Contact Us</NavLink></li>
              <li><NavLink to="/faq" className="hover:text-blue-400 transition-colors">FAQ</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Newsletter</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email address" 
                className="bg-[#0b1324] border border-[#121c33] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 rounded-xl transition-colors flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-[#121c33] text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 font-mono">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-500" /> support@vellumtrade.com</span>
          </div>
          <div>Copyright ©️ 2026 VELLUMTRADE. All rights reserved.</div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <WhatsAppButton />
        <ChatButton />
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Custom styling for Google Translate widget integration */
        #google_translate_element select {
          background-color: #0b1324;
          color: #cbd5e1;
          border: 1px solid #121c33;
          border-radius: 0.5rem;
          padding: 2px 4px;
          font-size: 10px;
          outline: none;
        }
        .goog-te-gadget {
          font-size: 0px !important;
          color: transparent !important;
        }
        .goog-te-gadget span {
          display: none;
        }
        .goog-logo-link, .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
