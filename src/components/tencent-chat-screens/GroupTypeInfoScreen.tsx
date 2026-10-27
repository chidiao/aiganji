import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation, useRoute, type RouteProp, type NavigationProp } from 'expo-router/react-navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { GroupTypeInfo } from '@/services/chat-uikit'
import { getGroupTypeById, type GroupType } from '@/services/chat-uikit'

type Nav = NavigationProp<any>

type GroupTypeInfoParams = {
  onSelect?: (groupType: GroupType) => void
}

export const GroupTypeInfoScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const { t } = useTranslation()
  const route = useRoute<RouteProp<{ GroupTypeInfo: GroupTypeInfoParams }, 'GroupTypeInfo'>>()

  const handleSelectType = useCallback(
    (groupTypeId: string): void => {
      const groupType = getGroupTypeById(groupTypeId)
      if (groupType) {
        if (route.params?.onSelect) {
          route.params.onSelect(groupType)
        }
        navigation.goBack()
      }
    },
    [navigation, route.params]
  )

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.groupTypeInfo.title')} onBack={handleBack} />
      <View style={styles.page}>
        <GroupTypeInfo showDocumentationLink onSelectType={handleSelectType} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  page: { flex: 1 },
})
