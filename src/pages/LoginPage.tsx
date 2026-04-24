import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, } from 'lucide-react'

import { Button } from '../components/common/Button'
import { Input } from '@/components/common/Input'
import { Checkbox } from '@/components/common/Checkbox'
import pipelines from '../assets/features/pipelines.svg'
import user from '../assets/features/user.svg'
import followUp from '../assets/features/followUp.svg'
import growthIcon from '../assets/features/growthIcon.svg'
import dashboardImg from '../assets/images/dashboardImg.svg'

import helloIcon from '@/assets/features/helloIcon.svg'
// ─── Zod Schema ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── Feature list ─────────────────────────────────────────────────────────────
const features = [
  { icon: pipelines, title: 'Track your pipeline', description: 'Visualize every stage of your sales process.' },
  { icon: user, title: 'Manage relationships', description: 'Keep all your contacts and conversations in one place.' },
  { icon: followUp, title: 'Automate follow-ups', description: 'Never miss a follow-up with smart reminders.' },
  { icon: growthIcon, title: 'Grow your business', description: 'Insights and reports to help you make better decisions.' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = (data: LoginFormValues) => {
    // TODO: wire up login API + auth store
    console.log('Login submitted:', data)
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#F0F2FD] to-[#E6E4FD] p-[70px] overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="relative hidden flex-1 flex-col bg-transparent gap-8 overflow-hidden lg:flex">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-[1.1rem] tracking-[-0.01em]">
            <span className="font-bold text-[30px] tracking-[-0.01em] text-[#6049CD]">
              Nextloop
            </span>{' '}
            <span className="font-medium text-[30px] tracking-[-0.01em] opacity-[0.85] text-[#111127]">
              CRM
            </span>
          </span>
        </div>

        {/* Hero */}
        <div>
          <h1 className="font-semibold text-[clamp(2rem,3vw,2.5rem)] leading-[1.3] tracking-[-0.01em] text-[#111127] max-w-[533px]">
            Build stronger relationships.{' '}

            <span className="font-bold text-[#111127]">Close</span>{' '}
            <span className="font-bold text-[#5b5bd6]">more deals.</span>
          </h1>

          <p className="mt-3 max-w-[400px] text-[18px] leading-[1.65] text-[#4A4A4A]">
            Nextloop CRM helps sales teams track leads, nurture relationships, and win more business.
          </p>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-[21px]">
          {features.map(({ icon, title, description }) => (
            <li key={title} className="flex items-start gap-3.5">

              <div className="flex h-[41px] w-[41px] items-center justify-center rounded-[8px] bg-[#ebebff]">
                <img src={icon} alt={title} className=" object-contain" />
              </div>

              <div>
                <h4 className="text-[16px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#111127]">
                  {title}
                </h4>
                <p className="text-sm text-[#6b6b8a]">{description}</p>
              </div>

            </li>
          ))}
        </ul>

        {/* Dashboard Preview Card */}
        <div className="relative leading-none">
          <img
            src={dashboardImg}
            alt="Dashboard preview"
            className="block w-full max-w-[606px] h-auto object-contain"
          />

          <div className="pointer-events-none absolute bottom-[-80px] right-[-60px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(91,91,214,0.12),transparent_70%)]" />
          <div className="pointer-events-none absolute right-[10%] top-[40%] h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(124,124,232,0.08),transparent_70%)]" />
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex w-full flex-col items-center justify-center border-[#e4e4ee] bg-[#FFFFFF] px-8 py-10 lg:w-[480px] lg:border-l rounded-[10px]">
        <div className="flex w-full max-w-[380px] flex-col gap-[24px]">

          {/* Header */}
          <div>
            <h2 className="flex items-center gap-2 text-[40px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#111127]">
              Hi,Welcome!
              <img src={helloIcon} alt="hello" className="w-[39px] h-[39px]" />
            </h2>
            <p className="mt-1 text-sm text-[#6b6b8a]">Login to your Nextloop CRM account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

            {/* Email — using Input */}
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              leftIcon={<Mail size={16} strokeWidth={1.75} />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password — using Input with right toggle */}
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<Lock size={16} strokeWidth={1.75} />}
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-[#9898b3] transition-colors hover:text-[#6b6b8a]"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
                </button>
              }
              {...register('password')}
            />

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              {/* Checkbox */}
              <Checkbox className='border-[#dcdcf0] hover:border-[#5b5bd6]'
                id="rememberMe"
                label="Remember me"
                checked={!!rememberMe}
                onCheckedChange={(checked) => setValue('rememberMe', checked)}
              />
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#5b5bd6] transition-colors hover:text-[#4a4ac4]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit — using Button */}
            <Button type="submit" variant="primary" size="lg" fullWidth className="mt-1">
              Login
            </Button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 text-[0.8125rem] text-[#9898b3]">
            <div className="h-px flex-1 bg-[#e4e4ee]" />
            <span>or</span>
            <div className="h-px flex-1 bg-[#e4e4ee]" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-[44px] flex items-center justify-center gap-2 rounded-[30px] border border-[#e4e4ee]  bg-white text-[#111127] text-sm font-medium hover:bg-[#f5f5f5]"
            >
              {/* Google SVG icon */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 h-[44px] flex items-center justify-center gap-2 rounded-[30px] border border-[#e4e4ee] bg-white text-[#111127] text-sm font-medium hover:bg-[#f5f5f5]"
            >
              {/* Facebook SVG icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-[#6b6b8a]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#5b5bd6] transition-colors hover:text-[#4a4ac4]">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}