import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalCard } from '@/components/modal-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

const PAGE_BACKGROUND = '#F2F3F5';
const BRAND_BLUE = '#1B66D0';
const DIVIDER_COLOR = '#E7E8EA';

type RowItem = {
  icon: number;
  label: string;
  onPress: () => void;
};

function ListRow({ item, isLast }: { item: RowItem; isLast: boolean }) {
  return (
    <View>
      <Pressable onPress={item.onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <Image source={item.icon} style={styles.rowIcon} tintColor={BRAND_BLUE} />
        <ThemedText style={styles.rowLabel}>{item.label}</ThemedText>
        <Image
          source={require('@/assets/images/icons/chevron-right.png')}
          style={styles.chevron}
          tintColor="#C9CDD3"
        />
      </Pressable>
      {!isLast ? <View style={styles.divider} /> : null}
    </View>
  );
}

function RowGroup({ label, rows, showLabel }: { label: string; rows: RowItem[]; showLabel?: boolean }) {
  return (
    <View style={styles.section}>
      {showLabel ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.sectionLabel}>
          {label}
        </ThemedText>
      ) : null}
      <View style={styles.group}>
        {rows.map((item, index) => (
          <ListRow key={item.label} item={item} isLast={index === rows.length - 1} />
        ))}
      </View>
    </View>
  );
}

export default function MineScreen() {
  const { user, signOut } = useAuth();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [status, setStatus] = useState('');

  const clearCache = async () => {
    await Promise.all([Image.clearMemoryCache(), Image.clearDiskCache()]);
    setConfirmVisible(false);
    setStatus('图片缓存已清除');
  };

  const handleLogout = () => {
    signOut();
    setLogoutVisible(false);
  };

  const commonRows: RowItem[] = [
    {
      icon: require('@/assets/images/icons/settings.png'),
      label: '首页设置',
      onPress: () => router.push('/settings'),
    },
    {
      icon: require('@/assets/images/icons/trash-2.png'),
      label: '清除缓存',
      onPress: () => setConfirmVisible(true),
    },
    {
      icon: require('@/assets/images/icons/info.png'),
      label: '关于我们',
      onPress: () => router.push('/about'),
    },
  ];

  const accountRows: RowItem[] = [
    {
      icon: require('@/assets/images/icons/file-text.png'),
      label: '我的订单',
      onPress: () => Alert.alert('提示', '功能开发中'),
    },
    {
      icon: require('@/assets/images/icons/heart.png'),
      label: '我的收藏',
      onPress: () => Alert.alert('提示', '功能开发中'),
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: PAGE_BACKGROUND }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Pressable
            onPress={!user ? () => router.push('/login') : undefined}
            style={({ pressed }) => !user && pressed && styles.pressed}>
            <LinearGradient
              colors={['#1668CE', '#2F9BF2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}>
              <View style={styles.avatar}>
                <Image
                  source={require('@/assets/images/tabIcons/user-round.png')}
                  style={styles.avatarIcon}
                  tintColor="#FFFFFF"
                />
              </View>
              {user ? (
                <>
                  <ThemedText style={styles.heroTitle}>{user.nickname}</ThemedText>
                  <ThemedText style={styles.heroSubtitle}>关注 32 · 粉丝 108 · 动态 46</ThemedText>
                </>
              ) : (
                <>
                  <ThemedText style={styles.heroTitle}>点击登录</ThemedText>
                  <ThemedText style={styles.heroSubtitle}>登录后开启赶集之旅</ThemedText>
                </>
              )}
            </LinearGradient>
          </Pressable>

          {user ? (
            <RowGroup label="我的账户" rows={accountRows} showLabel />
          ) : null}

          <RowGroup label="通用" rows={commonRows} showLabel />

          {status ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.status}>
              {status}
            </ThemedText>
          ) : null}

          {user ? (
            <Pressable
              onPress={() => setLogoutVisible(true)}
              style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
              <ThemedText style={styles.logoutText}>退出登录</ThemedText>
            </Pressable>
          ) : null}
        </View>
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

      <ModalCard visible={logoutVisible} onClose={() => setLogoutVisible(false)}>
        <ThemedText style={styles.modalTitle}>退出登录</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          确定要退出当前账号吗？
        </ThemedText>
        <View style={styles.modalActions}>
          <Pressable
            onPress={() => setLogoutVisible(false)}
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
            onPress={handleLogout}
            style={({ pressed }) => [styles.modalButton, styles.logoutModalButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={styles.logoutModalText}>
              退出
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  hero: {
    marginTop: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 44,
    height: 44,
  },
  heroTitle: {
    marginTop: Spacing.three,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: Spacing.half,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  section: {
    marginTop: Spacing.four,
  },
  sectionLabel: {
    marginBottom: Spacing.two,
  },
  group: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.four,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  rowIcon: {
    width: 22,
    height: 22,
  },
  rowLabel: {
    flex: 1,
  },
  chevron: {
    width: 18,
    height: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER_COLOR,
    marginLeft: Spacing.four + 22 + Spacing.three,
  },
  status: {
    marginTop: Spacing.two,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: Spacing.two,
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.four,
    paddingVertical: 14,
  },
  logoutText: {
    textAlign: 'center',
    color: '#E5484D',
    fontWeight: '600',
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
    color: '#FFFFFF',
  },
  logoutModalButton: {
    backgroundColor: 'transparent',
  },
  logoutModalText: {
    color: '#E5484D',
  },
  pressed: {
    opacity: 0.7,
  },
});
