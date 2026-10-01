const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User.model');
const { verifyToken, generateToken } = require('../middleware/auth');
const crypto = require('crypto');
const axios = require('axios');

// ============================================
// SENDGRID EMAIL HELPER - UPDATED TO USE WEB API
// ============================================

const sendEmail = async ({ to, subject, html, from = 'noreply@vellumtrade.com' }) => {
  try {
    const response = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: { email: from, name: 'Vellumtrade' },
        subject: subject,
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Email sent successfully via SendGrid API');
    return { success: true };
  } catch (error) {
    console.error('Send email error:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================
// PASSWORD RESET ROUTES (Extension-Resistant)
// ============================================

router.post('/recovery', [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail()
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

    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0a1628; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0;">Vellumtrade</h1>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #0a1628;">Password Reset Request</h2>
          <p style="color: #333;">You requested a password reset for your Vellumtrade account.</p>
          <p style="color: #333;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #d4af37; color: #0a1628; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Vellumtrade - Password Reset Request',
      html: message
    });

    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link shortly.'
    });

  } catch (error) {
    console.error('Recovery error:', error);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    res.status(500).json({ success: false, message: 'Server error. Could not send reset email.' });
  }
});

router.post('/forgot-password', [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    const resetUrl = `https://vellumtrade.com/reset-password?token=${resetToken}`;
    const message = `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`;

    await sendEmail({ to: user.email, subject: 'Vellumtrade - Password Reset Request', html: message });

    res.json({ success: true, message: 'If an account exists with this email, you will receive a password reset link shortly.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error. Could not send reset email.' });
  }
});

router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Invalid token' });

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    res.json({ success: true, message: 'Token is valid' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').notEmpty().withMessage('New password is required').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed' });

    const { token, newPassword } = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. Please login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============================================
// REGISTER & LOGIN ROUTES
// ============================================

router.post('/register', [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('username').trim().notEmpty(),
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty().isLength({ min: 6 }),
  body('phoneNumber').trim().notEmpty(),
  body('country').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const { firstName, lastName, username, email, password, phoneNumber, country, currencyType, accountType, referralCode } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ success: false, message: 'Username already taken.' });
    }

    const userData = { firstName, lastName, username, email, password, phoneNumber, country, currencyType: currencyType || 'USD', accountType: accountType || 'CryptoCurrency Investment' };
    
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        userData.referredBy = referrer._id;
        referrer.referralCount += 1;
        await referrer.save();
      }
    }

    const user = new User(userData);
    user.referralCode = user.generateReferralCode();
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'Registration successful!', token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

router.post('/login', [
  body('email').trim().isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Invalid credentials format' });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated.' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful!', token, user: { id: user._id, email: user.email, username: user.username, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ============================================
// GOOGLE AUTHENTICATION ROUTE
// ============================================
router.post('/google', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').notEmpty(),
  body('lastName').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid Google user details' });
    }

    const { email, firstName, lastName } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = new User({
        firstName,
        lastName,
        username,
        email,
        password: randomPassword,
        phoneNumber: 'Not Provided',
        country: 'Global',
        isVerified: true
      });

      user.referralCode = user.generateReferralCode();
      await user.save();
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated.' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Google login successful!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        totalBalance: user.totalBalance
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Server error during Google authentication.' });
  }
});

// Profile / Current User Routes
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
