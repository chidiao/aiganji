import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation, type NavigationProp } from 'expo-router/react-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CustomNavbar, AddGroup, type GroupInfo, showToast} from '@/services/chat-uikit'
import { useTranslation } from 'react-i18next'
import { GroupMemberRole } from 'tuikit-atomicx-react-native'

type Nav = NavigationProp<any>

export const AddGroupScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const { t } = useTranslation()

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleGroupSelect = useCallback(
    (group: GroupInfo): void => {
      if ((group as any).selfRole === GroupMemberRole.UNDEFINED) {
        navigation.navigate('ApplicationVerify', {
          type: 'group',
          groupInfo: group,
        })
      } else {
        showToast(`${t('demo.screens.addGroup.joinedAlready')}`)
      }
    },
    [navigation]
  )

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.addGroup.title')} onBack={handleBack} />
      <View style={styles.pageContent}>
        <AddGroup onGroupSelect={handleGroupSelect} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  pageContent: { flex: 1 },
})
