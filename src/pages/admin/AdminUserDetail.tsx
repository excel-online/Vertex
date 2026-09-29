import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  DollarSign,
  TrendingUp,
  Gift,
  Wallet,
  Plus,
  Save,
  AlertCircle,
  X,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/api';
import type { User as UserType, Transaction } from '@/types';
import { toast } from 'sonner';

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState({
    field: 'totalEarned' as 'totalEarned' | 'bonusBalance' | 'totalDeposited' | 'withdrawalLimit',
    amount: '',
    operation: 'add' as 'add' | 'subtract' | 'set',
    reason: ''
  });

  // Modal State for Sending Email from User Details
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailHeading, setEmailHeading] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserDetail();
    }
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      const response = await adminService.getUser(id!);
      if (response.success) {
        setUser(response.user);
        setTransactions(response.transactions);
      } else {
        toast.error('User not found');
        navigate('/admin/users');
      }
    } catch (error) {
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!balanceUpdate.amount || isNaN(parseFloat(balanceUpdate.amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await adminService.updateBalance({
        userId: id!,
        field: balanceUpdate.field,
        amount: parseFloat(balanceUpdate.amount),
        operation: balanceUpdate.operation,
        reason: balanceUpdate.reason
      });

      if (response.success) {
        toast.success('Balance updated successfully');
        setShowBalanceModal(false);
        setBalanceUpdate({
          field: 'totalEarned',
          amount: '',
          operation: 'add',
          reason: ''
        });
        fetchUserDetail();
      } else {
        toast.error(response.message || 'Failed to update balance');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    
    try {
      const response = await adminService.updateUserStatus(id!, !user.isActive);
      if (response.success) {
        toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
        fetchUserDetail();
      } else {
        toast.error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSendingEmail(true);
      const response = await adminService.sendCustomEmail(user._id || id!, {
        subject: emailSubject,
        headingTitle: emailHeading,
        messageBody: emailBody
      });

      if (response.success) {
        toast.success('Email sent successfully!');
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailHeading('');
        setEmailBody('');
      } else {
        toast.error(response.message || 'Failed to send email');
      }
    } catch (error) {
      toast.error('An error occurred while sending the email.');
    } finally {
      setSendingEmail(false);
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return 'text-purple-400';
      case 'Standard':
        return 'text-blue-400';
      case 'Premium':
        return 'text-gold';
      case 'Starter':
        return 'text-gray-400';
      default:
        return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Users
      </button>

      {/* User Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold text-2xl font-bold">
                {user.firstName?.[0] || '?'}{user.lastName?.[0] || '?'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user.firstName || 'Unknown'} {user.lastName || ''}
              </h2>
              <p className="text-muted-foreground">@{user.username || 'unknown'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setShowEmailModal(true)}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                user.isActive
                  ? 'bg-danger/20 text-danger hover:bg-danger/30'
                  : 'bg-success/20 text-success hover:bg-success/30'
              }`}
            >
              {user.isActive ? 'Deactivate User' : 'Activate User'}
            </button>
            <Button onClick={() => setShowBalanceModal(true)} className="btn-trading">
              <Plus className="w-4 h-4 mr-2" />
              Update Balance
            </Button>
          </div>
        </div>
      </div>

      {/* User Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold" />
              <span className="text-muted-foreground">{user.email || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold" />
              <span className="text-muted-foreground">{user.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gold" />
              <span className="text-muted-foreground">{user.country || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold" />
              <span className="text-muted-foreground">
                Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Investment Tier</span>
              <span className={`font-semibold ${getTierColor(user.investmentTier)}`}>
                {user.investmentTier || 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account Type</span>
              <span className="text-white">{user.accountType || 'Standard'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Currency</span>
              <span className="text-white">{user.currencyType || 'USD'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.isActive 
                  ? 'bg-success/20 text-success' 
                  : 'bg-danger/20 text-danger'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Referral Info</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Referral Code</span>
              <span className="text-gold font-mono">{user.referralCode || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Referral Count</span>
              <span className="text-white">{user.referralCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Referral Bonus</span>
              <span className="text-gold">${user.referralBonus?.toLocaleString() || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="balance-card">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-gold" />
            <span className="text-sm text-muted-foreground">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${user.totalBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Total Deposited</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${user.totalDeposited?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            <span className="text-sm text-muted-foreground">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${user.totalEarned?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-muted-foreground">Bonus Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${user.bonusBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>
        <div className="p-6">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
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
                      {transaction.type === 'Deposit' && <DollarSign className="w-5 h-5 text-success" />}
                      {transaction.type === 'Withdrawal' && <TrendingUp className="w-5 h-5 text-danger" />}
                      {transaction.type === 'Investment' && <TrendingUp className="w-5 h-5 text-gold" />}
                      {transaction.type === 'Bonus' && <Gift className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'Deposit' || transaction.type === 'Bonus' ? 'text-success' :
                      transaction.type === 'Withdrawal' ? 'text-danger' :
                      'text-white'
                    }`}>
                      {transaction.type === 'Deposit' || transaction.type === 'Bonus' ? '+' : 
                       transaction.type === 'Withdrawal' ? '-' : ''}
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

      {/* Balance Update Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Update Balance</h3>
              <button 
                onClick={() => setShowBalanceModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Balance Field
                </label>
                <select
                  value={balanceUpdate.field}
                  onChange={(e) => setBalanceUpdate(prev => ({ 
                    ...prev, 
                    field: e.target.value as typeof balanceUpdate.field 
                  }))}
                  className="input-trading w-full"
                >
                  <option value="totalEarned">Total Earned</option>
                  <option value="bonusBalance">Bonus Balance</option>
                  <option value="totalDeposited">Total Deposited</option>
                  <option value="withdrawalLimit">Withdrawal Limit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Operation
                </label>
                <div className="flex gap-2">
                  {(['add', 'subtract', 'set'] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => setBalanceUpdate(prev => ({ ...prev, operation: op }))}
                      className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${
                        balanceUpdate.operation === op
                          ? 'bg-gold text-navy'
                          : 'bg-secondary text-muted-foreground hover:text-white'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={balanceUpdate.amount}
                  onChange={(e) => setBalanceUpdate(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                  className="input-trading w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={balanceUpdate.reason}
                  onChange={(e) => setBalanceUpdate(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for this adjustment"
                  className="input-trading w-full h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowBalanceModal(false)}
                  variant="outline"
                  className="flex-1 border-border text-white hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateBalance}
                  className="flex-1 btn-trading"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Template Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 relative border border-border space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Send Branded Template Email</h3>
                  <p className="text-xs text-muted-foreground">
                    To: {user.firstName} ({user.email})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCustomEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Important Update Regarding Your Account"
                  className="input-trading w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Header Title / Logo Text (Optional)</label>
                <input
                  type="text"
                  value={emailHeading}
                  onChange={(e) => setEmailHeading(e.target.value)}
                  placeholder="e.g. MUNTTRADING"
                  className="input-trading w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Message Body (HTML or paragraphs)</label>
                <textarea
                  required
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Type your message here... You can use HTML tags like <p>, <b>, etc."
                  className="input-trading w-full text-sm resize-none"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Note: This will automatically be wrapped in your structured, responsive email template layout.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                  className="border-border text-muted-foreground hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={sendingEmail}
                  className="btn-trading bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  {sendingEmail ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sendingEmail ? 'Sending...' : 'Send Template Email'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetail;
