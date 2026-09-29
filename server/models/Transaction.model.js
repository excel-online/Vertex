const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Transaction Details
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal', 'Investment', 'Bonus', 'Referral', 'Adjustment'],
    required: [true, 'Transaction type is required']
  },
  
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'TRY', 'BRL', 'ZAR', 'NAD', 'BTC', 'USDT', 'ETH'],
    default: 'USD'
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Processing', 'Completed'],
    default: 'Pending'
  },
  
  // For Deposits
  depositMethod: {
    type: String,
    enum: ['Bitcoin', 'Ethereum', 'USDT', 'Bank Transfer', 'Credit Card', 'Other', null],
    default: null
  },
  
  depositAddress: {
    type: String,
    default: null
  },
  
  // User-submitted transaction ID for manual payments
  transactionId: {
    type: String,
    default: null,
    trim: true,
    uppercase: true
  },
  
  // For crypto deposits (blockchain hash)
  transactionHash: {
    type: String,
    default: null
  },
  
  // For Withdrawals
  withdrawalMethod: {
    type: String,
    enum: ['Bitcoin', 'Ethereum', 'USDT', 'Bank Transfer', 'Other', null],
    default: null
  },
  
  withdrawalAddress: {
    type: String,
    default: null
  },
  
  // For Investments
  investmentPlan: {
    type: String,
    enum: ['Starter', 'Premium', 'Standard', 'VIP', 'Custom', null],
    default: null
  },
  
  expectedReturn: {
    type: Number,
    default: 0
  },
  
  returnPercentage: {
    type: Number,
    default: 0
  },
  
  duration: {
    type: Number, // in days
    default: 0
  },
  
  startDate: {
    type: Date,
    default: null
  },
  
  endDate: {
    type: Date,
    default: null
  },
  
  // Admin Notes
  adminNotes: {
    type: String,
    default: ''
  },
  
  // Rejection Reason
  rejectionReason: {
    type: String,
    default: ''
  },
  
  // Processed by (Admin)
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ transactionId: 1 }); // NEW: Index for transaction ID lookups

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

// Static method to get user's transaction summary
transactionSchema.statics.getUserSummary = async function(userId) {
  const summary = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return summary;
};

// Static method to get pending transactions count
transactionSchema.statics.getPendingCount = async function() {
  return await this.countDocuments({ status: 'Pending' });
};

module.exports = mongoose.model('Transaction', transactionSchema);