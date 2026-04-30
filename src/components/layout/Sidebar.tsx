import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, FolderKanban,
  CheckSquare, PieChart, BarChart3, Settings,
  ChevronLeft, ChevronRight, Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui.store'
import { usePermission } from '@/hooks/usePermission'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pipeline', label: 'Pipeline', icon: FolderKanban },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/clients', label: 'Clients', icon: Building2 },
  { to: '/projects', label: 'Projects', icon: Briefcase },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: Users }
]

const ADMIN_NAV = [
  { to: '/settings/users', label: 'Users', icon: PieChart },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleCollapsed } = useUIStore()
  const { isAdmin } = usePermission()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-800 bg-[#0C142C] text-white transition-all duration-300',
        sidebarCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-800 pt-[24px] pb-[10px] px-5">
        {!sidebarCollapsed && (
          <span className="text-lg font-bold text-white">Nextloop CRM</span>
        )}
        <button
          onClick={toggleCollapsed}
          className="rounded-md p-1.5 text-gray-300 hover:bg-gray-800"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-1 px-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-white',
                    isActive
                      ? 'bg-brand-light text-white'
                      : 'hover:bg-gray-800'
                  )
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {!sidebarCollapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}

          {isAdmin && (
            <>
              {!sidebarCollapsed && (
                <li className="px-3 pt-4 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Admin
                  </span>
                </li>
              )}

              {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-white',
                        isActive
                          ? 'bg-brand-light text-white'
                          : 'hover:bg-gray-800'
                      )
                    }
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!sidebarCollapsed && <span>{label}</span>}
                  </NavLink>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>
    </aside>
  )
}