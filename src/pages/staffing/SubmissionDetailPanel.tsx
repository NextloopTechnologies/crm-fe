import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import SelectDropdown from '@/components/common/SelectDropdown'
import CandidateDocuments from './CandidateDocuments'
import { showToast } from '@/components/common/Toast'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import {
  changeSubmissionOutcome,
  getSubmission,
  getSubmissionHistory,
  openDocument,
  updateSubmission,
} from '@/api/staffing.api'
import {
  canSeeCommercials,
  NEUTRAL_CHIP,
  OUTCOME_CHIP,
  STAGE_LABEL,
} from '@/constants/Staffing'
import { apiErrorMessage, type ApiEnvelope, type StageHistoryEntry, type Submission } from '@/types/staffing.types'

interface Props {
  submissionNumber: string
  onClose: () => void
  onChanged: () => void
}

const OUTCOME_OPTIONS = [
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
  { label: 'On hold', value: 'ON_HOLD' },
]

/** Outcomes the API refuses without a reason. Mirrors SubmissionOutcome. */
const NEEDS_REASON = ['REJECTED', 'WITHDRAWN', 'ON_HOLD']

export default function SubmissionDetailPanel({ submissionNumber, onClose, onChanged }: Props) {
  const queryClient = useQueryClient()
  const role = useCurrentRole()
  const showCommercials = canSeeCommercials(role)

  const { data, isLoading } = useQuery({
    queryKey: ['staffing-submission', submissionNumber],
    queryFn: () => getSubmission(submissionNumber),
  })

  const { data: historyData } = useQuery({
    queryKey: ['staffing-submission-history', submissionNumber],
    queryFn: () => getSubmissionHistory(submissionNumber),
  })

  const submission: Submission | undefined = data?.data
  const history: StageHistoryEntry[] = useMemo(
    () => (Array.isArray(historyData?.data) ? historyData.data : []),
    [historyData],
  )

  const [outcome, setOutcome] = useState('')
  const [outcomeReason, setOutcomeReason] = useState('')
  const [hrNotes, setHrNotes] = useState('')
  const [salesNotes, setSalesNotes] = useState('')
  const [offeredRate, setOfferedRate] = useState('')
  const [clientRate, setClientRate] = useState('')
  const [screeningMinutes, setScreeningMinutes] = useState('')

  // Seeds the editable fields from whichever submission is loaded, and
  // re-seeds when a save returns fresh values. Done during render rather than
  // in an effect so the inputs never paint one frame of stale content.
  const [syncedFrom, setSyncedFrom] = useState<string | null>(null)
  const stamp = submission
    ? `${submission.submissionNumber}:${submission.version ?? 0}:${submission.lastModifiedDate ?? ''}`
    : null

  if (submission && stamp && syncedFrom !== stamp) {
    setSyncedFrom(stamp)
    setOutcome(submission.outcome ?? '')
    setOutcomeReason(submission.outcomeReason ?? '')
    setHrNotes(submission.hrNotes ?? '')
    setSalesNotes(submission.salesNotes ?? '')
    setOfferedRate(submission.offeredRate == null ? '' : String(submission.offeredRate))
    setClientRate(submission.clientSubmittedRate == null ? '' : String(submission.clientSubmittedRate))
    setScreeningMinutes(
      submission.screeningCallMinutes == null ? '' : String(submission.screeningCallMinutes),
    )
  }

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['staffing-submission', submissionNumber] })
    queryClient.invalidateQueries({ queryKey: ['staffing-submission-history', submissionNumber] })
    onChanged()
  }

  const handleResult = (res: ApiEnvelope, successTitle: string) => {
    if (res?.status === 'Success' || res?.code === '0x0200') {
      showToast({ title: successTitle, description: res?.description ?? '', type: 'success' })
      refresh()
      return true
    }
    showToast({
      title: 'Not saved',
      description: res?.description ?? 'Please try again.',
      type: 'error',
    })
    return false
  }

  const save = useMutation({
    mutationFn: () =>
      updateSubmission(submissionNumber, {
        // Required by the DTO but ignored on update: the pairing cannot change.
        requirementNumber: submission?.requirementNumber ?? '',
        candidateNumber: submission?.candidateNumber ?? '',
        offeredRate: offeredRate.trim() === '' ? undefined : Number(offeredRate),
        clientSubmittedRate: clientRate.trim() === '' ? undefined : Number(clientRate),
        screeningCallMinutes:
          screeningMinutes.trim() === '' ? undefined : Number(screeningMinutes),
        hrNotes,
        salesNotes,
        rateType: submission?.rateType,
        currency: submission?.currency,
      }),
    onSuccess: (res) => handleResult(res, 'Saved'),
    onError: (err: unknown) =>
      showToast({
        title: 'Not saved',
        description: apiErrorMessage(err, 'Please try again.'),
        type: 'error',
      }),
  })

  const changeOutcome = useMutation({
    mutationFn: () =>
      changeSubmissionOutcome(submissionNumber, {
        outcome,
        reason: outcomeReason,
        version: submission?.version,
      }),
    onSuccess: (res) => handleResult(res, 'Outcome updated'),
    onError: (err: unknown) =>
      showToast({
        title: 'Not updated',
        description: apiErrorMessage(err, 'Please try again.'),
        type: 'error',
      }),
  })

  const openDoc = useMutation({
    mutationFn: (documentNumber: string) => openDocument(documentNumber),
    onError: (err: unknown) =>
      showToast({
        title: 'Could not open the file',
        description: apiErrorMessage(err, 'Please try again.'),
        type: 'error',
      }),
  })

  // Recomputed from the field rather than read off the response, so the
  // warning appears as the number is typed instead of after a save.
  const overBudget =
    submission?.budgetPerProfile != null &&
    offeredRate.trim() !== '' &&
    Number(offeredRate) > submission.budgetPerProfile

  const reasonMissing = NEEDS_REASON.includes(outcome) && outcomeReason.trim() === ''
  const outcomeUnchanged = outcome === submission?.outcome && outcomeReason === (submission?.outcomeReason ?? '')

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      {/* Both overrides use the same data-[side=right] chain as the defaults
          they replace. A plain w-full / sm:max-w-* is a different variant
          chain, so tailwind-merge does not see a conflict and the built-in
          w-3/4 and max-w-sm keep winning — which is what squeezed this panel
          to 384px and pushed its content off the edge. */}
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-[560px] overflow-y-auto">
        {isLoading || !submission ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin text-[#5752FE]" />
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>{submission.candidateName ?? submission.candidateNumber}</SheetTitle>
              <SheetDescription>
                {submission.jobTitle} · {submission.submissionNumber}
              </SheetDescription>
            </SheetHeader>

            <div className="px-4 pb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex px-2 py-1 rounded-lg text-xs font-semibold bg-[#ebebff] text-[#5b5bd6]">
                {STAGE_LABEL[submission.stage] ?? submission.stage}
              </span>
              <span
                className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${
                  (OUTCOME_CHIP[submission.outcome] ?? NEUTRAL_CHIP).bg
                } ${(OUTCOME_CHIP[submission.outcome] ?? NEUTRAL_CHIP).text}`}
              >
                {submission.outcome}
              </span>
              {submission.rejectedAtStage && (
                <span className="text-xs text-slate-500">
                  closed at {STAGE_LABEL[submission.rejectedAtStage] ?? submission.rejectedAtStage}
                </span>
              )}
            </div>

            {/* ── Rates ── */}
            <section className="mt-6">
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-800">Rates</h3>
                {submission.budgetPerProfile != null && (
                  <span className="text-xs text-slate-500">
                    Budget{' '}
                    <span className="font-semibold text-slate-700">
                      {submission.budgetPerProfile}
                    </span>{' '}
                    per profile
                  </span>
                )}
              </div>

              {/* Advisory rather than a block: going over budget is sometimes
                  the right call, but it should never happen unnoticed. */}
              {overBudget && (
                <p className="mb-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                  Offering {offeredRate} is above the {submission.budgetPerProfile} budget for this
                  role.
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-slate-500 min-w-0">
                  Offered (we pay)
                  <Input
                    type="number"
                    min={0}
                    value={offeredRate}
                    onChange={(e) => setOfferedRate(e.target.value)}
                    className={overBudget ? 'border-amber-400 focus-visible:ring-amber-400' : ''}
                  />
                </label>

                {/* Hidden for HR: the API strips it on read and ignores it on
                    write, so the field would be a lie. */}
                {showCommercials && (
                  <label className="text-xs text-slate-500 min-w-0">
                    Client quote (we bill)
                    <Input
                      type="number"
                      min={0}
                      value={clientRate}
                      onChange={(e) => setClientRate(e.target.value)}
                    />
                  </label>
                )}

                <label className="text-xs text-slate-500 min-w-0">
                  Screening call (min)
                  <Input
                    type="number"
                    min={0}
                    value={screeningMinutes}
                    onChange={(e) => setScreeningMinutes(e.target.value)}
                  />
                </label>

                {showCommercials && (
                  <div className="text-xs text-slate-500 flex flex-col justify-end min-w-0">
                    Margin
                    <span className="text-base font-semibold text-emerald-600">
                      {submission.margin ?? '—'}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* What the client was actually sent, which is not necessarily the
                newest CV on file. */}
            {submission.submittedDocumentNumber && (
              <div className="mt-4 flex items-center gap-2 text-xs border border-[#ECECEC] rounded-lg px-3 py-2">
                <span className="text-slate-500 shrink-0">Sent to client:</span>
                <button
                  type="button"
                  onClick={() => openDoc.mutate(submission.submittedDocumentNumber!)}
                  className="font-medium text-[#5752FE] hover:underline truncate"
                >
                  {submission.submittedDocumentName}
                </button>
              </div>
            )}

            {/* ── Resumes ── */}
            {submission.candidateNumber && (
              <div className="mt-6">
                <CandidateDocuments candidateNumber={submission.candidateNumber} />
              </div>
            )}

            {/* ── Notes ── */}
            <section className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Notes</h3>
              <label className="text-xs text-slate-500">
                HR notes
                <Textarea rows={3} value={hrNotes} onChange={(e) => setHrNotes(e.target.value)} />
              </label>
              <label className="text-xs text-slate-500 block mt-3">
                Sales notes
                <Textarea rows={3} value={salesNotes} onChange={(e) => setSalesNotes(e.target.value)} />
              </label>
              <Button
                className="mt-3 bg-[#5752FE] hover:bg-[#4a45e0] text-white"
                disabled={save.isPending}
                onClick={() => save.mutate()}
              >
                {save.isPending ? 'Saving...' : 'Save details'}
              </Button>
            </section>

            {/* ── Outcome ── */}
            <section className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Outcome</h3>
              <SelectDropdown
                label="Status"
                placeholder="Select outcome"
                options={OUTCOME_OPTIONS}
                value={outcome}
                onChange={setOutcome}
              />
              <label className="text-xs text-slate-500 block mt-3">
                Reason {NEEDS_REASON.includes(outcome) && <span className="text-rose-500">*</span>}
                <Textarea
                  rows={2}
                  placeholder="Required when rejecting, withdrawing or holding"
                  value={outcomeReason}
                  onChange={(e) => setOutcomeReason(e.target.value)}
                />
              </label>
              {reasonMissing && (
                <p className="text-xs text-rose-500 mt-1">
                  A reason is required when marking a submission {outcome}.
                </p>
              )}
              <Button
                variant="outline"
                className="mt-3"
                disabled={reasonMissing || outcomeUnchanged || changeOutcome.isPending}
                onClick={() => changeOutcome.mutate()}
              >
                {changeOutcome.isPending ? 'Updating...' : 'Update outcome'}
              </Button>
            </section>

            {/* ── History ── */}
            <section className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">History</h3>
              {history.length === 0 && <p className="text-xs text-slate-400">Nothing recorded yet.</p>}
              <ol className="border-l border-[#ECECEC] pl-3 flex flex-col gap-3">
                {history.map((entry, i) => (
                  <li key={i} className="text-xs">
                    <p className="font-medium text-slate-700">
                      {entry.fromStage
                        ? `${STAGE_LABEL[entry.fromStage] ?? entry.fromStage} → ${
                            STAGE_LABEL[entry.toStage] ?? entry.toStage
                          }`
                        : `Added at ${STAGE_LABEL[entry.toStage] ?? entry.toStage}`}
                    </p>
                    <p className="text-slate-400">
                      {entry.changedBy} · {entry.changedAt?.slice(0, 19)}
                    </p>
                    {entry.reason && <p className="text-slate-500 italic mt-0.5">{entry.reason}</p>}
                  </li>
                ))}
              </ol>
            </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
