import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute, type RouteProp , type NavigationProp} from 'expo-router/react-navigation'

import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { UserPicker } from '@/services/chat-uikit'
import { USER_PICKER_TYPE, type UserPickerType } from '@/services/chat-uikit'
import type { User } from '@/services/chat-uikit'
import { getFullScreenCallbackParams } from '@/services/fullscreen-chat-navigation'

const TITLE_KEY_MAP: Record<number, string> = {
  [USER_PICKER_TYPE.SELECT_GROUP_AT_USER]: 'demo.screens.userPicker.title.selectGroupAtUser',
}

type RootStackParamList = {
  UserPicker: {
    businessType: UserPickerType | string;
    routeParams?: Record<string, any>;
    callbackKey?: string;
  }
}

type UserPickerRouteProp = RouteProp<RootStackParamList, 'UserPicker'>
type UserPickerNavProp = NavigationProp<RootStackParamList, 'UserPicker'>

export const UserPickerScreen: React.FC = () => {
  const navigation = useNavigation<UserPickerNavProp>()
  const route = useRoute<UserPickerRouteProp>()
  const { t } = useTranslation()

  const rawBusinessType = route.params?.businessType
  const businessType = (
    typeof rawBusinessType === 'string' && /^\d+$/.test(rawBusinessType)
      ? Number(rawBusinessType)
      : rawBusinessType
  ) as UserPickerType
  const routeParams =
    route.params?.routeParams ?? getFullScreenCallbackParams(route.params?.callbackKey)

  const handleConfirm = (selectedUsers: User[]): void => {
    console.log('selectedUsers:', selectedUsers, businessType)
    if (
      businessType === USER_PICKER_TYPE.SELECT_GROUP_MEMBER ||
      businessType === USER_PICKER_TYPE.SELECT_GROUP_AT_USER
    ) {
      const onSelect: ((data: { selectedUsers: User[] }) => void) | undefined = (
        routeParams as { onSelect?: (data: { selectedUsers: User[] }) => void }
      ).onSelect
      onSelect?.({ selectedUsers })
    }
    if (businessType !== USER_PICKER_TYPE.C2C_CONVERSATION && businessType !== USER_PICKER_TYPE.CREATE_GROUP) {
      navigation.goBack()
    }
  }

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const title = t(TITLE_KEY_MAP[businessType] ?? 'demo.screens.userPicker.title.default')

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={title} onBack={handleBack} />
      <View style={styles.container}>
        <UserPicker
          businessType={businessType}
          routeParams={routeParams}
          onConfirm={handleConfirm}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  container: {
    flex: 1,
    backgroundColor: PageBackground,
  },
})

export default UserPickerScreen
