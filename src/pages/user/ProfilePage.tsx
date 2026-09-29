import { useState } from 'react';
import { User, Mail, Phone, Globe, Lock, Save } from 'lucide-react';
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
            <User className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Profile</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? 'btn-success' : 'btn-trading'}
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
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-trading w-full pl-10 disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-trading w-full disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input-trading w-full pl-10 disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.username}
                  disabled
                  className="input-trading w-full disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-trading w-full pl-10 disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input-trading w-full pl-10 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Change Password</h3>
              <Button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </Button>
            </div>

            {isChangingPassword && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-trading w-full"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-trading w-full"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-trading w-full"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  className="btn-trading"
                  disabled={isLoading}
                >
                  Update Password
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Status</span>
                <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Investment Tier</span>
                <span className={`font-semibold ${getTierColor(user?.investmentTier || 'None')}`}>
                  {user?.investmentTier || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Account Type</span>
                <span className="text-white text-sm">{user?.accountType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Currency</span>
                <span className="text-white text-sm">{user?.currencyType}</span>
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Referral Code</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your referral code with friends and earn bonuses!
            </p>
            <div className="p-4 bg-navy-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Your Code</p>
              <p className="text-gold font-mono font-semibold text-lg">{user?.referralCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
