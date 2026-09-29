const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
const Notification = require('../models/Notification.model'); // ✅ ADDED THIS LINE
const { verifyToken } = require('../middleware/auth');
const QRCode = require('qrcode');
const { 
  getMaxWithdrawalAmount, 
  getAvailableToWithdraw, 
  getPerTransactionLimit,
  getMinWithdrawal 
} = require('../config/tiers');

// All routes require authentication
router.use(verifyToken);

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const recentTransactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

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

    const activeInvestments = await Transaction.find({
      userId: user._id,
      type: 'Investment',
      status: 'Approved',
      endDate: { $gte: new Date() }
    }).sort({ endDate: 1 });

    const totalInvested = await Transaction.aggregate([
      { 
        $match: { 
          userId: user._id, 
          type: 'Investment',
          status: 'Approved'
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalDeposited = user.totalDeposited || 0;
    const totalEarned = user.totalEarned || 0;
    const bonusBalance = user.bonusBalance || 0;
    const totalBalance = totalDeposited + totalEarned + bonusBalance;
    const availableForWithdrawal = Math.max(0, totalEarned + bonusBalance);
    const perTransactionLimit = getPerTransactionLimit(user.investmentTier);
    const minWithdrawal = getMinWithdrawal(user.investmentTier);

    res.json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          investmentTier: user.investmentTier,
          totalDeposited: totalDeposited,
          totalEarned: totalEarned,
          bonusBalance: bonusBalance,
          totalBalance: totalBalance,
          availableForWithdrawal: availableForWithdrawal,
          perTransactionLimit: perTransactionLimit,
          minWithdrawal: minWithdrawal,
          referralCode: user.referralCode,
          referralCount: user.referralCount
        },
        stats: {
          totalInvested: totalInvested[0]?.total || 0,
          activeInvestments: activeInvestments.length,
          transactionSummary
        },
        recentTransactions,
        activeInvestments
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    const query = { userId: req.user.id };
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
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

// @route   POST /api/user/deposit
// @desc    Create deposit request
// @access  Private
router.post('/deposit', [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number')
    .custom(value => value >= 100).withMessage('Minimum deposit is $100'),
  body('depositMethod')
    .notEmpty().withMessage('Deposit method is required')
    .isIn(['Bitcoin', 'Ethereum', 'USDT', 'Bank Transfer', 'Credit Card'])
    .withMessage('Invalid deposit method'),
  body('transactionHash')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Transaction ID must be at least 5 characters')
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

    const { amount, depositMethod, depositAddress, transactionHash } = req.body;

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'Deposit',
      amount: parseFloat(amount),
      currency: depositMethod === 'USDT' ? 'USDT' : depositMethod === 'Bitcoin' ? 'BTC' : depositMethod === 'Ethereum' ? 'ETH' : 'USD',
      status: 'Pending',
      depositMethod,
      depositAddress: depositAddress || null,
      transactionHash: transactionHash || null
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Deposit request created successfully. Admin will verify your transaction.',
      deposit: {
        id: transaction._id,
        amount: transaction.amount,
        method: transaction.depositMethod,
        transactionHash: transaction.transactionHash,
        status: transaction.status,
        createdAt: transaction.createdAt,
        walletAddress: depositMethod === 'Bitcoin' ? 'bc1q6s86aqlu8aaexhsz06xp5vauy4jnh6dcwuf7xs' :
                      depositMethod === 'Ethereum' ? '0x2173Cc352D0ce91C2DDB76E773D7d224e51767F3' :
                      depositMethod === 'USDT' ? '0x2173Cc352D0ce91C2DDB76E773D7d224e51767F3' : null
      }
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/user/deposit/:id/transaction-hash
// @desc    Update transaction hash for existing deposit
// @access  Private
router.put('/deposit/:id/transaction-hash', [
  param('id').isMongoId().withMessage('Invalid deposit ID'),
  body('transactionHash')
    .notEmpty().withMessage('Transaction hash is required')
    .trim()
    .isLength({ min: 5 }).withMessage('Transaction ID must be at least 5 characters')
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

    const { transactionHash } = req.body;
    
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
      type: 'Deposit'
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Deposit not found'
      });
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update transaction hash. Deposit is already ${transaction.status}`
      });
    }

    transaction.transactionHash = transactionHash;
    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction hash updated successfully',
      deposit: {
        id: transaction._id,
        amount: transaction.amount,
        transactionHash: transaction.transactionHash,
        status: transaction.status
      }
    });
  } catch (error) {
    console.error('Update transaction hash error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/user/withdrawal
// @desc    Create withdrawal request
// @access  Private
router.post('/withdrawal', [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number'),
  body('withdrawalMethod')
    .notEmpty().withMessage('Withdrawal method is required')
    .isIn(['Bitcoin', 'Ethereum', 'USDT', 'Bank Transfer'])
    .withMessage('Invalid withdrawal method'),
  body('withdrawalAddress')
    .notEmpty().withMessage('Withdrawal address is required')
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

    const { amount, withdrawalMethod, withdrawalAddress } = req.body;
    const withdrawalAmount = parseFloat(amount);

    const user = await User.findById(req.user.id);

    const availableToWithdraw = getAvailableToWithdraw(user);
    const maxPerTransaction = getMaxWithdrawalAmount(user);
    const minWithdrawal = getMinWithdrawal(user.investmentTier);

    if (withdrawalAmount < minWithdrawal) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal is $${minWithdrawal}`
      });
    }

    if (withdrawalAmount > availableToWithdraw) {
      return res.status(400).json({
        success: false,
        message: `Insufficient available balance. You can withdraw up to $${availableToWithdraw.toFixed(2)} (earnings + bonus only)`
      });
    }

    if (withdrawalAmount > maxPerTransaction) {
      return res.status(400).json({
        success: false,
        message: `Withdrawal amount exceeds per-transaction limit of $${maxPerTransaction.toFixed(2)}`
      });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'Withdrawal',
      amount: withdrawalAmount,
      currency: withdrawalMethod === 'USDT' ? 'USDT' : withdrawalMethod === 'Bitcoin' ? 'BTC' : withdrawalMethod === 'Ethereum' ? 'ETH' : 'USD',
      status: 'Pending',
      withdrawalMethod,
      withdrawalAddress
    });

   await transaction.save();

    // ✅ ADDED: Send notification (wrapped in try-catch so it doesn't break withdrawal)
    try {
      await Notification.create({
        userId: req.user.id,
        type: 'withdrawal_submitted',
        title: 'Withdrawal Request Submitted',
        message: `Your withdrawal request for $${withdrawalAmount.toLocaleString()} via ${withdrawalMethod} has been submitted and is pending approval.`,
        read: false
      });
    } catch (notifError) {
      console.error('Notification creation failed:', notifError);
      // Don't throw - withdrawal succeeded even if notification failed
    }

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully. Pending admin approval.',
      withdrawal: {
        id: transaction._id,
        amount: transaction.amount,
        method: transaction.withdrawalMethod,
        address: transaction.withdrawalAddress,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/investments
// @desc    Get user investments
// @access  Private
router.get('/investments', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    const query = { 
      userId: req.user.id,
      type: 'Investment'
    };
    
    if (status === 'active') {
      query.status = 'Approved';
      query.endDate = { $gte: new Date() };
    } else if (status === 'completed') {
      query.status = 'Approved';
      query.endDate = { $lt: new Date() };
    } else if (status !== 'all') {
      query.status = status;
    }

    const investments = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    const totalStats = await Transaction.aggregate([
      { 
        $match: { 
          userId: req.user._id, 
          type: 'Investment',
          status: 'Approved'
        } 
      },
      {
        $group: {
          _id: null,
          totalInvested: { $sum: '$amount' },
          totalExpectedReturn: { $sum: '$expectedReturn' }
        }
      }
    ]);

    res.json({
      success: true,
      investments,
      stats: totalStats[0] || { totalInvested: 0, totalExpectedReturn: 0 },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/referrals
// @desc    Get user referral information
// @access  Private
router.get('/referrals', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const referredUsers = await User.find({ referredBy: user._id })
      .select('firstName lastName username email createdAt investmentTier')
      .sort({ createdAt: -1 });

    const referralEarnings = await Transaction.aggregate([
      {
        $match: {
          userId: user._id,
          type: 'Referral'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      referralInfo: {
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        referralBonus: user.referralBonus,
        totalEarnings: referralEarnings[0]?.total || 0,
        referredUsers
      }
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/user/wallet-addresses
// @desc    Get deposit wallet addresses
// @access  Private
router.get('/wallet-addresses', async (req, res) => {
  try {
    const walletAddresses = {
      Bitcoin: {
        address: 'bc1q6s86aqlu8aaexhsz06xp5vauy4jnh6dcwuf7xs',
        network: 'BTC',
        qrCode: await QRCode.toDataURL('bitcoin:bc1q6s86aqlu8aaexhsz06xp5vauy4jnh6dcwuf7xs')
      },
      Ethereum: {
        address: '0x2173Cc352D0ce91C2DDB76E773D7d224e51767F3',
        network: 'ETH',
        qrCode: await QRCode.toDataURL('ethereum:0x2173Cc352D0ce91C2DDB76E773D7d224e51767F3')
      },
      USDT: {
        address: '0x2173Cc352D0ce91C2DDB76E773D7d224e51767F3',
        network: 'ERC20',
        qrCode: await QRCode.toDataURL(
          `ethereum:0x2173Cc352D0ce91C2DDB76E773D7d224e51767F3`
        )
      }
    };

    res.json({
      success: true,
      walletAddresses
    });
  } catch (error) {
    console.error('Get wallet addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;