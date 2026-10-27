import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import { useNavigation, useRoute, type RouteProp } from 'expo-router/react-navigation'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { GroupMemberList } from '@/services/chat-uikit'

type RootStackParamList = {
  GroupMemberList: { conversationID: string; hideMember?: boolean }
}

type Rt = RouteProp<RootStackParamList, 'GroupMemberList'>

export const GroupMemberListScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<Rt>()
  const { t } = useTranslation()
  const { conversationID, hideMember } = route.params

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.groupMemberList.title')} onBack={handleBack} />
      <GroupMemberList conversationID={conversationID} hideMember={hideMember ?? false} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
})
