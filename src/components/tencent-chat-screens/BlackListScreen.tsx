import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation } from 'expo-router/react-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { BlackList } from '@/services/chat-uikit'

export const BlackListScreen: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.blackList.title')} onBack={handleBack} />
      <View style={styles.pageContent}>
        <BlackList />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  pageContent: { flex: 1 },
})
