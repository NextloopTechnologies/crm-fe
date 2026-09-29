import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Loader2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SelectDropdown from '@/components/common/SelectDropdown'
import { showToast } from '@/components/common/Toast'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import {
  deleteCandidateDocument,
  documentUrl,
  getCandidateDocuments,
  uploadCandidateDocument,
} from '@/api/staffing.api'
import { DOCUMENT_VARIANT_OPTIONS, NEUTRAL_CHIP, VARIANT_CHIP } from '@/constants/Staffing'
import { apiErrorMessage, type StaffingDocument } from '@/types/staffing.types'

interface Props {
  candidateNumber: string
}

/** Mirrors the server's cap, so an oversized file is refused before uploading. */
const MAX_BYTES = 10 * 1024 * 1024

const ACCEPT = '.pdf,.doc,.docx'

const readableSize = (bytes?: number) => {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function CandidateDocuments({ candidateNumber }: Props) {
  const queryClient = useQueryClient()
  const role = useCurrentRole()
  const canManage = ['HR', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(role)

  const [variant, setVariant] = useState('ORIGINAL')
  const fileInput = useRef<HTMLInputElement>(null)

  const queryKey = ['staffing-documents', candidateNumber]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getCandidateDocuments(candidateNumber),
    enabled: Boolean(candidateNumber),
  })

  const documents: StaffingDocument[] = Array.isArray(data?.data) ? data.data : []

  const refresh = () => queryClient.invalidateQueries({ queryKey })

  const upload = useMutation({
    mutationFn: (file: File) => uploadCandidateDocument(candidateNumber, file, variant),
    onSuccess: (res) => {
      if (res?.status === 'Success' || res?.code === '0x0200') {
        showToast({ title: 'Uploaded', description: res?.description ?? '', type: 'success' })
        refresh()
      } else {
        // A duplicate or a rejected file type lands here with a readable
        // reason, so it is shown verbatim rather than flattened.
        showToast({
          title: 'Not uploaded',
          description: res?.description ?? 'Please try again.',
          type: 'error',
        })
      }
    },
    onError: (err: unknown) =>
      showToast({ title: 'Not uploaded', description: apiErrorMessage(err), type: 'error' }),
    onSettled: () => {
      // Cleared either way, so re-picking the same file still fires onChange.
      if (fileInput.current) fileInput.current.value = ''
    },
  })

  const remove = useMutation({
    mutationFn: (documentNumber: string) => deleteCandidateDocument(documentNumber),
    onSuccess: (res) => {
      if (res?.status === 'Success' || res?.code === '0x0200') {
        showToast({ title: 'Removed', description: res?.description ?? '', type: 'success' })
        refresh()
      } else {
        showToast({ title: 'Not removed', description: res?.description ?? '', type: 'error' })
      }
    },
    onError: (err: unknown) =>
      showToast({ title: 'Not removed', description: apiErrorMessage(err), type: 'error' }),
  })

  const onPick = (file?: File) => {
    if (!file) return

    if (file.size > MAX_BYTES) {
      showToast({
        title: 'File too large',
        description: `${file.name} is ${readableSize(file.size)}; the limit is 10 MB.`,
        type: 'error',
      })
      if (fileInput.current) fileInput.current.value = ''
      return
    }

    upload.mutate(file)
  }

  return (
    <section className="border border-[#E0E0E0] rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Resumes</h2>
          <p className="text-xs text-slate-500">PDF, DOC or DOCX, up to 10 MB.</p>
        </div>

        {canManage && (
          <div className="flex items-end gap-2">
            <div className="w-[190px]">
              <SelectDropdown
                placeholder="Variant"
                options={DOCUMENT_VARIANT_OPTIONS}
                value={variant}
                onChange={setVariant}
              />
            </div>
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0])}
            />
            <Button
              className="bg-[#5752FE] hover:bg-[#4a45e0] text-white gap-1"
              disabled={upload.isPending}
              onClick={() => fileInput.current?.click()}
            >
              {upload.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} /> Upload
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {isLoading && <Loader2 className="animate-spin text-[#5752FE]" />}

      {!isLoading && documents.length === 0 && (
        <p className="text-xs text-slate-400">
          No resume attached yet{canManage ? ' — upload one above.' : '.'}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {documents.map((doc) => {
          const chip = VARIANT_CHIP[doc.variant] ?? NEUTRAL_CHIP
          return (
            <div
              key={doc.documentNumber}
              className="flex items-center gap-3 border border-[#ECECEC] rounded-lg px-3 py-2"
            >
              <FileText size={16} className="text-slate-400 shrink-0" />

              <div className="min-w-0 flex-1">
                <a
                  // Opened in a tab: the API serves it inline, so a PDF is
                  // readable without a download-then-open round trip.
                  href={documentUrl(doc.documentNumber)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-slate-800 hover:text-[#5752FE] hover:underline truncate block"
                  title={doc.fileName}
                >
                  {doc.fileName}
                </a>
                <p className="text-[11px] text-slate-400">
                  {readableSize(doc.sizeBytes)}
                  {doc.uploadedBy ? ` · ${doc.uploadedBy}` : ''}
                  {doc.creationDate ? ` · ${doc.creationDate.slice(0, 10)}` : ''}
                </p>
              </div>

              <span
                className={`px-2 py-0.5 rounded-pill text-[10px] font-semibold shrink-0 ${chip.bg} ${chip.text}`}
              >
                {doc.variant}
              </span>

              {canManage && (
                <button
                  type="button"
                  className="text-slate-300 hover:text-rose-500 shrink-0"
                  title="Remove this file"
                  aria-label={`Remove ${doc.fileName}`}
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(doc.documentNumber)}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
