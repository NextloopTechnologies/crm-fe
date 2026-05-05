import { cn } from '@/lib/utils'

interface Props { className?: string; size?: 'sm' | 'md' | 'lg' }

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

export function LoadingSpinner({ className, size = 'md' }: Props) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-brand border-t-transparent',
          sizes[size]
        )}
      />
    </div>
  )
}
