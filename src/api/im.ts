import { request } from './client';

export type ImUserSig = {
  sdkAppId: number;
  userId: string;
  userSig: string;
  expireAt: number;
};

export function getImUserSig(token: string) {
  return request<ImUserSig>('/im/usersig', { token });
}
