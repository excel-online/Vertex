import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '@/services/api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [error, setError] = useState('');

  // Verify token on mount - FIXED: Reset states first
  useEffect(() => {
    // Reset all states when token changes
    setIsVerifying(true);
    setIsTokenValid(false);
    setIsSuccess(false);
    setError('');
    setNewPassword('');
    setConfirmPassword('');
    
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await authService.verifyResetToken(token);
        if (response.success) {
          setIsTokenValid(true);
        } else {
          setError('This reset link has expired or is invalid');
        }
      } catch  {
        setError('Failed to verify reset link');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = (): boolean => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        token: token!,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch  {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Properly reset state when requesting new link
  const handleRequestNewLink = () => {
    setIsTokenValid(false);
    setIsSuccess(false);
    setError('');
    setNewPassword('');
    setConfirmPassword('');
    navigate('/forgot-password');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          {/* CHANGED: Use button with handleRequestNewLink instead of Link */}
          <button 
            onClick={handleRequestNewLink}
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
          <p className="text-gray-400 mb-6">
            Your password has been successfully reset. Redirecting to login...
          </p>
          <Link 
            to="/login" 
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
        {/* Logo - CHANGED to logo1.png */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-yellow-600 p-2 rounded-lg mr-3">
            <img 
              src="/logo1.png" 
              alt="Vellumtrade" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Vellumtrade</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400 text-sm">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;