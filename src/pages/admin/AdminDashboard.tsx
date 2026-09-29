import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '@/services/api';
import type { AdminDashboardData, User, Transaction } from '@/types';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboard();
      if (response.success) {
        setData({
          stats: response.stats,
          tierDistribution: response.tierDistribution,
          recentUsers: response.recentUsers,
          recentTransactions: response.recentTransactions
        });
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="badge-pending">Pending</span>;
      case 'Approved':
      case 'Completed':
        return <span className="badge-approved">Approved</span>;
      case 'Rejected':
        return <span className="badge-rejected">Rejected</span>;
      default:
        return <span className="text-muted-foreground text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            Overview of platform performance and user activity
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-gold" />
            </div>
            <span className="text-xs text-muted-foreground">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{data?.stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-success mt-1">
            {data?.stats.activeUsers} active
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs text-muted-foreground">Total Deposits</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${data?.stats.totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-danger/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-danger" />
            </div>
            <span className="text-xs text-muted-foreground">Total Withdrawals</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${data?.stats.totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{data?.stats.pendingTransactions}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Transactions awaiting action
          </p>
        </div>
      </div>

      {/* Net Balance */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Net Platform Balance</p>
            <p className={`text-3xl font-bold ${
              (data?.stats.netBalance || 0) >= 0 ? 'text-success' : 'text-danger'
            }`}>
              ${data?.stats.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-gold" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Users */}
        <div className="glass-card">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Users</h3>
            <NavLink 
              to="/admin/users" 
              className="text-sm text-gold hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>
          <div className="p-6">
            {data?.recentUsers && data.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {data.recentUsers.map((user: User) => (
                  <NavLink 
                    key={user.id} 
                    to={`/admin/users/${user.id}`}
                    className="flex items-center justify-between p-4 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold font-semibold">
                          {user.firstName?.[0] || '?'}{user.lastName?.[0] || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.firstName || 'Unknown'} {user.lastName || ''}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.isActive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </NavLink>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 glass-card">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <NavLink 
              to="/admin/transactions" 
              className="text-sm text-gold hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </NavLink>
          </div>
          <div className="p-6">
            {data?.recentTransactions && data.recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {data.recentTransactions.map((transaction: Transaction) => (
                  <div 
                    key={transaction._id} 
                    className="flex items-center justify-between p-4 bg-navy-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'Deposit' ? 'bg-success/20' :
                        transaction.type === 'Withdrawal' ? 'bg-danger/20' :
                        transaction.type === 'Investment' ? 'bg-gold/20' :
                        'bg-purple-500/20'
                      }`}>
                        {transaction.type === 'Deposit' && <ArrowDownLeft className="w-5 h-5 text-success" />}
                        {transaction.type === 'Withdrawal' && <ArrowUpRight className="w-5 h-5 text-danger" />}
                        {transaction.type === 'Investment' && <TrendingUp className="w-5 h-5 text-gold" />}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {typeof transaction.userId === 'object' && transaction.userId
                            ? `${transaction.userId.firstName || 'Unknown'} ${transaction.userId.lastName || ''}`
                            : 'Unknown User'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'Deposit' ? 'text-success' :
                        transaction.type === 'Withdrawal' ? 'text-danger' :
                        'text-white'
                      }`}>
                        {transaction.type === 'Deposit' ? '+' : transaction.type === 'Withdrawal' ? '-' : ''}
                        ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No transactions found</p>
            )}
          </div>
        </div>
      </div>

      {/* Investment Tier Distribution */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Investment Tier Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['None', 'Starter', 'Premium', 'Standard', 'VIP'].map((tier) => {
            const tierData = data?.tierDistribution.find(t => t._id === tier);
            return (
              <div key={tier} className="text-center p-4 bg-navy-50 rounded-lg">
                <p className="text-2xl font-bold text-white">{tierData?.count || 0}</p>
                <p className={`text-sm ${
                  tier === 'VIP' ? 'text-purple-400' :
                  tier === 'Standard' ? 'text-blue-400' :
                  tier === 'Premium' ? 'text-gold' :
                  tier === 'Starter' ? 'text-gray-400' :
                  'text-muted-foreground'
                }`}>{tier}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;