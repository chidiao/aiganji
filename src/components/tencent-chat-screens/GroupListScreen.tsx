import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation, type NavigationProp } from 'expo-router/react-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { GroupList, type GroupInfo } from '@/services/chat-uikit'
import { openFullScreenChat } from '@/services/fullscreen-chat-navigation'

type Nav = NavigationProp<any>

export const GroupListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const { t } = useTranslation()

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleGroupClick = useCallback(
    (group: GroupInfo): void => {
      openFullScreenChat({
        conversationID: `group_${group.groupID}`,
        type: 'GROUP',
        title: group.groupName,
      })
    },
    [navigation]
  )

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.groupList.title')} onBack={handleBack} />
      <View style={styles.pageContent}>
        <GroupList onGroupSelect={handleGroupClick} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  pageContent: { flex: 1 },
})
