import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Calendar, Percent, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
      return <span className="badge-approved">Completed</span>;
    }
    
    switch (status) {
      case 'Pending':
        return <span className="badge-pending">Pending</span>;
      case 'Approved':
        return <span className="badge-approved">Active</span>;
      case 'Rejected':
        return <span className="badge-rejected">Rejected</span>;
      default:
        return <span className="text-muted-foreground text-xs">{status}</span>;
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
            <TrendingUp className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Investments</h2>
            <p className="text-muted-foreground">
              Track and manage your investment portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
            <span className="text-xs text-muted-foreground">Total Invested</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${stats.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Percent className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs text-muted-foreground">Expected Returns</span>
          </div>
          <p className="text-2xl font-bold text-success">
            ${stats.totalExpectedReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs text-muted-foreground">Active Investments</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {investments.filter(i => i.status === 'Approved' && i.endDate && new Date(i.endDate) > new Date()).length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setFilter(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-gold text-navy'
                : 'bg-secondary text-muted-foreground hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Investments Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="trading-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Amount</th>
                <th>Return %</th>
                <th>Expected Return</th>
                <th>Duration</th>
                <th>Status</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {investments.length > 0 ? (
                investments.map((investment) => (
                  <tr key={investment._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-gold" />
                        </div>
                        <span className="text-white font-medium">{investment.investmentPlan}</span>
                      </div>
                    </td>
                    <td className="text-white">
                      ${investment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-success">
                      {investment.returnPercentage}%
                    </td>
                    <td className="text-gold">
                      ${investment.expectedReturn?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {investment.duration} days
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(investment.status, investment.endDate)}
                    </td>
                    <td>
                      {investment.endDate ? (
                        <div>
                          <p className="text-white text-sm">
                            {new Date(investment.endDate).toLocaleDateString()}
                          </p>
                          {investment.status === 'Approved' && new Date(investment.endDate) > new Date() && (
                            <p className="text-xs text-muted-foreground">
                              {getDaysRemaining(investment.endDate)} days left
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No investments found</p>
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

      {/* Investment Info */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-medium mb-2">About Investments</h4>
            <p className="text-sm text-muted-foreground">
              Your investments are managed by our expert trading team. Returns are calculated 
              based on the plan you choose and are credited to your account at the end of the 
              investment period. You can track the progress of your investments here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsPage;
