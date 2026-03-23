import { Bell, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useNotifications } from '@/features/notifications/useNotifications'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { user, logout } = useAuthStore()
  const { data: notifications } = useNotifications()

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Page title slot — filled by each page via document.title */}
      <div className="text-sm text-gray-500">
        Welcome back, <span className="font-medium text-gray-900">{user?.name}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {/* Role badge */}
          <span className={cn(
            'hidden rounded px-1.5 py-0.5 text-[10px] font-semibold sm:block',
            'bg-brand-light text-brand'
          )}>
            {user?.role?.replace('_', ' ')}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
