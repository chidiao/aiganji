import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation } from 'expo-router/react-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { GroupApplicationList, type GroupApplicationInfo } from '@/services/chat-uikit'

export const GroupApplicationListScreen: React.FC = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleAccept = useCallback(
    (_item: GroupApplicationInfo): void => {
      navigation.goBack()
    },
    [navigation]
  )

  const handleReject = useCallback(
    (_item: GroupApplicationInfo): void => {
      navigation.goBack()
    },
    [navigation]
  )

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.groupApplicationList.title')} onBack={handleBack} />
      <View style={styles.pageContent}>
        <GroupApplicationList onAccept={handleAccept} onReject={handleReject} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  pageContent: { flex: 1 },
})
