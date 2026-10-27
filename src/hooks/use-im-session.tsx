import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLoginState } from 'tuikit-atomicx-react-native';

import { getImUserSig } from '@/api/im';
import { useAuth } from '@/hooks/use-auth';

type ImSessionState = {
  status: 'signed-out' | 'connecting' | 'ready' | 'error';
  error: string | null;
  retry: () => void;
};

const ImSessionContext = createContext<ImSessionState | null>(null);

export function ImSessionProvider({ children }: { children: ReactNode }) {
  const { token, user, isRestored } = useAuth();
  const { login, logout, loginStatus, loginUserInfo } = useLoginState();
  const attemptedUserId = useRef<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [status, setStatus] = useState<ImSessionState['status']>('signed-out');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isRestored) return;
    let active = true;

    if (!token || !user) {
      attemptedUserId.current = null;
      if (loginStatus === 1) void logout();
      return () => {
        active = false;
      };
    }

    const userId = String(user.id);
    if (loginStatus === 1 && loginUserInfo?.userID === userId) {
      attemptedUserId.current = userId;
      void Promise.resolve().then(() => {
        if (!active) return;
        setStatus('ready');
        setError(null);
      });
      return () => {
        active = false;
      };
    }
    if (attemptedUserId.current === userId) {
      return () => {
        active = false;
      };
    }

    attemptedUserId.current = userId;

    const connect = async () => {
      await Promise.resolve();
      if (!active) return;
      setStatus('connecting');
      setError(null);
      try {
        if (loginStatus === 1 && loginUserInfo?.userID !== userId) await logout();
        const credentials = await getImUserSig(token);
        if (!active) return;
        await login({
          sdkAppID: credentials.sdkAppId,
          userID: credentials.userId,
          userSig: credentials.userSig,
        });
        if (active) setStatus('ready');
      } catch (cause) {
        if (!active) return;
        attemptedUserId.current = null;
        setError(cause instanceof Error ? cause.message : '聊天服务连接失败');
        setStatus('error');
      }
    };

    void connect();
    return () => {
      active = false;
    };
  }, [isRestored, token, user, loginStatus, loginUserInfo?.userID, login, logout, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return (
    <ImSessionContext.Provider value={{ status, error, retry }}>
      {children}
    </ImSessionContext.Provider>
  );
}

export function useImSession() {
  const value = useContext(ImSessionContext);
  if (!value) throw new Error('useImSession must be used within ImSessionProvider');
  return value;
}
