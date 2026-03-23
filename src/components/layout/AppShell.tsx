import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Global toast notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
