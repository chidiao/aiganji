import React, { useCallback } from 'react'
import { PageBackground } from '@/constants/theme';
import { StyleSheet, View } from 'react-native'
import { useNavigation, useRoute, type RouteProp , type NavigationProp} from 'expo-router/react-navigation'

import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { CustomNavbar } from '@/services/chat-uikit'
import { SetRemark } from '@/services/chat-uikit'
import type { ContactInfoData } from '@/services/chat-uikit'

type RootStackParamList = {
  SetRemark: { friendInfo?: ContactInfoData }
}

type Nav = NavigationProp<RootStackParamList, 'SetRemark'>
type Rt = RouteProp<RootStackParamList, 'SetRemark'>

export const SetRemarkScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Rt>()
  const { t } = useTranslation()

  const friendInfo = route.params?.friendInfo ?? null

  const userID = friendInfo?.userID ?? ''
  const remark = friendInfo?.friendRemark ?? ''

  const handleBack = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleSuccess = useCallback(
    (_userID: string, _remark: string): void => {
      setTimeout(() => {
        navigation.goBack()
      }, 1500)
    },
    [navigation]
  )

  const handleFail = useCallback((error: any): void => {
    console.error('设置备注失败:', error)
  }, [])

  const handleCancel = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <CustomNavbar title={t('demo.screens.setRemark.title')} onBack={handleBack} />
      <View style={styles.pageContent}>
        <SetRemark
          userID={userID}
          remark={remark}
          onSuccess={handleSuccess}
          onFail={handleFail}
          onCancel={handleCancel}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PageBackground },
  pageContent: { flex: 1 },
})
