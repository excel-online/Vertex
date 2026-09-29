import { useState, useEffect, useCallback } from 'react';
import { ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';

interface Notification {
  id: number;
  country: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

const countries = [
  'United States', 'Germany', 'United Kingdom', 'Canada', 'Australia', 
  'France', 'Netherlands', 'Switzerland', 'Japan', 'Singapore',
  'UAE', 'South Africa', 'India', 'Brazil', 'Mexico',
  'Spain', 'Italy', 'Sweden', 'Norway', 'Denmark', 'New Zealand',
  'Hong Kong', 'Malaysia', 'Thailand', 'Indonesia', 'Philippines',
  'Turkey', 'Russia', 'Poland', 'Portugal', 'Belgium', 'Austria'
];

const LiveNotifications = () => {
  const [visible, setVisible] = useState<Notification | null>(null);

  // ✅ Define function FIRST using useCallback
  const showRandomNotification = useCallback(() => {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const amount = Math.floor(Math.random() * 25000) + 500;
    const type = Math.random() > 0.4 ? 'deposit' : 'withdrawal';
    
    const notification: Notification = {
      id: Date.now(),
      country,
      amount,
      type
    };

    setVisible(notification);

    setTimeout(() => {
      setVisible(null);
    }, 6000);
  }, []);

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    const interval = setInterval(() => {
      showRandomNotification();
    }, Math.random() * 7000 + 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [showRandomNotification]);

  const handleClose = () => {
    setVisible(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-6 z-40 animate-in slide-in-from-left">
      <div className="bg-navy-50/95 backdrop-blur-sm rounded-lg shadow-lg p-3 flex items-center gap-3 max-w-xs border border-gray-100">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          visible.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {visible.type === 'deposit' ? (
            <ArrowDownLeft className="w-5 h-5 text-green-600" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 text-xs">
            Someone from <span className="font-medium text-gray-800">{visible.country}</span>
          </p>
          <p className={`text-lg font-bold ${
            visible.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
          }`}>
            ${visible.amount.toLocaleString()}
          </p>
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LiveNotifications;