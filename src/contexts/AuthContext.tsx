import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loginWithCredentials } from '@/db/api';
import type { Profile } from '@/types';

const TOKEN_KEY = 'opser_token';
const USER_KEY = 'opser_user';

interface AuthContextType {
  user: { id: string; username: string } | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (stored && token) {
      const u = JSON.parse(stored);
      setUser(u);
      setProfile({ id: u.id, email: u.username, role: 'admin', created_at: '', updated_at: '' });
    }
    setLoading(false);
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const { token, user: u } = await loginWithCredentials(username, password);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
      setProfile({ id: u.id, email: u.username, role: 'admin', created_at: '', updated_at: '' });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (_username: string, _password: string) => {
    return { error: new Error('Registration not supported') };
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {};

  return (
    <AuthContext.Provider value={{ user: user as any, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
