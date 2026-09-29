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
  // Try to get existing user ID from localStorage (set by chat widget or previous visit)
  let userId = localStorage.getItem('vellumtrade_user_id');
  let userName = localStorage.getItem('vellumtrade_user_name');
  let userEmail = localStorage.getItem('vellumtrade_user_email');
  
  // If no existing ID, check if logged in user
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.id || user._id) {
    // Logged in user - use their ID
    userId = user.id || user._id;
    userName = user.name || user.firstName || user.username || 'User';
    userEmail = user.email;
  } else if (!userId) {
    // Guest - create persistent ID
    userId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    userName = 'Guest User';
    userEmail = 'guest@example.com';
  }
  
  // Store for consistency across the site
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

  // Initialize user info on mount
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
        
        // Open chat widget automatically so user can see reply there
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
    <div className="space-y-6">
      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <a 
          href="https://wa.me/15742384154"  
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 rounded-xl p-6 text-white transition-colors"
        >
          <div className="w-12 h-12 bg-navy-50/20 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
          <p className="text-green-100 text-sm">Chat with us instantly</p>
          <p className="mt-2 font-mono">+1 (574) 238-4154</p>
        </a>

        <div className="bg-blue-600 rounded-xl p-6 text-white">
          <div className="w-12 h-12 bg-navy-50/20 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Email</h3>
          <p className="text-blue-100 text-sm">Send us an email</p>
          <p className="mt-2 font-mono text-sm">support@vellumtrade.com</p>
        </div>

        <div className="bg-purple-600 rounded-xl p-6 text-white">
          <div className="w-12 h-12 bg-navy-50/20 rounded-lg flex items-center justify-center mb-4">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Phone</h3>
          <p className="text-purple-100 text-sm">Call us directly</p>
          <p className="mt-2 font-mono">+1 (574) 238-4154</p>
        </div>
      </div>

      {/* Support Hours */}
      <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Support Hours</h3>
            <p className="text-gray-600">Our support team is available 24/7 to assist you with any questions or concerns.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Send us a Message</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your ID: <span className="font-mono text-xs">{userInfo.userId}</span>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select a subject</option>
                <option value="deposit">Deposit Issue</option>
                <option value="withdrawal">Withdrawal Issue</option>
                <option value="account">Account Problem</option>
                <option value="technical">Technical Support</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Describe your issue or question in detail..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Sending...
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
        <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  <FileQuestion className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-navy-50/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Security First</h3>
            <p className="text-blue-100">
              Never share your password or private keys with anyone. Our support team will never ask for 
              your sensitive information. Always verify you are on the official Vellumtrade website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;