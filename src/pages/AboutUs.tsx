import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronRight,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketService } from '@/services/api';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatButton from '@/components/ChatButton';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const footerLinks = {
  explore: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
   { label: 'Terms of Service', href: '/terms-of-use' },
   // { label: 'Pricing', href: '#pricing' },
    //{ label: 'Testimonials', href: '#testimonials' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ]
};

const AboutUs: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await marketService.getTopCoins();
        setCoins(data.slice(0, 20));
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();

    // Trigger entrance animation - coming from top
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-navy-50">
       {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-50/95 backdrop-blur-md border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <NavLink to="/" className="flex items-center gap-1 sm:gap-2">
  <img 
    src="/logo1.png" 
    alt="VELLUMTRADE" 
    className="h-6 sm:h-8 w-auto object-contain"
  />
  <div className="flex items-center">
    <span className="text-amber-500 font-bold text-base sm:text-xl tracking-wide">VELLUM</span>
    <span className="text-blue-600 font-bold text-base sm:text-xl tracking-wide">TRADE</span>
  </div>
</NavLink>
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="/about-us" className="text-blue-600 font-medium">About Us</a>
            </div>

            <div className="flex items-center gap-4">
              <NavLink to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Login
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Live Market Ticker - Matches Landing Page */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-blue-900 border-b border-blue-800 py-2">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <div className="flex items-center animate-marquee whitespace-nowrap">
              {[...coins, ...coins].map((coin, index) => (
                <div key={`${coin.id}-${index}`} className="flex items-center gap-4 px-6 flex-shrink-0">
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-white font-medium">{coin.name}</span>
                  <span className="text-blue-300">({coin.symbol.toUpperCase()})</span>
                  <span className="text-white font-semibold">${coin.current_price?.toLocaleString()}</span>
                  <span className={`${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'} font-medium`}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - About Us Content with Animation */}
      <main 
        className={`px-4 py-8 pt-32 max-w-4xl mx-auto transition-all duration-700 ease-out transform ${
          showContent ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
        }`}
      >
        <section className="mb-12">
          {/* About Us Title with Underline */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-wide text-gray-900 mb-2">ABOUT US</h1>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="mb-8 rounded-lg overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop" 
              alt="Modern Trading Office Building"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              We are the only binary options broker that truly places emphasis on you and your trading experience!
            </h2>
            
            <p>
              Vellumtrade is one of the leading binary options brokers in the industry. With a high payout of 81% on binary options contracts, we offer the most generous payouts in the industry.
            </p>

            <p>
              Binary options, or digital options, have continued to gain popularity in the past decade, many ambitious traders see binary options as their preferred choice of investment vehicle in this time of market instability. Vellumtrade's platform stands out as a leader among the brokers out there with a team that is made up of professionals with experience in forex trading, risk management, derivatives and international laws and legislation. Their combined knowledge and experience trumps that held by most operators in the market.
            </p>

            <p>
              Vellumtrade stands out as a one of the leaders in the industry, and here's why:
            </p>

            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Our trading platform is web based and thus you won't have to download any software. This makes it easy to trade from anywhere... at any time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>You don't need to have any previous trading experience to get going. It is as easy as 1-2-3.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>The interface is remarkably user friendly. We have worked hard to ensure processes are fast and intuitive.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>We offer in-depth training materials to speed up your learning process.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>We allow traders to sell their options before they expire. Early expiration can help you drive more profits through your portfolio.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>We offer a tremendous range of assets handpicked from the best commodities, stocks, currencies and indices. The trading modules on our platform are industry leading. At every stage of the investment process we strive to help our traders get the edge that they need to succeed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>We have invested in the latest technologies in the industry to ensure that your transactions are swift, secure and safe.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer - UPDATED with Payment Icons and Comodo Secure */}
      <footer className="bg-blue-600 text-white relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <NavLink to="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo1.png" 
                    alt="Vellumtrade" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Vellumtrade</span>
              </NavLink>
              <p className="text-blue-100 text-sm mb-6">
                Your trusted partner in cryptocurrency and forex trading. Secure, reliable, and profitable.
              </p>
              {/* Facebook icon REMOVED as requested */}
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Explore</h4>
              <ul className="space-y-3">
                {footerLinks.explore.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-blue-100 hover:text-white transition-colors flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Subscribe</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-navy-50/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Methods & Copyright Section */}
        <div className="border-t border-blue-500 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Copyright and Comodo Secure */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <p className="text-white text-sm">
                  Copyright ©️ 2023 VELLUMTRADE. All rights reserved.
                </p>
                {/* Comodo Secure Badge */}
                <div className="flex items-center gap-1 bg-navy-50 rounded-full px-2 py-1">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-green-600 font-bold text-xs">COMODO</span>
                  <span className="text-gray-600 font-bold text-xs">SECURE</span>
                </div>
              </div>
            </div>

            {/* Payment Method Icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {/* Visa */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                  <path d="M17.68 1.5L15.5 14.5H18.9L21.08 1.5H17.68Z" fill="#1A1F71"/>
                  <path d="M30.5 1.5C29.5 1.1 28 0.8 26.2 0.8C22.2 0.8 19.3 3 19.3 6.2C19.3 8.6 21.4 9.9 22.9 10.7C24.5 11.5 25 12 25 12.6C25 13.5 23.9 13.9 22.9 13.9C21.4 13.9 20.5 13.6 19.3 13.1L18.8 12.9L18.3 15.8C19.5 16.3 21.3 16.6 23.2 16.6C27.4 16.6 30.2 14.4 30.2 11C30.2 9.1 29 7.8 26.7 6.8C25.3 6.2 24.4 5.7 24.4 5.1C24.4 4.6 25 4 26.3 4C27.5 4 28.4 4.2 29.2 4.5L29.6 4.7L30.1 1.9L30.5 1.5Z" fill="#1A1F71"/>
                  <path d="M35.5 1.5H32.5C31.7 1.5 31.1 1.7 30.7 2.6L24.5 14.5H28.4L29.2 12.5H34.3L34.8 14.5H38.2L35.5 1.5Z" fill="#1A1F71"/>
                  <path d="M12.5 1.5L8.5 9.8L8.1 8C7.3 5.6 5.2 3 2.5 1.6L6.1 14.5H10.1L15.9 1.5H12.5Z" fill="#1A1F71"/>
                  <path d="M6.5 1.5H0.8L0.7 1.7C5.3 2.8 8.5 5.8 9.8 9.2L8.9 2.6C8.7 1.7 8.2 1.5 7.4 1.5H6.5Z" fill="#F7B600"/>
                </svg>
              </div>
              
              {/* MasterCard */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 30" fill="none">
                  <circle cx="15" cy="15" r="15" fill="#EB001B"/>
                  <circle cx="33" cy="15" r="15" fill="#F79E1B"/>
                  <path d="M24 5C27.5 7.5 29.5 11 29.5 15C29.5 19 27.5 22.5 24 25C20.5 22.5 18.5 19 18.5 15C18.5 11 20.5 7.5 24 5Z" fill="#FF5F00"/>
                </svg>
              </div>

              {/* Maestro */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 30" fill="none">
                  <circle cx="15" cy="15" r="15" fill="#0099DF"/>
                  <circle cx="33" cy="15" r="15" fill="#6C6BBD"/>
                  <path d="M24 5C27.5 7.5 29.5 11 29.5 15C29.5 19 27.5 22.5 24 25C20.5 22.5 18.5 19 18.5 15C18.5 11 20.5 7.5 24 5Z" fill="#FF5F00"/>
                </svg>
              </div>

              {/* JCB */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" fill="#0066B3"/>
                  <rect x="18" y="2" width="12" height="12" rx="2" fill="#00A650"/>
                  <rect x="34" y="2" width="12" height="12" rx="2" fill="#FF0000"/>
                  <text x="6" y="11" fontSize="8" fill="white" fontWeight="bold">J</text>
                  <text x="22" y="11" fontSize="8" fill="white" fontWeight="bold">C</text>
                  <text x="38" y="11" fontSize="8" fill="white" fontWeight="bold">B</text>
                </svg>
              </div>

              {/* Skrill */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <span className="text-purple-700 font-bold text-sm">Skrill</span>
              </div>

              {/* Visa Electron */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-16">
                <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                  <path d="M17.68 1.5L15.5 14.5H18.9L21.08 1.5H17.68Z" fill="#1A1F71"/>
                  <path d="M30.5 1.5C29.5 1.1 28 0.8 26.2 0.8C22.2 0.8 19.3 3 19.3 6.2C19.3 8.6 21.4 9.9 22.9 10.7C24.5 11.5 25 12 25 12.6C25 13.5 23.9 13.9 22.9 13.9C21.4 13.9 20.5 13.6 19.3 13.1L18.8 12.9L18.3 15.8C19.5 16.3 21.3 16.6 23.2 16.6C27.4 16.6 30.2 14.4 30.2 11C30.2 9.1 29 7.8 26.7 6.8C25.3 6.2 24.4 5.7 24.4 5.1C24.4 4.6 25 4 26.3 4C27.5 4 28.4 4.2 29.2 4.5L29.6 4.7L30.1 1.9L30.5 1.5Z" fill="#1A1F71"/>
                  <path d="M35.5 1.5H32.5C31.7 1.5 31.1 1.7 30.7 2.6L24.5 14.5H28.4L29.2 12.5H34.3L34.8 14.5H38.2L35.5 1.5Z" fill="#1A1F71"/>
                  <path d="M12.5 1.5L8.5 9.8L8.1 8C7.3 5.6 5.2 3 2.5 1.6L6.1 14.5H10.1L15.9 1.5H12.5Z" fill="#1A1F71"/>
                  <path d="M6.5 1.5H0.8L0.7 1.7C5.3 2.8 8.5 5.8 9.8 9.2L8.9 2.6C8.7 1.7 8.2 1.5 7.4 1.5H6.5Z" fill="#00A1FF"/>
                </svg>
              </div>

              {/* Western Union */}
              <div className="bg-yellow-400 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-black font-bold text-xs text-center leading-tight">WESTERN<br/>UNION</span>
              </div>

              {/* Wire Transfer */}
              <div className="bg-blue-800 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-white font-bold text-xs text-center">wire<br/>transfer</span>
              </div>

              {/* MoneyGram */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-red-600 font-bold text-xs">MoneyGram</span>
              </div>

              {/* Neteller */}
              <div className="bg-navy-50 rounded px-3 py-2 flex items-center justify-center h-10 w-20">
                <span className="text-green-600 font-bold text-sm">NETELLER</span>
              </div>
            </div>

            {/* GetButton reference */}
            <div className="flex items-center justify-center gap-2 text-blue-200 text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>GetButton</span>
            </div>
          </div>
        </div>
      </footer>

     {/* Replace the current WhatsApp & Chat Buttons div with this */}
<div className="relative bg-blue-600">
  <div className="absolute -top-16 right-4 flex flex-col gap-3">
    <WhatsAppButton />
    <ChatButton />
  </div>
  {/* The buttons need a container with height to prevent covering footer */}
  <div className="h-20"></div>
    </div>

     
    </div>
  );
};

export default AboutUs;