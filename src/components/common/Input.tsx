import { forwardRef } from 'react'
import { Input as BaseInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'

// ─── Props ───────────────────────────────────────────────
interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightElement?: ReactNode
}

// ─── Component ───────────────────────────────────────────
const Input = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ id, label, error, leftIcon, rightElement, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={id} className="text-sm font-medium text-[#111127]">
            {label}
          </Label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9898b3]">
              {leftIcon}
            </span>
          )}

          <BaseInput
            ref={ref}
            id={id}
            className={cn(
              'h-11 rounded-[10px] border-[1.5px] text-[0.9375rem] text-[#111127] placeholder:text-[#9898b3]',
              'border-[#e4e4ee] focus-visible:border-[#5b5bd6] focus-visible:ring-2 focus-visible:ring-[rgba(91,91,214,0.12)] focus-visible:ring-offset-0',
              error &&
                'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100',
              leftIcon && 'pl-10',
              rightElement && 'pr-10',
              className
            )}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </span>
          )}
        </div>

        {error && (
          <p className="text-[0.8125rem] font-medium text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { CustomInputProps }