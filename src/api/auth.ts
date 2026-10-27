import { request } from './client';

export type Gender = 'UNKNOWN' | 'MALE' | 'FEMALE';

export type User = {
  id: number;
  username: string;
  nickname: string;
  gender: Gender;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResult = {
  token: string;
  user: User;
};

export function loginApi(username: string, password: string) {
  return request<AuthResult>('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export function registerApi(params: {
  username: string;
  password: string;
  nickname?: string;
  phone?: string;
}) {
  return request<AuthResult>('/auth/register', {
    method: 'POST',
    body: params,
  });
}

export function getProfile(token: string) {
  return request<{ user: User }>('/auth/profile', { token });
}
