import { useLoginState } from 'tuikit-atomicx-react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PageBackground } from '@/constants/theme';
import { ConversationListScreen } from '@/components/tencent-chat-screens';
import { useImSession } from '@/hooks/use-im-session';
import { useAuth } from '@/hooks/use-auth';

export default function ChatHomeScreen() {
  const { user, token, isRestored } = useAuth();
  const { status, error, retry } = useImSession();
  const { loginStatus } = useLoginState();

  if (!isRestored) return <Loading label="正在恢复登录状态…" />;
  if (!user || !token) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={styles.title}>登录后使用聊天</ThemedText>
        <ThemedText themeColor="textSecondary">登录账号后即可收发即时消息</ThemedText>
        <Pressable style={styles.button} onPress={() => router.push('/login')}>
          <ThemedText style={styles.buttonText}>去登录</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }
  if (status === 'error') {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={styles.title}>聊天服务连接失败</ThemedText>
        <ThemedText themeColor="textSecondary">{error ?? '请检查网络后重试'}</ThemedText>
        <Pressable style={styles.button} onPress={retry}>
          <ThemedText style={styles.buttonText}>重试</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }
  if (status !== 'ready' || loginStatus !== 1) return <Loading label="正在连接聊天服务…" />;

  return <ConversationListScreen />;
}

function Loading({ label }: { label: string }) {
  return (
    <ThemedView style={styles.center}>
      <ActivityIndicator color="#2E6FD6" />
      <ThemedText themeColor="textSecondary">{label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: PageBackground },
  title: { fontSize: 20, lineHeight: 28, fontWeight: '700' },
  button: { minHeight: 44, minWidth: 96, alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingHorizontal: 20, backgroundColor: '#2E6FD6' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});
