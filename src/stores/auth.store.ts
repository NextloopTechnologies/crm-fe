import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types/api.types'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  login: (token: string, refreshToken: string, user: AuthUser) => void
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
      login: (token, refreshToken, user) =>
        set({ token, refreshToken, user, isAuthenticated: true }),
      logout: () =>
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
    }),
    { name: 'crm-auth' }
  )
)
