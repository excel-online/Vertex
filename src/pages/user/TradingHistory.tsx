import { useState, useEffect } from 'react';
import { History, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { userService } from '@/services/api';
import type { Transaction } from '@/types';
import { toast } from 'sonner';

const TradingHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, [page, filter]);

  const fetchHistory = async () => {
    try {
      const response = await userService.getTransactions({
        page,
        limit: 10,
        type: filter !== 'all' ? filter : undefined
      });
      if (response.success) {
        setTransactions(response.transactions);
        setTotalPages(response.pagination.pages);
      }
    } catch (error) {
      toast.error('Failed to load trading history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Pending</span>;
      case 'Approved':
      case 'Completed':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>;
      case 'Rejected':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Rejected</span>;
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All History' },
          { value: 'Deposit', label: 'Deposits' },
          { value: 'Withdrawal', label: 'Withdrawals' },
          { value: 'Investment', label: 'Investments' },
          { value: 'Bonus', label: 'Bonuses' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setFilter(tab.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-navy-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-navy-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">Type</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">Amount</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">Status</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">Date</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'Deposit' ? 'bg-green-100' :
                          transaction.type === 'Withdrawal' ? 'bg-red-100' :
                          transaction.type === 'Investment' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          <TrendingUp className={`w-5 h-5 ${
                            transaction.type === 'Deposit' ? 'text-green-600' :
                            transaction.type === 'Withdrawal' ? 'text-red-600' :
                            transaction.type === 'Investment' ? 'text-blue-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                        <span className="font-medium text-gray-800">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${
                        transaction.type === 'Deposit' || transaction.type === 'Bonus' ? 'text-green-600' :
                        transaction.type === 'Withdrawal' ? 'text-red-600' :
                        'text-gray-800'
                      }`}>
                        {transaction.type === 'Deposit' || transaction.type === 'Bonus' ? '+' : 
                         transaction.type === 'Withdrawal' ? '-' : ''}
                        ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(transaction.status)}</td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {transaction.depositMethod || transaction.withdrawalMethod || transaction.investmentPlan || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No trading history found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingHistory;
