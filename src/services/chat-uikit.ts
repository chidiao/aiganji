import type { ComponentType } from 'react';

// Keep the runtime import untyped: TUIKit 3.0.1 publishes TypeScript source with
// declaration errors that otherwise prevent the host app from typechecking.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const UIKit = require('@tencentcloud/chat-uikit-react-native') as Record<string, any>;

function component(name: string) {
  return UIKit[name] as ComponentType<any>;
}

export const Text = component('Text');
export const CustomNavbar = component('CustomNavbar');
export const ApplicationVerify = component('ApplicationVerify');
export const BlackList = component('BlackList');
export const AddGroup = component('AddGroup');
export const AddFriend = component('AddFriend');
export const MessageList = component('MessageList');
export const MessageInput = component('MessageInput');
export const ContactList = component('ContactList');
export const ConversationList = component('ConversationList');
export const ContactInfo = component('ContactInfo');
export const CreateGroup = component('CreateGroup');
export const FriendApplicationList = component('FriendApplicationList');
export const GroupApplicationList = component('GroupApplicationList');
export const GroupList = component('GroupList');
export const GroupManagement = component('GroupManagement');
export const GroupMemberList = component('GroupMemberList');
export const GroupTypeInfo = component('GroupTypeInfo');
export const Search = component('Search');
export const SetRemark = component('SetRemark');
export const UserPicker = component('UserPicker');
export const C2CChatSetting = component('C2CChatSetting');
export const GroupChatSetting = component('GroupChatSetting');

export const USER_PICKER_TYPE = UIKit.USER_PICKER_TYPE as Record<string, any>;
export const showToast = UIKit.showToast as (...args: any[]) => void;
export const rpxToPx = UIKit.rpxToPx as (value: number) => number;
export const getGroupTypeById = UIKit.getGroupTypeById as (id: string | number) => any;
export const initI18n = UIKit.initI18n as (language?: 'en' | 'zh-CN') => void;
export const getI18n = UIKit.getI18n as () => import('i18next').i18n;

export type GroupInfo = any;
export type ContactInfoData = any;
export type ContactInfoType = any;
export type FriendApplicationInfo = any;
export type GroupApplicationInfo = any;
export type ConversationInfo = any;
export type EntryType = any;
export type MessageInfo = any;
export type UserPickerType = any;
export type ChatSettingUserPickerType = any;
export type User = {
  userID: string;
  nickname?: string;
  avatarURL?: string;
  [key: string]: unknown;
};
export type GroupType = any;
export type SearchOption = any;
export type CreateGroupUserLite = User;
