import { router, type Href } from 'expo-router';

export type FullScreenChatParams = {
  conversationID: string;
  type: 'C2C' | 'GROUP';
  title?: string;
  locateMessage?: unknown;
};

type FullScreenContactParams = {
  type?: string;
  userInfo?: unknown;
  friendInfo?: unknown;
  applicationInfo?: unknown;
};

export type FullScreenRouteName =
  | 'Chat'
  | 'ChatSetting'
  | 'ContactInfo'
  | 'ApplicationVerify'
  | 'SetRemark'
  | 'SearchInConversation'
  | 'UserPicker'
  | 'UserFilter'
  | 'CreateGroup'
  | 'GroupTypeInfo'
  | 'GroupManagement'
  | 'GroupMemberList'
  | 'Search'
  | 'AddFriend'
  | 'AddGroup'
  | 'BlackList'
  | 'ContactList'
  | 'FriendApplicationList'
  | 'GroupApplicationList'
  | 'GroupList'
  | 'Main'
  | 'ConversationList'
  | 'Login';

const callbackParams = new Map<string, Record<string, unknown>>();
let callbackSequence = 0;

function serialize(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}

export function deserializeRouteParam<T>(value: unknown): T | undefined {
  if (typeof value !== 'string') return value as T | undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
}

function serializeParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => [key, serialize(value)])
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
}

export function openFullScreenRoute(
  name: FullScreenRouteName,
  params: Record<string, unknown> = {},
  replace = false
) {
  const href = {
    pathname: `/(fullscreen)/${name}`,
    params: serializeParams(params),
  } as Href;
  if (replace) router.replace(href);
  else router.push(href);
}

export function openFullScreenChat(params: FullScreenChatParams, replace = false) {
  openFullScreenRoute('Chat', params, replace);
}

export function openFullScreenContact(params: FullScreenContactParams) {
  openFullScreenRoute('ContactInfo', params);
}

export function openFullScreenUserPicker(
  businessType: string | number,
  routeParams: Record<string, unknown> = {}
) {
  const callbackKey = `picker-${++callbackSequence}`;
  callbackParams.set(callbackKey, routeParams);
  openFullScreenRoute('UserPicker', { businessType, callbackKey });
}

export function getFullScreenCallbackParams(callbackKey?: string) {
  if (!callbackKey) return {};
  return callbackParams.get(callbackKey) ?? {};
}