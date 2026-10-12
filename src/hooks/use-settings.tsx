import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type BackgroundMode = 'bing' | 'custom';
export type QuoteMode = 'api' | 'custom';
export type ThemeMode = 'system' | 'light' | 'dark';

export type Settings = {
  backgroundMode: BackgroundMode;
  quoteMode: QuoteMode;
  customQuote: string;
  themeMode: ThemeMode;
};

const STORAGE_KEY = 'home-settings';

const DEFAULT_SETTINGS: Settings = {
  backgroundMode: 'bing',
  quoteMode: 'api',
  customQuote: '',
  themeMode: 'system',
};

type SettingsContextValue = {
  settings: Settings;
  setBackgroundMode: (mode: BackgroundMode) => void;
  setQuoteMode: (mode: QuoteMode) => void;
  setCustomQuote: (quote: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function sanitizeSettings(raw: unknown): Partial<Settings> {
  if (!raw || typeof raw !== 'object') return {};
  const value = raw as Record<string, unknown>;
  const next: Partial<Settings> = {};

  if (value.backgroundMode === 'bing' || value.backgroundMode === 'custom') {
    next.backgroundMode = value.backgroundMode;
  }
  if (value.quoteMode === 'api' || value.quoteMode === 'custom') {
    next.quoteMode = value.quoteMode;
  }
  if (typeof value.customQuote === 'string') {
    next.customQuote = value.customQuote;
  }
  if (value.themeMode === 'system' || value.themeMode === 'light' || value.themeMode === 'dark') {
    next.themeMode = value.themeMode;
  }

  return next;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

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
        setSettings({ ...DEFAULT_SETTINGS, ...sanitizeSettings(saved) });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const setBackgroundMode = (backgroundMode: BackgroundMode) => {
    const next = { ...settings, backgroundMode };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const setQuoteMode = (quoteMode: QuoteMode) => {
    const next = { ...settings, quoteMode };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const setCustomQuote = (customQuote: string) => {
    const next = { ...settings, customQuote };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const setThemeMode = (themeMode: ThemeMode) => {
    const next = { ...settings, themeMode };
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  return (
    <SettingsContext.Provider
      value={{ settings, setBackgroundMode, setQuoteMode, setCustomQuote, setThemeMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return value;
}