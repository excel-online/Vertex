import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Clock, Send, HelpCircle, FileQuestion, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'How do I make a deposit?',
    answer: 'Go to the Deposit section in your dashboard, select your preferred payment method (Bitcoin, Ethereum, or USDT), enter the amount, and send funds to the provided wallet address.'
  },
  {
    question: 'How long do withdrawals take?',
    answer: 'Withdrawals are typically processed within 24-48 hours after admin approval. Bank transfers may take 3-5 business days.'
  },
  {
    question: 'What is the minimum deposit amount?',
    answer: 'The minimum deposit amount is $100 for all payment methods.'
  },
  {
    question: 'How do I upgrade my account?',
    answer: 'Visit the Account Upgrade section to view available tiers and their benefits. Higher tiers offer better returns and additional features.'
  },
  {
    question: 'Is my investment safe?',
    answer: 'Yes, we use bank-level security with 256-bit encryption and cold storage for all assets. Your funds are protected by our advanced security systems.'
  }
];

// API Configuration - Backend URL
const API_BASE_URL = 'https://kimi-agent.onrender.com';

// UNIFIED USER ID - Same across chat widget and contact form
const getUnifiedUserInfo = () => {
  let userId = localStorage.getItem('vellumtrade_user_id');
  let userName = localStorage.getItem('vellumtrade_user_name');
  let userEmail = localStorage.getItem('vellumtrade_user_email');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.id || user._id) {
    userId = user.id || user._id;
    userName = user.name || user.firstName || user.username || 'User';
    userEmail = user.email;
  } else if (!userId) {
    userId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    userName = 'Guest User';
    userEmail = 'guest@example.com';
  }
  
  localStorage.setItem('vellumtrade_user_id', userId);
  if (userName) localStorage.setItem('vellumtrade_user_name', userName);
  if (userEmail) localStorage.setItem('vellumtrade_user_email', userEmail);
  
  return { userId, userName, userEmail };
};

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({ userId: '', userName: '', userEmail: '' });

  useEffect(() => {
    const info = getUnifiedUserInfo();
    setUserInfo(info);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/chat-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          name: userInfo.userName,
          email: userInfo.userEmail,
          message: `[${formData.subject.toUpperCase()}] ${formData.message}`
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent! Check the Live Chat widget for replies');
        setFormData({ subject: '', message: '' });
        
        setTimeout(() => {
          const chatButton = document.querySelector('[data-chat-trigger]') || 
                            document.querySelector('.chat-widget-trigger') ||
                            document.querySelector('button[aria-label*="chat" i]');
          if (chatButton) {
            (chatButton as HTMLElement).click();
          }
        }, 500);
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      
      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <a 
          href="https://wa.me/15742384154"  
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl bg-emerald-600/20 border border-emerald-500/30 p-6 text-white hover:bg-emerald-600/30 transition-all shadow-xl backdrop-blur-xl flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1 text-white">WhatsApp</h3>
            <p className="text-emerald-300 text-xs">Chat with our reps instantly</p>
          </div>
          <p className="mt-4 font-mono text-sm text-emerald-200 font-semibold">+1 (574) 238-4154</p>
        </a>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 text-white shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1 text-white">Email Support</h3>
            <p className="text-slate-400 text-xs">Send inquiries via email</p>
          </div>
          <p className="mt-4 font-mono text-sm text-blue-300 font-semibold">support@vellumtrade.com</p>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 text-white shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1 text-white">Direct Phone</h3>
            <p className="text-slate-400 text-xs">Speak directly with us</p>
          </div>
          <p className="mt-4 font-mono text-sm text-purple-300 font-semibold">+1 (574) 238-4154</p>
        </div>

      </div>

      {/* Support Hours Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-base">24/7 Dedicated Support</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Our support desk is active around the clock to assist you with inquiries, deposits, and configurations.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Contact Form Container */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Send us a Message</h3>
            <p className="text-xs text-slate-400 mt-1">
              Assigned Session ID: <span className="font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{userInfo.userId}</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-400">Select a support category</option>
                <option value="deposit" className="bg-slate-900 text-white">Deposit Issue</option>
                <option value="withdrawal" className="bg-slate-900 text-white">Withdrawal Issue</option>
                <option value="account" className="bg-slate-900 text-white">Account Problem</option>
                <option value="technical" className="bg-slate-900 text-white">Technical Support</option>
                <option value="general" className="bg-slate-900 text-white">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Message Details
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                placeholder="Describe your issue or question in detail..."
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all cursor-pointer disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Transmitting Message...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4 pt-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  <FileQuestion className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{faq.question}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Security Notice Card */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900/80 to-blue-900/40 border border-purple-500/30 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-purple-400">
          <Shield className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-white text-base">Security First Reminder</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Never share your account password, private keys, or seed phrases with anyone. Official platform representatives will never request sensitive authentication keys. Always ensure you are operating on the authenticated domain.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ContactSupport;
