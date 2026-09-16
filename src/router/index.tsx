import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/lib/route'
import { protectedRoutes } from './routes.config'

const LoginPage          = lazy(() => import('@/pages/LoginPage'))
const SignUpPage         = lazy(() => import('@/pages/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPassword'))
const NotFoundPage       = lazy(() => import('@/pages/NotFoundPage'))

const Loading = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
  </div>
)

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
)

const protectedChildren = protectedRoutes.map(({ path, element: Page }) => ({
  path,
  element: <Wrap><Page /></Wrap>,
}))

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN,           element: <Wrap><LoginPage /></Wrap> },
  { path: ROUTES.SIGNUP,         element: <Wrap><SignUpPage /></Wrap> },
  { path: ROUTES.FORGOT_PASSWORD, element: <Wrap><ForgotPasswordPage /></Wrap> },

  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          ...protectedChildren,
        ],
      },
    ],
  },

  { path: '*', element: <Wrap><NotFoundPage /></Wrap> },
])