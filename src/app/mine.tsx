import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { QUOTES } from '@/constants/quotes';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function MineScreen() {
  const quote = useMemo(() => {
    const index = new Date().getDate() % QUOTES.length;
    return QUOTES[index];
  }, []);

  const [status, setStatus] = useState('');

  const clearCache = async () => {
    await Promise.all([Image.clearMemoryCache(), Image.clearDiskCache()]);
    setStatus('图片缓存已清除');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">我的</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.quote}>
          {quote}
        </ThemedText>

        <Pressable
          onPress={clearCache}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <ThemedText type="smallBold" style={styles.buttonText}>
            清除图片缓存
          </ThemedText>
        </Pressable>

        {status ? (
          <ThemedText type="small" themeColor="textSecondary">
            {status}
          </ThemedText>
        ) : null}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset,
  },
  quote: {
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.five,
    backgroundColor: '#3c87f7',
  },
  buttonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
  },
});
