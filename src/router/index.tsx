import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'

// Pages — lazy loaded for performance
import { lazy, Suspense } from 'react'
const LoginPage       = lazy(() => import('@/pages/LoginPage'))
const DashboardPage   = lazy(() => import('@/pages/DashboardPage'))
const LeadsPage       = lazy(() => import('@/pages/LeadsPage'))
const LeadDetailPage  = lazy(() => import('@/pages/LeadDetailPage'))
const ClientsPage     = lazy(() => import('@/pages/ClientsPage'))
const ProjectsPage    = lazy(() => import('@/pages/ProjectsPage'))
const TasksPage       = lazy(() => import('@/pages/TasksPage'))
const PipelinePage    = lazy(() => import('@/pages/PipelinePage'))
const ReportsPage     = lazy(() => import('@/pages/ReportsPage'))
const UsersPage       = lazy(() => import('@/pages/UsersPage'))
const SettingsPage    = lazy(() => import('@/pages/SettingsPage'))
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'))

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
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true,               element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard',         element: <Wrap><DashboardPage /></Wrap> },
          { path: 'leads',             element: <Wrap><LeadsPage /></Wrap> },
          { path: 'leads/:id',         element: <Wrap><LeadDetailPage /></Wrap> },
          { path: 'clients',           element: <Wrap><ClientsPage /></Wrap> },
          { path: 'projects',          element: <Wrap><ProjectsPage /></Wrap> },
          { path: 'tasks',             element: <Wrap><TasksPage /></Wrap> },
          { path: 'pipeline',          element: <Wrap><PipelinePage /></Wrap> },
          { path: 'reports',           element: <Wrap><ReportsPage /></Wrap> },
          { path: 'settings/users',    element: <Wrap><UsersPage /></Wrap> },
          { path: 'settings',          element: <Wrap><SettingsPage /></Wrap> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Wrap><NotFoundPage /></Wrap>,
  },
])
