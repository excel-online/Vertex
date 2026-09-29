const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['deposit_confirmed', 'deposit_rejected', 'withdrawal_approved', 'withdrawal_rejected', 
           'investment_matured', 'referral_bonus', 'account_upgrade', 'support_reply', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Index for fetching unread notifications quickly
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);