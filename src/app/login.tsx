import { Image } from 'expo-image'
import { router } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { loginApi } from '@/api/auth'
import { AgreementRow, AUTH_LINK_COLOR, AuthInput, GradientButton } from '@/components/auth-ui'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useToast } from '@/components/toast'
import { Spacing } from '@/constants/theme'
import { useAuth } from '@/hooks/use-auth'

export default function LoginScreen() {
  const { signIn } = useAuth()
  const toast = useToast()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    if (submitting) {
      return
    }
    if (!agreed) {
      toast.show('请先阅读并同意用户协议和隐私政策')
      return
    }
    const username = account.trim()
    if (!username || !password) {
      toast.show('请输入账号和密码')
      return
    }
    setSubmitting(true)
    try {
      toast.showLoading('登录中')
      const { token, user } = await loginApi(username, password)
      signIn(token, user)
      toast.show('登录成功')
      router.back()
    } catch (error) {
      toast.show(error instanceof Error ? error.message : '登录失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAwareScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" bottomOffset={24}>
        <View style={styles.logoArea}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        </View>

        <View style={styles.form}>
          <ThemedText style={styles.title}>欢迎回来</ThemedText>
          <ThemedText style={styles.subtitle}>登录你的账号，开启赶集之旅</ThemedText>

          <View style={styles.fields}>
            <AuthInput placeholder="请输入账号" value={account} onChangeText={setAccount} autoComplete="username" />
            <AuthInput
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <Pressable
            onPress={() => toast.show('暂不支持找回密码')}
            style={({ pressed }) => [styles.forgot, pressed && styles.pressed]}
          >
            <ThemedText type="small" style={styles.link}>
              忘记密码?
            </ThemedText>
          </Pressable>

          <GradientButton label="登  录" onPress={handleLogin} />

          <Pressable onPress={() => { setAccount('guest_7k2m'); setPassword('G7k2m!9x'); }} style={({ pressed }) => [styles.guestButton, pressed && styles.pressed]}>
            <ThemedText style={styles.linkLarge}>游客登录</ThemedText>
          </Pressable>

          <AgreementRow checked={agreed} onToggle={() => setAgreed((v) => !v)} style={styles.agreementSpacing} />

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>还没有账号？</ThemedText>
            <Pressable onPress={() => router.replace('/register')} hitSlop={4}>
              <ThemedText style={styles.linkLarge}>立即注册</ThemedText>
            </Pressable>
          </View>
        </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9'
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four
  },
  content: { flexGrow: 1, paddingBottom: Spacing.four },
  logoArea: {
    alignItems: 'center',
    paddingTop: Spacing.five
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 20
  },
  form: {
    marginTop: Spacing.five
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700'
  },
  subtitle: {
    marginTop: Spacing.two,
    fontSize: 15,
    lineHeight: 22,
    color: '#60646C'
  },
  fields: {
    marginTop: Spacing.five,
    gap: Spacing.four
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: Spacing.two,
    marginBottom: Spacing.three
  },
  link: {
    color: AUTH_LINK_COLOR,
    fontWeight: '600'
  },
  agreementSpacing: {
    marginTop: Spacing.five
  },
  guestButton: { alignSelf: 'center', marginTop: Spacing.three, padding: Spacing.two },
  footer: {
    marginTop: Spacing.five,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two
  },
  footerText: {
    fontSize: 15,
    color: '#60646C'
  },
  linkLarge: {
    fontSize: 15,
    color: AUTH_LINK_COLOR,
    fontWeight: '600'
  },
  pressed: {
    opacity: 0.7
  }
})
