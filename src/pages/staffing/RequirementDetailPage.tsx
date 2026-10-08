import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { KanbanSquare, Loader2, Pencil } from 'lucide-react'
import BackButton from '@/components/common/BackButton'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/route'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { getRequirement } from '@/api/staffing.api'
import {
  canSeeCommercials,
  isHr,
  NEUTRAL_CHIP,
  PRIORITY_CHIP,
  REQUIREMENT_STATUS_CHIP,
} from '@/constants/Staffing'
import type { Requirement } from '@/types/staffing.types'

/** One labelled value. Renders an em dash rather than an empty gap. */
function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-slate-800 mt-0.5">
        {value === null || value === undefined || value === '' ? (
          <span className="text-slate-300">—</span>
        ) : (
          value
        )}
      </p>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[#E0E0E0] rounded-xl p-4">
      <h2 className="text-sm font-semibold text-slate-800 mb-3">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
    </section>
  )
}

export default function RequirementDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const role = useCurrentRole()
  const showCommercials = canSeeCommercials(role)
  const showBudget = showCommercials || isHr(role)

  const { data, isLoading } = useQuery({
    queryKey: ['staffing-requirement', id],
    queryFn: () => getRequirement(id as string),
    enabled: Boolean(id),
  })

  const requirement: Requirement | undefined = data?.data

  const progress = useMemo(() => {
    const total = requirement?.positions ?? 1
    const filled = requirement?.filledPositions ?? 0
    return { total, filled, pct: total === 0 ? 0 : Math.min(100, Math.round((filled / total) * 100)) }
  }, [requirement])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
        <Loader2 className="animate-spin text-[#5752FE]" />
      </div>
    )
  }

  if (!requirement) {
    return (
      <div className="bg-white min-h-screen rounded-xl p-4">
        <BackButton path={ROUTES.STAFFING_REQUIREMENTS} label="Back To Requirements" />
        <p className="text-sm text-slate-500 mt-4">
          That requirement could not be found, or you don't have permission to view it.
        </p>
      </div>
    )
  }

  const statusChip = REQUIREMENT_STATUS_CHIP[requirement.status ?? 'OPEN'] ?? NEUTRAL_CHIP
  const priorityChip = PRIORITY_CHIP[requirement.priority ?? 'MEDIUM'] ?? NEUTRAL_CHIP
  const rateSuffix = `${requirement.currency ?? ''} ${(requirement.rateType ?? '').toLowerCase()}`.trim()

  return (
    <div className="bg-white min-h-screen rounded-xl p-4">
      <BackButton path={ROUTES.STAFFING_REQUIREMENTS} label="Back To Requirements" />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-semibold text-gray-900">{requirement.jobTitle}</h1>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${statusChip.bg} ${statusChip.text}`}>
              {requirement.status}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${priorityChip.bg} ${priorityChip.text}`}>
              {requirement.priority}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {requirement.requirementNumber}
            {requirement.clientName ? ` · ${requirement.clientName}` : ''}
            {requirement.location ? ` · ${requirement.location}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => navigate(ROUTES.STAFFING_BOARD(requirement.requirementNumber))}
          >
            <KanbanSquare size={14} /> Board
          </Button>
          <Button
            className="bg-[#5752FE] hover:bg-[#4a45e0] text-white gap-1"
            title="Edit this requirement"
            aria-label="Edit this requirement"
            onClick={() => navigate(ROUTES.STAFFING_REQUIREMENT_EDIT(requirement.requirementNumber))}
          >
            <Pencil size={14} /> Edit
          </Button>
        </div>
      </div>

      {/* ── Progress ── */}
      <section className="border border-[#E0E0E0] rounded-xl p-4 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Positions</h2>
          <span className="text-sm">
            <span className="font-semibold text-slate-900">{progress.filled}</span>
            <span className="text-slate-400"> / {progress.total} filled</span>
          </span>
        </div>
        <div className="h-2 rounded-pill bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-pill ${progress.filled >= progress.total ? 'bg-emerald-500' : 'bg-[#5752FE]'}`}
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Role">
          <Field label="Client" value={requirement.clientName} />
          <Field label="Location" value={requirement.location} />
          <Field label="Work mode" value={requirement.workMode} />
          <Field label="Engagement" value={requirement.engagementType} />
          <Field
            label="Experience"
            value={
              requirement.minExperienceYears != null || requirement.maxExperienceYears != null
                ? `${requirement.minExperienceYears ?? '?'} – ${requirement.maxExperienceYears ?? '?'} yrs`
                : null
            }
          />
          <Field label="Target date" value={requirement.targetDate} />
          <Field label="Owner" value={requirement.requirementOwner} />
          <Field label="Assigned recruiter" value={requirement.assignedTo} />
          <Field label="Raised" value={requirement.creationDate?.slice(0, 10)} />
        </Card>

        <Card title="Commercials">
          {showCommercials ? (
            <>
              <Field
                label="Client quote"
                value={
                  requirement.clientBudgetMin != null || requirement.clientBudgetMax != null
                    ? `${requirement.clientBudgetMin ?? '?'} – ${requirement.clientBudgetMax ?? '?'} ${rateSuffix}`
                    : null
                }
              />
              <Field
                label="HR budget"
                value={
                  requirement.internalMaxRate != null
                    ? `${requirement.internalMaxRate} ${rateSuffix}`
                    : null
                }
              />
              <Field
                label="Margin per profile"
                value={
                  requirement.clientBudgetMax != null && requirement.internalMaxRate != null
                    ? `${requirement.clientBudgetMax - requirement.internalMaxRate} ${rateSuffix}`
                    : null
                }
              />
            </>
          ) : showBudget ? (
            <>
              {/* HR sees the budget it negotiates against, not the quote. */}
              <Field
                label="HR budget"
                value={
                  requirement.internalMaxRate != null
                    ? `${requirement.internalMaxRate} ${rateSuffix}`
                    : null
                }
              />
              <div className="col-span-2">
                <p className="text-[11px] text-slate-400">
                  The most you may offer per profile. Set by Sales.
                </p>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 col-span-3">Not visible for your role.</p>
          )}
        </Card>
      </div>

      <section className="border border-[#E0E0E0] rounded-xl p-4 mt-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Skills</h2>
        {(requirement.skills ?? []).length === 0 ? (
          <p className="text-xs text-slate-400">No skills listed.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {(requirement.skills ?? []).map((skill) => (
              <span
                key={skill}
                className="inline-flex px-2 py-1 rounded-pill bg-[#ebebff] text-xs font-medium text-[#5b5bd6]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="border border-[#E0E0E0] rounded-xl p-4 mt-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-2">Job description</h2>
        {requirement.jobDescription ? (
          // whitespace-pre-wrap so a pasted JD keeps its paragraphs instead of
          // collapsing into one block.
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{requirement.jobDescription}</p>
        ) : (
          <p className="text-xs text-slate-400">No description added.</p>
        )}
      </section>
    </div>
  )
}
