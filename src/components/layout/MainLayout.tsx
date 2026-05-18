import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Navbar } from "./NavBar"

export function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-white">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}