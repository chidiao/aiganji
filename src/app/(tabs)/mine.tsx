import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ChevronRight,
  FileText,
  Heart,
  Info,
  Settings,
  Trash2,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ModalCard } from '@/components/modal-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useToast } from '@/components/toast';
import { PageBackground, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

const BRAND_BLUE = '#1B66D0';
const DIVIDER_COLOR = '#E7E8EA';

type RowItem = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
};

function ListRow({ item, isLast }: { item: RowItem; isLast: boolean }) {
  const Icon = item.icon;
  return (
    <View>
      <Pressable onPress={item.onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <Icon size={22} color={BRAND_BLUE} strokeWidth={1.9} />
        <ThemedText style={styles.rowLabel}>{item.label}</ThemedText>
        <ChevronRight size={18} color="#C9CDD3" strokeWidth={1.8} />
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
  const toast = useToast();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const clearCache = async () => {
    await Promise.all([Image.clearMemoryCache(), Image.clearDiskCache()]);
    setConfirmVisible(false);
    toast.show('图片缓存已清除');
  };

  const handleLogout = () => {
    signOut();
    setLogoutVisible(false);
    toast.show('已退出登录');
  };

  const commonRows: RowItem[] = [
    {
      icon: Settings,
      label: '首页设置',
      onPress: () => router.push('/settings'),
    },
    {
      icon: Trash2,
      label: '清除缓存',
      onPress: () => setConfirmVisible(true),
    },
    {
      icon: Info,
      label: '关于我们',
      onPress: () => router.push('/about'),
    },
  ];

  const accountRows: RowItem[] = [
    {
      icon: FileText,
      label: '我的订单',
      onPress: () => toast.show('功能开发中'),
    },
    {
      icon: Heart,
      label: '我的收藏',
      onPress: () => toast.show('功能开发中'),
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: PageBackground }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Pressable
            onPress={!user ? () => router.push('/login') : undefined}
            style={({ pressed }) => !user && pressed && styles.pressed}>
            <LinearGradient
              colors={['#1766CC', '#3188E8', '#5C9DEB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}>
              <View style={styles.avatar}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatarIcon} contentFit="cover" />
                ) : (
                  <UserRound size={38} color="#FFFFFF" strokeWidth={1.8} />
                )}
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.heroEyebrow}>{user ? '个人账号' : '欢迎来到赶集'}</ThemedText>
                <ThemedText numberOfLines={1} style={styles.heroTitle}>
                  {user?.nickname || '点击登录'}
                </ThemedText>
                <ThemedText numberOfLines={1} style={styles.heroSubtitle}>
                  {user ? `账号 ${user.username}` : '登录后同步个人资料和收藏'}
                </ThemedText>
              </View>
              {user ? (
                <View style={styles.loggedInBadge}>
                  <ThemedText style={styles.loggedInText}>已登录</ThemedText>
                </View>
              ) : (
                <View style={styles.heroAction}>
                  <ChevronRight size={20} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                </View>
              )}
              <View pointerEvents="none" style={styles.heroOrb} />
            </LinearGradient>
          </Pressable>

          {user ? (
            <RowGroup label="我的账户" rows={accountRows} showLabel />
          ) : null}

          <RowGroup label="通用" rows={commonRows} showLabel />

          {user ? (
            <>
              <View style={styles.spacer} />
              <Pressable
                onPress={() => setLogoutVisible(true)}
                style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
                <ThemedText style={styles.logoutText}>退出登录</ThemedText>
              </Pressable>
            </>
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
    paddingBottom: Spacing.four,

  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  hero: {
    minHeight: 150,
    marginTop: Spacing.two,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.72)',
    backgroundColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarIcon: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 16,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  heroTitle: {
    marginTop: 3,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.82)',
  },
  heroAction: {
    width: 26,
    alignItems: 'flex-end',
  },
  loggedInBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  loggedInText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
  },
  heroOrb: {
    position: 'absolute',
    width: 166,
    height: 166,
    borderRadius: 83,
    right: -78,
    top: -100,
    backgroundColor: 'rgba(255,255,255,0.10)',
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
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER_COLOR,
    marginLeft: Spacing.four + 22 + Spacing.three,
  },
  spacer: {
    flex: 1,
    minHeight: Spacing.five,
  },
  logoutButton: {
    marginBottom: 0,
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
