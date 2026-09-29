import type {
  BenchStatus,
  RequirementStatus,
  StaffingPriority,
  SubmissionOutcome,
  SubmissionStage,
} from '@/types/staffing.types'

type Chip = { bg: string; text: string }

/**
 * Board columns in funnel order.
 *
 * Mirrors SubmissionStage in crm-be. The backend returns every stage on the
 * board response, so this list is for labels and ordering only — never for
 * deciding which columns exist, which would drift the moment a stage is added.
 */
export const STAGE_LABEL: Record<SubmissionStage, string> = {
  SOURCED: 'Sourced',
  HR_SCREENING: 'HR screening',
  HR_SUBMITTED: 'HR submitted',
  SALES_SCREENING: 'Sales screening',
  SUBMITTED_TO_CLIENT: 'Sent to client',
  L1: 'L1',
  L2: 'L2',
  ADDITIONAL_ROUND: 'Extra round',
  FINAL_ROUND: 'Final round',
  SELECTED: 'Selected',
  ONBOARDED: 'Joined',
}

export const STAGE_ORDER: SubmissionStage[] = [
  'SOURCED',
  'HR_SCREENING',
  'HR_SUBMITTED',
  'SALES_SCREENING',
  'SUBMITTED_TO_CLIENT',
  'L1',
  'L2',
  'ADDITIONAL_ROUND',
  'FINAL_ROUND',
  'SELECTED',
  'ONBOARDED',
]

export const OWNER_CHIP: Record<'HR' | 'SALES', Chip> = {
  HR: { bg: 'bg-[#ebebff]', text: 'text-[#5b5bd6]' },
  SALES: { bg: 'bg-[#e6f7ef]', text: 'text-[#0f9d58]' },
}

export const OUTCOME_CHIP: Record<SubmissionOutcome, Chip> = {
  IN_PROGRESS: { bg: 'bg-slate-100', text: 'text-slate-600' },
  REJECTED: { bg: 'bg-rose-100', text: 'text-rose-700' },
  WITHDRAWN: { bg: 'bg-amber-100', text: 'text-amber-700' },
  ON_HOLD: { bg: 'bg-sky-100', text: 'text-sky-700' },
  JOINED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
}

export const REQUIREMENT_STATUS_CHIP: Record<RequirementStatus, Chip> = {
  OPEN: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  ON_HOLD: { bg: 'bg-sky-100', text: 'text-sky-700' },
  FILLED: { bg: 'bg-[#ebebff]', text: 'text-[#5b5bd6]' },
  CANCELLED: { bg: 'bg-rose-100', text: 'text-rose-700' },
  CLOSED: { bg: 'bg-slate-100', text: 'text-slate-600' },
}

export const PRIORITY_CHIP: Record<StaffingPriority, Chip> = {
  LOW: { bg: 'bg-slate-100', text: 'text-slate-600' },
  MEDIUM: { bg: 'bg-sky-100', text: 'text-sky-700' },
  HIGH: { bg: 'bg-amber-100', text: 'text-amber-700' },
  CRITICAL: { bg: 'bg-rose-100', text: 'text-rose-700' },
}

export const BENCH_CHIP: Record<BenchStatus, Chip> = {
  ON_BENCH: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  AVAILABLE_SOON: { bg: 'bg-amber-100', text: 'text-amber-700' },
  DEPLOYED: { bg: 'bg-[#ebebff]', text: 'text-[#5b5bd6]' },
  NOT_AVAILABLE: { bg: 'bg-slate-100', text: 'text-slate-600' },
}

export const NEUTRAL_CHIP: Chip = { bg: 'bg-slate-100', text: 'text-slate-600' }

export const REQUIREMENT_STATUS_OPTIONS = [
  { label: 'Open', value: 'OPEN' },
  { label: 'On hold', value: 'ON_HOLD' },
  { label: 'Filled', value: 'FILLED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Closed', value: 'CLOSED' },
]

export const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' },
]

export const RATE_TYPE_OPTIONS = [
  { label: 'Hourly', value: 'HOURLY' },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Annual', value: 'ANNUAL' },
]

export const WORK_MODE_OPTIONS = [
  { label: 'Onsite', value: 'ONSITE' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'Remote', value: 'REMOTE' },
]

export const ENGAGEMENT_OPTIONS = [
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Contract to hire', value: 'C2H' },
  { label: 'Permanent', value: 'PERMANENT' },
]

export const BENCH_STATUS_OPTIONS = [
  { label: 'On bench', value: 'ON_BENCH' },
  { label: 'Available soon', value: 'AVAILABLE_SOON' },
  { label: 'Deployed', value: 'DEPLOYED' },
  { label: 'Not available', value: 'NOT_AVAILABLE' },
]

export const CANDIDATE_SOURCE_OPTIONS = [
  { label: 'Referral', value: 'REFERRAL' },
  { label: 'Job portal', value: 'JOB_PORTAL' },
  { label: 'Vendor', value: 'VENDOR' },
  { label: 'Inbound', value: 'INBOUND' },
  { label: 'Internal', value: 'INTERNAL' },
]

export const DOCUMENT_VARIANT_OPTIONS = [
  { label: 'Original', value: 'ORIGINAL' },
  { label: 'Formatted', value: 'FORMATTED' },
  { label: 'Masked (safe to send)', value: 'MASKED' },
]

export const VARIANT_CHIP: Record<string, Chip> = {
  ORIGINAL: { bg: 'bg-slate-100', text: 'text-slate-600' },
  FORMATTED: { bg: 'bg-[#ebebff]', text: 'text-[#5b5bd6]' },
  MASKED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
}

export const PERIOD_OPTIONS = [
  { label: 'Today', value: 'DAILY' },
  { label: 'This week', value: 'WEEKLY' },
  { label: 'This month', value: 'MONTHLY' },
  { label: 'This year', value: 'YEARLY' },
]

/** Roles allowed to see client rates and margin. Mirrors StaffingRateVisibility. */
export const canSeeCommercials = (role?: string) =>
  ['SALES', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes((role ?? '').toUpperCase())

export const isHr = (role?: string) => (role ?? '').toUpperCase() === 'HR'

/**
 * Whether a role may move a card INTO a stage.
 *
 * Mirrors StageTransitionPolicy.checkRole on the server. Duplicated here only
 * so the board can dim the columns you cannot use while you are dragging —
 * the server remains the thing that actually enforces it, and a drop on a
 * dimmed column would still be refused with a reason.
 */
export const canDropInto = (role: string | undefined, owner: 'HR' | 'SALES'): boolean => {
  const upper = (role ?? '').toUpperCase()

  // Somebody has to be able to unstick a board at 7pm.
  if (['ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(upper)) return true

  return owner === 'HR' ? upper === 'HR' : upper === 'SALES'
}
