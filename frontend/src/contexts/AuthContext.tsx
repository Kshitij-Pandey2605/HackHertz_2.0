import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'premind_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage on mount
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored auth user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(email, password || '');
      setUser(response.data);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.signup(name, email, password || '');
      setUser(response.data);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
