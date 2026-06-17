import api from '@/lib/axios'
import type { LoginRequest, LoginResponse, AuthUser } from '@/types/api.types'

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>('/auth/login', data).then((r) => r.data)

export const logout = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = api.post('auth/logout', { refreshToken });
  return response;
}
export const refreshToken = (token: string) =>
  api.post<LoginResponse>('/auth/refresh', { refreshToken: token }).then((r) => r.data)

export const getMe = () =>
  api.get<AuthUser>('/auth/me').then((r) => r.data)
