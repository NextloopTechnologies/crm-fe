import { forwardRef } from 'react'
import { Button as BaseButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'

// Base props from shadcn button
type BaseButtonProps = ComponentProps<typeof BaseButton>

// ─── Variant map ─────────────────────────────────────────────
const variantClasses = {
  primary:
   // 'bg-[#5b5bd6] text-white hover:bg-[#4a4ac4] hover:shadow-[0_4px_16px_rgba(91,91,214,0.3)] active:scale-[0.98] transition-all',
    'bg-[#5752FE] text-white active:scale-[0.98] transition-all',

  outline:
    'border border-[#e4e4ee] text-[#111127] hover:border-[#cccce0] hover:bg-[#f0f0f7] active:scale-[0.98] transition-all',

  ghost:
    'bg-transparent text-[#6b6b8a] hover:bg-[#f0f0f7] hover:text-[#111127] active:scale-[0.98] transition-all',

  danger:
    'bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_4px_16px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all',
}

// ─── Size map ────────────────────────────────────────────────
const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-11 px-4 text-[0.9375rem]',
  lg: 'h-[46px] px-6 text-[0.9375rem]',
  icon: 'h-9 w-9 p-0',
}

// ─── Action presets ──────────────────────────────────────────
type ActionType = 'save' | 'cancel' | 'create' | 'delete'

const actionPresets: Record<
  ActionType,
  { variant: keyof typeof variantClasses; label: string; loadingLabel: string }
> = {
  save: {
    variant: 'primary',
    label: 'Save',
    loadingLabel: 'Saving...',
  },
  create: {
    variant: 'primary',
    label: 'Create',
    loadingLabel: 'Creating...',
  },
  cancel: {
    variant: 'outline',
    label: 'Cancel',
    loadingLabel: 'Cancel',
  },
  delete: {
    variant: 'danger',
    label: 'Delete',
    loadingLabel: 'Deleting...',
  },
}

// ─── Props ───────────────────────────────────────────────────
interface CustomButtonProps extends Omit<BaseButtonProps, 'variant' | 'size'> {
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  loading?: boolean
  fullWidth?: boolean
  action?: ActionType
  showIcon?: boolean
}

// ─── Component ───────────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      variant,
      size = 'md',
      loading = false,
      fullWidth = false,
      action,
      showIcon = true,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const preset = action ? actionPresets[action] : null

    // priority: manual variant > action preset > default 'primary'
    const resolvedVariant = variant ?? preset?.variant ?? 'primary'

    // priority: children (override) > preset label
    const resolvedChildren = children ?? preset?.label

    const resolvedLoadingLabel = preset?.loadingLabel ?? resolvedChildren

    return (
      <BaseButton
      ref={ref}
      variant={resolvedVariant === "outline" ? "outline" : "ghost"}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[10px] tracking-[0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b5bd6] focus-visible:ring-offset-2',
         variantClasses[resolvedVariant],
         sizeClasses[size],
         fullWidth && 'w-full',
        (disabled || loading) && 'cursor-not-allowed opacity-60',
        className
      )}
      {...props}
    >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{resolvedLoadingLabel}</span>
          </>
        ) : (
          <>
            <span>{resolvedChildren}</span>
          </>
        )}
      </BaseButton>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { CustomButtonProps }