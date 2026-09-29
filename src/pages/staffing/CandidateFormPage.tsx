import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FormPage, { type FormSection } from '@/components/common/Form'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import SelectDropdown from '@/components/common/SelectDropdown'
import BackButton from '@/components/common/BackButton'
import CandidateDocuments from './CandidateDocuments'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { createCandidate, getCandidate, updateCandidate } from '@/api/staffing.api'
import { CANDIDATE_SOURCE_OPTIONS, RATE_TYPE_OPTIONS } from '@/constants/Staffing'
import { apiErrorMessage, type CandidateRequest } from '@/types/staffing.types'

const EMPTY: CandidateRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  currentLocation: '',
  currentEmployer: '',
  currentDesignation: '',
  primarySkills: '',
  rateType: 'HOURLY',
  currency: 'INR',
  source: '',
}

// Mirrors the backend's EMAIL_REGEX closely enough to catch typos here. Note
// it requires a domain label of two or more characters, which is why an
// address like "a@b.com" is rejected server-side.
const EMAIL_RE = /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/

const toNumber = (value: string): number | undefined =>
  value.trim() === '' ? undefined : Number(value)

export default function CandidateFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const mode: 'add' | 'edit' = id ? 'edit' : 'add'

  const [form, setForm] = useState<CandidateRequest>({ ...EMPTY })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    getCandidate(id)
      .then((res) => {
        const d = res?.data
        if (d) setForm({ ...EMPTY, ...d })
      })
      .catch(() =>
        showToast({
          title: 'Could not load candidate',
          description: 'Please go back and try again.',
          type: 'error',
        }),
      )
  }, [id])

  const set = <K extends keyof CandidateRequest>(key: K, value: CandidateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const validate = (): boolean => {
    const next: Record<string, string> = {}

    if (!form.firstName?.trim()) next.firstName = 'First name cannot be blank.'
    if (form.email && !EMAIL_RE.test(form.email)) {
      next.email = 'Enter a valid email address (e.g. example@domain.com).'
    }
    if (form.phone && !PHONE_RE.test(form.phone)) next.phone = 'Phone must be 7 to 15 digits.'
    if ((form.totalExperienceYears ?? 0) < 0) {
      next.totalExperienceYears = 'Experience cannot be negative.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload: CandidateRequest = {
        ...form,
        firstName: form.firstName.trim(),
        // Blank strings would fail the backend's @Pattern checks, which treat
        // them as supplied-but-invalid rather than absent.
        email: form.email || undefined,
        phone: form.phone || undefined,
        source: form.source || undefined,
        rateType: form.rateType || undefined,
      }

      const res =
        mode === 'add'
          ? await createCandidate(payload)
          : await updateCandidate(id as string, payload)

      if (res?.status === 'Success' || res?.code === '0x0200') {
        showToast({
          title: mode === 'add' ? 'Candidate added' : 'Candidate updated',
          description: `${form.firstName} ${form.lastName ?? ''}`.trim(),
          type: 'success',
        })
        navigate(ROUTES.STAFFING_CANDIDATES)
      } else {
        // Duplicate email or phone lands here, and the message names the
        // person already holding it — worth showing verbatim.
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

  const sections: FormSection[] = useMemo(
    () => [
      {
        icon: <span>👤</span>,
        title: 'Identity',
        subtitle: 'Who they are and how to reach them.',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        children: (
          <>
            <Input
              id="firstName"
              label="First Name"
              placeholder="Enter first name"
              required
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              error={errors.firstName}
            />
            <Input
              id="lastName"
              label="Last Name"
              placeholder="Enter last name"
              value={form.lastName ?? ''}
              onChange={(e) => set('lastName', e.target.value)}
            />
            <Input
              id="email"
              label="Email"
              placeholder="Enter email"
              value={form.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
            />
            <Input
              id="phone"
              label="Phone"
              placeholder="Enter phone"
              value={form.phone ?? ''}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              id="currentLocation"
              label="Location"
              placeholder="e.g. Pune"
              value={form.currentLocation ?? ''}
              onChange={(e) => set('currentLocation', e.target.value)}
            />
            <SelectDropdown
              label="Source"
              placeholder="Where did they come from?"
              options={CANDIDATE_SOURCE_OPTIONS}
              value={form.source ?? ''}
              onChange={(v) => set('source', v)}
            />
          </>
        ),
      },
      {
        icon: <span>💼</span>,
        title: 'Profile',
        subtitle: 'Experience, skills and availability.',
        iconBg: 'bg-green-50',
        iconColor: 'text-green-500',
        children: (
          <>
            <Input
              id="totalExperienceYears"
              label="Total Experience (yrs)"
              type="number"
              min={0}
              placeholder="0"
              value={form.totalExperienceYears === undefined ? '' : String(form.totalExperienceYears)}
              onChange={(e) => set('totalExperienceYears', toNumber(e.target.value))}
              error={errors.totalExperienceYears}
            />
            <Input
              id="noticePeriodDays"
              label="Notice Period (days)"
              type="number"
              min={0}
              placeholder="0"
              value={form.noticePeriodDays === undefined ? '' : String(form.noticePeriodDays)}
              onChange={(e) => set('noticePeriodDays', toNumber(e.target.value))}
            />
            <Input
              id="currentEmployer"
              label="Current Employer"
              placeholder="Enter employer"
              value={form.currentEmployer ?? ''}
              onChange={(e) => set('currentEmployer', e.target.value)}
            />
            <Input
              id="currentDesignation"
              label="Current Designation"
              placeholder="Enter designation"
              value={form.currentDesignation ?? ''}
              onChange={(e) => set('currentDesignation', e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                id="primarySkills"
                label="Primary Skills"
                placeholder="Java, Spring Boot, Kafka"
                value={form.primarySkills ?? ''}
                onChange={(e) => set('primarySkills', e.target.value)}
              />
            </div>
          </>
        ),
      },
      {
        icon: <span>💰</span>,
        title: 'Expectation',
        subtitle: 'What the candidate is asking for. What we offer is set per submission.',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        children: (
          <>
            <Input
              id="expectedRate"
              label="Expected Rate"
              type="number"
              min={0}
              placeholder="0"
              value={form.expectedRate === undefined ? '' : String(form.expectedRate)}
              onChange={(e) => set('expectedRate', toNumber(e.target.value))}
            />
            <SelectDropdown
              label="Rate Type"
              placeholder="Select rate type"
              options={RATE_TYPE_OPTIONS}
              value={form.rateType ?? ''}
              onChange={(v) => set('rateType', v as CandidateRequest['rateType'])}
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
      },
    ],
    [form, errors],
  )

  return (
    <div>
      <BackButton path={ROUTES.STAFFING_CANDIDATES} label="Back To List" />
      <FormPage
        heading={mode === 'add' ? 'Add Candidate' : 'Edit Candidate'}
        subheading={
          mode === 'add'
            ? 'Add someone to the pool. They can be submitted to any requirement later.'
            : 'Update this candidate.'
        }
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.STAFFING_CANDIDATES)}
        submitLabel={
          <Button type="submit" variant="primary" size="lg" className="mt-1" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Save' : 'Update'}
          </Button>
        }
      />

      {/* Only once the candidate exists — an upload needs something to attach
          to, and creating the record first is one click away. */}
      {mode === 'edit' && id && (
        <div className="mt-4">
          <CandidateDocuments candidateNumber={id} />
        </div>
      )}
    </div>
  )
}
