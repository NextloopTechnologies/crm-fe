// router/routes.config.tsx
import { lazy } from "react"
import { ROUTES } from "@/lib/route"
import {
  LayoutDashboard, Users, Briefcase,
  Settings, Building2, CheckSquare,
  BarChart2, UserCircle,
  FolderKanban, KanbanSquare,
} from "lucide-react"

// ─── Lazy Imports ────────────────────────────────────────────
const DashboardPage     = lazy(() => import('@/pages/dashboard/DashboardRouter'))
const LeadsListPage     = lazy(() => import('@/pages/leads/LeadPage'))
const LeadsPage         = lazy(() => import('@/pages/leads/LeadsPage'))
const EditLeadPage      = lazy(() => import('@/pages/leads/EditLeadPage'))
const LeadDetailPage      = lazy(() => import('@/pages/leads/LeadDetailPage'))
const CreateProjectPage      = lazy(() => import('@/pages/project/CreateProjectPage'))
const ProjectsPage      = lazy(() => import('@/pages/project/ProjectListPage'))
const EditProjectPage      = lazy(() => import('@/pages/project/EditProjectPage'))
const PipelinePage      = lazy(() => import('@/pages/PipelinePage'))
const UserListPage      = lazy(() => import('@/pages/users/UserList'))
const CreateUsersPage   = lazy(() => import('@/pages/users/CreateUserPage'))
const EditUsersPage     = lazy(() => import('@/pages/users/EditUserPage'))
const TenantsListPage   = lazy(() => import('@/pages/tenants/TenantsListPage'))
const CreateTenantPage  = lazy(() => import('@/pages/tenants/CreateTenantPage'))
const EditTenantPage    = lazy(() => import('@/pages/tenants/EditTenantPage'))
const AccountListPage   = lazy(() => import('@/pages/accounts/AccountListPage'))
const AccountDetailPage   = lazy(() => import('@/pages/accounts/AccountDetailPage'))
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
const InvoicePage      = lazy(() => import('@/pages/accounts/invoices/AccountInvoiceTab'))
const CreateInvoicePage      = lazy(() => import('@/pages/accounts/invoices/CreateInvoicePage'))
const EditInvoicePage      = lazy(() => import('@/pages/accounts/invoices/EditInvoicePage'))


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
  { path: 'leads/create',         element: LeadsPage },
  { path: 'leads/edit/:id',    element: EditLeadPage },
  { path: 'leads/detail/:id',    element: LeadDetailPage },

  {
    path: ROUTES.PROJECT,
    element: ProjectsPage,
    sidebar: { label: "Projects", icon: FolderKanban, group: "main" },
  },
    { path: 'project/create',         element: CreateProjectPage },
    { path: 'project/edit/:id',         element: EditProjectPage },


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
  { path: 'users/edit/:email',    element: EditUsersPage },
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
  { path: 'accounts/detail/:id',    element: AccountDetailPage },

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

  { path : ROUTES.INVOICE , element: InvoicePage},
  { path: ROUTES.INVOICE_CREATE, element: CreateInvoicePage },
  { path: "invoice/edit/:id", element: EditInvoicePage },


]

// ─── Helper — sidebar ke liye filter ─────────────────────────
export const getSidebarRoutes = (group?: SidebarGroup) =>
  protectedRoutes.filter(r =>
    r.sidebar && (group ? r.sidebar.group === group : true)
  )