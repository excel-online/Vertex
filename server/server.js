require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import axios to make external API calls
const axios = require('axios');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const supportRoutes = require('./routes/support.routes');
const notificationRoutes = require('./routes/notification.routes');
const { initializeSocket } = require('./socket');

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// ============================================
// CORS Configuration - STRICT VERSION
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://vertex-gtp6.vercel.app',
  'https://vertex-five-eta.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// ============================================
// FIXED: Rate Limiting with proper proxy handling
// ============================================

// Trust proxy (required for Render and other cloud platforms)
app.set('trust proxy', 1);

// General rate limiter - FIXED for X-Forwarded-For issue
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  // Fix for X-Forwarded-For issue on Render
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints - EXCLUDE forgot password
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  // Fix for X-Forwarded-For issue
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  // Skip forgot password and recovery endpoints
  skip: (req) => {
    const path = req.path.toLowerCase();
    return path.includes('forgot-password') || 
           path.includes('recovery') ||
           path.includes('reset-password');
  },
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  }
});

// Apply auth limiter only to login and register, NOT forgot password
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// MongoDB Connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log("✅ CLOUD DATABASE CONNECTED!");
  } catch (error) {
    console.error("❌ RENDER CONNECTION ERROR:", error.message);
  }
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/notifications', notificationRoutes);

// Forex Ticker Endpoint
app.get('/api/market/forex-ticker', async (req, res) => {
  try {
    const countryToCurrency = {
      'EU': 'EUR',
      'US': 'USD',
      'JP': 'JPY',
      'GB': 'GBP',
      'CH': 'CHF',
      'AU': 'AUD',
      'CA': 'CAD',
      'NZ': 'NZD',
      'CN': 'CNY'
    };

    const pairsToFetch = [
      { from: 'EUR', to: 'USD' },
      { from: 'GBP', to: 'USD' },
      { from: 'USD', to: 'JPY' },
      { from: 'USD', to: 'CAD' },
      { from: 'EUR', to: 'GBP' }
    ];

    let formattedForexData = [];
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const pair of pairsToFetch) {
      const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${pair.from}&to_currency=${pair.to}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
      
      const response = await axios.get(url);
      console.log('Alpha Vantage response:', JSON.stringify(response.data, null, 2));
      
      const data = response.data['Realtime Currency Exchange Rate'];

      if (data) {
        console.log('From Code:', data['1. From_Currency Code']);
        console.log('To Code:', data['3. To_Currency Code']);
        
        const fromCode = countryToCurrency[data['1. From_Currency Code']] || data['1. From_Currency Code'];
        const toCode = countryToCurrency[data['3. To_Currency Code']] || data['3. To_Currency Code'];
        
        console.log('Mapped From:', fromCode);
        console.log('Mapped To:', toCode);
        
        formattedForexData.push({
          symbol: `${fromCode}${toCode}`,
          current_price: parseFloat(data['5. Exchange Rate']),
          price_change_percentage_24h: 0,
          lastUpdated: data['6. Last Refreshed']
        });
      }

      await wait(12000);
    }

    console.log('Final data sent to frontend:', formattedForexData);
    res.json(formattedForexData);
  } catch (error) {
    console.error('Error fetching live forex data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// CoinGecko Top Coins Proxy Endpoint
app.get('/api/market/coins', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching coin data from CoinGecko:', error.message);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Investment Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      user: '/api/user',
      admin: '/api/admin',
      support: '/api/support',
      health: '/api/health',
      forex: '/api/market/forex-ticker',
      coins: '/api/market/coins'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  // Create HTTP server first
  const http = require('http');
  const httpServer = http.createServer(app);
  
  // Initialize Socket.io
  initializeSocket(httpServer);
  
  // Use httpServer.listen instead of app.listen
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║       🚀 Investment Platform Server Running 🚀            ║
║                                                            ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(43)}║
║   Port: ${PORT.toString().padEnd(51)}║
║   API URL: http://localhost:${PORT}/api${' '.repeat(26)}║
║   Socket.io: Enabled ✅                                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
  });
};
startServer();

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
