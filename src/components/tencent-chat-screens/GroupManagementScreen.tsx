import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import {
  useNavigation,
  useRoute,
  type RouteProp,
  type NavigationProp,
} from 'expo-router/react-navigation'

import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { GroupManagement } from '@/services/chat-uikit'
import type { UserPickerType as ChatSettingUserPickerType } from '@/services/chat-uikit'

type RootStackParamList = {
  GroupManagement: { conversationID: string }
  UserPicker: { businessType: ChatSettingUserPickerType; routeParams?: Record<string, any> }
  GroupMemberList: { conversationID: string; hideMember?: boolean }
}

type Rt = RouteProp<RootStackParamList, 'GroupManagement'>
type Nav = NavigationProp<RootStackParamList, 'GroupManagement'>

export const GroupManagementScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Rt>()
  const { t } = useTranslation()
  const { conversationID } = route.params

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleNavigateToMemberList = useCallback(
    (convID: string, hideMember: boolean): void => {
      navigation.navigate('GroupMemberList', { conversationID: convID, hideMember })
    },
    [navigation]
  )

  const handleNavigateToUserPicker = useCallback(
    (info: {
      businessType: ChatSettingUserPickerType
      conversationID: string
    }): void => {
      navigation.navigate('UserPicker', {
        businessType: info.businessType,
        routeParams: { conversationID: info.conversationID },
      })
    },
    [navigation]
  )

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.groupManagement.title')} onBack={handleBack} />
      <GroupManagement
        conversationID={conversationID}
        onNavigateToMemberList={handleNavigateToMemberList}
        onNavigateToUserPicker={handleNavigateToUserPicker}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
})
