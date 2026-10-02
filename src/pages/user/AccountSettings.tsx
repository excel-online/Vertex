import { useState } from 'react';
import { User, Mail, Phone, Globe, Lock, Save, Camera, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import { toast } from 'sonner';

const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      if (response.success && response.user) {
        updateUser(response.user);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (response.success) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center shadow-inner">
              <span className="text-3xl font-extrabold text-purple-300">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </div>
          
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{user?.firstName} {user?.lastName}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Account
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Column: Personal Info & Password Settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Information Form */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-slate-950/30 border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username || ''}
                  disabled
                  className="w-full bg-slate-950/30 border border-white/5 rounded-2xl px-4 py-3.5 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                    placeholder="+1..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSaveProfile}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all cursor-pointer"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving Changes...' : 'Save Profile Changes'}
              </Button>
            </div>
          </div>

          {/* Change Password Panel */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight">Security & Passwords</h3>
              <Button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                variant="outline"
                className="bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-2xl text-xs font-semibold cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5" />
                {isChangingPassword ? 'Cancel Edit' : 'Change Password'}
              </Button>
            </div>

            {isChangingPassword && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleChangePassword}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 border border-emerald-500/30 transition-all cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-6">
          
          {/* Account Status Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">Account Metrics</h3>
            <div className="space-y-3 pt-1 divide-y divide-white/5">
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Status</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Investment Tier</span>
                <span className="font-bold text-purple-400 text-xs">
                  {user?.investmentTier || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Account Type</span>
                <span className="text-white font-medium text-xs">{user?.accountType || 'Standard'}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Base Currency</span>
                <span className="text-white font-medium text-xs">{user?.currencyType || 'USD'}</span>
              </div>
            </div>
          </div>

          {/* Security Verification Panel */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Security Guard</h3>
                <p className="text-xs text-slate-400">Profile fully secured</p>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Two-Factor Authentication Active</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Primary Email Verified</span>
              </div>
            </div>
          </div>

          {/* Referral Code Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900/80 to-blue-900/60 border border-purple-500/30 p-6 shadow-xl backdrop-blur-xl space-y-3">
            <h3 className="font-bold text-white text-base">Your Referral Code</h3>
            <p className="text-xs text-slate-300">Invite partners and earn platform equity commission bonuses.</p>
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-center">
              <p className="font-mono font-bold text-purple-300 text-sm tracking-wider">{user?.referralCode || 'N/A'}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AccountSettings;
