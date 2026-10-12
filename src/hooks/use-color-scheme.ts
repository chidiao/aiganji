import { useSettings } from '@/hooks/use-settings';
import { useSystemColorScheme } from '@/hooks/use-system-color-scheme';

/**
 * Resolves the active color scheme from the user's theme preference, falling
 * back to the system scheme when set to `system`.
 */
export function useColorScheme(): 'light' | 'dark' {
  const system = useSystemColorScheme();
  const { settings } = useSettings();

  if (settings.themeMode === 'system') {
    return system === 'dark' ? 'dark' : 'light';
  }

  return settings.themeMode;
}
