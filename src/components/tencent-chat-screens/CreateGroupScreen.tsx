import React, { useCallback, useMemo, useState } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from 'expo-router/react-navigation'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import {
  CreateGroup,
  type CreateGroupUserLite,
  type GroupType,
} from '@/services/chat-uikit'
import type { User } from '@/services/chat-uikit'
import { deserializeRouteParam, openFullScreenChat } from '@/services/fullscreen-chat-navigation'

type Nav = NavigationProp<any> & {
  replace: <RouteName extends keyof never>(
    name: RouteName,
    params?: { conversationID: string; type: 'C2C' | 'GROUP'; title?: string }
  ) => void
}
type CreateGroupRoute = RouteProp<
  { CreateGroup: { selectedUsers?: User[] | string } },
  'CreateGroup'
>

export const CreateGroupScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<CreateGroupRoute>()
  const { t } = useTranslation()

  const [groupType, setGroupType] = useState<GroupType | undefined>(undefined)

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleNavigateToGroupType = useCallback(
    (_currentTypeId: string): void => {
      navigation.navigate('GroupTypeInfo', {
        onSelect: (selectedType: GroupType): void => {
          setGroupType(selectedType)
        },
      })
    },
    [navigation]
  )

  const selectedUsers: CreateGroupUserLite[] = useMemo((): CreateGroupUserLite[] => {
    const source = deserializeRouteParam<User[]>(route.params?.selectedUsers) ?? []
    return source.map((u: User): CreateGroupUserLite => ({
      userID: u.userID,
      nickname: u.nickname && u.nickname.length > 0 ? u.nickname : u.userID,
    }))
  }, [route.params?.selectedUsers])

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.createGroup.title')} onBack={handleBack} />
      <View style={styles.page}>
        <CreateGroup
          selectedUsers={selectedUsers}
          controlledGroupType={groupType}
          onNavigateToGroupType={handleNavigateToGroupType}
          onCreateSuccess={useCallback(
            (data: { groupID: string; conversationID: string }) => {
              console.log('[CreateGroupScreen] create group success:', data)
              openFullScreenChat({
                conversationID: data.conversationID,
                type: 'GROUP',
                title: t('demo.screens.chat.title.group'),
              }, true)
            },
            [navigation, t]
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  page: {
    flex: 1,
    backgroundColor: PageBackground,
  },
})
