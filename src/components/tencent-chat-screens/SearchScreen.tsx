import React, { useCallback, useState } from 'react'
import { PageBackground } from '@/constants/theme';
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { useNavigation, useRoute, type RouteProp , type NavigationProp} from 'expo-router/react-navigation'

import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Search, type SearchOption } from '@/services/chat-uikit'
import { openFullScreenChat } from '@/services/fullscreen-chat-navigation'

type RootStackParamList = {
  Search: { statusBarHeight?: number }
  Chat: { conversationID: string; type: 'C2C' | 'GROUP'; title?: string; locateMessage?: any }
  SearchInConversation: { conversationID: string; keyword: string; option: string }
}

type Nav = NavigationProp<RootStackParamList, 'Search'>

type UserData = { userID: string; userInfo?: { userID: string } }
type GroupData = { groupID: string; groupName: string }
type GroupMemberData = { userID: string }
type ConversationData = { conversationID: string }
type MessageData = { conversationID: string; conversationName?: string; showName?: string }

const STATUS_BAR_HEIGHT = Platform.OS === 'ios'
  ? 44
  : (StatusBar.currentHeight ?? 24)

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<Nav>()
  const route = useRoute<RouteProp<RootStackParamList, 'Search'>>()
  const { t } = useTranslation()
  const statusBarHeight = route.params?.statusBarHeight ?? STATUS_BAR_HEIGHT
  const [keyword, setKeyword] = useState('')
  const [searchOption, setSearchOption] = useState<SearchOption>({})

  const handleSearch = useCallback(
    (searchKeyword: string, option: SearchOption): void => {
      setKeyword(searchKeyword)
      setSearchOption(option)
    },
    []
  )

  const handleCancel = useCallback((): void => {
    navigation.goBack()
  }, [navigation])

  const handleResultItemClick = useCallback(
    (type: string, data: any): void => {
      switch (type) {
        case 'user': {
          const d = data as UserData
          if (d.userID) {
            openFullScreenChat({
              conversationID: `c2c_${d.userID}`,
              type: 'C2C',
              title: d.userID,
            })
          }
          break
        }
        case 'friend': {
          const d = data as UserData
          const friendConvID = `c2c_${d.userInfo?.userID || d.userID}`
          openFullScreenChat({
            conversationID: friendConvID,
            type: 'C2C',
            title: d.userInfo?.userID ?? d.userID,
          })
          break
        }
        case 'group': {
          const d = data as GroupData
          const groupConvID = `group_${d.groupID}`
          openFullScreenChat({
            conversationID: groupConvID,
            type: 'GROUP',
            title: d.groupName ?? t('demo.screens.chat.title.group'),
          })
          break
        }
        case 'groupMember': {
          const d = data as GroupMemberData
          if (d.userID) {
            openFullScreenChat({
              conversationID: `c2c_${d.userID}`,
              type: 'C2C',
              title: d.userID,
            })
          }
          break
        }
        case 'conversation': {
          const d = data as ConversationData
          navigation.navigate('SearchInConversation', {
            conversationID: d.conversationID,
            keyword: encodeURIComponent(keyword),
            option: encodeURIComponent(JSON.stringify(searchOption)),
          })
          break
        }
        case 'message': {
          const d = data as MessageData
          if (d.conversationID) {
            openFullScreenChat({
              conversationID: d.conversationID,
              type: d.conversationID.startsWith('group_') ? 'GROUP' : 'C2C',
              title: d.conversationName ?? d.showName ?? t('demo.screens.chat.title.default'),
            })
          }
          break
        }
        default:
          console.warn('[SearchPage] Unknown result type:', type)
      }
    },
    [navigation, keyword, searchOption, t]
  )

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={[styles.searchPage, { paddingTop: statusBarHeight }]}>
        <Search
          placeholder={t('demo.screens.search.placeholder')}
          showAdvanced
          showCancel
          debounceTime={300}
          onSearch={handleSearch}
          onCancel={handleCancel}
          onResultItemClick={handleResultItemClick}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PageBackground,
  },
  searchPage: {
    flex: 1,
    backgroundColor: PageBackground,
  },
})
