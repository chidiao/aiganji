import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { Text } from '@/services/chat-uikit'
import { useNavigation, useRoute, type RouteProp , type NavigationProp} from 'expo-router/react-navigation'

import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'

type RootStackParamList = {
  UserFilter: { keyword?: string }
}

type Nav = NavigationProp<RootStackParamList, 'UserFilter'>
type Rt = RouteProp<RootStackParamList, 'UserFilter'>

export const UserFilterScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Rt>()
  const { t } = useTranslation()

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.userFilter.title')} onBack={handleBack} />
      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          UserFilter 屏（待 1:1 转化 userFilter.nvue）
          {'\n'}
          keyword: {route.params?.keyword ?? ''}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
})
