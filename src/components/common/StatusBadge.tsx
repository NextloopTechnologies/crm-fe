import { cn } from '@/lib/utils'

const colourMap: Record<string, string> = {
  // Lead stages
  LEAD:        'bg-gray-100 text-gray-700',
  QUALIFIED:   'bg-blue-100 text-blue-700',
  PROPOSAL:    'bg-yellow-100 text-yellow-700',
  NEGOTIATION: 'bg-orange-100 text-orange-700',
  CLOSED_WON:  'bg-green-100 text-green-700',
  CLOSED_LOST: 'bg-red-100 text-red-700',
  UNQUALIFIED: 'bg-gray-100 text-gray-500',
  INACTIVE:    'bg-gray-100 text-gray-400',
  // Shared
  ACTIVE:      'bg-green-100 text-green-700',
  PAST:        'bg-slate-100 text-slate-600',
  // Task
  PENDING:     'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED:   'bg-green-100 text-green-700',
  CANCELLED:   'bg-gray-100 text-gray-500',
  // Project
  ON_HOLD:     'bg-yellow-100 text-yellow-700',
}

interface Props {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colourMap[status] ?? 'bg-gray-100 text-gray-600',
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
