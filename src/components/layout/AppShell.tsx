import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'
import { Navbar } from './NavBar'
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1220]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300 bg-white',
          sidebarCollapsed ? 'ml-14' : 'ml-48' // ✅ fixed
        )}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Toasts */}
      <Toaster position="top-right"
        toastOptions={{
          style: {
            top: "60px",  // top se niche karo — value apne hisaab se adjust karo
          }
        }} />
    </div>
  )
}