import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const sdkVersion = Constants.expoConfig?.sdkVersion;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          <ThemedText style={styles.appName}>爱赶集</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            版本 {version}
          </ThemedText>
          {sdkVersion ? (
            <ThemedText type="small" themeColor="textSecondary">
              Expo SDK {sdkVersion}
            </ThemedText>
          ) : null}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: Spacing.four,
  },
  appName: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
});
