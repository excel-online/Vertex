import { X, Send, MessageCircle } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/services/api';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string | number;
  sender: 'support' | 'user';
  text: string;
  time: string;
}

interface ChatHistoryMessage {
  _id: string;
  sender: string;
  message: string;
  createdAt: string;
}

// UNIFIED USER ID - Same function as ContactSupport
const getUnifiedUserInfo = (authUser?: any) => {
  // Try to get existing user ID from localStorage
  let userId = localStorage.getItem('vellumtrade_user_id');
  let userName = localStorage.getItem('vellumtrade_user_name');
  let userEmail = localStorage.getItem('vellumtrade_user_email');
  
  // PRIORITY: Check passed auth user first (from useAuth context)
  if (authUser?.id || authUser?._id) {
    userId = authUser.id || authUser._id;
    userName = authUser.name || authUser.firstName || authUser.username || 'User';
    userEmail = authUser.email;
  } 
  // Fallback: Check localStorage user if no auth context
  else {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (localUser.id || localUser._id) {
      userId = localUser.id || localUser._id;
      userName = localUser.name || localUser.firstName || localUser.username || 'User';
      userEmail = localUser.email;
    } else if (!userId) {
      // Guest - create persistent ID
      userId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      userName = 'Guest User';
      userEmail = 'guest@example.com';
    }
  }
  
  // Store for consistency across the site
  localStorage.setItem('vellumtrade_user_id', userId);
  if (userName) localStorage.setItem('vellumtrade_user_name', userName);
  if (userEmail) localStorage.setItem('vellumtrade_user_email', userEmail);
  localStorage.setItem('chat_guest_id', userId);
  
  return { userId, userName, userEmail };
};

const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'support',
      text: 'Hello! Welcome to Vellumtrade Support. How can we assist you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  
  // Use unified user ID system - computed with useMemo, updates when user changes
  const userInfo = useMemo(() => getUnifiedUserInfo(user), [user]);

  const loadChatHistory = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/support/chat-history/${userInfo.userId}`);
      if (response.data.success && response.data.messages.length > 0) {
        const history: Message[] = response.data.messages.map((msg: ChatHistoryMessage) => ({
          id: msg._id,
          sender: msg.sender === 'admin' ? 'support' : 'user',
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(prev => [...prev, ...history]);
      }
    } catch {
      console.log('No chat history');
    }
  }, [userInfo.userId]);

  // Connect to Socket.io
  useEffect(() => {
    if (!isOpen) return;

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      console.log('Connected to chat with userId:', userInfo.userId);
      setIsConnected(true);
      socketRef.current?.emit('join_chat', userInfo.userId);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for admin replies (from email or chat)
    socketRef.current.on('admin_reply', (data: Message) => {
      console.log('Received admin reply:', data);
      setMessages(prev => [...prev, {
        id: data.id,
        sender: 'support',
        text: data.text,
        time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    // Load chat history
    const timer = setTimeout(() => {
      loadChatHistory();
    }, 0);

    return () => {
      clearTimeout(timer);
      socketRef.current?.disconnect();
    };
  }, [isOpen, userInfo.userId, loadChatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    
    const sentMessage = message;
    setMessage('');

    try {
      await apiClient.post('/api/support/chat-message', {
        userId: userInfo.userId,
        name: userInfo.userName,
        email: userInfo.userEmail,
        message: sentMessage
      });
    } catch {
      console.log('Message saved locally');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-navy-50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gold p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-bold text-navy">Vellumtrade Support</h3>
              <p className="text-xs text-navy/70 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {isConnected ? 'Online' : 'Connecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-navy/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-navy" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gold text-navy rounded-br-md'
                    : 'bg-navy-50 text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className={`text-xs mt-1 block ${
                  msg.sender === 'user' ? 'text-navy/70' : 'text-gray-400'
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-navy-50 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="p-3 bg-gold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors"
            >
              <Send className="w-5 h-5 text-navy" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Or contact us faster on{' '}
            <a
              href="https://wa.me/+15742384154"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:underline font-medium"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;