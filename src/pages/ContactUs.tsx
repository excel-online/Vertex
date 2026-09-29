import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronRight,
  Send,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Shield
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
   // { label: 'Testimonials', href: '#testimonials' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact-us' },
    { label: 'FAQ', href: '/faq' },
   // { label: 'Terms of Service', href: '/terms-of-use' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ]
};

const ContactUs: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [email, setEmail] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await marketService.getTopCoins();
        setCoins(data.slice(0, 20));
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };
    fetchCoins();

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

  // Handler to trigger ChatButton from the card
  const handleStartChat = () => {
    // Find and click the ChatButton
    const chatButton = document.querySelector('[data-chat-button="true"]') as HTMLButtonElement;
    if (chatButton) {
      chatButton.click();
    } else {
      // Fallback: dispatch custom event
      window.dispatchEvent(new CustomEvent('openChatPanel'));
    }
  };

  // Handler to trigger WhatsApp from the card
  const handleWhatsAppUs = () => {
    // Find and click the WhatsAppButton
    const whatsappButton = document.querySelector('[data-whatsapp-button="true"]') as HTMLAnchorElement;
    if (whatsappButton) {
      whatsappButton.click();
    } else {
      // Fallback: open directly
      window.open('https://wa.me/+15742384154?', '_blank');
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
              <NavLink to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</NavLink>
              <NavLink to="/about-us" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</NavLink>
              <NavLink to="/contact-us" className="text-blue-600 font-medium">Contact Us</NavLink>
            </div>

            <div className="flex items-center gap-4">
              <NavLink to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Live Market Ticker - Maintained */}
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

      {/* Main Content - Contact Us specific with Entrance Animation */}
      <main 
        className={`pt-32 pb-16 px-4 max-w-6xl mx-auto transition-all duration-700 ease-out transform ${
          showContent ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
        }`}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-wide text-gray-900 mb-2">GET IN TOUCH</h1>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            We're here to help you navigate the world of cryptocurrency and forex trading. 
            Whether you have questions about our platform or need support, our team is ready to assist.
          </p>
        </div>

        {/* Contact Method Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-navy-50 rounded-xl border border-gray-100 shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">24/7 Support</h3>
            <p className="text-gray-600 mb-6 text-sm">Our dedicated support team is available around the clock.</p>
            <a href="mailto:support@Vellumtrade.com" className="text-blue-600 font-semibold hover:text-blue-700">support@Vellumtrade.com</a>
          </div>

          <div className="bg-navy-50 rounded-xl border border-gray-100 shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Live Chat</h3>
            <p className="text-gray-600 mb-6 text-sm">Connect with our support agents in real-time, available 24/7.</p>
            <Button 
              onClick={handleStartChat}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-6"
            >
              Start Chat
            </Button>
          </div>

          <div className="bg-navy-50 rounded-xl border border-gray-100 shadow-md p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">WhatsApp</h3>
            <p className="text-gray-600 mb-6 text-sm">Prefer messaging? Reach us directly for quick responses.</p>
            <Button 
              onClick={handleWhatsAppUs}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
            >
              WhatsApp Us
            </Button>
          </div>
        </div>

        {/* Headquarters & Security */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-900 rounded-2xl p-8 flex items-start gap-6 text-white">
            <MapPin className="w-10 h-10 text-blue-300 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Headquarters</h3>
              <p className="text-blue-100">
                Vellumtrade Financial Services<br />
                123 Crypto Plaza, Suite 456<br />
                New York, NY 10004, United States
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-8 flex items-start gap-4">
            <Shield className="w-10 h-10 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Your Security Matters</h4>
              <p className="text-amber-700 text-sm leading-relaxed">
                We will never ask for your password or private keys via email. 
                Verify all communications to protect your account.
              </p>
            </div>
          </div>
        </div>
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
              <p className="text-blue-100 text-sm mb-6">Your trusted partner in cryptocurrency and forex trading.</p>
              {/* Facebook icon REMOVED as requested */}
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Explore</h4>
              <ul className="space-y-3">
                {footerLinks.explore.map((link, i) => (
                  <li key={i}><a href={link.href} className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />{link.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, i) => (
                  <li key={i}><a href={link.href} className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"><ChevronRight className="w-4 h-4" />{link.label}</a></li>
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
                  placeholder="Enter email"
                  className="flex-1 px-4 py-3 rounded-lg bg-navy-50/10 border border-white/20 text-white focus:outline-none"
                />
                <button type="submit" className="px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg"><Send className="w-5 h-5" /></button>
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

      {/* Floating Buttons - WhatsApp (left) and Live Chat (right) */}
      <WhatsAppButton />
      <ChatButton />
    </div>
  );
};

export default ContactUs;