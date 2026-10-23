import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalCard } from '@/components/modal-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingRowProps = {
  icon: number;
  label: string;
  onPress: () => void;
  chevron?: number;
  value?: string;
};

function SettingRow({ icon, label, onPress, chevron, value }: SettingRowProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundElement" style={styles.row}>
        <Image source={icon} style={styles.rowIcon} tintColor={theme.text} />
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
        {value ? (
          <ThemedText type="small" themeColor="textSecondary">
            {value}
          </ThemedText>
        ) : null}
        {chevron ? (
          <Image source={chevron} style={styles.chevron} tintColor={theme.textSecondary} />
        ) : null}
      </ThemedView>
    </Pressable>
  );
}

export default function MineScreen() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [status, setStatus] = useState('');

  const clearCache = async () => {
    await Promise.all([Image.clearMemoryCache(), Image.clearDiskCache()]);
    setConfirmVisible(false);
    setStatus('图片缓存已清除');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>我的</ThemedText>
        </View>

        <View style={styles.list}>
          <SettingRow
            icon={require('@/assets/images/icons/settings.png')}
            label="首页设置"
            onPress={() => router.push('/settings')}
            chevron={require('@/assets/images/icons/chevron-right.png')}
          />
          <SettingRow
            icon={require('@/assets/images/icons/trash-2.png')}
            label="清除缓存"
            onPress={() => setConfirmVisible(true)}
          />
          <SettingRow
            icon={require('@/assets/images/icons/info.png')}
            label="关于应用"
            onPress={() => router.push('/about')}
            chevron={require('@/assets/images/icons/chevron-right.png')}
          />
        </View>

        {status ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.status}>
            {status}
          </ThemedText>
        ) : null}
      </SafeAreaView>

      <ModalCard visible={confirmVisible} onClose={() => setConfirmVisible(false)}>
        <ThemedText style={styles.modalTitle}>清除缓存</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          确定要清除所有已缓存的图片吗？清除后再次浏览需要重新加载。
        </ThemedText>
        <View style={styles.modalActions}>
          <Pressable
            onPress={() => setConfirmVisible(false)}
            style={({ pressed }) => [
              styles.modalButton,
              styles.modalCancel,
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              取消
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={clearCache}
            style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.modalConfirmText}>
              确定
            </ThemedText>
          </Pressable>
        </View>
      </ModalCard>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  rowIcon: {
    width: 24,
    height: 24,
  },
  rowLabel: {
    flex: 1,
  },
  chevron: {
    width: 20,
    height: 20,
  },
  status: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  modalTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  modalButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    backgroundColor: '#3c87f7',
  },
  modalCancel: {
    backgroundColor: 'transparent',
  },
  modalConfirmText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
  },
});