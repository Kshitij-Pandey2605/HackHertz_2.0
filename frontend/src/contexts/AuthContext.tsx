import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';

export interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'premind_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to format Supabase user to our app User interface
  const mapSupabaseUser = (sbUser: any): User => {
    const meta = sbUser.user_metadata || {};
    const name = meta.full_name || meta.name || meta.user_name || sbUser.email?.split('@')[0] || 'User';
    const avatarUrl = meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sbUser.email || name)}`;

    return {
      id: sbUser.id,
      email: sbUser.email || '',
      name,
      avatarUrl,
    };
  };

  // Sync Supabase authentication state
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (!error && session?.user && isMounted) {
            const formatted = mapSupabaseUser(session.user);
            setUser(formatted);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(formatted));
          }
        }
      } catch (err) {
        console.error('Error fetching Supabase session:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listen for real-time auth state changes (OAuth redirects, token refresh, sign-in/out)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const formatted = mapSupabaseUser(session.user);
        setUser(formatted);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(formatted));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Log in with Email and Password
   */
  const login = useCallback(async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      // If using demo credentials, log in directly
      if (email.toLowerCase() === 'alex.chen@university.edu' || email.toLowerCase() === 'demo@premind.ai') {
        const demoUser: User = {
          id: 'usr_demo_chen',
          name: 'Alex Chen',
          email: email.toLowerCase(),
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        };
        setUser(demoUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
        return;
      }

      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          const formatted = mapSupabaseUser(data.user);
          setUser(formatted);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(formatted));
          return;
        }
      }

      // Fallback via API service
      const response = await api.auth.login(email, password || '');
      setUser(response.data);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign up with Name, Email and Password
   */
  const signup = useCallback(async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              name,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.user) {
          const formatted = mapSupabaseUser(data.user);
          setUser(formatted);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(formatted));
          return;
        }
      }

      // Fallback via API service
      const response = await api.auth.signup(name, email, password || '');
      setUser(response.data);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Log in with Google OAuth
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Google OAuth sign-in error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Demo Quick Login for testing and rapid review
   */
  const demoLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const demoUser: User = {
        id: 'usr_demo_chen',
        name: 'Alex Chen',
        email: 'alex.chen@university.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      };
      setUser(demoUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user session
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut().catch(() => {});
      }
    } finally {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        demoLogin,
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
