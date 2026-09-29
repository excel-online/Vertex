import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X, ArrowUpRight, ArrowDownRight, TrendingUp, Users, Shield, MessageCircle, AlertCircle } from 'lucide-react';
import { notificationService, type NotificationItem } from '@/services/api'; 
import { formatDistanceToNow } from 'date-fns';

const notificationConfig = {
  deposit_confirmed: { icon: ArrowDownRight, color: 'text-green-500', bg: 'bg-green-100' },
  deposit_rejected: { icon: X, color: 'text-red-500', bg: 'bg-red-100' },
  withdrawal_approved: { icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-100' },
  withdrawal_rejected: { icon: X, color: 'text-red-500', bg: 'bg-red-100' },
  investment_matured: { icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100' },
  referral_bonus: { icon: Users, color: 'text-orange-500', bg: 'bg-orange-100' },
  account_upgrade: { icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  support_reply: { icon: MessageCircle, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  system: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-100' }
};

const getNotificationIcon = (type: string) => {
  const config = notificationConfig[type as keyof typeof notificationConfig] || notificationConfig.system;
  const Icon = config.icon;
  return (
    <div className={`p-2 rounded-full ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
    </div>
  );
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications({ limit: 20 });
      if (response.success) {
        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await notificationService.deleteNotification(id);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button - Made responsive */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-[10px] sm:text-xs font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile: Full screen overlay */}
          <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown - Mobile responsive */}
          <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto top-16 sm:top-auto sm:right-0 mt-2 sm:mt-2 sm:w-80 md:w-96 bg-navy-50 rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden max-h-[calc(100vh-6rem)] sm:max-h-80">
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'No new notifications'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                  <span className="sm:hidden">Read all</span>
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-12rem)] sm:max-h-80">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 sm:py-12 text-center text-gray-500">
                  <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-sm sm:text-base">No notifications yet</p>
                  <p className="text-xs sm:text-sm mt-1">We'll notify you when something happens</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`group px-3 sm:px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex gap-2 sm:gap-3">
                      {getNotificationIcon(notification.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-medium text-xs sm:text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                            {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : ''}
                          </span>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 sm:gap-3 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                              <Check className="w-3 h-3" />
                              <span className="hidden sm:inline">Mark read</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>

                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}