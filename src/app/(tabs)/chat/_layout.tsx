import { Stack } from 'expo-router';
import { initI18n } from '@/services/chat-uikit';
import { PageBackground } from '@/constants/theme';

initI18n('zh-CN');

export default function ChatRoutesLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: PageBackground } }} />;
}
