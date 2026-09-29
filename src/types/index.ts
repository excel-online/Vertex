// User Types
export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  currencyType: string;
  accountType: string;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;
  investmentTier: string;
  totalDeposited: number;
  totalEarned: number;
  bonusBalance: number;
  withdrawalLimit: number;
  totalBalance: number;
  availableForWithdrawal: number;
  referralCode: string;
  referralCount: number;
  referralBonus: number;
  createdAt?: string;
  lastLogin?: string;
}

// Transaction Types
export interface Transaction {
  _id: string;
  userId: string | User;
  type: 'Deposit' | 'Withdrawal' | 'Investment' | 'Bonus' | 'Referral' | 'Adjustment';
  amount: number;
  currency: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';
  depositMethod?: string;
  depositAddress?: string;
  transactionHash?: string;
  withdrawalMethod?: string;
  withdrawalAddress?: string;
  investmentPlan?: string;
  expectedReturn?: number;
  returnPercentage?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  adminNotes?: string;
  rejectionReason?: string;
  processedBy?: string | User;
  processedAt?: string;
  createdAt: string;
  updatedAt?: string;
  formattedAmount?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  currencyType?: string;
  accountType?: string;
  referralCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  errors?: Array<{ msg: string }>;
}

// Dashboard Types
export interface DashboardData {
  user: User;
  stats: {
    totalInvested: number;
    activeInvestments: number;
    transactionSummary: Array<{
      _id: string;
      total: number;
      count: number;
    }>;
  };
  recentTransactions: Transaction[];
  activeInvestments: Transaction[];
}

// Admin Types
export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingTransactions: number;
  netBalance: number;
}

export interface TierDistribution {
  _id: string;
  count: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  tierDistribution: TierDistribution[];
  recentUsers: User[];
  recentTransactions: Transaction[];
}

// Investment Tier Types
export interface InvestmentTier {
  name: string;
  minAmount: number;
  referralBonus: number;
  features: string[];
  color: string;
}

// Deposit/Withdrawal Types
export interface DepositData {
  amount: number;
  depositMethod: string;
  depositAddress?: string;
  transactionHash?: string;
}

export interface WithdrawalData {
  amount: number;
  withdrawalMethod: string;
  withdrawalAddress: string;
}

// Wallet Address Types
export interface WalletAddress {
  address: string;
  network: string;
  qrCode: string;
}

export interface WalletAddresses {
  Bitcoin: WalletAddress;
  Ethereum: WalletAddress;
  USDT: WalletAddress;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ msg: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  [key: string]: T[] | unknown;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}

// CoinGecko Types
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

// ==========================================
// NOTIFICATION TYPES (FIXED!)
// ==========================================

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

export type NotificationType = 
  | 'deposit_confirmed' 
  | 'deposit_rejected' 
  | 'withdrawal_approved' 
  | 'withdrawal_rejected' 
  | 'investment_matured' 
  | 'referral_bonus' 
  | 'account_upgrade' 
  | 'support_reply' 
  | 'system';

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data: NotificationData;  // ✅ FIXED: Record<string, any> → NotificationData
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
  totalPages: number;
  currentPage: number;
}

export interface MarkReadResponse {
  success: boolean;
  notification: Notification;
  unreadCount: number;
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
  unreadCount: number;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
  unreadCount: number;
}