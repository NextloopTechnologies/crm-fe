import { useAuthStore } from '@/stores/auth.store'

/**
 * The signed-in user's role, upper-cased.
 *
 * Prefers the auth store, then falls back to localStorage — which is where
 * useLogin actually writes it, and where the rest of the app reads it from.
 *
 * usePermission() reads only the store, and the store's `user` is not
 * populated by the login flow. Anything keyed off it therefore behaves as
 * though the user had no role at all, which silently hid client rates and
 * margin from Sales and Admin as well as from HR.
 */
export function useCurrentRole(): string {
  const user = useAuthStore((s) => s.user)
  const fromStore = (user?.role ?? user?.roleName ?? '').toUpperCase()

  if (fromStore) return fromStore

  try {
    return (localStorage.getItem('roleName') ?? '').toUpperCase()
  } catch {
    // Private mode or blocked storage: fall through to no role, which shows
    // the least rather than the most.
    return ''
  }
}
