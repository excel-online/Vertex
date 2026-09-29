const Notification = require('../models/Notification.model');

const notificationService = {
  // Create notification for a user
  createNotification: async (userId, type, title, message, data = {}) => {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Create notification error:', error);
      return null;
    }
  },

  // Deposit confirmed
  depositConfirmed: async (userId, amount, currency) => {
    return await notificationService.createNotification(
      userId,
      'deposit_confirmed',
      'Deposit Confirmed',
      `Your ${currency} deposit of $${amount.toLocaleString()} has been confirmed and added to your balance.`,  // ✅ backticks
      { amount, currency }
    );
  },

  // Deposit rejected
  depositRejected: async (userId, amount, currency, reason) => {
    return await notificationService.createNotification(
      userId,
      'deposit_rejected',
      'Deposit Rejected',
      `Your ${currency} deposit of $${amount.toLocaleString()} was rejected. Reason: ${reason}`,  // ✅ backticks
      { amount, currency, reason }
    );
  },

  // Withdrawal approved
  withdrawalApproved: async (userId, amount) => {
    return await notificationService.createNotification(
      userId,
      'withdrawal_approved',
      'Withdrawal Approved',
      `Your withdrawal request for $${amount.toLocaleString()} has been approved and is being processed.`,  // ✅ backticks
      { amount }
    );
  },

  // Withdrawal rejected
  withdrawalRejected: async (userId, amount, reason) => {
    return await notificationService.createNotification(
      userId,
      'withdrawal_rejected',
      'Withdrawal Rejected',
      `Your withdrawal request for $${amount.toLocaleString()} was rejected. Reason: ${reason}`,  // ✅ backticks
      { amount, reason }
    );
  },

  // Add this inside notificationService object (after withdrawalRejected)
withdrawalSubmitted: async (userId, amount, method) => {
  return await notificationService.createNotification(
    userId,
    'withdrawal_submitted',
    'Withdrawal Request Submitted',
    `Your withdrawal request for $${amount.toLocaleString()} via ${method} has been submitted and is pending approval.`,
    { amount, method }
  );
},

  // Investment matured
  investmentMatured: async (userId, planName, profit) => {
    return await notificationService.createNotification(
      userId,
      'investment_matured',
      'Investment Matured',
      `Your ${planName} investment has matured! You earned $${profit.toLocaleString()} profit.`,  // ✅ backticks
      { planName, profit }
    );
  },

  // Referral bonus
  referralBonus: async (userId, amount, referrerName) => {
    return await notificationService.createNotification(
      userId,
      'referral_bonus',
      'Referral Bonus Earned',
      `You earned $${amount.toLocaleString()} referral bonus from ${referrerName}'s deposit!`,  // ✅ backticks
      { amount, referrerName }
    );
  },

  // Account upgrade
  accountUpgrade: async (userId, tierName) => {
    return await notificationService.createNotification(
      userId,
      'account_upgrade',
      'Account Upgraded',
      `Congratulations! Your account has been upgraded to ${tierName} tier. Enjoy your new benefits!`,  // ✅ backticks
      { tierName }
    );
  },

  // Support reply
  supportReply: async (userId) => {
    return await notificationService.createNotification(
      userId,
      'support_reply',
      'New Support Message',
      'Our support team has replied to your message. Check your email or chat for details.',
      {}
    );
  }
};

module.exports = notificationService;