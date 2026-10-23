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

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleLogin = () => {
    if (!agreed) {
      Alert.alert('提示', '请先阅读并同意用户协议和隐私政策');
      return;
    }
    if (!account.trim() || !password) {
      Alert.alert('提示', '请输入账号和密码');
      return;
    }
    signIn(account.trim());
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoArea}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          <ThemedText type="small" themeColor="textSecondary">
            爱赶集
          </ThemedText>
        </View>

        <View style={styles.form}>
          <ThemedText style={styles.title}>欢迎回来</ThemedText>
          <ThemedText style={styles.subtitle}>登录你的账号，开启赶集之旅</ThemedText>

          <View style={styles.fields}>
            <AuthInput
              placeholder="请输入账号"
              value={account}
              onChangeText={setAccount}
              autoComplete="username"
            />
            <AuthInput
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <Pressable
            onPress={() => Alert.alert('忘记密码', '演示应用，暂不支持找回密码')}
            style={({ pressed }) => [styles.forgot, pressed && styles.pressed]}>
            <ThemedText type="small" style={styles.link}>
              忘记密码?
            </ThemedText>
          </Pressable>

          <GradientButton label="登  录" onPress={handleLogin} />

          <AgreementRow
            checked={agreed}
            onToggle={() => setAgreed((v) => !v)}
            style={styles.agreementSpacing}
          />

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>还没有账号？</ThemedText>
            <Pressable onPress={() => router.replace('/register')} hitSlop={4}>
              <ThemedText style={styles.linkLarge}>立即注册</ThemedText>
            </Pressable>
          </View>
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
  logoArea: {
    alignItems: 'center',
    paddingTop: Spacing.five,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 20,
  },
  form: {
    marginTop: Spacing.five,
  },
  title: {
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
  forgot: {
    alignSelf: 'flex-end',
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  link: {
    color: AUTH_LINK_COLOR,
    fontWeight: '600',
  },
  agreementSpacing: {
    marginTop: Spacing.five,
  },
  footer: {
    marginTop: Spacing.five,
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
