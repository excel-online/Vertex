import { useState, useEffect } from 'react';
import { History, TrendingUp, Calendar, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
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
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case 'Approved':
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Rejected</span>;
      default:
        return <span className="text-slate-400 text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
          <History className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Transaction & Trading History</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Monitor and audit all your deposits, withdrawals, and investments in real time
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2">
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
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              filter === tab.value
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History Table Container */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Type Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                          transaction.type === 'Deposit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          transaction.type === 'Withdrawal' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                          transaction.type === 'Investment' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        }`}>
                          {transaction.type === 'Deposit' ? <ArrowDownLeft className="w-5 h-5" /> :
                           transaction.type === 'Withdrawal' ? <ArrowUpRight className="w-5 h-5" /> :
                           transaction.type === 'Investment' ? <TrendingUp className="w-5 h-5" /> :
                           <Zap className="w-5 h-5" />}
                        </div>
                        <span className="font-semibold text-white text-sm">{transaction.type}</span>
                      </div>
                    </td>

                    {/* Amount Column */}
                    <td className="py-4 px-6">
                      <span className={`font-bold text-sm ${
                        transaction.type === 'Deposit' || transaction.type === 'Bonus' ? 'text-emerald-400' :
                        transaction.type === 'Withdrawal' ? 'text-rose-400' :
                        'text-white'
                      }`}>
                        {transaction.type === 'Deposit' || transaction.type === 'Bonus' ? '+' : 
                         transaction.type === 'Withdrawal' ? '-' : ''}
                        ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">{getStatusBadge(transaction.status)}</td>

                    {/* Date Column */}
                    <td className="py-4 px-6 text-slate-300 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Details Column */}
                    <td className="py-4 px-6 text-slate-300 text-sm font-medium">
                      <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/5">
                        {transaction.depositMethod || transaction.withdrawalMethod || transaction.investmentPlan || 'Standard'}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 text-slate-500">
                      <History className="w-8 h-8" />
                    </div>
                    <p className="text-slate-300 font-semibold text-base">No trading history found</p>
                    <p className="text-slate-500 text-xs mt-1">Transactions will appear here once you start trading or depositing.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-slate-400 text-sm font-medium">
              Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-all"
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
