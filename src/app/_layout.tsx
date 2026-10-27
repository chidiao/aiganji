import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/hooks/use-auth';
import { SettingsProvider } from '@/hooks/use-settings';
import { ToastProvider } from '@/components/toast';
import { ImSessionProvider } from '@/hooks/use-im-session';

const backgroundColor = Colors.background;

SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});

function ThemedRoot() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});
  }, []);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor },
        headerStyle: { backgroundColor },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(fullscreen)" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="about" options={{ title: '关于应用' }} />
      <Stack.Screen name="settings" options={{ title: '首页设置' }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <ToastProvider>
            <ImSessionProvider>
              <ThemedRoot />
            </ImSessionProvider>
          </ToastProvider>
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
