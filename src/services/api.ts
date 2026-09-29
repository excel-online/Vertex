import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { 
  User, 
  Transaction, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  DashboardData,
  AdminDashboardData,
  DepositData,
  WithdrawalData,
  WalletAddresses,
  ApiResponse
} from '@/types';

// ============================================
// NEW: CoinGecko Crypto Types
// ============================================
export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CryptoTickerItem {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  image: string;
  rank: number;
}

// Activity feed notification (like your video)
export interface ActivityNotification {
  id: string;
  country: string;
  action: 'withdrawn' | 'trading' | 'deposited' | 'bought' | 'sold';
  amount: number;
  currency: string;
  timestamp: Date;
}

// 1. Types & Interfaces
export interface NotificationData {
  amount?: number;
  currency?: string;
  reason?: string;
  planName?: string;
  profit?: number;
  referrerName?: string;
  tierName?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface NotificationItem {
  _id: string;
  type: 'deposit_confirmed' | 'deposit_rejected' | 'withdrawal_approved' | 'withdrawal_rejected' | 
        'investment_matured' | 'referral_bonus' | 'account_upgrade' | 'support_reply' | 'system';
  title: string;
  message: string;
  read: boolean;
  data: NotificationData;
  createdAt: string;
}

// ============================================
// PASSWORD RESET TYPES
// ============================================
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// FIXED: Production API URL
// ============================================
const PRODUCTION_API_URL = 'http://localhost:5000';

// 2. Create axios instance (THE ONLY ONE)
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || PRODUCTION_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  withCredentials: false  // FIXED: Changed to false for better CORS compatibility
});

// NEW: CoinGecko API instance (FREE - no auth required)
const coinGeckoClient: AxiosInstance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// HELPER: Extension-resistant fetch with retry (for non-auth requests)
// ============================================

const API_BASE = import.meta.env.VITE_API_URL || PRODUCTION_API_URL;

// Use native fetch with retry logic - harder for extensions to intercept
const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  retries = 3
): Promise<any> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        // Prevent caching issues
        cache: 'no-store',
        // Ensure credentials are sent
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${i + 1} failed:`, error);
      
      // Wait before retry with exponential backoff
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// 3. Auth Service
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },
  getMe: async (): Promise<AuthResponse> => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
  updateProfile: async (data: Partial<User>): Promise<AuthResponse> => {
    const response = await apiClient.put('/api/auth/profile', data);
    return response.data;
  },
  changePassword: async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
  
  // ============================================
  // FIXED: Use axios instead of fetch for password reset
  // This fixes CORS + credentials issues
  // ============================================
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post('/api/auth/recovery', data);
    return response.data;
  },
  
  verifyResetToken: async (token: string): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get('/api/auth/verify-reset-token', {
      params: { token }
    });
    return response.data;
  },
  
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post('/api/auth/reset-password', data);
    return response.data;
  }
};

// 4. User Service
export const userService = {
  getDashboard: async (): Promise<{ success: boolean; dashboard: DashboardData }> => {
    const response = await apiClient.get('/api/user/dashboard');
    return response.data;
  },
  getTransactions: async (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
    const response = await apiClient.get('/api/user/transactions', { params });
    return response.data;
  },
  createDeposit: async (data: DepositData): Promise<ApiResponse<{ deposit: Transaction; walletAddress?: string }>> => {
    const response = await apiClient.post('/api/user/deposit', data);
    return response.data;
  },
  createWithdrawal: async (data: WithdrawalData): Promise<ApiResponse<{ withdrawal: Transaction }>> => {
    const response = await apiClient.post('/api/user/withdrawal', data);
    return response.data;
  },
  getInvestments: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get('/api/user/investments', { params });
    return response.data;
  },
  getReferrals: async (): Promise<{ success: boolean; referralInfo: unknown }> => {
    const response = await apiClient.get('/api/user/referrals');
    return response.data;
  },
  getWalletAddresses: async (): Promise<{ success: boolean; walletAddresses: WalletAddresses }> => {
    const response = await apiClient.get('/api/user/wallet-addresses');
    return response.data;
  }
};

// 5. Admin Service
export const adminService = {
  getDashboard: async (): Promise<{ success: boolean; stats: AdminDashboardData['stats']; tierDistribution: AdminDashboardData['tierDistribution']; recentUsers: User[]; recentTransactions: Transaction[] }> => {
    const response = await apiClient.get('/api/admin/dashboard');
    return response.data;
  },
  getUsers: async (params?: { page?: number; limit?: number; search?: string; tier?: string; status?: string }) => {
    const response = await apiClient.get('/api/admin/users', { params });
    return response.data;
  },
  getUser: async (id: string): Promise<{ success: boolean; user: User; transactions: Transaction[]; transactionSummary: unknown[] }> => {
    const response = await apiClient.get(`/api/admin/users/${id}`);
    return response.data;
  },
  sendCustomEmail: async (
    userId: string, 
    data: { subject: string; headingTitle?: string; messageBody: string }
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post(`/api/admin/users/${userId}/mail`, data);
    return response.data;
  },
  updateUserStatus: async (id: string, isActive: boolean): Promise<{ success: boolean; message: string; user: User }> => {
    const response = await apiClient.put(`/api/admin/users/${id}/status`, { isActive });
    return response.data;
  },
  updateBalance: async (data: {
    userId: string;
    field: 'totalEarned' | 'bonusBalance' | 'totalDeposited' | 'withdrawalLimit';
    amount: number;
    operation?: 'add' | 'subtract' | 'set';
    reason?: string;
  }): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.put('/api/admin/update-balance', data);
    return response.data;
  },
  getTransactions: async (params?: { page?: number; limit?: number; type?: string; status?: string; userId?: string; startDate?: string; endDate?: string }) => {
    const response = await apiClient.get('/api/admin/transactions', { params });
    return response.data;
  },
  withdrawalAction: async (transactionId: string, action: 'approve' | 'reject', reason?: string): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post('/api/admin/withdrawal-action', { transactionId, action, reason });
    return response.data;
  },
  depositAction: async (transactionId: string, action: 'approve' | 'reject', reason?: string): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post('/api/admin/deposit-action', { transactionId, action, reason });
    return response.data;
  },
  createInvestment: async (data: {
    userId: string;
    amount: number;
    plan: string;
    duration: number;
    returnPercentage: number;
  }): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post('/api/admin/create-investment', data);
    return response.data;
  }
};

// ============================================
// 6. Market Service
// ============================================
export const marketService = {
  // Get live forex from your backend
  getLiveTicker: async (): Promise<unknown[]> => {
    const response = await apiClient.get('/api/market/forex-ticker');
    console.log('Forex API response:', response.data);
    return response.data;
  },
  
  // UPDATED: Now fetches data from CoinGecko
  getTopCoins: async (): Promise<CryptoCoin[]> => {
    // Call the new method that actually fetches data
    return await marketService.getCryptoPrices(5); // Get top 5 coins
  },

  // ============================================
  // NEW: FREE COINGECKO CRYPTO METHODS
  // ============================================
  
  getCryptoPrices: async (limit: number = 100, currency: string = 'usd'): Promise<CryptoCoin[]> => {
    const response = await coinGeckoClient.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: Math.min(limit, 250),
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    return response.data;
  },

  /**
   * Get simplified ticker data for table display
   */
  getCryptoTicker: async (limit: number = 100): Promise<CryptoTickerItem[]> => {
    const coins = await marketService.getCryptoPrices(limit);
    return coins.map(coin => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      image: coin.image,
      rank: coin.market_cap_rank
    }));
  },

  /**
   * Search coins by name or symbol
   */
  searchCoins: async (query: string): Promise<CryptoCoin[]> => {
    const response = await coinGeckoClient.get('/search', {
      params: { query }
    });
    // Get detailed data for top 10 search results
    const ids = response.data.coins.slice(0, 10).map((c: any) => c.id).join(',');
    if (!ids) return [];
    
    const details = await coinGeckoClient.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: ids,
        sparkline: false
      }
    });
    return details.data;
  },

  /**
   * Get single coin details
   */
  getCoinDetail: async (coinId: string): Promise<unknown> => {
    const response = await coinGeckoClient.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false
      }
    });
    return response.data;
  },

  /**
   * Get global crypto market data
   */
  getGlobalData: async (): Promise<unknown> => {
    const response = await coinGeckoClient.get('/global');
    return response.data.data;
  },

  /**
   * Get trending coins (top 7)
   */
  getTrending: async (): Promise<unknown[]> => {
    const response = await coinGeckoClient.get('/search/trending');
    return response.data.coins.map((item: any) => ({
      rank: item.item.market_cap_rank,
      name: item.item.name,
      symbol: item.item.symbol,
      thumb: item.item.thumb,
      price: item.item.data?.price || 0,
      change24h: item.item.data?.price_change_percentage_24h?.usd || 0
    }));
  }
};

// ============================================
// 7. Notification Service
// ============================================
export const notificationService = {
  getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<{
    success: boolean;
    notifications: NotificationItem[];
    unreadCount: number;
    totalPages: number;
    currentPage: number;
  }> => {
    const response = await apiClient.get('/api/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: string): Promise<{
    success: boolean;
    notification: NotificationItem;
    unreadCount: number;
  }> => {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{
    success: boolean;
    message: string;
    unreadCount: number;
  }> => {
    const response = await apiClient.put('/api/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<{
    success: boolean;
    message: string;
    unreadCount: number;
  }> => {
    const response = await apiClient.delete(`/api/notifications/${id}`);
    return response.data;
  }
};

// ============================================
// 8. Support Service (NEW - ONLY THIS ADDED)
// ============================================
export const supportService = {
  // Send contact form message to admin (with subject)
  sendContactMessage: async (data: {
    userId: string;
    name: string;
    email: string;
    subject: string;
    subjectLabel: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/api/support/contact', data);
    return response.data;
  },
  
  // Get chat history for live chat
  getChatHistory: async (userId: string): Promise<{ 
    success: boolean; 
    messages: Array<{
      _id: string;
      sender: string;
      message: string;
      createdAt: string;
    }> 
  }> => {
    const response = await apiClient.get(`/api/support/chat-history/${userId}`);
    return response.data;
  },
  
  // Send chat message (for live chat)
  sendChatMessage: async (data: {
    userId: string;
    name: string;
    email: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/api/support/chat-message', data);
    return response.data;
  }
};

export default apiClient;
