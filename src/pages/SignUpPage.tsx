import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, } from '@/assets/icons/components/index'
import { Button } from '../components/common/Button'
import { Input } from '@/components/common/Input'
import { Checkbox } from '@/components/common/Checkbox'
import pipelines from '../assets/icons/svgs/pipelines.svg'
import user from '../assets/icons/svgs/user.svg'
import growthIcon from '../assets/icons/svgs/growthIcon.svg'
import dashboardImg from '../assets/images/dashboardImg.svg'
import { useSignup } from '@/hooks/useSignup'

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const SignupSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),

    companyName: z.string().min(1, 'Company name is required'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z
        .string()
        .min(6, 'Confirm password is required'),

    consent: z.boolean().refine((val) => val === true, {
        message: 'You must accept terms & conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

type SignUpFormValues = z.infer<typeof SignupSchema>

// ─── Feature list ─────────────────────────────────────────────────────────────
const features = [
    { icon: pipelines, title: 'Track your pipeline', description: 'Visualize every stage of your sales process.' },
    { icon: user, title: 'Manage relationships', description: 'Keep all your contacts and conversations in one place.' },
    { icon: growthIcon, title: 'Grow your business', description: 'Insights and reports to help you make better decisions.' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function SignUpPage() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const { onSubmit: signUpSubmit , isLoading } = useSignup()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(SignupSchema),
        defaultValues: { consent: false },
    })

    const consent = watch('consent')

    const onSubmit = async (data: any) => {
        try {
          // API call here
        } catch (err) {
          console.error(err)
        }
      }
    

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#4734D3] to-[#2E4EDE] p-[80px] overflow-hidden ">
            {/* ── Left Panel ── */}
            <div className="relative hidden flex-1 flex-col bg-transparent gap-8 overflow-hidden lg:flex text-[#FFFFFF]">

                {/* Logo */}
                <div className="flex items-center ">
                    <span className="text-[1.1rem] tracking-[-0.01em]">
                        <span className="font-bold text-[30px] tracking-[-0.01em]">
                            Nextloop
                        </span>{' '}
                        <span className="font-medium text-[26px] tracking-[-0.01em] opacity-[0.85]">
                            CRM
                        </span>
                    </span>
                </div>

                {/* Hero */}
                <div>
                    <h2 className="text-[#FFFFFF] font-semibold text-[clamp(1.3rem,2vw,1.7rem)] leading-[1.25] tracking-[-0.01em] max-w-[460px]">
                        Start building stronger relationships. Close more deals..{' '}
                    </h2>

                    <p className="text-[#FFFFFF] mt-1.5 max-w-[360px] text-[14px] leading-[1.5]">
                        Nextloop CRM helps sales teams track leads, nurture relationships, and win more business.
                    </p>
                </div>

                {/* Features */}
                <ul className="text-[#FFFFFF] flex flex-col gap-[20px]">
                    {features.map(({ icon, title, description }) => (
                        <li key={title} className="flex items-start gap-3.5">

                            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] bg-[#ebebff]">
                                <img src={icon} alt={title} className=" object-contain bg=[#02004E3B]" />
                            </div>

                            <div>
                                <h4 className="text-[#FFFFFF] text-[14px] font-semibold leading-[1.25] tracking-[-0.01em]">
                                    {title}
                                </h4>
                                <p className="text-sm text-[#FFFFFF]">{description}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Dashboard Preview Card */}
                <div className="relative leading-none">
                    <img
                        src={dashboardImg}
                        alt="Dashboard preview"
                        className="block w-full max-w-[450px] h-auto object-contain"
                    />
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center border-[#e4e4ee] bg-[#FFFFFF]  lg:border-l rounded-[10px] ">
                <div className="flex w-full max-w-[380px] px-[20px] py-[40px] flex-col gap-[10px]">

                    {/* Header */}
                    <div >
                        <h2 className="flex items-center gap-1 text-[35px] font-semibold leading-[1.3] tracking-[-0.01em] text-[#111127]">
                            Create your account
                        </h2>
                        <p className="mt-1 text-sm text-[#6b6b8a]">Get started in just a few seconds.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">

                        {/* Full Name */}
                        <Input
                            id="fullName"
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                            error={errors.fullName?.message}
                            disabled={isLoading}
                            {...register('fullName')}
                        />

                        {/* Email */}
                        <Input
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="Enter your email"
                            leftIcon={<MailIcon className="w-4 h-4"/>}
                            error={errors.email?.message}
                            disabled={isLoading}
                            {...register('email')}
                        />

                        {/* Company */}
                        <Input
                            id="companyName"
                            label="Company Name"
                            type="text"
                            placeholder="Enter your company name"
                            error={errors.companyName?.message}
                            disabled={isLoading}
                            {...register('companyName')}
                        />

                        {/* Password */}
                        <Input
                            id="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            leftIcon={<LockIcon className="w-4 h-4"/>}
                            error={errors.password?.message}
                            disabled={isLoading}
                            rightElement={
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((v) => !v)}
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  className="text-[#9898b3] transition-colors hover:text-[#6b6b8a]"
                                >
                                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                              }
                            {...register('password')}
                        />

                        {/* Confirm Password */}
                        <Input
                            id="confirmPassword"
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            leftIcon={<LockIcon className="w-4 h-4"/>}
                            error={errors.confirmPassword?.message}
                            disabled={isLoading}
                            rightElement={
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((v) => !v)}
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                  className="text-[#9898b3] transition-colors hover:text-[#6b6b8a]"
                                >
                                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                              }
                            {...register('confirmPassword')}
                        />

                        {/* Consent */}
                        <div>
                            <Checkbox
                                id="consent"
                                label="I agree to the Terms of Service and Privacy Policy"
                                checked={watch('consent') || false}
                                onCheckedChange={(checked) => setValue('consent', checked)}
                            />
                            {errors.consent && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.consent.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Creating...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                    </form>

                    {/* Sign In */}
                    <p className="text-center text-sm text-[#6b6b8a]">
                        Already have an account? Login{' '}
                        <Link to="/login" className="font-semibold text-[#5b5bd6] transition-colors hover:text-[#4a4ac4]">
                            Log In
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}