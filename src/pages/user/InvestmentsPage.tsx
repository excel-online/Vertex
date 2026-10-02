import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Calendar, Percent, AlertCircle, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { userService } from '@/services/api';
import type { Transaction } from '@/types';
import { toast } from 'sonner';

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ totalInvested: 0, totalExpectedReturn: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvestments();
  }, [page, filter]);

  const fetchInvestments = async () => {
    try {
      const response = await userService.getInvestments({ 
        page, 
        limit: 10, 
        status: filter 
      });
      if (response.success) {
        setInvestments(response.investments);
        setStats(response.stats);
        setTotalPages(response.pagination.pages);
      }
    } catch (error) {
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, endDate?: string) => {
    const isExpired = endDate && new Date(endDate) < new Date();
    
    if (isExpired) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
    }
    
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>;
      case 'Approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Active</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Rejected</span>;
      default:
        return <span className="text-slate-400 text-xs">{status}</span>;
    }
  };

  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
          <TrendingUp className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">My Investments</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Track, monitor, and manage your active trading portfolio and yields
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Invested</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ${stats.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400 mt-1">Capital deployed in markets</p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Expected Returns</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              ${stats.totalExpectedReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400 mt-1">Projected total payout</p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Investments</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {investments.filter(i => i.status === 'Approved' && i.endDate && new Date(i.endDate) > new Date()).length}
            </p>
            <p className="text-xs text-slate-400 mt-1">Currently generating yields</p>
          </div>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 pt-2">
        {[
          { value: 'all', label: 'All Portfolios' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setFilter(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
              filter === tab.value
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Investments Table Container */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Plan</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Return %</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Expected Return</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Duration</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-slate-400 font-semibold text-xs uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {investments.length > 0 ? (
                investments.map((investment) => (
                  <tr key={investment._id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Plan */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-white font-semibold text-sm">{investment.investmentPlan}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-white font-bold text-sm">
                      ${investment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Return % */}
                    <td className="py-4 px-6 text-emerald-400 font-bold text-sm">
                      +{investment.returnPercentage}%
                    </td>

                    {/* Expected Return */}
                    <td className="py-4 px-6 text-purple-300 font-bold text-sm">
                      ${investment.expectedReturn?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-6 text-slate-300 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {investment.duration} days
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {getStatusBadge(investment.status, investment.endDate)}
                    </td>

                    {/* End Date */}
                    <td className="py-4 px-6 text-sm">
                      {investment.endDate ? (
                        <div>
                          <p className="text-white font-medium">
                            {new Date(investment.endDate).toLocaleDateString()}
                          </p>
                          {investment.status === 'Approved' && new Date(investment.endDate) > new Date() && (
                            <p className="text-xs text-purple-400 font-semibold mt-0.5">
                              {getDaysRemaining(investment.endDate)} days left
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 text-slate-500">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <p className="text-slate-300 font-semibold text-base">No investments found</p>
                    <p className="text-slate-500 text-xs mt-1">Your active and past investment plans will show up here.</p>
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

      {/* Investment Info Card */}
      <div className="rounded-2xl bg-purple-500/10 border border-purple-500/20 p-6 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-purple-200 text-sm">About Managed Investments</h4>
          <p className="text-purple-300/80 text-xs leading-relaxed">
            Your capital is deployed and managed by our expert trading team across decentralized and traditional markets. Returns are calculated 
            based on your selected plan and are credited automatically to your account balance at the conclusion of the investment period.
          </p>
        </div>
      </div>

    </div>
  );
};

export default InvestmentsPage;
