import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation , type NavigationProp} from 'expo-router/react-navigation'

import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { FriendApplicationList, type FriendApplicationInfo } from '@/services/chat-uikit'
import { openFullScreenContact } from '@/services/fullscreen-chat-navigation'

type RootStackParamList = {
  ContactInfo: { type: string; applicationInfo?: any }
}

type Nav = NavigationProp<RootStackParamList, 'ContactInfo'>

export const FriendApplicationListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const { t } = useTranslation()

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleItemClick = useCallback(
    (item: FriendApplicationInfo): void => {
      openFullScreenContact({
        type: 'newContact',
        applicationInfo: item,
      })
    },
    [navigation]
  )
  const handleAccept = useCallback((item: FriendApplicationInfo): void => {
    console.log('已同意好友申请:', item.userID)
  }, [])

  const handleReject = useCallback((item: FriendApplicationInfo): void => {
    console.log('已拒绝好友申请:', item.userID)
  }, [])

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.friendApplicationList.title')} onBack={handleBack} />
      <View style={styles.pageContent}>
        <FriendApplicationList
          onItemClick={handleItemClick}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  pageContent: { flex: 1 },
})
