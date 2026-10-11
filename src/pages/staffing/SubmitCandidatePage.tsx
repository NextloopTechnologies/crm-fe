import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import FormPage, { type FormSection } from '@/components/common/Form'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import SelectDropdown from '@/components/common/SelectDropdown'
import BackButton from '@/components/common/BackButton'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { createCandidate, createSubmission, getCandidates, getRequirement } from '@/api/staffing.api'
import { canSeeCommercials, CANDIDATE_SOURCE_OPTIONS } from '@/constants/Staffing'
import {
  apiErrorMessage,
  type Candidate,
  type CandidateRequest,
  type SubmissionRequest,
} from '@/types/staffing.types'

const toNumber = (value: string): number | undefined =>
  value.trim() === '' ? undefined : Number(value)

/** Puts an existing candidate onto a requirement's board. */
export default function SubmitCandidatePage() {
  const navigate = useNavigate()
  const { requirementNumber } = useParams<{ requirementNumber: string }>()
  const role = useCurrentRole()
  const showCommercials = canSeeCommercials(role)

  // Two ways in: pick someone already in the pool, or type a new person and
  // create them on the way through. Sourcing a fresh CV is the common case,
  // and bouncing out to the candidate form lost whatever was typed here.
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [candidateNumber, setCandidateNumber] = useState('')
  const [newCandidate, setNewCandidate] = useState<CandidateRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentLocation: '',
    primarySkills: '',
    source: '',
  })
  const [expectedRate, setExpectedRate] = useState('')
  const [offeredRate, setOfferedRate] = useState('')
  const [clientRate, setClientRate] = useState('')
  const [screeningMinutes, setScreeningMinutes] = useState('')
  const [hrNotes, setHrNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: requirementData } = useQuery({
    queryKey: ['staffing-requirement', requirementNumber],
    queryFn: () => getRequirement(requirementNumber as string),
    enabled: Boolean(requirementNumber),
  })

  const { data: candidateData } = useQuery({
    queryKey: ['staffing-candidate'],
    queryFn: getCandidates,
  })

  const candidateOptions = useMemo(() => {
    const rows: Candidate[] = Array.isArray(candidateData?.data) ? candidateData.data : []
    return rows.map((c) => ({
      label: `${c.fullName ?? c.firstName} — ${c.candidateNumber}`,
      value: c.candidateNumber,
    }))
  }, [candidateData])

  const requirement = requirementData?.data

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'existing' && !candidateNumber) {
      setError('Pick a candidate to submit.')
      return
    }

    if (mode === 'new' && !newCandidate.firstName.trim()) {
      setError('Enter at least a first name for the new candidate.')
      return
    }
    setError('')

    setLoading(true)
    try {
      let resolvedCandidate = candidateNumber

      if (mode === 'new') {
        const created = await createCandidate({
          ...newCandidate,
          firstName: newCandidate.firstName.trim(),
          // Blank strings fail the backend's @Pattern checks, which read them
          // as supplied-but-invalid rather than absent.
          email: newCandidate.email || undefined,
          phone: newCandidate.phone || undefined,
          source: newCandidate.source || undefined,
        })

        if (created?.status !== 'Success' && created?.code !== '0x0200') {
          // A duplicate email or phone lands here, and the message names the
          // person already holding it — worth showing verbatim.
          showToast({
            title: 'Could not add the candidate',
            description: created?.description ?? 'Please check the details and try again.',
            type: 'error',
          })
          setLoading(false)
          return
        }

        resolvedCandidate = created.data.candidateNumber
      }

      const payload: SubmissionRequest = {
        requirementNumber: requirementNumber as string,
        candidateNumber: resolvedCandidate,
        candidateExpectedRate: toNumber(expectedRate),
        offeredRate: toNumber(offeredRate),
        clientSubmittedRate: toNumber(clientRate),
        screeningCallMinutes: toNumber(screeningMinutes),
        hrNotes: hrNotes || undefined,
      }

      const res = await createSubmission(payload)

      if (res?.status === 'Success' || res?.code === '0x0200') {
        showToast({ title: 'Candidate submitted', description: res?.description ?? '', type: 'success' })

        // Advisory, not a refusal: the same person may legitimately go to one
        // client through two requirements, and only the people involved know.
        if (res?.warning) {
          showToast({ title: 'Heads up', description: res.warning, type: 'warning' })
        }

        navigate(ROUTES.STAFFING_BOARD(requirementNumber as string))
      } else {
        showToast({
          title: 'Could not submit',
          description: res?.description ?? 'Please try again.',
          type: 'error',
        })
      }
    } catch (err) {
      showToast({
        title: 'Could not submit',
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
        icon: <span>🧑‍💼</span>,
        title: 'Candidate',
        subtitle: requirement?.jobTitle
          ? `Submitting to ${requirement.jobTitle}.`
          : 'Pick someone from the pool.',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        children: (
          <>
            <div className="md:col-span-2">
              <div className="inline-flex rounded-lg border border-[#E0E0E0] p-0.5 mb-3">
                {(['existing', 'new'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setMode(option)
                      setError('')
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      mode === option
                        ? 'bg-[#5752FE] text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option === 'existing' ? 'From the pool' : 'New candidate'}
                  </button>
                ))}
              </div>

              {mode === 'existing' ? (
                <SelectDropdown
                  label="Candidate"
                  placeholder="Search the pool"
                  options={candidateOptions}
                  value={candidateNumber}
                  onChange={setCandidateNumber}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="newFirstName"
                    label="First Name"
                    placeholder="Enter first name"
                    required
                    value={newCandidate.firstName}
                    onChange={(e) =>
                      setNewCandidate((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                  />
                  <Input
                    id="newLastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    value={newCandidate.lastName ?? ''}
                    onChange={(e) =>
                      setNewCandidate((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                  />
                  <Input
                    id="newEmail"
                    label="Email"
                    placeholder="Enter email"
                    value={newCandidate.email ?? ''}
                    onChange={(e) => setNewCandidate((prev) => ({ ...prev, email: e.target.value }))}
                  />
                  <Input
                    id="newPhone"
                    label="Phone"
                    placeholder="Enter phone"
                    value={newCandidate.phone ?? ''}
                    onChange={(e) => setNewCandidate((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    id="newLocation"
                    label="Location"
                    placeholder="e.g. Pune"
                    value={newCandidate.currentLocation ?? ''}
                    onChange={(e) =>
                      setNewCandidate((prev) => ({ ...prev, currentLocation: e.target.value }))
                    }
                  />
                  <SelectDropdown
                    label="Source"
                    placeholder="Where did they come from?"
                    options={CANDIDATE_SOURCE_OPTIONS}
                    value={newCandidate.source ?? ''}
                    onChange={(v) => setNewCandidate((prev) => ({ ...prev, source: v }))}
                  />
                  <div className="md:col-span-2">
                    <Input
                      id="newSkills"
                      label="Primary Skills"
                      placeholder="Java, Spring Boot, Kafka"
                      value={newCandidate.primarySkills ?? ''}
                      onChange={(e) =>
                        setNewCandidate((prev) => ({ ...prev, primarySkills: e.target.value }))
                      }
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 md:col-span-2">
                    They are added to the pool as well, so they can be submitted elsewhere later.
                  </p>
                </div>
              )}

              {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
            </div>
            <Input
              id="screeningCallMinutes"
              label="Screening Call (min)"
              type="number"
              min={0}
              placeholder="How long the HR call took"
              value={screeningMinutes}
              onChange={(e) => setScreeningMinutes(e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                id="hrNotes"
                label="HR Notes"
                placeholder="Availability, notice period, what stood out"
                value={hrNotes}
                onChange={(e) => setHrNotes(e.target.value)}
              />
            </div>
          </>
        ),
      },
      {
        icon: <span>💰</span>,
        title: 'Rates',
        subtitle: 'What they want, and what we offer.',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        children: (
          <>
            <Input
              id="expectedRate"
              label="Candidate Expects"
              type="number"
              min={0}
              placeholder="0"
              value={expectedRate}
              onChange={(e) => setExpectedRate(e.target.value)}
            />
            <Input
              id="offeredRate"
              label="We Offer"
              type="number"
              min={0}
              placeholder="0"
              value={offeredRate}
              onChange={(e) => setOfferedRate(e.target.value)}
            />
            {/* Hidden for HR: the API ignores a client rate sent by an HR
                caller, so offering the field would lose the value silently. */}
            {showCommercials && (
              <div>
                <Input
                  id="clientSubmittedRate"
                  label="We Bill The Client"
                  type="number"
                  min={0}
                  placeholder="Required before sending to the client"
                  value={clientRate}
                  onChange={(e) => setClientRate(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  The board refuses a client submission until this is set.
                </p>
              </div>
            )}
          </>
        ),
      },
    ]
    return list
  }, [
    candidateOptions,
    candidateNumber,
    mode,
    newCandidate,
    error,
    expectedRate,
    offeredRate,
    clientRate,
    screeningMinutes,
    hrNotes,
    requirement,
    showCommercials,
  ])

  return (
    <div>
      <BackButton
        path={ROUTES.STAFFING_BOARD(requirementNumber as string)}
        label="Back To Board"
      />
      <FormPage
        heading="Submit Candidate"
        subheading="Adds the candidate to this requirement's board at Sourced."
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.STAFFING_BOARD(requirementNumber as string))}
        submitLabel={
          <Button type="submit" variant="primary" size="lg" className="mt-1" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        }
      />
    </div>
  )
}
