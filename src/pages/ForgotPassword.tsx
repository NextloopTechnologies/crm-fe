import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { MailIcon } from '@/assets/icons/components/index'
import { Button } from '../components/common/Button'
import { Input } from '@/components/common/Input'
import { showToast } from '@/components/common/Toast'
import { requestPasswordReset, resetPassword } from '@/api/auth.api'
import { apiErrorMessage } from '@/types/staffing.types'
import pipelines from '../assets/icons/svgs/pipelines.svg'
import user from '../assets/icons/svgs/user.svg'
import growthIcon from '../assets/icons/svgs/growthIcon.svg'
import dashboardImg from '../assets/images/dashboardImg.svg'

// ─── Zod Schemas ──────────────────────────────────────────────────────────────
const forgotSchema = z.object({
    email: z
        .string()
        .min(1, 'Email or Phone is required')
        .min(3, 'Please enter a valid email or phone'),
})

// Mirrors the server's rule, so a password it will refuse is caught here
// rather than after a round trip that burns the token attempt.
const resetSchema = z
    .object({
        token: z.string().min(1, 'Reset code is required'),
        newPassword: z
            .string()
            .min(8, 'Use between 8 and 20 characters')
            .max(20, 'Use between 8 and 20 characters')
            .regex(/[A-Z]/, 'Include an uppercase letter')
            .regex(/[a-z]/, 'Include a lowercase letter')
            .regex(/[0-9]/, 'Include a number')
            .regex(/[^A-Za-z0-9]/, 'Include a special character'),
        confirmNewPassword: z.string().min(1, 'Confirm your new password'),
    })
    .refine((v) => v.newPassword === v.confirmNewPassword, {
        message: 'Passwords don’t match',
        path: ['confirmNewPassword'],
    })

type ForgotFormValues = z.infer<typeof forgotSchema>
type ResetFormValues = z.infer<typeof resetSchema>

// ─── Feature list ─────────────────────────────────────────────────────────────
const features = [
    { icon: pipelines, title: 'Track your pipeline', description: 'Visualize every stage of your sales process.' },
    { icon: user, title: 'Manage relationships', description: 'Keep all your contacts and conversations in one place.' },
    { icon: growthIcon, title: 'Grow your business', description: 'Insights and reports to help you make better decisions.' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
    const navigate = useNavigate()

    // Two steps rather than one screen: the server will not take a new
    // password from someone who has not yet proved they can read the account's
    // mail, so there is nothing to collect until a code is in hand.
    const [step, setStep] = useState<'request' | 'reset'>('request')
    const [sentTo, setSentTo] = useState('')

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
    })

    const resetForm = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
    })

    const request = useMutation({
        mutationFn: (identifier: string) => requestPasswordReset(identifier),
        onSuccess: (res) => {
            // The server answers the same way for an unknown account, so this
            // deliberately does not claim the address was found.
            showToast({
                title: 'Check for your reset code',
                description: res?.description ?? '',
                type: 'success',
            })
            setSentTo(getValues('email'))
            setStep('reset')
        },
        onError: (err: unknown) =>
            showToast({ title: 'Could not send a code', description: apiErrorMessage(err), type: 'error' }),
    })

    const complete = useMutation({
        mutationFn: (v: ResetFormValues) => resetPassword(v.token, v.newPassword, v.confirmNewPassword),
        onSuccess: (res) => {
            if (res?.status === 'Success' || res?.code === '0x0200') {
                showToast({ title: 'Password changed', description: res?.description ?? '', type: 'success' })
                navigate('/login')
            } else {
                showToast({ title: 'Not changed', description: res?.description ?? '', type: 'error' })
            }
        },
        onError: (err: unknown) =>
            showToast({ title: 'Not changed', description: apiErrorMessage(err), type: 'error' }),
    })

    const isLoading = request.isPending || complete.isPending

    const onSubmit = (values: ForgotFormValues) => request.mutate(values.email)

    return (
        <div className="flex min-h-screen bg-gradient-to-b from-[#F0F2FD] to-[#E6E4FD] p-[80px] overflow-hidden">

            {/* ── Left Panel ── */}
            <div className="relative hidden flex-1 flex-col bg-transparent gap-3 overflow-hidden lg:flex">

                {/* Logo */}
                <div className="flex items-center">
                    <span className="text-[1.1rem] tracking-[-0.01em]">
                        <span className="font-bold text-[30px] tracking-[-0.01em] text-[#6049CD]">
                            Nextloop
                        </span>{' '}
                        <span className="font-medium text-[26px] tracking-[-0.01em] opacity-[0.85] text-[#111127]">
                            CRM
                        </span>
                    </span>
                </div>

                {/* Hero */}
                <div>
                    <h2 className="font-semibold text-[clamp(1.3rem,2vw,1.7rem)] leading-[1.25] tracking-[-0.01em] text-[#111127] max-w-[460px]">
                        Build stronger relationships.{' '}
                        <span className="font-bold text-[#111127]">Close</span>{' '}
                        <span className="font-bold text-[#5b5bd6]">more deals.</span>
                    </h2>
                    <p className="mt-1.5 max-w-[360px] text-[14px] leading-[1.5] text-[#4A4A4A]">
                        Nextloop CRM helps sales teams track leads, nurture relationships, and win more business.
                    </p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-[12px]">
                    {features.map(({ icon, title, description }) => (
                        <li key={title} className="flex items-start gap-3.5">
                            <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] bg-[#ebebff]">
                                <img src={icon} alt={title} className="object-contain" />
                            </div>
                            <div>
                                <h4 className="text-[14px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#111127]">
                                    {title}
                                </h4>
                                <p className="text-sm text-[#6b6b8a]">{description}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Dashboard Preview */}
                <div className="relative leading-none">
                    <img
                        src={dashboardImg}
                        alt="Dashboard preview"
                        className="block w-full max-w-[450px] h-auto object-contain"
                    />
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="flex flex-1 flex-col items-center justify-center border-[#e4e4ee] bg-[#FFFFFF] lg:border-l rounded-[10px]">
                <div className="flex w-full max-w-[380px] p-[10px] flex-col gap-[32px]">

                    {/* Back to login */}
                    <Link
                        to="/login"
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#111127] hover:text-[#5b5bd6] transition-colors w-fit"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Back to login
                    </Link>

                    {/* Header */}
                    <div>
                        <h2 className="text-[36px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#000000]">
                            {step === 'request' ? 'Forgot password?' : 'Enter your code'}
                        </h2>
                        <p className="mt-2 text-sm leading-[1.6] text-[#6b6b8a]">
                            {step === 'request' ? (
                                "No worries. Enter your email, phone or username and we'll send a reset code."
                            ) : (
                                <>
                                    If an account matches <span className="font-medium text-[#111127]">{sentTo}</span>, a
                                    reset code is on its way. It is good for 30 minutes and can be used once.
                                </>
                            )}
                        </p>
                    </div>

                    {/* Form */}
                    {step === 'request' ? (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

                            <Input
                                id="email"
                                label="Email / Phone*"
                                type="text"
                                placeholder="Enter Email / Phone*"
                                autoComplete="username"
                                leftIcon={<MailIcon className="w-4 h-4" />}
                                error={errors.email?.message}
                                disabled={isLoading}
                                {...register('email')}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                className="mt-1"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending code...' : 'Send reset code'}
                            </Button>

                        </form>
                    ) : (
                        <form
                            onSubmit={resetForm.handleSubmit((v) => complete.mutate(v))}
                            noValidate
                            className="flex flex-col gap-4"
                        >

                            <Input
                                id="token"
                                label="Reset code*"
                                type="text"
                                placeholder="Paste the code you were sent"
                                autoComplete="one-time-code"
                                error={resetForm.formState.errors.token?.message}
                                disabled={isLoading}
                                {...resetForm.register('token')}
                            />

                            <Input
                                id="newPassword"
                                label="New password*"
                                type="password"
                                placeholder="Enter a new password"
                                autoComplete="new-password"
                                error={resetForm.formState.errors.newPassword?.message}
                                disabled={isLoading}
                                {...resetForm.register('newPassword')}
                            />

                            <Input
                                id="confirmNewPassword"
                                label="Confirm new password*"
                                type="password"
                                placeholder="Enter it again"
                                autoComplete="new-password"
                                error={resetForm.formState.errors.confirmNewPassword?.message}
                                disabled={isLoading}
                                {...resetForm.register('confirmNewPassword')}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                className="mt-1"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Changing password...' : 'Change password'}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('request')}
                                className="text-sm text-[#6b6b8a] hover:text-[#5b5bd6] transition-colors"
                            >
                                Didn't get a code? Try again
                            </button>

                        </form>
                    )}

                    {/* Footer */}
                    <p className="text-center text-sm text-[#6b6b8a]">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-[#5b5bd6] transition-colors hover:text-[#4a4ac4]"
                        >
                            Back to login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}