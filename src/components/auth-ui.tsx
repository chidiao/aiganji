import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';

export const AUTH_LINK_COLOR = '#1B66D0';

type AuthInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoComplete?: TextInputProps['autoComplete'];
};

export function AuthInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoComplete,
}: AuthInputProps) {
  const [visible, setVisible] = useState(false);
  const passwordHidden = secureTextEntry && !visible;

  return (
    <View style={styles.inputWrap}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#B4B8BF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={passwordHidden}
        autoCapitalize="none"
        autoComplete={autoComplete}
      />
      {secureTextEntry ? (
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}>
          <Image
            source={
              passwordHidden
                ? require('@/assets/images/icons/eye.png')
                : require('@/assets/images/icons/eye-off.png')
            }
            style={styles.eyeIcon}
            tintColor="#9CA1A8"
          />
        </Pressable>
      ) : null}
    </View>
  );
}

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function GradientButton({ label, onPress, style }: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [style, pressed && styles.pressed]}>
      <LinearGradient
        colors={['#2E6CD6', '#0A2C66']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientButton}>
        <ThemedText style={styles.gradientButtonText}>{label}</ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

type AgreementRowProps = {
  checked: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AgreementRow({ checked, onToggle, style }: AgreementRowProps) {
  return (
    <View style={[styles.agreementRow, style]}>
      <Pressable
        onPress={onToggle}
        hitSlop={8}
        style={({ pressed }) => [
          styles.checkbox,
          checked && styles.checkboxChecked,
          pressed && styles.pressed,
        ]}>
        {checked ? <ThemedText style={styles.checkmark}>✓</ThemedText> : null}
      </Pressable>
      <ThemedText type="small" themeColor="textSecondary" style={styles.agreementText}>
        我已阅读并同意 <ThemedText type="small" style={styles.link}>《用户协议》</ThemedText> 和{' '}
        <ThemedText type="small" style={styles.link}>《隐私政策》</ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEDEF',
    paddingHorizontal: 18,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#17181A',
    paddingVertical: 0,
  },
  eyeIcon: {
    width: 22,
    height: 22,
  },
  gradientButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C9CDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E6CD6',
    borderColor: '#2E6CD6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 14,
  },
  agreementText: {
    flex: 1,
  },
  link: {
    color: AUTH_LINK_COLOR,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
