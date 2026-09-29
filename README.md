# Vellumtrade - Investment Platform

A professional MERN stack investment management platform with a dark trading dashboard aesthetic.

## Features

### Frontend (React + TypeScript + Tailwind CSS)

- **Dark Trading Theme**: Deep navy (#0a0e17) with gold (#c5a059) and success green (#10b981) accents
- **Landing Page**: 
  - Live market ticker powered by CoinGecko API
  - Investment tiers display (Starter, Premium, Standard, VIP)
  - User testimonials and platform statistics
- **Authentication**: JWT-based login and registration
- **User Dashboard**:
  - Portfolio balance cards (Total, Deposited, Earned, Bonus)
  - Recent transactions overview
  - Active investments tracking
  - Referral program
- **Deposit System**: 
  - BTC/USDT/ETH wallet addresses with QR codes
  - Click-to-copy functionality
- **Withdrawal System**: Request withdrawals with admin approval
- **Admin Dashboard**:
  - User management with balance updates
  - Transaction approval/rejection
  - Platform statistics and analytics

### Backend (Node.js + Express + MongoDB)

- **Authentication**: JWT with Bcrypt password hashing
- **User Model**: Complete schema with balances, tiers, and referral system
- **Transaction Model**: Full tracking of deposits, withdrawals, investments
- **Admin APIs**:
  - `GET /admin/users` - List all users
  - `PUT /admin/update-balance` - Update user balances
  - `POST /admin/withdrawal-action` - Approve/reject withdrawals
  - `POST /admin/deposit-action` - Approve/reject deposits
- **Security**: Express Validator, Helmet, Rate Limiting, CORS

## Project Structure

```
investment-platform/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── contexts/       # Auth Context
│   │   ├── layouts/        # Dashboard Layout
│   │   ├── pages/          # Page Components
│   │   │   ├── user/       # User Dashboard Pages
│   │   │   └── admin/      # Admin Dashboard Pages
│   │   ├── services/       # API Services
│   │   └── types/          # TypeScript Types
│   └── package.json
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose Models
│   ├── routes/             # API Routes
│   ├── middleware/         # Auth Middleware
│   └── server.js           # Main Server File
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd investment-platform
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start
```

3. **Setup Frontend**
```bash
cd client
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Environment Variables

**Server (.env)**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/investment-platform
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
```

**Client (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### User
- `GET /api/user/dashboard` - Get dashboard data
- `GET /api/user/transactions` - Get user transactions
- `POST /api/user/deposit` - Create deposit request
- `POST /api/user/withdrawal` - Create withdrawal request
- `GET /api/user/investments` - Get investments
- `GET /api/user/wallet-addresses` - Get deposit addresses

### Admin
- `GET /api/admin/dashboard` - Get admin stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/status` - Toggle user status
- `PUT /api/admin/update-balance` - Update user balance
- `GET /api/admin/transactions` - List all transactions
- `POST /api/admin/withdrawal-action` - Process withdrawal
- `POST /api/admin/deposit-action` - Process deposit

## Default Admin Account

Create an admin user by setting `isAdmin: true` in the database or use the following after registration:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

## Security Features

- JWT-based authentication
- Password hashing with Bcrypt (12 rounds)
- Input validation with Express Validator
- Rate limiting on auth endpoints
- Helmet for security headers
- CORS configuration
- Protected routes in React

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router DOM
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt
- Express Validator
- Helmet
- CORS

## License

MIT License

## Support

For support, contact support@Vellumtrade.com or WhatsApp +1 (574) 238-4154
