/** Mirrors the constant classes in crm-be's staffing module. */

/**
 * The shape every endpoint answers with.
 *
 * Note a refused business rule arrives as HTTP 200 with a failure `code` and
 * the reason in `description` — not as an error — so callers have to read the
 * body rather than trusting the status.
 */
export interface ApiEnvelope<T = unknown> {
  code?: string
  status?: string
  description?: string
  data?: T
  /** Advisory, not a refusal. Currently only on submission create. */
  warning?: string
}

/** Narrows an axios rejection down to the server's own message. */
export function apiErrorMessage(error: unknown, fallback = 'Please try again.'): string {
  const response = (error as { response?: { data?: ApiEnvelope } })?.response
  return response?.data?.description ?? fallback
}

export type SubmissionStage =
  | 'SOURCED'
  | 'HR_SCREENING'
  | 'HR_SUBMITTED'
  | 'SALES_SCREENING'
  | 'SUBMITTED_TO_CLIENT'
  | 'L1'
  | 'L2'
  | 'ADDITIONAL_ROUND'
  | 'FINAL_ROUND'
  | 'SELECTED'
  | 'ONBOARDED'

export type SubmissionOutcome = 'IN_PROGRESS' | 'REJECTED' | 'WITHDRAWN' | 'ON_HOLD' | 'JOINED'

export type RequirementStatus = 'OPEN' | 'ON_HOLD' | 'FILLED' | 'CANCELLED' | 'CLOSED'

export type StaffingPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type RateType = 'HOURLY' | 'DAILY' | 'MONTHLY' | 'ANNUAL'

export type BenchStatus = 'ON_BENCH' | 'DEPLOYED' | 'AVAILABLE_SOON' | 'NOT_AVAILABLE'

export type DashboardPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface RequirementRequest {
  jobTitle: string
  jobDescription?: string
  minExperienceYears?: number
  maxExperienceYears?: number
  location?: string
  workMode?: string
  engagementType?: string
  positions?: number
  accountId?: number
  clientName?: string
  /** Commercials. The API strips these for HR callers. */
  clientBudgetMin?: number
  clientBudgetMax?: number
  internalMaxRate?: number
  rateType?: RateType
  currency?: string
  status?: RequirementStatus
  priority?: StaffingPriority
  /** yyyy-MM-dd */
  targetDate?: string
  requirementOwner?: string
  assignedTo?: string
  skills?: string[]
}

export interface Requirement extends RequirementRequest {
  requirementNumber: string
  filledPositions?: number
  creationDate?: string
  lastModifiedDate?: string
}

export interface CandidateRequest {
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  currentLocation?: string
  totalExperienceYears?: number
  currentEmployer?: string
  currentDesignation?: string
  noticePeriodDays?: number
  primarySkills?: string
  expectedRate?: number
  rateType?: RateType
  currency?: string
  source?: string
  vendorId?: number
}

export interface Candidate extends CandidateRequest {
  candidateNumber: string
  fullName?: string
  benchStatus?: BenchStatus
  availableFrom?: string
  creationDate?: string
  lastModifiedDate?: string
}

export interface SubmissionRequest {
  requirementNumber: string
  candidateNumber: string
  candidateExpectedRate?: number
  offeredRate?: number
  /** Sales and Admin only; the API ignores it from HR callers. */
  clientSubmittedRate?: number
  rateType?: RateType
  currency?: string
  screeningCallMinutes?: number
  hrNotes?: string
  salesNotes?: string
}

export interface Submission {
  submissionNumber: string
  requirementNumber?: string
  jobTitle?: string
  candidateNumber?: string
  candidateName?: string
  stage: SubmissionStage
  outcome: SubmissionOutcome
  outcomeReason?: string
  rejectedAtStage?: SubmissionStage
  sortKey?: number
  candidateExpectedRate?: number
  offeredRate?: number
  /** Null for HR callers. */
  clientSubmittedRate?: number
  /** Derived; null for HR callers. */
  margin?: number
  /** The requirement's ceiling per profile. Visible to HR too. */
  budgetPerProfile?: number
  /** Offered rate exceeds that ceiling. Advisory, not a block. */
  overBudget?: boolean
  rateType?: RateType
  currency?: string
  screeningCallMinutes?: number
  /** The exact file the client was sent, pinned at submission. */
  submittedDocumentNumber?: string
  submittedDocumentName?: string
  hrNotes?: string
  salesNotes?: string
  submittedBy?: string
  /** Sent back on a move so the API can reject a stale board. */
  version?: number
  creationDate?: string
  lastModifiedDate?: string
}

export interface BoardColumn {
  stage: SubmissionStage
  owner: 'HR' | 'SALES'
  sequence: number
  count: number
  submissions: Submission[]
}

export interface StageHistoryEntry {
  fromStage?: SubmissionStage
  toStage: SubmissionStage
  fromOutcome?: SubmissionOutcome
  toOutcome?: SubmissionOutcome
  reason?: string
  changedBy?: string
  changedAt?: string
}

export interface Kpi {
  key: string
  label: string
  value: number
  previous?: number
  delta?: number
  unit?: string
}

export interface KpiScore {
  key: string
  label: string
  comparator: 'GT' | 'LT'
  target: number
  actual: number | null
  /** Oriented so 100 always means "on target", whichever direction is good. */
  attainment: number | null
  met: boolean
  unit: string
}

export interface StaffingDashboard {
  period: DashboardPeriod
  from: string
  to: string
  kpis: Kpi[]
  scorecard: KpiScore[]
  pipelineByStage: Record<string, number>
  outcomes: Record<string, number>
  rejectionsByStage: Record<string, number>
  perUser: Record<string, number>
  /** Null for HR callers. */
  margin: number | null
}

export interface StandupPerson {
  username: string
  moves: number
  highlights: string[]
}

export interface StandupRequirement {
  requirementNumber: string
  jobTitle?: string
  moves: number
  /** Span between first and last action, not hours worked. */
  activeMinutes: number
  candidatesTouched: string[]
}

export interface Standup {
  date: string
  totalMoves: number
  peopleActive: number
  people: StandupPerson[]
  requirements: StandupRequirement[]
}

export interface Folder {
  folderId: number
  folderName: string
  parentFolderId?: number | null
  description?: string
  candidateCount: number
  children: Folder[]
}

export interface KpiTargetRow {
  key: string
  label: string
  period: DashboardPeriod
  comparator: 'GT' | 'LT'
  target: number
  unit: string
  source: 'DEFAULT' | 'CONFIGURED'
}

export type DocumentVariant = 'ORIGINAL' | 'FORMATTED' | 'MASKED'

export interface StaffingDocument {
  documentNumber: string
  fileName: string
  variant: DocumentVariant
  contentType?: string
  sizeBytes?: number
  uploadedBy?: string
  creationDate?: string
}

export interface ResumeSearchHit {
  candidateNumber: string
  fullName: string
  primarySkills?: string
  totalExperienceYears?: number
  currentLocation?: string
  benchStatus?: BenchStatus
  documentNumber: string
  fileName: string
  /** Matching fragment; hits are wrapped in << >> by the server. */
  snippet?: string
}
