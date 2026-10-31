import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, Text, View } from 'react-native';


type ToastController = {
  show: (message: string) => void;
  showLoading: (message: string) => void;
};

const ToastContext = createContext<ToastController | null>(null);

const SHOW_DURATION = 160;
const HIDE_DELAY = 2200;
const HIDE_DURATION = 240;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [opacity] = useState(() => new Animated.Value(0));
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    hideTimer.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: HIDE_DURATION,
        useNativeDriver: true,
      }).start();
    }, HIDE_DELAY);
  }, [opacity]);

  const stopHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
  }, []);

  const fadeIn = useCallback(() => {
    opacity.stopAnimation();
    Animated.timing(opacity, {
      toValue: 1,
      duration: SHOW_DURATION,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const show = useCallback(
    (next: string) => {
      setLoading(false);
      setMessage(next);
      fadeIn();
      startHide();
    },
    [fadeIn, startHide],
  );

  const showLoading = useCallback(
    (next: string) => {
      setLoading(true);
      setMessage(next);
      fadeIn();
      stopHide();
    },
    [fadeIn, stopHide],
  );

  useEffect(() => {
    return () => {
      stopHide();
    };
  }, [stopHide]);

  const value = useMemo(() => ({ show, showLoading }), [show, showLoading]);

  return (
    <ToastContext.Provider value={value}>
      <View style={styles.canvas}>
        {children}
        <View pointerEvents="none" style={styles.toastArea}>
          <Animated.View style={[styles.toast, loading && styles.toastRow, { opacity }]}>
            {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
            <Text style={styles.toastText}>{message}</Text>
          </Animated.View>
        </View>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  toastArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    transform: [{ translateY: -24 }],
    alignItems: 'center',
  },
  toast: {
    backgroundColor: 'rgba(20,21,26,0.88)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  toastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
