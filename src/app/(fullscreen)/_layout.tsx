import { Stack } from 'expo-router';

import { PageBackground } from '@/constants/theme';
import { initI18n } from '@/services/chat-uikit';

initI18n('zh-CN');

export default function FullscreenRoutesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: PageBackground },
        animation: 'slide_from_right',
      }}
    />
  );
}