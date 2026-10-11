import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FormPage, { type FormSection } from '@/components/common/Form'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import SelectDropdown from '@/components/common/SelectDropdown'
import { ChipsInput } from '@/components/common/ChipsInput'
import BackButton from '@/components/common/BackButton'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { createRequirement, getRequirement, updateRequirement } from '@/api/staffing.api'
import {
  canSeeCommercials,
  isHr,
  ENGAGEMENT_OPTIONS,
  PRIORITY_OPTIONS,
  RATE_TYPE_OPTIONS,
  REQUIREMENT_STATUS_OPTIONS,
  WORK_MODE_OPTIONS,
} from '@/constants/Staffing'
import { apiErrorMessage, type RequirementRequest } from '@/types/staffing.types'

const EMPTY: RequirementRequest = {
  jobTitle: '',
  jobDescription: '',
  location: '',
  workMode: '',
  engagementType: '',
  positions: 1,
  clientName: '',
  rateType: 'HOURLY',
  currency: 'INR',
  status: 'OPEN',
  priority: 'MEDIUM',
  targetDate: '',
  assignedTo: '',
  skills: [],
}

const MAX_SKILLS = 30
const SKILL_RE = /^[\p{L}\p{N}][\p{L}\p{N}\s.+#/&-]{0,48}$/u

/** Empty string means "not filled in"; 0 is a real number and must survive. */
const toNumber = (value: string): number | undefined =>
  value.trim() === '' ? undefined : Number(value)

export default function RequirementFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const mode: 'add' | 'edit' = id ? 'edit' : 'add'
  const role = useCurrentRole()
  const showCommercials = canSeeCommercials(role)
  // HR sees the budget it negotiates against, but not what we charge the
  // client, and cannot change either.
  const showBudget = showCommercials || isHr(role)

  const [form, setForm] = useState<RequirementRequest>({ ...EMPTY })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    getRequirement(id)
      .then((res) => {
        const d = res?.data
        if (d) setForm({ ...EMPTY, ...d, skills: d.skills ?? [] })
      })
      .catch(() =>
        showToast({
          title: 'Could not load requirement',
          description: 'Please go back and try again.',
          type: 'error',
        }),
      )
  }, [id])

  const set = <K extends keyof RequirementRequest>(key: K, value: RequirementRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  /**
   * Mirrors RequirementServiceImpl.validate so the obvious mistakes are caught
   * before a round trip. The backend still checks all of it.
   */
  const validate = (): boolean => {
    const next: Record<string, string> = {}

    if (!form.jobTitle?.trim()) next.jobTitle = 'Job title cannot be blank.'
    if ((form.positions ?? 1) < 1) next.positions = 'Positions must be at least 1.'

    const { minExperienceYears: min, maxExperienceYears: max } = form
    if (min !== undefined && max !== undefined && min > max) {
      next.minExperienceYears = 'Minimum experience cannot be greater than maximum.'
    }

    const { clientBudgetMin: bMin, clientBudgetMax: bMax, internalMaxRate: cap } = form
    if (bMin !== undefined && bMax !== undefined && bMin > bMax) {
      next.clientBudgetMin = 'Minimum budget cannot be greater than maximum.'
    }
    if (cap !== undefined && bMax !== undefined && cap > bMax) {
      next.internalMaxRate = 'Internal ceiling cannot exceed the client budget — that placement loses money.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Blank optional strings are dropped rather than sent as "", which the
      // backend's @Pattern validators would reject as invalid values.
      const payload: RequirementRequest = {
        ...form,
        jobTitle: form.jobTitle.trim(),
        workMode: form.workMode || undefined,
        engagementType: form.engagementType || undefined,
        targetDate: form.targetDate || undefined,
        rateType: form.rateType || undefined,
      }

      const res =
        mode === 'add'
          ? await createRequirement(payload)
          : await updateRequirement(id as string, payload)

      if (res?.status === 'Success' || res?.code === '0x0200') {
        showToast({
          title: mode === 'add' ? 'Requirement created' : 'Requirement updated',
          description: form.jobTitle,
          type: 'success',
        })
        navigate(ROUTES.STAFFING_REQUIREMENTS)
      } else {
        showToast({
          title: 'Could not save',
          description: res?.description ?? 'Please check the form and try again.',
          type: 'error',
        })
      }
    } catch (err) {
      showToast({
        title: 'Could not save',
        description: apiErrorMessage(err, 'Please try again.'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const sections: FormSection[] = useMemo(() => {
    const list: FormSection[] = [
      {
        icon: <span>📋</span>,
        title: 'Role',
        subtitle: 'What the client is asking for.',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        children: (
          <>
            <Input
              id="jobTitle"
              label="Job Title"
              placeholder="e.g. Senior Java Developer"
              required
              value={form.jobTitle}
              onChange={(e) => set('jobTitle', e.target.value)}
              error={errors.jobTitle}
            />
            <Input
              id="clientName"
              label="Client"
              placeholder="Enter client name"
              value={form.clientName ?? ''}
              onChange={(e) => set('clientName', e.target.value)}
            />
            <Input
              id="location"
              label="Location"
              placeholder="e.g. Pune"
              value={form.location ?? ''}
              onChange={(e) => set('location', e.target.value)}
            />
            <SelectDropdown
              label="Work Mode"
              placeholder="Select work mode"
              options={WORK_MODE_OPTIONS}
              value={form.workMode ?? ''}
              onChange={(v) => set('workMode', v)}
            />
            <SelectDropdown
              label="Engagement"
              placeholder="Select engagement type"
              options={ENGAGEMENT_OPTIONS}
              value={form.engagementType ?? ''}
              onChange={(v) => set('engagementType', v)}
            />
            <Input
              id="positions"
              label="Positions"
              type="number"
              min={1}
              placeholder="1"
              value={String(form.positions ?? 1)}
              onChange={(e) => set('positions', toNumber(e.target.value) ?? 1)}
              error={errors.positions}
            />
            <Input
              id="minExperienceYears"
              label="Min Experience (yrs)"
              type="number"
              min={0}
              placeholder="0"
              value={form.minExperienceYears === undefined ? '' : String(form.minExperienceYears)}
              onChange={(e) => set('minExperienceYears', toNumber(e.target.value))}
              error={errors.minExperienceYears}
            />
            <Input
              id="maxExperienceYears"
              label="Max Experience (yrs)"
              type="number"
              min={0}
              placeholder="0"
              value={form.maxExperienceYears === undefined ? '' : String(form.maxExperienceYears)}
              onChange={(e) => set('maxExperienceYears', toNumber(e.target.value))}
            />
          </>
        ),
      },
      {
        icon: <span>🧩</span>,
        title: 'Skills & Workflow',
        subtitle: 'What to source against, and how hard to push.',
        iconBg: 'bg-green-50',
        iconColor: 'text-green-500',
        children: (
          <>
            <div className="md:col-span-2">
              <ChipsInput
                id="skills"
                label="Skills"
                placeholder="Type a skill and press Enter"
                value={form.skills ?? []}
                onChange={(next) => set('skills', next)}
                max={MAX_SKILLS}
                validate={(candidate) =>
                  SKILL_RE.test(candidate) ? null : 'Use letters, numbers and . + # / & - only.'
                }
                helpText="Duplicates are ignored, case-insensitively."
              />
            </div>
            <SelectDropdown
              label="Status"
              placeholder="Select status"
              options={REQUIREMENT_STATUS_OPTIONS}
              value={form.status ?? ''}
              onChange={(v) => set('status', v as RequirementRequest['status'])}
            />
            <SelectDropdown
              label="Priority"
              placeholder="Select priority"
              options={PRIORITY_OPTIONS}
              value={form.priority ?? ''}
              onChange={(v) => set('priority', v as RequirementRequest['priority'])}
            />
            <Input
              id="targetDate"
              label="Target Date"
              type="date"
              value={form.targetDate ?? ''}
              onChange={(e) => set('targetDate', e.target.value)}
            />
            <Input
              id="assignedTo"
              label="Assigned Recruiter"
              placeholder="Username of the recruiter"
              value={form.assignedTo ?? ''}
              onChange={(e) => set('assignedTo', e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                id="jobDescription"
                label="Job Description"
                placeholder="Paste the JD"
                value={form.jobDescription ?? ''}
                onChange={(e) => set('jobDescription', e.target.value)}
              />
            </div>
          </>
        ),
      },
    ]

    // HR gets a read-only budget card; Sales gets the full commercials. The
    // API strips the client figures for HR either way, so showing them would
    // offer edits that silently do nothing.
    if (!showCommercials && showBudget) {
      list.push({
        icon: <span>💰</span>,
        title: 'Budget',
        subtitle: 'What you can offer a candidate for this role.',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        children: (
          <div className="md:col-span-2">
            <p className="text-2xl font-semibold text-slate-900">
              {form.internalMaxRate ?? '—'}
              {form.internalMaxRate != null && (
                <span className="text-sm font-normal text-slate-500">
                  {' '}
                  {form.currency} / {(form.rateType ?? '').toLowerCase()}
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              The most we will pay per profile. Set by Sales — talk to them if it needs to move.
            </p>
          </div>
        ),
      })
    }

    if (showCommercials) {
      list.push({
        icon: <span>💰</span>,
        title: 'Commercials',
        subtitle: 'What we quoted the client, and the budget HR works to.',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        children: (
          <>
            <Input
              id="clientBudgetMin"
              label="Client Quote (min)"
              type="number"
              min={0}
              placeholder="0"
              value={form.clientBudgetMin === undefined ? '' : String(form.clientBudgetMin)}
              onChange={(e) => set('clientBudgetMin', toNumber(e.target.value))}
              error={errors.clientBudgetMin}
            />
            <Input
              id="clientBudgetMax"
              label="Client Quote (max)"
              type="number"
              min={0}
              placeholder="0"
              value={form.clientBudgetMax === undefined ? '' : String(form.clientBudgetMax)}
              onChange={(e) => set('clientBudgetMax', toNumber(e.target.value))}
            />
            <Input
              id="internalMaxRate"
              label="HR Budget (per profile)"
              type="number"
              min={0}
              placeholder="Most HR may offer"
              value={form.internalMaxRate === undefined ? '' : String(form.internalMaxRate)}
              onChange={(e) => set('internalMaxRate', toNumber(e.target.value))}
              error={errors.internalMaxRate}
            />
            <SelectDropdown
              label="Rate Type"
              placeholder="Select rate type"
              options={RATE_TYPE_OPTIONS}
              value={form.rateType ?? ''}
              onChange={(v) => set('rateType', v as RequirementRequest['rateType'])}
            />
            <Input
              id="currency"
              label="Currency"
              placeholder="INR"
              value={form.currency ?? ''}
              onChange={(e) => set('currency', e.target.value.toUpperCase())}
            />
          </>
        ),
      })
    }

    return list
  }, [form, errors, showCommercials, showBudget])

  return (
    <div>
      <BackButton path={ROUTES.STAFFING_REQUIREMENTS} label="Back To List" />
      <FormPage
        heading={mode === 'add' ? 'Create Requirement' : 'Edit Requirement'}
        subheading={
          mode === 'add'
            ? 'Raise a new role to source against.'
            : 'Update this requirement.'
        }
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.STAFFING_REQUIREMENTS)}
        submitLabel={
          <Button type="submit" variant="primary" size="lg" className="mt-1" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Save' : 'Update'}
          </Button>
        }
      />
    </div>
  )
}
