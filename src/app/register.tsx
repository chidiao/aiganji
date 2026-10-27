import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgreementRow, AuthInput, AUTH_LINK_COLOR, GradientButton } from '@/components/auth-ui';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useToast } from '@/components/toast';
import { Spacing } from '@/constants/theme';
import { registerApi } from '@/api/auth';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const toast = useToast();
  const [nickname, setNickname] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (submitting) {
      return;
    }
    if (!agreed) {
      toast.show('请先阅读并同意用户协议和隐私政策');
      return;
    }
    const username = account.trim();
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
      toast.show('账号需为 3-32 位字母、数字或下划线');
      return;
    }
    if (!password) {
      toast.show('请设置密码');
      return;
    }
    if (password.length < 8 || password.length > 20) {
      toast.show('密码长度需要 8-20 位');
      return;
    }
    setSubmitting(true);
    try {
      toast.showLoading('注册中');
      const { token, user } = await registerApi({
        username,
        password,
        nickname: nickname.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      signIn(token, user);
      toast.show('注册成功');
      router.replace('/(tabs)/mine');
    } catch (error) {
      toast.show(error instanceof Error ? error.message : '注册失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <ChevronLeft size={26} color="#17181A" strokeWidth={2} />
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
