import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type AuthUser = {
  nickname: string;
};

const STORAGE_KEY = 'auth-user';

type AuthContextValue = {
  user: AuthUser | null;
  signIn: (nickname: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        let saved: unknown;
        try {
          saved = JSON.parse(raw);
        } catch {
          return;
        }
        if (saved && typeof (saved as AuthUser).nickname === 'string') {
          setUser({ nickname: (saved as AuthUser).nickname });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const signIn = (nickname: string) => {
    const next = { nickname };
    setUser(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const signOut = () => {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
