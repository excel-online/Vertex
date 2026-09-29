const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { TIER_CONFIG, getAvailableToWithdraw, getPerTransactionLimit, getMinWithdrawal } = require('../config/tiers');

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Account Settings
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  currencyType: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'TRY', 'BRL', 'ZAR', 'NAD'],
    default: 'USD'
  },
  accountType: {
    type: String,
    enum: ['CryptoCurrency Investment', 'Forex Trading', 'Stock Trading', 'Binary Option Trading', 'Bitcoin Mining'],
    default: 'CryptoCurrency Investment'
  },
  
  // Financial Balances
  totalDeposited: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  bonusBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Investment Tier
  investmentTier: {
    type: String,
    enum: ['Starter', 'Premium', 'Standard', 'VIP', 'None'],
    default: 'None'
  },
  
  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralCount: {
    type: Number,
    default: 0
  },
  referralBonus: {
    type: Number,
    default: 0
  },
  
  // Password Reset Fields
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
  },
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total balance
userSchema.virtual('totalBalance').get(function() {
  return this.totalDeposited + this.totalEarned + this.bonusBalance;
});

// Virtual for available for withdrawal (earnings + bonus only, deposits locked)
userSchema.virtual('availableForWithdrawal').get(function() {
  const earningsAndBonus = this.totalEarned + this.bonusBalance;
  return Math.max(0, earningsAndBonus);
});

// Virtual for per-transaction limit based on tier
userSchema.virtual('perTransactionLimit').get(function() {
  return getPerTransactionLimit(this.investmentTier);
});

// Virtual for minimum withdrawal based on tier
userSchema.virtual('minWithdrawal').get(function() {
  return getMinWithdrawal(this.investmentTier);
});

// Index for faster queries
userSchema.index({ isAdmin: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  return `${this.username}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

// Update investment tier based on total deposited
userSchema.methods.updateInvestmentTier = function() {
  const deposited = this.totalDeposited;
  
  let newTier = 'None';
  if (deposited >= 50000) {
    newTier = 'VIP';
  } else if (deposited >= 20000) {
    newTier = 'Standard';
  } else if (deposited >= 5000) {
    newTier = 'Premium';
  } else if (deposited >= 100) {
    newTier = 'Starter';
  }
  
  this.investmentTier = newTier;
};

module.exports = mongoose.model('User', userSchema);