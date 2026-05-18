import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'

// Pages — lazy loaded for performance
import { lazy, Suspense } from 'react'
import ForgotPasswordPage from '@/pages/ForgotPassword'
import EditTenantPage from '@/pages/tenants/EditTenantPage'
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignUpPage = lazy(() => import('@/pages/SignUpPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const LeadsPage = lazy(() => import('@/pages/leads/LeadsPage'))
const ClientsPage = lazy(() => import('@/pages/ClientsPage'))
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'))
const TasksPage = lazy(() => import('@/pages/TasksPage'))
const PipelinePage = lazy(() => import('@/pages/PipelinePage'))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))
const CreateUsersPage = lazy(() => import('@/pages/users/CreateUserPage'))
const EditUsersPage = lazy(() => import('@/pages/users/EditUserPage'))
const UserListPage = lazy(() => import('@/pages/users/UserList'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const LeadsListPage = lazy(() => import('@/pages/leads/LeadsListPage'))
const TenantsListPage = lazy(() => import('@/pages/tenants/TenantsListPage'))
const CreateTenantPage = lazy(() => import('@/pages/tenants/CreateTenantPage'))
const MyProfilePage = lazy(() => import('@/pages/profile/MyProfilePage'))
const EditProfilePage = lazy(() => import('@/pages/profile/EditProfilePage'))
const Loading = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
  </div>
)

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Wrap><LoginPage /></Wrap>,
  },
  {
    path: '/signUp',
    element: <Wrap><SignUpPage /></Wrap>,
  },
  {
    path: '/forgot-password',
    element: <Wrap><ForgotPasswordPage /></Wrap>,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Wrap><DashboardPage /></Wrap> },
          { path: 'leads', element: <Wrap><LeadsListPage /></Wrap> },
          { path: 'leads/add', element: <Wrap><LeadsPage /></Wrap> },
          { path: 'clients', element: <Wrap><ClientsPage /></Wrap> },
          { path: 'projects', element: <Wrap><ProjectsPage /></Wrap> },
          { path: 'tasks', element: <Wrap><TasksPage /></Wrap> },
          { path: 'pipeline', element: <Wrap><PipelinePage /></Wrap> },
          { path: 'reports', element: <Wrap><ReportsPage /></Wrap> },
          { path: 'users/create', element: <Wrap><CreateUsersPage /></Wrap> },
          { path: 'users/:id/edit', element: <Wrap><EditUsersPage /></Wrap> },
          { path: 'users', element: <Wrap><UserListPage /></Wrap> },
          { path: 'settings', element: <Wrap><SettingsPage /></Wrap> },
          { path: 'tenants', element: <Wrap><TenantsListPage /></Wrap> },
          { path: 'tenants/create', element: <Wrap><CreateTenantPage /></Wrap> },
          { path: 'tenants/:id/edit', element: <Wrap><EditTenantPage /></Wrap> },
          { path: 'profile', element: <Wrap><MyProfilePage /></Wrap> },
          { path: 'profile/edit', element: <Wrap><EditProfilePage /></Wrap> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Wrap><NotFoundPage /></Wrap>,
  },
])
