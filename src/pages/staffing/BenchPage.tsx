import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Folder, FolderPlus, Loader2, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectDropdown from '@/components/common/SelectDropdown'
import { showToast } from '@/components/common/Toast'
import {
  addCandidateToFolder,
  createFolder,
  deleteFolder,
  getBench,
  getCandidates,
  getFolderCandidates,
  getFolderTree,
  removeCandidateFromFolder,
  setBenchStatus,
} from '@/api/staffing.api'
import { BENCH_CHIP, BENCH_STATUS_OPTIONS, NEUTRAL_CHIP } from '@/constants/Staffing'
import { type ApiEnvelope, type BenchStatus, type Candidate, type Folder as FolderNode } from '@/types/staffing.types'

interface BenchRow {
  candidateNumber: string
  fullName: string
  primarySkills?: string
  totalExperienceYears?: number
  currentLocation?: string
  benchStatus?: BenchStatus
  availableFrom?: string | null
}

export default function BenchPage() {
  const queryClient = useQueryClient()

  const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({})
  const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderParent, setNewFolderParent] = useState<number | null>(null)
  const [candidateToAdd, setCandidateToAdd] = useState('')

  const { data: benchData, isLoading: benchLoading } = useQuery({
    queryKey: ['staffing-bench'],
    queryFn: getBench,
  })

  const { data: treeData } = useQuery({
    queryKey: ['staffing-folder'],
    queryFn: getFolderTree,
  })

  const { data: allCandidates } = useQuery({
    queryKey: ['staffing-candidate'],
    queryFn: getCandidates,
  })

  const { data: folderCandidates } = useQuery({
    queryKey: ['staffing-folder-candidates', selectedFolder?.folderId],
    queryFn: () => getFolderCandidates(selectedFolder!.folderId),
    enabled: Boolean(selectedFolder),
  })

  const bench: BenchRow[] = useMemo(
    () => (Array.isArray(benchData?.data) ? benchData.data : []),
    [benchData],
  )

  const tree: FolderNode[] = useMemo(
    () => (Array.isArray(treeData?.data) ? treeData.data : []),
    [treeData],
  )

  const candidateOptions = useMemo(() => {
    const rows: Candidate[] = Array.isArray(allCandidates?.data) ? allCandidates.data : []
    return rows.map((c) => ({
      label: `${c.fullName ?? c.firstName} — ${c.candidateNumber}`,
      value: c.candidateNumber,
    }))
  }, [allCandidates])

  /** Flattened folder list for the parent picker, indented by depth. */
  const folderOptions = useMemo(() => {
    const out: { label: string; value: string }[] = []
    const walk = (nodes: FolderNode[], depth: number) => {
      nodes.forEach((n) => {
        out.push({ label: `${'— '.repeat(depth)}${n.folderName}`, value: String(n.folderId) })
        walk(n.children ?? [], depth + 1)
      })
    }
    walk(tree, 0)
    return out
  }, [tree])

  const refreshFolders = () => {
    queryClient.invalidateQueries({ queryKey: ['staffing-folder'] })
    queryClient.invalidateQueries({ queryKey: ['staffing-folder-candidates'] })
  }

  const handleResult = (res: ApiEnvelope, title: string, after?: () => void) => {
    if (res?.status === 'Success' || res?.code === '0x0200') {
      showToast({ title, description: res?.description ?? '', type: 'success' })
      after?.()
      return
    }
    showToast({ title: 'Not saved', description: res?.description ?? 'Please try again.', type: 'error' })
  }

  const addFolder = useMutation({
    mutationFn: () =>
      createFolder({
        folderName: newFolderName.trim(),
        parentFolderId: newFolderParent ?? undefined,
      }),
    onSuccess: (res) =>
      handleResult(res, 'Folder created', () => {
        setNewFolderName('')
        setNewFolderParent(null)
        refreshFolders()
      }),
  })

  const removeFolder = useMutation({
    mutationFn: (folderId: number) => deleteFolder(folderId),
    onSuccess: (res) =>
      handleResult(res, 'Folder deleted', () => {
        setSelectedFolder(null)
        refreshFolders()
      }),
  })

  const fileCandidate = useMutation({
    mutationFn: () => addCandidateToFolder(selectedFolder!.folderId, candidateToAdd),
    onSuccess: (res) =>
      handleResult(res, 'Filed', () => {
        setCandidateToAdd('')
        refreshFolders()
      }),
  })

  const unfileCandidate = useMutation({
    mutationFn: (candidateNumber: string) =>
      removeCandidateFromFolder(selectedFolder!.folderId, candidateNumber),
    onSuccess: (res) => handleResult(res, 'Removed', refreshFolders),
  })

  const updateBench = useMutation({
    mutationFn: ({
      candidateNumber,
      status,
      availableFrom,
    }: {
      candidateNumber: string
      status: string
      availableFrom?: string
    }) => setBenchStatus(candidateNumber, { benchStatus: status, availableFrom }),
    onSuccess: (res) =>
      handleResult(res, 'Bench updated', () => {
        queryClient.invalidateQueries({ queryKey: ['staffing-bench'] })
        queryClient.invalidateQueries({ queryKey: ['staffing-candidate'] })
      }),
  })

  const renderFolder = (node: FolderNode, depth: number) => {
    const hasChildren = (node.children ?? []).length > 0
    const isOpen = openFolders[node.folderId] ?? depth === 0
    const isSelected = selectedFolder?.folderId === node.folderId

    return (
      <div key={node.folderId}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer text-sm ${
            isSelected ? 'bg-[#ebebff] text-[#5b5bd6] font-medium' : 'hover:bg-slate-50'
          }`}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          onClick={() => setSelectedFolder(node)}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpenFolders((prev) => ({ ...prev, [node.folderId]: !isOpen }))
              }}
              className="text-slate-400"
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-[14px]" />
          )}
          <Folder size={14} className="text-slate-400" />
          <span className="truncate flex-1">{node.folderName}</span>
          <span className="text-xs text-slate-400">{node.candidateCount}</span>
        </div>

        {isOpen && (node.children ?? []).map((child) => renderFolder(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen rounded-xl p-4">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Bench</h1>
        <p className="text-xs text-gray-500">
          Who is free, and how HR has filed them. A candidate can sit in several folders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Folders ── */}
        <div className="border border-[#E0E0E0] rounded-lg p-3">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Folders</h2>

          <div className="flex flex-col gap-2 mb-3">
            <Input
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <SelectDropdown
              placeholder="Top level"
              options={folderOptions}
              value={newFolderParent == null ? '' : String(newFolderParent)}
              onChange={(v) => setNewFolderParent(v ? Number(v) : null)}
            />
            <Button
              className="bg-[#5752FE] hover:bg-[#4a45e0] text-white gap-1"
              disabled={newFolderName.trim() === '' || addFolder.isPending}
              onClick={() => addFolder.mutate()}
            >
              <FolderPlus size={14} /> Create folder
            </Button>
          </div>

          <div className="border-t border-[#ECECEC] pt-2">
            {tree.length === 0 && <p className="text-xs text-slate-400 py-2">No folders yet.</p>}
            {tree.map((node) => renderFolder(node, 0))}
          </div>
        </div>

        {/* ── Folder contents ── */}
        <div className="border border-[#E0E0E0] rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800">
              {selectedFolder ? selectedFolder.folderName : 'Folder contents'}
            </h2>
            {selectedFolder && (
              <button
                type="button"
                className="text-slate-400 hover:text-rose-500"
                title="Delete folder"
                onClick={() => removeFolder.mutate(selectedFolder.folderId)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {!selectedFolder && <p className="text-xs text-slate-400">Pick a folder on the left.</p>}

          {selectedFolder && (
            <>
              <div className="flex flex-col gap-2 mb-3">
                <SelectDropdown
                  placeholder="Add a candidate"
                  options={candidateOptions}
                  value={candidateToAdd}
                  onChange={setCandidateToAdd}
                />
                <Button
                  variant="outline"
                  disabled={!candidateToAdd || fileCandidate.isPending}
                  onClick={() => fileCandidate.mutate()}
                >
                  Add to folder
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                {(folderCandidates?.data ?? []).length === 0 && (
                  <p className="text-xs text-slate-400">Nobody filed here yet.</p>
                )}
                {(folderCandidates?.data ?? []).map((c: BenchRow) => (
                  <div
                    key={c.candidateNumber}
                    className="flex items-center justify-between gap-2 text-sm px-2 py-1.5 rounded-lg hover:bg-slate-50"
                  >
                    <span className="truncate">{c.fullName}</span>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-rose-500"
                      title="Remove from folder"
                      onClick={() => unfileCandidate.mutate(c.candidateNumber)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Bench list ── */}
        <div className="border border-[#E0E0E0] rounded-lg p-3">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">
            Available ({bench.length})
          </h2>

          {benchLoading && <Loader2 className="animate-spin text-[#5752FE]" />}

          {!benchLoading && bench.length === 0 && (
            <p className="text-xs text-slate-400">Nobody is on the bench.</p>
          )}

          <div className="flex flex-col gap-2">
            {bench.map((row) => {
              const cfg = row.benchStatus ? BENCH_CHIP[row.benchStatus] ?? NEUTRAL_CHIP : NEUTRAL_CHIP
              return (
                <div key={row.candidateNumber} className="border border-[#ECECEC] rounded-lg p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{row.fullName}</span>
                    <span className={`px-2 py-0.5 rounded-pill text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                      {row.benchStatus?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{row.primarySkills ?? '—'}</p>
                  {row.availableFrom && (
                    <p className="text-[11px] text-slate-400">From {row.availableFrom}</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="border-t border-[#ECECEC] mt-3 pt-3">
            <h3 className="text-xs font-semibold text-slate-700 mb-2">Set bench status</h3>
            <BenchStatusForm
              candidateOptions={candidateOptions}
              pending={updateBench.isPending}
              onSubmit={(candidateNumber, status, availableFrom) =>
                updateBench.mutate({ candidateNumber, status, availableFrom })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface BenchStatusFormProps {
  candidateOptions: { label: string; value: string }[]
  pending: boolean
  onSubmit: (candidateNumber: string, status: string, availableFrom?: string) => void
}

function BenchStatusForm({ candidateOptions, pending, onSubmit }: BenchStatusFormProps) {
  const [candidateNumber, setCandidateNumber] = useState('')
  const [status, setStatus] = useState('')
  const [availableFrom, setAvailableFrom] = useState('')

  // The API refuses AVAILABLE_SOON without a date, so the button waits for it
  // rather than letting the request bounce.
  const needsDate = status === 'AVAILABLE_SOON'
  const ready = candidateNumber && status && (!needsDate || availableFrom)

  return (
    <div className="flex flex-col gap-2">
      <SelectDropdown
        placeholder="Candidate"
        options={candidateOptions}
        value={candidateNumber}
        onChange={setCandidateNumber}
      />
      <SelectDropdown
        placeholder="Status"
        options={BENCH_STATUS_OPTIONS}
        value={status}
        onChange={setStatus}
      />
      {needsDate && (
        <Input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
      )}
      <Button
        variant="outline"
        disabled={!ready || pending}
        onClick={() => onSubmit(candidateNumber, status, availableFrom || undefined)}
      >
        {pending ? 'Saving...' : 'Update'}
      </Button>
    </div>
  )
}
