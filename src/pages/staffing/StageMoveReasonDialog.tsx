import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { STAGE_LABEL } from '@/constants/Staffing'
import type { SubmissionStage } from '@/types/staffing.types'

interface Props {
  candidateName: string
  fromStage: SubmissionStage
  toStage: SubmissionStage
  onCancel: () => void
  onConfirm: (reason: string) => void
}

/**
 * Asked for before a backward move is sent.
 *
 * The API refuses a backward move without a reason, so collecting it here
 * turns a rejected request into a question — and the reason lands in the
 * stage history, which is the only place anyone can later find out why a
 * candidate went back a step.
 */
export default function StageMoveReasonDialog({
  candidateName,
  fromStage,
  toStage,
  onCancel,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState('')
  const trimmed = reason.trim()

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Why is this going back?</DialogTitle>
          <DialogDescription>
            Moving {candidateName} from {STAGE_LABEL[fromStage] ?? fromStage} back to{' '}
            {STAGE_LABEL[toStage] ?? toStage}. This is recorded on the submission's history.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          autoFocus
          rows={3}
          placeholder="e.g. Client asked us to re-check the notice period"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-[#5752FE] hover:bg-[#4a45e0] text-white"
            disabled={trimmed.length === 0}
            onClick={() => onConfirm(trimmed)}
          >
            Move back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
