import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SettingsProvider } from '@/hooks/use-settings';

SystemUI.setBackgroundColorAsync(
  Appearance.getColorScheme() === 'dark' ? Colors.dark.background : Colors.light.background,
).catch(() => {});

function ThemedRoot() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme].background;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});
  }, [backgroundColor]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
