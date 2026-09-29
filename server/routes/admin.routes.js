const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const { verifyToken, isAdmin } = require('../middleware/auth');
const Notification = require('../models/Notification.model');
const { getMaxWithdrawalAmount, getAvailableToWithdraw, getPerTransactionLimit, getMinWithdrawal } = require('../config/tiers');

// All routes require authentication and admin privileges
router.use(verifyToken, isAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalDeposits,
      totalWithdrawals,
      pendingTransactions,
      recentUsers,
      recentTransactions
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Transaction.aggregate([
        { $match: { type: 'Deposit', status: 'Approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'Withdrawal', status: 'Approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.countDocuments({ status: 'Pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password').lean(),
      Transaction.find()
        .populate('userId', 'firstName lastName email username')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    const tierDistribution = await User.aggregate([
      { $group: { _id: '$investmentTier', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        pendingTransactions,
        netBalance: (totalDeposits[0]?.total || 0) - (totalWithdrawals[0]?.total || 0)
      },
      tierDistribution,
      recentUsers,
      recentTransactions
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with account stats
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, tier, status } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tier && tier !== 'all') {
      query.investmentTier = tier;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user details
// @access  Admin
router.get('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const transactionSummary = await Transaction.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDeposited = user.totalDeposited || 0;
    const totalEarned = user.totalEarned || 0;
    const bonusBalance = user.bonusBalance || 0;
    const totalBalance = totalDeposited + totalEarned + bonusBalance;
    const availableForWithdrawal = Math.max(0, totalEarned + bonusBalance);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        totalDeposited,
        totalEarned,
        bonusBalance,
        totalBalance,
        availableForWithdrawal,
        perTransactionLimit: getPerTransactionLimit(user.investmentTier),
        minWithdrawal: getMinWithdrawal(user.investmentTier)
      },
      transactions,
      transactionSummary
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle user active status
// @access  Admin
router.put('/users/:id/status', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/update-balance
// @desc    Update user balance (totalEarned and bonusBalance)
// @access  Admin
router.put('/update-balance', [
  body('userId').isMongoId().withMessage('Valid user ID is required'),
  body('field')
    .notEmpty().withMessage('Field is required')
    .isIn(['totalEarned', 'bonusBalance', 'totalDeposited'])
    .withMessage('Invalid field'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number'),
  body('operation')
    .optional()
    .isIn(['add', 'subtract', 'set'])
    .withMessage('Operation must be add, subtract, or set'),
  body('reason')
    .optional()
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId, field, amount, operation = 'add', reason = '' } = req.body;
    const numericAmount = parseFloat(amount);

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let previousValue = user[field];
    let newValue;

    switch (operation) {
      case 'add':
        newValue = previousValue + numericAmount;
        break;
      case 'subtract':
        newValue = Math.max(0, previousValue - numericAmount);
        break;
      case 'set':
        newValue = numericAmount;
        break;
      default:
        newValue = previousValue + numericAmount;
    }

    user[field] = newValue;
    
    if (field === 'totalDeposited') {
      user.updateInvestmentTier();
    }
    
    await user.save();

    const updatedUser = await User.findById(userId);

    const transaction = new Transaction({
      userId: user._id,
      type: 'Adjustment',
      amount: numericAmount,
      currency: 'USD',
      status: 'Completed',
      adminNotes: `Admin ${operation} ${field}: ${reason}`,
      processedBy: req.user._id,
      processedAt: new Date()
    });
    await transaction.save();

    res.json({
      success: true,
      message: 'Balance updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          [field]: updatedUser[field],
          totalDeposited: updatedUser.totalDeposited,
          totalEarned: updatedUser.totalEarned,
          bonusBalance: updatedUser.bonusBalance,
          totalBalance: updatedUser.totalBalance,
          investmentTier: updatedUser.investmentTier,
          availableForWithdrawal: updatedUser.availableForWithdrawal,
          perTransactionLimit: getPerTransactionLimit(updatedUser.investmentTier),
          minWithdrawal: getMinWithdrawal(updatedUser.investmentTier)
        },
        adjustment: {
          field,
          operation,
          amount: numericAmount,
          previousValue,
          newValue,
          reason
        }
      }
    });
  } catch (error) {
    console.error('Update balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/transactions
// @desc    Get all transactions with filters
// @access  Admin
router.get('/transactions', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      status, 
      userId,
      startDate,
      endDate 
    } = req.query;
    
    const query = {};
    
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'firstName lastName email username')
      .populate('processedBy', 'firstName lastName username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      transactions,
      summary,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/withdrawal-action
// @desc    Approve or reject withdrawal
// @access  Admin
router.post('/withdrawal-action', [
  body('transactionId').isMongoId().withMessage('Valid transaction ID is required'),
  body('action')
    .notEmpty().withMessage('Action is required')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be approve or reject'),
  body('reason')
    .optional()
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { transactionId, action, reason = '' } = req.body;

    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.type !== 'Withdrawal') {
      return res.status(400).json({
        success: false,
        message: 'This action is only for withdrawals'
      });
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Withdrawal is already ${transaction.status}`
      });
    }

    const user = await User.findById(transaction.userId);
    
    if (action === 'approve') {
      const availableBalance = getAvailableToWithdraw(user);
      
      if (availableBalance < transaction.amount) {
        return res.status(400).json({
          success: false,
          message: `User has insufficient available balance. Available: $${availableBalance.toFixed(2)}, Requested: $${transaction.amount}`
        });
      }

      let remainingToDeduct = transaction.amount;
      
      if (user.totalEarned > 0) {
        const deductFromEarned = Math.min(user.totalEarned, remainingToDeduct);
        user.totalEarned -= deductFromEarned;
        remainingToDeduct -= deductFromEarned;
      }
      
      if (remainingToDeduct > 0 && user.bonusBalance > 0) {
        const deductFromBonus = Math.min(user.bonusBalance, remainingToDeduct);
        user.bonusBalance -= deductFromBonus;
        remainingToDeduct -= deductFromBonus;
      }
      
      if (remainingToDeduct > 0) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient funds in earnings and bonus'
        });
      }

      transaction.status = 'Approved';
    } else {
      transaction.status = 'Rejected';
      transaction.rejectionReason = reason;
    }

    transaction.processedBy = req.user._id;
    transaction.processedAt = new Date();
    transaction.adminNotes = reason;

   await Promise.all([transaction.save(), user.save()]);

    // ✅ ADDED: Send notification to user based on action (wrapped in try-catch)
    try {
      if (action === 'approve') {
        await Notification.create({
          userId: transaction.userId,
          type: 'withdrawal_approved',
          title: 'Withdrawal Approved',
          message: `Your withdrawal request for $${transaction.amount.toLocaleString()} has been approved and is being processed.`,
          read: false
        });
      } else {
        await Notification.create({
          userId: transaction.userId,
          type: 'withdrawal_rejected',
          title: 'Withdrawal Rejected',
          message: `Your withdrawal request for $${transaction.amount.toLocaleString()} was rejected. Reason: ${reason}`,
          read: false
        });
      }
    } catch (notifError) {
      console.error('Notification creation failed:', notifError);
      // Don't throw - withdrawal action succeeded even if notification failed
    }

    const updatedUser = await User.findById(user._id);

    res.json({
      success: true,
      message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        processedAt: transaction.processedAt
      },
      user: {
        id: updatedUser._id,
        totalEarned: updatedUser.totalEarned,
        bonusBalance: updatedUser.bonusBalance,
        totalDeposited: updatedUser.totalDeposited,
        totalBalance: updatedUser.totalBalance,
        investmentTier: updatedUser.investmentTier,
        availableForWithdrawal: updatedUser.availableForWithdrawal,
        perTransactionLimit: getPerTransactionLimit(updatedUser.investmentTier),
        minWithdrawal: getMinWithdrawal(updatedUser.investmentTier)
      }
    });
  } catch (error) {
    console.error('Withdrawal action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/deposit-action
// @desc    Approve or reject deposit
// @access  Admin
router.post('/deposit-action', [
  body('transactionId').isMongoId().withMessage('Valid transaction ID is required'),
  body('action')
    .notEmpty().withMessage('Action is required')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be approve or reject'),
  body('reason')
    .optional()
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { transactionId, action, reason = '' } = req.body;

    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.type !== 'Deposit') {
      return res.status(400).json({
        success: false,
        message: 'This action is only for deposits'
      });
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Deposit is already ${transaction.status}`
      });
    }

    const user = await User.findById(transaction.userId);
    const oldTier = user.investmentTier;
    const oldLimit = getPerTransactionLimit(user.investmentTier);
    
    if (action === 'approve') {
      user.totalDeposited += transaction.amount;
      
      user.updateInvestmentTier();
      
      const newTier = user.investmentTier;
      const newLimit = getPerTransactionLimit(newTier);
      
      transaction.status = 'Approved';

      const newNotification = new Notification({
        userId: user._id,
        type: 'deposit_confirmed',
        title: 'Deposit Approved',
        message: `Your deposit of $${transaction.amount} has been approved. ${newTier !== oldTier ? `You have been upgraded to ${newTier} tier! Your per-transaction limit is now $${newLimit}.` : ''}`,
        read: false
      });

      transaction.processedBy = req.user._id;
      transaction.processedAt = new Date();
      transaction.adminNotes = reason;

      await Promise.all([
        transaction.save(),
        user.save(),
        newNotification.save()
      ]);

      const updatedUser = await User.findById(user._id);

      const totalDeposited = updatedUser.totalDeposited || 0;
      const totalEarned = updatedUser.totalEarned || 0;
      const bonusBalance = updatedUser.bonusBalance || 0;
      const totalBalance = totalDeposited + totalEarned + bonusBalance;
      const availableForWithdrawal = Math.max(0, totalEarned + bonusBalance);

      res.json({
        success: true,
        message: `Deposit approved successfully${newTier !== oldTier ? ` and tier upgraded to ${newTier}` : ''}`,
        transaction: {
          id: transaction._id,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status,
          processedAt: transaction.processedAt
        },
        user: {
          id: updatedUser._id,
          totalDeposited: totalDeposited,
          totalEarned: totalEarned,
          bonusBalance: bonusBalance,
          totalBalance: totalBalance,
          availableForWithdrawal: availableForWithdrawal,
          investmentTier: updatedUser.investmentTier,
          perTransactionLimit: getPerTransactionLimit(updatedUser.investmentTier),
          minWithdrawal: getMinWithdrawal(updatedUser.investmentTier),
          tierUpgrade: newTier !== oldTier ? {
            from: oldTier,
            to: newTier,
            oldLimit: oldLimit,
            newLimit: newLimit
          } : null
        }
      });
      
    } else {
      transaction.status = 'Rejected';
      transaction.rejectionReason = reason;
      transaction.processedBy = req.user._id;
      transaction.processedAt = new Date();
      transaction.adminNotes = reason;

      const newNotification = new Notification({
        userId: user._id,
        type: 'deposit_rejected',
        title: 'Deposit Rejected',
        message: `Your deposit of $${transaction.amount} was rejected. Reason: ${reason}`,
        read: false
      });

      await Promise.all([
        transaction.save(),
        newNotification.save()
      ]);

      res.json({
        success: true,
        message: 'Deposit rejected successfully',
        transaction: {
          id: transaction._id,
          type: transaction.type,
          amount: transaction.amount,
          status: transaction.status,
          processedAt: transaction.processedAt
        }
      });
    }
  } catch (error) {
    console.error('Deposit action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;