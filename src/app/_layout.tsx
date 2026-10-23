import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';
import { SettingsProvider } from '@/hooks/use-settings';

const backgroundColor = Colors.background;

SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});

function ThemedRoot() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});
  }, []);

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor },
          headerStyle: { backgroundColor },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ title: '关于应用' }} />
        <Stack.Screen name="settings" options={{ title: '首页设置' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ThemedRoot />
    </SettingsProvider>
  );
}
