import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { getProfile, type User } from '@/api/auth';

export type AuthSession = {
  token: string;
  user: User;
};

const STORAGE_KEY = 'auth-session';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isRestored: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseSession(raw: string): AuthSession | null {
  let saved: unknown;
  try {
    saved = JSON.parse(raw);
  } catch {
    return null;
  }
  const session = saved as AuthSession;
  if (
    !session ||
    typeof session.token !== 'string' ||
    !session.user ||
    typeof session.user.id !== 'number' ||
    typeof session.user.nickname !== 'string'
  ) {
    return null;
  }
  return session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw || !active) return;
        const session = parseSession(raw);
        if (!session) return;

        setToken(session.token);
        setUser(session.user);
        setIsRestored(true);

        // 静默刷新用户信息，失败时继续使用本地缓存
        const { user: fresh } = await getProfile(session.token);
        if (!active) return;
        setUser(fresh);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ token: session.token, user: fresh })).catch(
          () => {},
        );
      } catch {
        return;
      } finally {
        if (active) setIsRestored(true);
      }
    };

    void restore();

    return () => {
      active = false;
    };
  }, []);

  const signIn = (token: string, nextUser: User) => {
    setIsRestored(true);
    setToken(token);
    setUser(nextUser);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: nextUser })).catch(() => {});
  };

  const signOut = () => {
    setIsRestored(true);
    setToken(null);
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, token, isRestored, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
