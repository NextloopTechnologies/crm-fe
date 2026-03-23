import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login } from '@/api/auth.api'
import { useAuthStore } from '@/stores/auth.store'

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await login(data)
      loginStore(res.token, res.refreshToken, res.user)
      navigate('/dashboard', { replace: true })
      toast.success(`Welcome back, ${res.user.name}!`)
    } catch {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-brand">Nextloop CRM</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
