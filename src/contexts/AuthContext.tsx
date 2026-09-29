import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import { authService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Validate token by fetching current user
        authService.getMe().then(response => {
          if (response.success && response.user) {
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            // Token invalid, clear storage
            logout();
          }
        }).catch(() => {
          logout();
        });
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      return response;
    } catch (error: any) {
      // ✅ Pass backend error message to frontend
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Unable to connect to server. Please check your internet connection.'
      };
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authService.register(data);
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      return response;
    } catch (error: any) {
      // ✅ Pass backend error message to frontend
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Unable to connect to server. Please check your internet connection.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};