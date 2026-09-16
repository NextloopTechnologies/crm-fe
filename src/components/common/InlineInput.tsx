// InlineInput.tsx
import { forwardRef } from 'react'
import { Input as BaseInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string
    label?: string
    error?: string
}

const InlineInput = forwardRef<HTMLInputElement, InlineInputProps>(
    ({ id, label, error, className, ...props }, ref) => {
        return (
            <div className="flex flex-col">
                <div className="flex items-center gap-1">
                    {label && (
                        <Label
                            htmlFor={id}
                            className="w-20 shrink-0 text-sm font-medium text-[#111127]"
                        >
                            {label}
                        </Label>
                    )}
                    <BaseInput
                        ref={ref}
                        id={id}
                        className={cn(
                            'h-10 w-80 rounded-[10px] border-[1.5px] text-[0.9375rem]',
                            'text-[#111127] placeholder:text-[#9898b3]',
                            'border-[#e4e4ee] focus-visible:border-[#5b5bd6]',
                            'focus-visible:ring-2 focus-visible:ring-[rgba(91,91,214,0.12)] focus-visible:ring-offset-0',
                            error && 'border-red-500',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-[0.8125rem] font-medium text-red-500 pl-28">{error}</p>
                )}
            </div>
        )
    }
)

InlineInput.displayName = 'InlineInput'
export { InlineInput }