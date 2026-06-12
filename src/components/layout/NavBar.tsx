import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, ChevronDown, User, Settings, LogOut, X, Paperclip, Folder, UserIcon, CheckCircle, Trash2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react";
import { cn } from "@/lib/utils"
import { showToast } from "../common/Toast"
import NotificationSidebar from "../common/NotificationSidebar"
import { logout } from "@/api/auth.api"

// ── Route → label map ────────────────────────────────────────────────────────
const routeMeta: Record<string, { title: string; breadcrumb: string[] }> = {
  "/users": { title: "Users", breadcrumb: ["Manage system users and their access"] },
  "/users/create": { title: "Users", breadcrumb: ["Users", "Create User"] },
  "/users/edit/:id": { title: "Users", breadcrumb: ["Users", "Create User"] },
  "/dashboard": { title: "Dashboard", breadcrumb: ["Dashboard"] },
  "/settings": { title: "Settings", breadcrumb: ["Settings"] },
  "/roles": { title: "Roles", breadcrumb: ["Roles"] },
  "/leads": { title: "Leads", breadcrumb: ["Manage and track all your incoming leads"] },
  "/leads/create": { title: "Leads", breadcrumb: ["Leads", "Add Lead"] },
  "/leads/edit/:id": { title: "Leads", breadcrumb: ["Leads", "Edit Lead"] },
  "/tenants": { title: "Tenants", breadcrumb: ["Manage system tenants and their system"] },
  "/tenants/create": { title: "Tenants", breadcrumb: ["Tenant", "Add Tenant"] },
  "/tenants/:id/edit": { title: "Tenants", breadcrumb: ["Tenant", "Edit Tenant"] },
  "/profile": { title: "Profile", breadcrumb: ["Manage your account settings and preferences"] },
  "/accounts": { title: "Accounts", breadcrumb: ["Manage your customer accounts and related information"] },
  "/accounts/create": { title: "Accounts", breadcrumb: ["Accounts", "Create Account"] },
  "/accounts/edit/:id": { title: "Accounts", breadcrumb: ["Accounts", "Edit Account"] },
  "/tasks/create": { title: "Tasks", breadcrumb: ["Accounts", "Edit Account"] },
  "/tasks/": { title: "Tasks", breadcrumb: ["Manage your customer accounts and related information"] },
  "/tasks/edit/:id": { title: "Tasks", breadcrumb: ["Accounts", "Edit Account"] },
  "/project/create" : {title : "Project" , breadcrumb : ["Projects" , "Create Project"]},
  "/project/edit/:id" : {title : "Project" , breadcrumb : ["Projects" , "Edit Project"]},
  "/projects" : {title : "Project" , breadcrumb : ["Manage your projects and related information"]}

}

// ── Dynamic route matcher ─────────────────────────────────────────────────────
const getRouteMeta = (pathname: string) => {
  if (routeMeta[pathname]) return routeMeta[pathname];
  for (const pattern in routeMeta) {
    const regex = new RegExp("^" + pattern.replace(/:[^\s/]+/g, "[^/]+") + "$");
    if (regex.test(pathname)) return routeMeta[pattern];
  }
  return null;
};

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [openLogout, setOpenLogout] = useState(false);
  const [showWriteToUs, setShowWriteToUs] = useState(false);
  const [showAccountSub, setShowAccountSub] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleLogout = () => {
   const response = logout();
    localStorage.clear();
     navigate("/login");
  };

  const handleSend = () => {
    // handle send logic here
    setSubject("");
    setMessage("");

    showToast({
      title: "Message Submitted",
      description: "We've received your message and will get back to you shortly.",
      type: "success",
      icon: <CheckCircle size={22} color="#0BD901" />,
    });
  };

  const meta = getRouteMeta(location.pathname) ?? {
    title: "Page",
    breadcrumb: [location.pathname.replace("/", "")],
  }

  return (
    <>
      <header className="h-14 border-b border-[#EEEEEE] bg-white flex items-center justify-between px-6">

        {/* ── Left: Page title ── */}
        <div className="flex flex-col justify-center min-w-[140px]">
          <h1 className="text-xl font-semibold text-black leading-tight">
            {meta.title}
          </h1>
        </div>

        {/* ── Right: Search + Bell + User ── */}
        <div className="flex items-center gap-3">

          {/* Search */}
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

          {/* Notification bell */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-gray-500 hover:bg-gray-100 relative"
            onClick={() => setShowNotification(true)}

          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </Button>

          <NotificationSidebar
            open={showNotification}
            onClose={() => setShowNotification(false)}
          />

          {/* ── User Dropdown ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 focus:outline-none group">
                <Avatar className="h-8 w-8 ring-2 ring-gray-100">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-xs font-semibold bg-blue-50 text-blue-600">
                    IS
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[13px] font-semibold text-gray-800">Ishaan S.</span>
                  <span className="text-[12px] text-gray-400">Super Admin</span>
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
              className="w-56 bg-white shadow-md py-2 px-4 rounded-none"
            >
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <Avatar className="h-9 w-9 ring-2 ring-gray-100 flex-shrink-0">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-xs font-semibold bg-blue-50 text-blue-600">
                    IS
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[12px] font-semibold text-gray-800 truncate">Ishaan S.</span>
                  <span className="text-[12px] text-gray-400 truncate">Super Admin</span>
                </div>
              </div>

              <DropdownMenuSeparator className="my-1 bg-gray-200" />

              <DropdownMenuItem
                className="flex items-center gap-2.5 text-xs text-gray-700 rounded-md cursor-pointer focus:bg-gray-50 px-3 py-2"
                onClick={() => navigate("/profile")}
              >
                <User size={13} className="text-black" />
                My Profile
              </DropdownMenuItem>

              <div className="relative">
                <DropdownMenuItem
                  className="flex items-center justify-between text-xs text-gray-700 rounded-md cursor-pointer focus:bg-[#5752FE]/10 focus:text-[#5752FE] px-3 py-2"
                  onSelect={(e) => {
                    e.preventDefault(); // dropdown close na ho
                    setShowAccountSub((prev) => !prev);
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings size={13} className="text-black" />
                    Account Settings
                  </div>
                  <ChevronDown
                    size={12}
                    className={`text-gray-400 transition-transform duration-200 ${showAccountSub ? "rotate-180" : ""}`}
                  />
                </DropdownMenuItem>

                {/* Sub items — neeche slide karo */}
                {showAccountSub && (
                  <div className=" mb-1 overflow-hidden rounded-[6px]">
                    <button
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-[#5752FE]/10 hover:text-[#5752FE]"
                      onClick={() => navigate("/profile/account-info")}
                    >
                      <User size={12} className="text-gray-500" />
                      Account Information
                    </button>

                    <div className="mx-3 h-[0.5px] bg-gray-200" />

                    <button
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                      onClick={() => {navigate("/profile/delete") }}
                    >
                      <Trash2 size={12} className="text-red-400" />
                      Delete Account
                    </button>
                  </div>
                )}
              </div>

              {/* <DropdownMenuItem
                className="flex items-center gap-2.5 text-xs text-gray-700 rounded-md cursor-pointer focus:bg-gray-50 px-3 py-2"
                onClick={() => navigate("/settings")}
              >
                <Settings size={13} className="text-black" />
                Preferences
              </DropdownMenuItem> */}

              <DropdownMenuSeparator className="my-1 bg-gray-200" />

              {/* Write to Us */}
              <DropdownMenuItem
                className="flex items-center gap-2.5 text-xs text-gray-700 rounded-md cursor-pointer focus:bg-gray-50 px-3 py-2"
                onClick={() => setShowWriteToUs(true)}
              >
                <Settings size={13} className="text-black" />
                Write to Us
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2.5 text-xs text-red-500 rounded-md cursor-pointer focus:bg-red-50 focus:text-red-600 px-3 py-2"
                onClick={() => handleLogout() }
              >
                <LogOut size={13} className="text-black" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── Write to Us Sidebar ── */}

      {/* Overlay */}
      {showWriteToUs && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setShowWriteToUs(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed top-14 right-0 h-[calc(100vh-56px)] w-80 bg-white border-l border-[#EEEEEE] shadow-xl z-50 transition-transform duration-300 flex flex-col",
          showWriteToUs ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center px-4 py-3 bg-[#5752FE]">
          <button
            onClick={() => setShowWriteToUs(false)}
            className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-white/20 text-white"
          >
            <X size={17} />
          </button>
          <h2 className="text-sm px-2 text-white font-medium">Write To Us</h2>
        </div>

        {/* User Info Banner */}
        <div className="flex items-center gap-3 px-4 py-4 bg-[#5752FE1A] border-b border-[#EEEEEE]">
          <div className="h-12 w-12 -mt-1 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <UserIcon size={24} className="text-[#5752FE]" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-gray-700">
              Hello, <span className="font-semibold text-gray-900">John</span>
            </p>
            <p className="text-xs text-gray-500">Please share your feedback, comments, issues or any questions here</p>
          </div>
        </div>

        {/* Sidebar Body */}
        <div className="flex flex-col gap-4 p-5 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <Input
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-9 text-sm rounded-[8px] border-[#e4e4ee] focus-visible:ring-1 focus-visible:ring-[#5752FE]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Please leave your comments here"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-sm border border-[#e4e4ee] rounded-[8px] px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#5752FE] text-gray-700 placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Attachment</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-[#e4e4ee] rounded-[8px] cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              />
              {attachment ? (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Paperclip size={13} className="text-[#5752FE]" />
                  <span className="truncate max-w-[200px]">{attachment.name}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); setAttachment(null); }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400 p-5">
                  <Folder size={16} color="black" />
                  <span className="text-[10px]">Drag & Drop your file</span>
                  <span className="text-[10px] text-[#5752FE]">Click to browser</span>
                  <span className="text-[10px]">Max file size: 10 MB (PNG, JPG, PDF, DOCX)</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="flex items-center gap-3 px-5 py-4">
          <Button
            variant="outline"
            className="flex-1 h-9 rounded-[10px] border-[#e4e4ee] text-gray-500 text-sm"
            onClick={() => {
              setSubject("");
              setMessage("");
              setShowWriteToUs(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-9 rounded-[10px] bg-[#5752FE] hover:bg-[#4a45e0] text-white text-sm font-medium"
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  )
}