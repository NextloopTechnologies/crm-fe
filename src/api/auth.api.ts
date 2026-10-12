import api from '@/lib/axios'
import type { LoginRequest, LoginResponse, AuthUser } from '@/types/api.types'

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>('/auth/login', data).then((r) => r.data)

export const logout = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = api.post('/auth/logout', { refreshToken });
  return response;
}
export const refreshToken = (token: string) =>
  api.post<LoginResponse>('/auth/refresh', { refreshToken: token }).then((r) => r.data)

export const getMe = () =>
  api.get<AuthUser>('/auth/me').then((r) => r.data)

/**
 * Step one of a password reset: asks for a token, which the server delivers
 * out of band.
 *
 * Answers the same way whether or not the account exists, so there is nothing
 * here to tell the caller which it was — and nothing to show the user beyond
 * the message the server returns.
 */
export const requestPasswordReset = (userNameAndMobile: string) =>
  api
    .post('/auth/forgot-password', null, { params: { userNameAndMobile } })
    .then((r) => r.data)

/** Step two: spends the delivered token to set a new password. */
export const resetPassword = (token: string, newPassword: string, confirmNewPassword: string) =>
  api
    .post('/auth/reset-password', null, { params: { token, newPassword, confirmNewPassword } })
    .then((r) => r.data)
