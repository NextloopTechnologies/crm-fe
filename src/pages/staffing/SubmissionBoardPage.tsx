import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GripVertical, Loader2, Plus } from 'lucide-react'
import BackButton from '@/components/common/BackButton'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { getBoard, moveSubmissionStage } from '@/api/staffing.api'
import {
  canDropInto,
  canSeeCommercials,
  NEUTRAL_CHIP,
  OUTCOME_CHIP,
  OWNER_CHIP,
  STAGE_LABEL,
} from '@/constants/Staffing'
import { apiErrorMessage, type BoardColumn, type Submission, type SubmissionStage } from '@/types/staffing.types'
import SubmissionDetailPanel from './SubmissionDetailPanel'
import StageMoveReasonDialog from './StageMoveReasonDialog'

interface PendingMove {
  submission: Submission
  toStage: SubmissionStage
}

export default function SubmissionBoardPage() {
  const navigate = useNavigate()
  const { requirementNumber } = useParams<{ requirementNumber: string }>()
  const queryClient = useQueryClient()
  const role = useCurrentRole()
  const showCommercials = canSeeCommercials(role)

  const [dragging, setDragging] = useState<Submission | null>(null)
  const [hoverStage, setHoverStage] = useState<SubmissionStage | null>(null)
  const [openSubmission, setOpenSubmission] = useState<string | null>(null)
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null)

  // Guards against a drop firing while a move is still in flight, which would
  // send a second request carrying a version the server has already bumped.
  const inFlight = useRef(false)

  const queryKey = useMemo(() => ['staffing-board', requirementNumber], [requirementNumber])

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getBoard(requirementNumber as string),
    enabled: Boolean(requirementNumber),
  })

  const columns: BoardColumn[] = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data],
  )

  const reload = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient, queryKey],
  )

  const move = useMutation({
    mutationFn: ({
      submissionNumber,
      toStage,
      reason,
      version,
    }: {
      submissionNumber: string
      toStage: string
      reason?: string
      version?: number
    }) => moveSubmissionStage(submissionNumber, { toStage, reason, version }),

    onSuccess: (res) => {
      // The API answers 200 with a failure code for a refused move — a rule
      // was broken, not a request. Surface the reason it gave rather than a
      // generic error, because the reason is the whole point.
      if (res?.status === 'Success' || res?.code === '0x0200') {
        showToast({ title: 'Moved', description: res?.description ?? '', type: 'success' })
      } else {
        showToast({
          title: 'Move refused',
          description: res?.description ?? 'That move is not allowed.',
          type: 'error',
        })
      }
      reload()
    },

    onError: (err: unknown) => {
      showToast({
        title: 'Move failed',
        description: apiErrorMessage(err, 'Please try again.'),
        type: 'error',
      })
      reload()
    },

    onSettled: () => {
      inFlight.current = false
    },
  })

  const stageSequence = useCallback(
    (stage: SubmissionStage) => columns.find((c) => c.stage === stage)?.sequence ?? 0,
    [columns],
  )

  const handleDrop = useCallback(
    (toStage: SubmissionStage) => {
      const submission = dragging
      setDragging(null)
      setHoverStage(null)

      if (!submission || inFlight.current) return
      if (submission.stage === toStage) return

      // A backward move needs a reason, so ask for one before sending rather
      // than letting the server refuse and losing the drag.
      if (stageSequence(toStage) < stageSequence(submission.stage)) {
        setPendingMove({ submission, toStage })
        return
      }

      inFlight.current = true
      move.mutate({
        submissionNumber: submission.submissionNumber,
        toStage,
        version: submission.version,
      })
    },
    [dragging, move, stageSequence],
  )

  const confirmBackwardMove = useCallback(
    (reason: string) => {
      if (!pendingMove) return
      inFlight.current = true
      move.mutate({
        submissionNumber: pendingMove.submission.submissionNumber,
        toStage: pendingMove.toStage,
        reason,
        version: pendingMove.submission.version,
      })
      setPendingMove(null)
    },
    [pendingMove, move],
  )

  const totals = useMemo(() => {
    const all = columns.flatMap((c) => c.submissions)
    return {
      total: all.length,
      active: all.filter((s) => s.outcome === 'IN_PROGRESS').length,
      closed: all.filter((s) => s.outcome !== 'IN_PROGRESS').length,
    }
  }, [columns])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
        <Loader2 className="animate-spin text-[#5752FE]" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen rounded-xl p-4">
      <BackButton path={ROUTES.STAFFING_REQUIREMENTS} label="Back To Requirements" />

      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{data?.jobTitle ?? 'Board'}</h1>
          <p className="text-xs text-gray-500">
            {requirementNumber} · {data?.filledPositions ?? 0}/{data?.positions ?? 0} filled ·{' '}
            {totals.active} active, {totals.closed} closed
          </p>
        </div>
        <Button
          className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1"
          onClick={() => navigate(ROUTES.STAFFING_SUBMIT(requirementNumber as string))}
        >
          <Plus size={14} /> Submit Candidate
        </Button>
      </div>

      {totals.total === 0 && (
        <div className="border border-dashed border-[#D8D8E3] rounded-xl p-8 text-center mb-4">
          <p className="text-sm font-medium text-slate-700">No candidates on this board yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            Submit someone from the pool and they will land in Sourced.
          </p>
          <Button
            className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1"
            onClick={() => navigate(ROUTES.STAFFING_SUBMIT(requirementNumber as string))}
          >
            <Plus size={14} /> Submit Candidate
          </Button>
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {columns.map((column) => {
            const owner = OWNER_CHIP[column.owner] ?? NEUTRAL_CHIP
            const isTarget = hoverStage === column.stage
            const droppable = canDropInto(role, column.owner)

            // Only dim while something is actually in flight — a permanently
            // greyed half of the board would read as broken rather than as
            // "not yours to move".
            const blocked = Boolean(dragging) && !droppable

            return (
              <div
                key={column.stage}
                className={`w-[250px] shrink-0 rounded-xl border transition-all ${
                  isTarget && droppable
                    ? 'border-[#5752FE] bg-[#f5f5ff] ring-2 ring-[#5752FE]/20'
                    : 'border-[#E0E0E0] bg-[#FAFAFB]'
                } ${blocked ? 'opacity-40' : ''}`}
                onDragOver={(e) => {
                  // Without preventDefault the browser refuses the drop.
                  e.preventDefault()
                  setHoverStage(column.stage)
                }}
                onDragLeave={() => setHoverStage((s) => (s === column.stage ? null : s))}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(column.stage)
                }}
              >
                <div className="px-3 py-2 border-b border-[#ECECEC] flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700">
                      {STAGE_LABEL[column.stage] ?? column.stage}
                    </span>
                    <span
                      className={`inline-flex w-fit mt-1 px-1.5 py-0.5 rounded-pill text-[10px] font-semibold ${owner.bg} ${owner.text}`}
                    >
                      {column.owner}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {blocked ? `${column.owner} only` : column.count}
                  </span>
                </div>

                <div className="p-2 flex flex-col gap-2 min-h-[120px]">
                  {column.submissions.length === 0 && (
                    <p className="text-[11px] text-slate-400 text-center py-4">Nothing here</p>
                  )}

                  {column.submissions.map((submission) => {
                    const outcome = OUTCOME_CHIP[submission.outcome] ?? NEUTRAL_CHIP
                    const closed = submission.outcome !== 'IN_PROGRESS'

                    return (
                      <div
                        key={submission.submissionNumber}
                        // A closed submission cannot be moved; the server
                        // refuses it, so the card should not invite the drag.
                        draggable={!closed}
                        onDragStart={() => setDragging(submission)}
                        onDragEnd={() => {
                          setDragging(null)
                          setHoverStage(null)
                        }}
                        onClick={() => setOpenSubmission(submission.submissionNumber)}
                        className={`rounded-lg border bg-white p-2 text-left transition-shadow ${
                          closed
                            ? 'border-[#ECECEC] opacity-70 cursor-pointer'
                            : 'border-[#E0E0E0] cursor-grab active:cursor-grabbing hover:shadow-sm'
                        } ${dragging?.submissionNumber === submission.submissionNumber ? 'opacity-40' : ''}`}
                      >
                        <div className="flex items-start gap-1">
                          {!closed && <GripVertical size={12} className="text-slate-300 mt-0.5 shrink-0" />}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {submission.candidateName ?? submission.candidateNumber}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {submission.submissionNumber}
                            </p>
                          </div>
                        </div>

                        {(submission.offeredRate != null || submission.screeningCallMinutes != null) && (
                          <p className="text-[10px] text-slate-500 mt-1 truncate">
                            {submission.offeredRate != null && <>offer {submission.offeredRate}</>}
                            {submission.offeredRate != null &&
                              submission.screeningCallMinutes != null && <> · </>}
                            {submission.screeningCallMinutes != null && (
                              <>{submission.screeningCallMinutes}m call</>
                            )}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-1 mt-2">
                          <span
                            className={`inline-flex px-1.5 py-0.5 rounded-pill text-[10px] font-semibold ${outcome.bg} ${outcome.text}`}
                          >
                            {submission.outcome}
                          </span>
                          <span className="flex items-center gap-1">
                            {/* Visible to HR as well: they are the ones who
                                negotiated the number that broke the budget. */}
                            {submission.overBudget && (
                              <span
                                className="text-[10px] font-semibold text-amber-600"
                                title="Offered rate is above the budget for this role"
                              >
                                over budget
                              </span>
                            )}
                            {showCommercials && submission.margin != null && (
                              <span className="text-[10px] font-semibold text-emerald-600">
                                +{submission.margin}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {openSubmission && (
        <SubmissionDetailPanel
          submissionNumber={openSubmission}
          onClose={() => setOpenSubmission(null)}
          onChanged={reload}
        />
      )}

      {pendingMove && (
        <StageMoveReasonDialog
          candidateName={pendingMove.submission.candidateName ?? pendingMove.submission.submissionNumber}
          fromStage={pendingMove.submission.stage}
          toStage={pendingMove.toStage}
          onCancel={() => setPendingMove(null)}
          onConfirm={confirmBackwardMove}
        />
      )}
    </div>
  )
}
