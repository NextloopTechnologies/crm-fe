import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, ChevronRight } from "lucide-react"
import { useLocation } from "react-router-dom" // or next/router if using Next.js

// ── Route → label map ─────────────────────────────────────────────────────────
const routeMeta: Record<string, { title: string; breadcrumb: string[] }> = {
  "/users": { title: "Users", breadcrumb: ["Manage system users and their access"] },
  "/users/create": { title: "Create User", breadcrumb: ["Users", "Create User"] },
  "/users/:id/edit": { title: "Edit User", breadcrumb: ["Users", "Edit User"] },
  "/dashboard": { title: "Dashboard", breadcrumb: ["Dashboard"] },
  "/settings": { title: "Settings", breadcrumb: ["Settings"] },
  "/roles": { title: "Roles", breadcrumb: ["Roles"] },
  "/leads": { title: "Leads", breadcrumb: ["Manage and track all your incoming leads"] },
  "/leads/add": { title: "Add Lead", breadcrumb: ["Leads", "Add Lead"] },
  "/tenants": { title: "Tenants", breadcrumb: ["Manage system tenants and their system"] },

}

export function Navbar() {
  const location = useLocation()
  const meta = routeMeta[location.pathname] ?? {
    title: "Page",
    breadcrumb: [location.pathname.replace("/", "")],
  }

  return (
    <header className="h-16 border-b border-[#EEEEEE] bg-white flex items-center justify-between px-6">

      {/* ── Left: Page title + Breadcrumb ── */}
      <div className="flex flex-col justify-center min-w-[140px]">
        <h1 className="text-lg font-semibold text-black leading-tight">
          {meta.title}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          {meta.breadcrumb.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight size={11} className="text-gray-400" />
              )}
              <span
                className={
                  idx === meta.breadcrumb.length - 1
                    ? "text-[11px] text-gray-500 font-medium"
                    : "text-[11px] text-gray-400"
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Right: Search + Bell + User ── */}
      <div className="flex items-center gap-3">

        {/* Search — icon on the right */}
        <div className="relative">
          <Input
            placeholder="Search here..."
            className="w-56 h-9 pl-3 pr-9 text-sm text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-lg bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-gray-300"
          />
          <Search
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5752FE]"
          />
        </div>

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 relative"
        >
          <Bell size={17} />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 focus:outline-none group">
              <Avatar className="h-8 w-8 rounded-full ring-2 ring-gray-100">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="text-xs font-semibold bg-blue-50 text-blue-600">
                  IS
                </AvatarFallback>
              </Avatar>

              {/* Name + Role */}
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[13px] font-semibold text-gray-800">
                  Ishaan S.
                </span>
                <span className="text-[11px] text-gray-400">
                  Admin
                </span>
              </div>

              <ChevronDown
                size={14}
                className="text-gray-400 group-data-[state=open]:rotate-180 transition-transform duration-200"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-48 rounded-lg border border-gray-100 bg-white shadow-md p-1"
          >
            <DropdownMenuItem className="text-sm text-gray-700 rounded-md cursor-pointer focus:bg-gray-50">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-gray-700 rounded-md cursor-pointer focus:bg-gray-50">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-gray-100" />
            <DropdownMenuItem className="text-sm text-red-500 rounded-md cursor-pointer focus:bg-red-50 focus:text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}