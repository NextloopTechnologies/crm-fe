import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./NavBar"
import { useUIStore } from '@/stores/ui.store'
import { cn } from '@/lib/utils'

export function MainLayout() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex">
      <Sidebar />

      <div className={cn(
        "flex-1 flex flex-col bg-white transition-all duration-300",
        sidebarCollapsed ? 'ml-14' : 'ml-48'  // same value
      )}>
        <Navbar />
        <main className="p-4">
          <Outlet />  
        </main>
      </div>
    </div>
  )
}