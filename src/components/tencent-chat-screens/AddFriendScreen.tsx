import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation, type NavigationProp } from 'expo-router/react-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { AddFriend } from '@/services/chat-uikit'
import { openFullScreenContact } from '@/services/fullscreen-chat-navigation'
import type { ContactInfoData } from '@/services/chat-uikit'

type Nav = NavigationProp<any>

export const AddFriendScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const { t } = useTranslation()

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleUserSelect = useCallback(
    (user: ContactInfoData): void => {
      if (!user.isFriend) {
        openFullScreenContact({
          type: 'addFriend',
          userInfo: user,
        })
      } else {
        openFullScreenContact({
          type: 'friend',
          friendInfo: user,
        })
      }
    },
    [navigation]
  )

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.addFriend.title')} onBack={handleBack} />
      <View style={styles.pageContent}>
        <AddFriend onUserSelect={handleUserSelect} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  pageContent: { flex: 1 },
})
