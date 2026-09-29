import { useState, useEffect } from 'react';
import { 
  Wallet, 
  ChevronLeft, 
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Gift,
  Check,
  X,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/api';
import type { Transaction } from '@/types';
import { toast } from 'sonner';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('Pending');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [page, type, status]);

  const fetchTransactions = async () => {
    try {
      const response = await adminService.getTransactions({
        page,
        limit: 10,
        type: type !== 'all' ? type : undefined,
        status: status !== 'all' ? status : undefined
      });
      if (response.success) {
        setTransactions(response.transactions);
        setTotalPages(response.pagination.pages);
      }
    } catch  {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedTransaction) return;

    try {
      let response;
      if (selectedTransaction.type === 'Withdrawal') {
        response = await adminService.withdrawalAction(
          selectedTransaction._id,
          action,
          actionReason
        );
      } else if (selectedTransaction.type === 'Deposit') {
        response = await adminService.depositAction(
          selectedTransaction._id,
          action,
          actionReason
        );
      }

      if (response?.success) {
        toast.success(`${selectedTransaction.type} ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        setShowActionModal(false);
        setSelectedTransaction(null);
        setActionReason('');
        fetchTransactions();
      } else {
        toast.error(response?.message || 'Failed to process action');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    }
  };

  const openActionModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowActionModal(true);
  };

  // ✅ NEW: Copy transaction hash to clipboard
  const copyTransactionHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Transaction ID copied to clipboard');
  };

  // ✅ NEW: Get blockchain explorer URL
  const getExplorerUrl = (method?: string, hash?: string) => {
    if (!hash) return null;
    switch (method) {
      case 'Bitcoin':
        return `https://www.blockchain.com/btc/tx/${hash}`;
      case 'Ethereum':
      case 'USDT':
        return `https://etherscan.io/tx/${hash}`;
      default:
        return null;
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
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Transaction Management</h2>
            <p className="text-muted-foreground">
              Review and manage all platform transactions
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="input-trading"
          >
            <option value="all">All Types</option>
            <option value="Deposit">Deposits</option>
            <option value="Withdrawal">Withdrawals</option>
            <option value="Investment">Investments</option>
            <option value="Bonus">Bonuses</option>
            <option value="Adjustment">Adjustments</option>
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input-trading"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
     <div className="glass-card overflow-hidden">
  <div className="overflow-x-auto">
    <table className="trading-table">
      <thead>
        <tr>
          <th>Type</th><th>User</th><th>Amount</th><th>Method</th><th className="min-w-[200px]">Transaction ID</th><th>Status</th><th>Date</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'Deposit' ? 'bg-success/20' :
                          transaction.type === 'Withdrawal' ? 'bg-danger/20' :
                          transaction.type === 'Investment' ? 'bg-gold/20' :
                          'bg-purple-500/20'
                        }`}>
                          {transaction.type === 'Deposit' && <ArrowDownLeft className="w-5 h-5 text-success" />}
                          {transaction.type === 'Withdrawal' && <ArrowUpRight className="w-5 h-5 text-danger" />}
                          {transaction.type === 'Investment' && <TrendingUp className="w-5 h-5 text-gold" />}
                          {transaction.type === 'Bonus' && <Gift className="w-5 h-5 text-purple-400" />}
                        </div>
                        <span className="text-white font-medium">{transaction.type}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted-foreground">
                        {typeof transaction.userId === 'object' && transaction.userId
                          ? `${transaction.userId.firstName || 'Unknown'} ${transaction.userId.lastName || ''}`
                          : 'Unknown User'
                        }
                      </span>
                    </td>
                    <td className={`font-semibold ${
                      transaction.type === 'Deposit' || transaction.type === 'Bonus' ? 'text-success' :
                      transaction.type === 'Withdrawal' ? 'text-danger' :
                      'text-white'
                    }`}>
                      {transaction.type === 'Deposit' || transaction.type === 'Bonus' ? '+' : 
                       transaction.type === 'Withdrawal' ? '-' : ''}
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-muted-foreground">
                      {transaction.depositMethod || transaction.withdrawalMethod || '-'}
                    </td>
                    
                    {/* ✅ NEW: Transaction ID Column */}
                    <td>
                      {transaction.transactionHash ? (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs font-mono truncate max-w-[120px]">
                            {transaction.transactionHash}
                          </span>
                          <button
                            onClick={() => copyTransactionHash(transaction.transactionHash!)}
                            className="p-1.5 bg-gold/10 text-gold rounded hover:bg-gold/20 transition-colors"
                            title="Copy Transaction ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {getExplorerUrl(transaction.depositMethod || transaction.withdrawalMethod, transaction.transactionHash) && (
                            <a
                              href={getExplorerUrl(transaction.depositMethod || transaction.withdrawalMethod, transaction.transactionHash)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-success/10 text-success rounded hover:bg-success/20 transition-colors"
                              title="View on Blockchain Explorer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Not provided</span>
                      )}
                    </td>
                    
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td className="text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {transaction.status === 'Pending' && 
                       (transaction.type === 'Deposit' || transaction.type === 'Withdrawal') && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openActionModal(transaction)}
                            className="p-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
                            title="Approve/Reject"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12"> {/* ✅ Updated colspan to 8 */}
                    <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Modal - UPDATED with Transaction Hash */}
      {showActionModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {selectedTransaction.type} Action
              </h3>
              <button 
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedTransaction(null);
                  setActionReason('');
                }}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 space-y-2">
              <p className="text-muted-foreground">
                <span className="text-white">Amount:</span>{' '}
                ${selectedTransaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-muted-foreground">
                <span className="text-white">User:</span>{' '}
                {typeof selectedTransaction.userId === 'object' && selectedTransaction.userId
                  ? `${selectedTransaction.userId.firstName || 'Unknown'} ${selectedTransaction.userId.lastName || ''}`
                  : 'Unknown User'
                }
              </p>
              
              {/* ✅ NEW: Show Transaction Hash in Modal */}
              {selectedTransaction.transactionHash && (
                <div className="p-3 bg-navy-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="text-white">Transaction ID:</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gold font-mono break-all flex-1">
                      {selectedTransaction.transactionHash}
                    </code>
                    <button
                      onClick={() => copyTransactionHash(selectedTransaction.transactionHash!)}
                      className="p-1.5 bg-gold/10 text-gold rounded hover:bg-gold/20"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Verify this transaction on the blockchain before approving.
                  </p>
                </div>
              )}
              
              {selectedTransaction.withdrawalAddress && (
                <p className="text-muted-foreground">
                  <span className="text-white">Address:</span>{' '}
                  {selectedTransaction.withdrawalAddress}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter reason for this action"
                className="input-trading w-full h-20 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleAction('reject')}
                variant="outline"
                className="flex-1 border-danger text-danger hover:bg-danger/10"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleAction('approve')}
                className="flex-1 btn-success"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;