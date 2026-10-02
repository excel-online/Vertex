import { useState } from 'react';
import { User, Mail, Phone, Globe, Lock, Save, ShieldCheck, Award, CreditCard, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      if (response.success && response.user) {
        updateUser(response.user);
        toast.success('Profile updated successfully');
        setIsEditing(false);
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Standard':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Premium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Starter':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">My Profile</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage your account settings, personal details, and security credentials
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Profile Info Form Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Personal Information</h3>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all shadow-lg cursor-pointer ${
                  isEditing 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
                }`}
                disabled={isLoading}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  'Edit Profile'
                )}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-slate-400 text-sm focus:outline-none disabled:opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-slate-400 text-sm focus:outline-none disabled:opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Security & Password</h3>
              <Button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                variant="outline"
                className="px-4 py-2 rounded-2xl border-purple-500/40 text-purple-400 hover:bg-purple-500/10 text-sm font-semibold transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </Button>
            </div>

            {isChangingPassword && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all cursor-pointer mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </div>
            )}
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Account Status Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Account Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs">Status</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-purple-400" /> Investment Tier
                </span>
                <span className={`px-2.5 py-1 rounded-xl border text-xs font-bold ${getTierColor(user?.investmentTier || 'None')}`}>
                  {user?.investmentTier || 'None'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Account Type
                </span>
                <span className="text-white font-semibold text-xs">{user?.accountType || 'Standard'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 text-xs">Currency</span>
                <span className="text-white font-semibold text-xs">{user?.currencyType || 'USD'}</span>
              </div>
            </div>
          </div>

          {/* Referral Code Card */}
          <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              Referral Code
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share your referral code with friends and earn exclusive investment bonuses!
            </p>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">Your Code</p>
              <p className="text-purple-400 font-mono font-extrabold text-xl tracking-wider">
                {user?.referralCode || 'N/A'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
