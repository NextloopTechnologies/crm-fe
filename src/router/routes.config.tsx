// router/routes.config.tsx
import { lazy } from "react"
import { ROUTES } from "@/lib/route"
import {
  LayoutDashboard, Users, Briefcase,
  Settings, Building2, CheckSquare,
  BarChart2, UserCircle, BookUser,
  FolderKanban, KanbanSquare,
} from "lucide-react"

// ─── Lazy Imports ────────────────────────────────────────────
const DashboardPage     = lazy(() => import('@/pages/dashboard/DashboardRouter'))
const LeadsListPage     = lazy(() => import('@/pages/leads/LeadsListPage'))
const LeadsPage         = lazy(() => import('@/pages/leads/LeadsPage'))
const EditLeadPage      = lazy(() => import('@/pages/leads/EditLeadPage'))
const ProjectsPage      = lazy(() => import('@/pages/ProjectsPage'))
const PipelinePage      = lazy(() => import('@/pages/PipelinePage'))
const UserListPage      = lazy(() => import('@/pages/users/UserList'))
const CreateUsersPage   = lazy(() => import('@/pages/users/CreateUserPage'))
const EditUsersPage     = lazy(() => import('@/pages/users/EditUserPage'))
const TenantsListPage   = lazy(() => import('@/pages/tenants/TenantsListPage'))
const CreateTenantPage  = lazy(() => import('@/pages/tenants/CreateTenantPage'))
const EditTenantPage    = lazy(() => import('@/pages/tenants/EditTenantPage'))
const AccountListPage   = lazy(() => import('@/pages/accounts/AccountListPage'))
const CreateAccountPage = lazy(() => import('@/pages/accounts/CreateAccountPage'))
const EditAccountPage   = lazy(() => import('@/pages/accounts/EditAccountPage'))
const TaskListPage      = lazy(() => import('@/pages/tasks/TaskListPage'))
const CreateTaskPage    = lazy(() => import('@/pages/tasks/CreateTaskPage'))
const EditTaskPage      = lazy(() => import('@/pages/tasks/EditTaskPage'))
const ReportListPage    = lazy(() => import('@/pages/report/ReportListPage'))
const CreateReportPage  = lazy(() => import('@/pages/report/CreateReportPage'))
const EditReportPage    = lazy(() => import('@/pages/report/EditReportPage'))
const MyProfilePage     = lazy(() => import('@/pages/profile/MyProfilePage'))
const EditProfilePage   = lazy(() => import('@/pages/profile/EditProfilePage'))
const SettingsPage      = lazy(() => import('@/pages/SettingsPage'))
const DeleteAccountPage      = lazy(() => import('@/pages/profile/DeleteAccountPage'))
const AccountInformationPage = lazy(() => import('@/pages/profile/AccountInformationPage'))

// ─── Types ───────────────────────────────────────────────────
export type SidebarGroup = "main" | "management" | "settings"

export interface RouteConfig {
  path: string
  element: React.LazyExoticComponent<any>
  sidebar?: {
    label: string
    icon: React.ElementType
    group: SidebarGroup
  }
}

// ─── Protected Routes ────────────────────────────────────────
export const protectedRoutes: RouteConfig[] = [

  // ── Main ─────────────────────────────────────────────────
  {
    path: ROUTES.DASHBOARD,
    element: DashboardPage,
    sidebar: { label: "Dashboard", icon: LayoutDashboard, group: "main" },
  },
  {
    path: ROUTES.LEADS,
    element: LeadsListPage,
    sidebar: { label: "Leads", icon: Briefcase, group: "main" },
  },
  { path: 'leads/add',         element: LeadsPage },
  { path: 'leads/edit/:id',    element: EditLeadPage },
  {
    path: ROUTES.PROJECT,
    element: ProjectsPage,
    sidebar: { label: "Projects", icon: FolderKanban, group: "main" },
  },
  {
    path: ROUTES.PIPELINE,
    element: PipelinePage,
    sidebar: { label: "Pipeline", icon: KanbanSquare, group: "main" },
  },
  {
    path: ROUTES.TASKS,
    element: TaskListPage,
    sidebar: { label: "Tasks", icon: CheckSquare, group: "main" },
  },
  { path: ROUTES.TASKS_CREATE, element: CreateTaskPage },
  { path: 'tasks/edit/:id',    element: EditTaskPage },
  {
    path: ROUTES.REPORTS,
    element: ReportListPage,
    sidebar: { label: "Reports", icon: BarChart2, group: "main" },
  },
  { path: ROUTES.REPORTS_CREATE, element: CreateReportPage },
  { path: 'reports/:id/edit',    element: EditReportPage },

  // ── Management ───────────────────────────────────────────
  {
    path: ROUTES.USERS,
    element: UserListPage,
    sidebar: { label: "Users", icon: Users, group: "management" },
  },
  { path: ROUTES.USERS_CREATE, element: CreateUsersPage },
  { path: 'users/:id/edit',    element: EditUsersPage },
  {
    path: ROUTES.TENANTS,
    element: TenantsListPage,
    sidebar: { label: "Tenants", icon: Building2, group: "management" },
  },
  { path: ROUTES.TENANTS_CREATE, element: CreateTenantPage },
  { path: 'tenants/:id/edit',    element: EditTenantPage },
  {
    path: ROUTES.ACCOUNTS,
    element: AccountListPage,
    sidebar: { label: "Accounts", icon: UserCircle, group: "management" },
  },
  { path: ROUTES.ACCOUNTS_CREATE, element: CreateAccountPage },
  { path: 'accounts/edit/:id',    element: EditAccountPage },

  // ── Profile & Settings ───────────────────────────────────
  { path: ROUTES.PROFILE,      element: MyProfilePage },
  { path: ROUTES.PROFILE_EDIT, element: EditProfilePage },
  { path: ROUTES.DELETE_ACCOUNT_PAGE, element: DeleteAccountPage },
  { path: ROUTES.ACCOUNT_INFORMATION_PAGE, element: AccountInformationPage },

  {
    path: ROUTES.SETTINGS,
    element: SettingsPage,
    sidebar: { label: "Settings", icon: Settings, group: "settings" },
  },
]

// ─── Helper — sidebar ke liye filter ─────────────────────────
export const getSidebarRoutes = (group?: SidebarGroup) =>
  protectedRoutes.filter(r =>
    r.sidebar && (group ? r.sidebar.group === group : true)
  )