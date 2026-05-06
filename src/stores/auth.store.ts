import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, LoginResponse } from '@/types/api.types'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean

  login: (data: LoginResponse) => void
  logout: () => void
  updateUser: (user: AuthUser) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (data) =>
        set({
          token: data.token,
          refreshToken: data.refreshToken,
          user: {
            fullname: data.fullname,
            roleName: data.roleName,
            managerId: data.managerId,
            orgnizationId: data.orgnizationId,
          },
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'crm-auth',
      partialize: (s) => ({
        token: s.token,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    }
  )
)