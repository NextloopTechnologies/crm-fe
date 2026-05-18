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
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/tenants', label: 'Tenants', icon: Users },
  { to: '/pipeline', label: 'Pipeline', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/clients', label: 'Clients', icon: Building2 },
  { to: '/projects', label: 'Projects', icon: Briefcase },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  
]

const ADMIN_NAV = [
  { to: '/settings/users', label: 'Users', icon: PieChart },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-[#5752FE] text-white cursor-default hover:bg-[#5752FE] hover:text-white'
      : 'text-black hover:bg-[#f5f4ff] hover:text-[#5752FE]'
  )

export function Sidebar() {
  const { sidebarCollapsed, toggleCollapsed } = useUIStore()
  const { isAdmin } = usePermission()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-to-b from-[#F0F2FD] to-[#E6E4FD] text-black transition-all duration-300',
        sidebarCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between pl-5">
        {!sidebarCollapsed && (
          <span className="text-[1.1rem] tracking-[-0.01em]">
            <span className="font-bold text-[20px] tracking-[-0.01em] text-[#6049CD]">
              Nextloop
            </span>{' '}
            <span className="font-medium text-[20px] tracking-[-0.01em] opacity-[0.85] text-[#111127]">
              CRM
            </span>
          </span>
        )}
        <button
          onClick={toggleCollapsed}
          className="rounded-md p-1.5 text-black hover:bg-[#5752FE] hover:text-white transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto  scrollbar-thin">
        <ul className="space-y-1 px-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} className={navItemClass}>
                <Icon size={18} className="flex-shrink-0" />
                {!sidebarCollapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}

          {isAdmin && (
            <>
              {!sidebarCollapsed && (
                <li className="px-3 pt-4 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-black-400">
                    Admin
                  </span>
                </li>
              )}

              {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink to={to} className={navItemClass}>
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