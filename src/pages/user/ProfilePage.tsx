import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Lock, 
  ShieldCheck, 
  Award, 
  CreditCard, 
  HelpCircle, 
  ChevronRight, 
  Users, 
  FileText, 
  Link as LinkIcon, 
  Smartphone, 
  LifeBuoy, 
  Star, 
  Building, 
  LogOut,
  X,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/api';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || ''
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      if (response.success && response.user) {
        updateUser(response.user);
        toast.success('Profile updated successfully');
        setShowAccountModal(false);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* Top Header Bar with Help Button */}
      <div className="flex items-center justify-between pt-4 pb-2 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile</h1>
        <button 
          onClick={() => navigate('/dashboard/support')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-purple-400" />
          Help
        </button>
      </div>

      {/* User Header Info Card (Matching reference design) */}
      <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-5 shadow-xl backdrop-blur-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-purple-500/30">
          {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white truncate">
              {user?.firstName || 'User'} {user?.lastName || ''}
            </h2>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-slate-400 text-xs font-mono mt-0.5 truncate">
            @{user?.username || user?.email?.split('@')[0] || 'account'}
          </p>
        </div>
      </div>

      {/* SECTION: Profile */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">Profile</p>
        
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 divide-y divide-white/5 shadow-xl backdrop-blur-xl overflow-hidden">
          
          <button 
            onClick={() => setShowAccountModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Account Information</p>
                <p className="text-slate-400 text-xs">Update your personal details & info</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>

          <button 
            onClick={() => navigate('/dashboard/recipients')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Recipients</p>
                <p className="text-slate-400 text-xs">Manage saved withdrawal accounts & wallets</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>

          <button 
            onClick={() => navigate('/dashboard/upgrade')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Verification</p>
                <p className="text-slate-400 text-xs">Tier level & KYC verification status</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>

          <button 
            onClick={() => navigate('/dashboard/history')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Transaction Limits</p>
                <p className="text-slate-400 text-xs">View your deposit and withdrawal thresholds</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>

        </div>
      </div>

      {/* SECTION: Integrations */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">Integrations</p>
        
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 divide-y divide-white/5 shadow-xl backdrop-blur-xl overflow-hidden">
          <div className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Connected Apps</p>
                <p className="text-slate-400 text-xs">Manage external wallets & API integrations</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* SECTION: Security */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">Security</p>
        
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 divide-y divide-white/5 shadow-xl backdrop-blur-xl overflow-hidden">
          
          <button 
            onClick={() => navigate('/dashboard/settings')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Change Password</p>
                <p className="text-slate-400 text-xs">Update your security credentials</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>

          <div className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-slate-400 text-xs">Add an extra layer of security</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>

          <div className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Biometric Login</p>
                <p className="text-slate-400 text-xs">Use fingerprint or face recognition</p>
              </div>
            </div>
            <input type="checkbox" className="toggle toggle-purple accent-purple-600 w-10 h-5 cursor-pointer" defaultChecked />
          </div>

        </div>
      </div>

      {/* SECTION: General */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">General</p>
        
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 divide-y divide-white/5 shadow-xl backdrop-blur-xl overflow-hidden">
          
          <button 
            onClick={() => navigate('/dashboard/support')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Contact Our Support</p>
                <p className="text-slate-400 text-xs">Get 24/7 assistance from our team</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>

          <a 
            href="https://play.google.com" 
            target="_blank" 
            rel="noreferrer"
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Rate Us on the Play Store</p>
                <p className="text-slate-400 text-xs">Support us with a 5-star review</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </a>

          <div className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-500/10 text-slate-300 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">About Us</p>
                <p className="text-slate-400 text-xs">Company info & terms</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>

        </div>
      </div>

      {/* Log Out Action */}
      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-3xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>

      {/* ACCOUNT EDIT MODAL */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl bg-slate-900 border border-white/10 w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Edit Account Information</h3>
              <button onClick={() => setShowAccountModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowAccountModal(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl border-white/10 text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
