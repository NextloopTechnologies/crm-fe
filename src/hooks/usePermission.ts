import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/enums'

const roleHierarchy: Record<string, number> = {
  [UserRole.SUPER_ADMIN]: 5,
  [UserRole.ADMIN]:       4,
  [UserRole.MANAGER]:     3,
  [UserRole.SALES_EXEC]:  2,
  [UserRole.VIEWER]:      1,
}

export function usePermission() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role ?? ''

  const hasRole = (required: UserRole | UserRole[]) => {
    const roles = Array.isArray(required) ? required : [required]
    return roles.includes(role as UserRole)
  }

  const hasMinRole = (minRole: UserRole) =>
    (roleHierarchy[role] ?? 0) >= (roleHierarchy[minRole] ?? 0)

  const isAdmin      = hasMinRole(UserRole.ADMIN)
  const isManager    = hasMinRole(UserRole.MANAGER)
  const isSalesExec  = hasMinRole(UserRole.SALES_EXEC)
  const isSuperAdmin = hasRole(UserRole.SUPER_ADMIN)

  return { hasRole, hasMinRole, isAdmin, isManager, isSalesExec, isSuperAdmin, role }
}
