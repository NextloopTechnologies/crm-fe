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
import { Bell } from "lucide-react"

export function Navbar() {
  return (
    <header className="h-16 border-b border-gray-800 bg-[#0C142C] text-white flex items-center justify-between px-4">
      
      {/* Left: Search */}
      <div className="w-full max-w-sm">
        <Input
          placeholder="Search..."
          className="bg-[#111A3A] border-none text-white placeholder:text-gray-400 focus-visible:ring-0"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
          <Bell size={18} />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>IS</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 bg-white text-black">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}