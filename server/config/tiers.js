// app/server/config/tiers.js

const TIER_CONFIG = {
  None: {
    name: 'None',
    minDeposit: 0,
    maxWithdrawal: 0,
    minWithdrawal: 0,
    description: 'No tier'
  },
  Starter: {
    name: 'Starter',
    minDeposit: 100,
    maxWithdrawal: 1000,
    minWithdrawal: 10,
    description: 'Starter tier - $100 minimum deposit'
  },
  Premium: {
    name: 'Premium',
    minDeposit: 5000,
    maxWithdrawal: 5000,
    minWithdrawal: 50,
    description: 'Premium tier - $5,000 minimum deposit'
  },
  Standard: {
    name: 'Standard',
    minDeposit: 20000,
    maxWithdrawal: 15000,
    minWithdrawal: 100,
    description: 'Standard tier - $20,000 minimum deposit'
  },
  VIP: {
    name: 'VIP',
    minDeposit: 50000,
    maxWithdrawal: 50000,
    minWithdrawal: 500,
    description: 'VIP tier - $50,000 minimum deposit'
  }
};

function getTierByDeposit(amount) {
  if (amount >= 50000) return 'VIP';
  if (amount >= 20000) return 'Standard';
  if (amount >= 5000) return 'Premium';
  if (amount >= 100) return 'Starter';
  return 'None';
}

function getMaxWithdrawalAmount(user) {
  const tier = TIER_CONFIG[user.investmentTier];
  if (!tier) return 0;
  
  // ONLY earnings + bonus (deposits LOCKED forever)
  const earningsAndBonus = (user.totalEarned || 0) + (user.bonusBalance || 0);
  
  // Can withdraw ALL earnings + bonus, only limited by per-transaction cap
  return Math.max(0, Math.min(earningsAndBonus, tier.maxWithdrawal));
}

function getAvailableToWithdraw(user) {
  // Available = earnings + bonus only (deposits are locked)
  return Math.max(0, (user.totalEarned || 0) + (user.bonusBalance || 0));
}

function getPerTransactionLimit(tierName) {
  const tier = TIER_CONFIG[tierName];
  return tier ? tier.maxWithdrawal : 0;
}

// FIXED: Added missing function that was causing the crash
function getMinWithdrawal(tierName) {
  const tier = TIER_CONFIG[tierName];
  return tier ? tier.minWithdrawal : 0;
}

module.exports = {
  TIER_CONFIG,
  getTierByDeposit,
  getMaxWithdrawalAmount,
  getAvailableToWithdraw,
  getPerTransactionLimit,
  getMinWithdrawal  // FIXED: Now exported
};