import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { RadioRow } from '@/components/radio-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSettings } from '@/hooks/use-settings';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, setBackgroundMode, setQuoteMode, setCustomQuote } = useSettings();
  const [draft, setDraft] = useState(settings.customQuote);
  const [saved, setSaved] = useState(false);

  const saveQuote = () => {
    const next = draft.trim();
    setCustomQuote(next);
    setDraft(next);
    setSaved(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
          每日一图
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.card}>
          <RadioRow
            label="必应"
            description="使用必应每日壁纸作为首页背景"
            selected={settings.backgroundMode === 'bing'}
            onSelect={() => setBackgroundMode('bing')}
          />
          <RadioRow
            label="自定义"
            description="使用内置的本地图片（ganji-bg.jpg）"
            selected={settings.backgroundMode === 'custom'}
            onSelect={() => setBackgroundMode('custom')}
          />
        </ThemedView>

        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
          每日一言
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.card}>
          <RadioRow
            label="网络"
            description="从每日一言接口获取"
            selected={settings.quoteMode === 'api'}
            onSelect={() => setQuoteMode('api')}
          />
          <RadioRow
            label="自定义"
            description="输入并保存自己的寄语"
            selected={settings.quoteMode === 'custom'}
            onSelect={() => setQuoteMode('custom')}
          />
        </ThemedView>

        {settings.quoteMode === 'custom' ? (
          <View style={styles.customQuoteBox}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="写下你想要的每日一言…"
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.backgroundSelected },
              ]}
            />
            <View style={styles.saveRow}>
              {saved ? (
                <ThemedText type="small" themeColor="textSecondary">
                  已保存
                </ThemedText>
              ) : null}
              <Pressable
                onPress={saveQuote}
                style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold" style={styles.saveButtonText}>
                  保存
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  sectionTitle: {
    marginHorizontal: Spacing.one,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  customQuoteBox: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    minHeight: 96,
    fontSize: 16,
    lineHeight: 24,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.three,
  },
  saveButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    backgroundColor: '#3c87f7',
  },
  saveButtonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
  },
});