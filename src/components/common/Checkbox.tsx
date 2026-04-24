import { forwardRef } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CheckedState } from '@radix-ui/react-checkbox'

// ─── Props ───────────────────────────────────────────────────
interface CustomCheckboxProps {
  id: string
  label?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  labelClassName?: string
}

// ─── Component ───────────────────────────────────────────────
const Checkbox = forwardRef<HTMLButtonElement, CustomCheckboxProps>(
  (
    {
      id,
      label,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      className,
      labelClassName,
    },
    ref
  ) => {
    const handleChange = (state: CheckedState) => {
      onCheckedChange?.(state === true)
    }

    return (
      <div className="flex items-center gap-2">
        
        {/* Checkbox */}
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onCheckedChange={handleChange}
          className={cn(
            // Base
            'h-[18px] w-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all',

            // ✅ Visible border (unchecked)
            'border-[#cfcfe6] bg-white',

            // ✅ Hover
            'hover:border-[#5b5bd6]',

            // ✅ Checked state
            'data-[state=checked]:bg-[#5b5bd6] data-[state=checked]:border-[#5b5bd6]',

            // Focus
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b5bd6] focus-visible:ring-offset-2',

            // Disabled
            disabled && 'cursor-not-allowed opacity-50',

            className
          )}
        >
          {/* ✅ Check Icon */}
          <CheckboxPrimitive.Indicator>
            <Check className="h-[12px] w-[12px] text-white" strokeWidth={3} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {/* Label */}
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              'cursor-pointer select-none text-sm text-[#6b6b8a]',
              disabled && 'cursor-not-allowed opacity-50',
              labelClassName
            )}
          >
            {label}
          </Label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
export type { CustomCheckboxProps }