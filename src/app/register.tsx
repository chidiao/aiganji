import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgreementRow, AuthInput, AUTH_LINK_COLOR, GradientButton } from '@/components/auth-ui';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const [nickname, setNickname] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleRegister = () => {
    if (!agreed) {
      Alert.alert('提示', '请先阅读并同意用户协议和隐私政策');
      return;
    }
    if (!account.trim() || !password) {
      Alert.alert('提示', '请输入账号和密码');
      return;
    }
    if (password.length < 8 || password.length > 20) {
      Alert.alert('提示', '密码长度需要 8-20 位');
      return;
    }
    signIn(nickname.trim() || account.trim());
    router.replace('/(tabs)/mine');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Image
            source={require('@/assets/images/icons/chevron-left.png')}
            style={styles.backIcon}
            tintColor="#17181A"
          />
        </Pressable>

        <ThemedText style={styles.title}>创建账号</ThemedText>
        <ThemedText style={styles.subtitle}>注册后即可开启你的赶集之旅</ThemedText>

        <View style={styles.fields}>
          <AuthInput placeholder="请输入昵称" value={nickname} onChangeText={setNickname} />
          <AuthInput
            placeholder="请输入账号"
            value={account}
            onChangeText={setAccount}
            autoComplete="username"
          />
          <AuthInput
            placeholder="请设置密码（8-20位）"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          <AuthInput
            placeholder="手机号（选填）"
            value={phone}
            onChangeText={setPhone}
            autoComplete="tel"
          />
        </View>

        <AgreementRow
          checked={agreed}
          onToggle={() => setAgreed((v) => !v)}
          style={styles.agreementSpacing}
        />

        <GradientButton label="注  册" onPress={handleRegister} style={styles.buttonSpacing} />

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>已有账号？</ThemedText>
          <Pressable onPress={() => router.replace('/login')} hitSlop={4}>
            <ThemedText style={styles.linkLarge}>直接登录</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  back: {
    marginTop: Spacing.four,
    alignSelf: 'flex-start',
  },
  backIcon: {
    width: 26,
    height: 26,
  },
  title: {
    marginTop: Spacing.four,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: Spacing.two,
    fontSize: 15,
    lineHeight: 22,
    color: '#60646C',
  },
  fields: {
    marginTop: Spacing.five,
    gap: Spacing.four,
  },
  agreementSpacing: {
    marginTop: Spacing.four,
  },
  buttonSpacing: {
    marginTop: Spacing.four,
  },
  footer: {
    marginTop: Spacing.four,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  footerText: {
    fontSize: 15,
    color: '#60646C',
  },
  linkLarge: {
    fontSize: 15,
    color: AUTH_LINK_COLOR,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
