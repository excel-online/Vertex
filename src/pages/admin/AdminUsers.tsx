import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  UserX,
  DollarSign,
  Mail,
  X,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/api';
import type { User } from '@/types';
import { toast } from 'sonner';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all');
  const [status, setStatus] = useState('all');

  // Modal State for Email Dispatch
  const [selectedUserForMail, setSelectedUserForMail] = useState<User | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailHeading, setEmailHeading] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, tier, status]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers({
        page,
        limit: 10,
        search: search || undefined,
        tier: tier !== 'all' ? tier : undefined,
        status: status !== 'all' ? status : undefined
      });
      if (response.success) {
        setUsers(response.users);
        setTotalPages(response.pagination.pages);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await adminService.updateUserStatus(userId, !currentStatus);
      if (response.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForMail) return;

    try {
      setSendingEmail(true);
      // Calls the backend endpoint we added: POST /api/admin/users/:id/mail
      const response = await adminService.sendCustomEmail(selectedUserForMail._id, {
        subject: emailSubject,
        headingTitle: emailHeading,
        messageBody: emailBody
      });

      if (response.success) {
        toast.success('Email sent successfully!');
        setSelectedUserForMail(null);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-muted-foreground">
              Manage user accounts and view their details
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or username..."
                className="input-trading w-full pl-10"
              />
            </div>
          </div>
          <select
            value={tier}
            onChange={(e) => { setTier(e.target.value); setPage(1); }}
            className="input-trading"
          >
            <option value="all">All Tiers</option>
            <option value="None">None</option>
            <option value="Starter">Starter</option>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="VIP">VIP</option>
          </select>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input-trading"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button type="submit" className="btn-trading">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="trading-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <NavLink 
                        to={`/admin/users/${user._id}`}
                        className="flex items-center gap-3 hover:opacity-80"
                      >
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                          <span className="text-gold font-semibold">
                            {user.firstName?.[0] || '?'}{user.lastName?.[0] || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.firstName || 'Unknown'} {user.lastName || ''}</p>
                          <p className="text-xs text-muted-foreground">@{user.username || 'unknown'}</p>
                        </div>
                      </NavLink>
                    </td>
                    <td className="text-muted-foreground">{user.email || 'Not provided'}</td>
                    <td>
                      <span className={`font-medium ${getTierColor(user.investmentTier)}`}>
                        {user.investmentTier || 'None'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-white">
                        <DollarSign className="w-4 h-4 text-gold" />
                        {user.totalBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive 
                          ? 'bg-success/20 text-success' 
                          : 'bg-danger/20 text-danger'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <NavLink to={`/admin/users/${user._id}`}>
                          <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10">
                            View
                          </Button>
                        </NavLink>
                        {/* Send Custom Template Email Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500/10 px-2"
                          onClick={() => setSelectedUserForMail(user)}
                          title="Send Custom Styled Email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive 
                              ? 'bg-danger/20 text-danger hover:bg-danger/30' 
                              : 'bg-success/20 text-success hover:bg-success/30'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
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

      {/* Custom Styled Email Modal */}
      {selectedUserForMail && (
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
                    To: {selectedUserForMail.firstName} ({selectedUserForMail.email})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserForMail(null)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
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
                  Note: This will automatically be formatted into your platform's standard responsive email layout.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedUserForMail(null)}
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

export default AdminUsers;
