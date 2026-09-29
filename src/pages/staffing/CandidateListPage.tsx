import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, UserCheck, UserPlus, Users } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/common/Table'
import StatsCard from '@/components/common/StatsCards'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { deleteCandidate, getCandidates } from '@/api/staffing.api'
import type { Candidate } from '@/types/staffing.types'
import { BENCH_CHIP, BENCH_STATUS_OPTIONS, NEUTRAL_CHIP } from '@/constants/Staffing'

/** The people pool — reused across requirements rather than per submission. */
export default function CandidateListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['staffing-candidate'],
    queryFn: getCandidates,
  })

  const rows: Candidate[] = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data],
  )

  const reload = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['staffing-candidate'] }),
    [queryClient],
  )

  const stats = useMemo(
    () => [
      {
        icon: <Users className="w-5 h-5" />,
        label: 'Total candidates',
        value: rows.length,
        subtitle: 'In the pool',
      },
      {
        icon: <UserCheck className="w-5 h-5" />,
        label: 'On bench',
        value: rows.filter((r) => r.benchStatus === 'ON_BENCH').length,
        subtitle: 'Free right now',
      },
      {
        icon: <UserPlus className="w-5 h-5" />,
        label: 'Available soon',
        value: rows.filter((r) => r.benchStatus === 'AVAILABLE_SOON').length,
        subtitle: 'Rolling off',
      },
      {
        icon: <Users className="w-5 h-5" />,
        label: 'Deployed',
        value: rows.filter((r) => r.benchStatus === 'DEPLOYED').length,
        subtitle: 'Placed with a client',
      },
    ],
    [rows],
  )

  const handleDelete = useCallback(
    async (row: Candidate | Candidate[]) => {
      const target = Array.isArray(row) ? row[0] : row
      if (!target?.candidateNumber) return
      try {
        await deleteCandidate(target.candidateNumber)
        showToast({
          title: 'Candidate removed',
          description: `${target.fullName ?? target.firstName} was removed from the pool.`,
          type: 'success',
        })
        reload()
      } catch {
        showToast({ title: 'Delete failed', description: 'Please try again.', type: 'error' })
      }
    },
    [reload],
  )

  const columns: ColumnDef<Candidate>[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: 'Candidate',
        width: '200px',
        render: (_, row) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.fullName ?? row.firstName}</span>
            <span className="text-xs text-slate-400">{row.candidateNumber}</span>
          </div>
        ),
      },
      {
        key: 'email',
        label: 'Email',
        width: '200px',
        render: (_, row) => row.email || <span className="text-slate-400">—</span>,
      },
      {
        key: 'phone',
        label: 'Phone',
        width: '140px',
        render: (_, row) => row.phone || <span className="text-slate-400">—</span>,
      },
      {
        key: 'totalExperienceYears',
        label: 'Exp.',
        width: '90px',
        render: (_, row) =>
          row.totalExperienceYears != null ? `${row.totalExperienceYears} yrs` : <span className="text-slate-400">—</span>,
      },
      {
        key: 'primarySkills',
        label: 'Skills',
        width: '200px',
        render: (_, row) =>
          row.primarySkills ? (
            <span className="text-xs text-slate-600 line-clamp-1" title={row.primarySkills}>
              {row.primarySkills}
            </span>
          ) : (
            <span className="text-slate-400">—</span>
          ),
      },
      {
        key: 'noticePeriodDays',
        label: 'Notice',
        width: '100px',
        render: (_, row) =>
          row.noticePeriodDays != null ? `${row.noticePeriodDays} d` : <span className="text-slate-400">—</span>,
      },
      {
        key: 'benchStatus',
        label: 'Bench',
        width: '140px',
        render: (_, row) => {
          if (!row.benchStatus) return <span className="text-slate-400">—</span>
          const cfg = BENCH_CHIP[row.benchStatus] ?? NEUTRAL_CHIP
          return (
            <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
              {row.benchStatus.replace('_', ' ')}
            </span>
          )
        },
      },
    ],
    [],
  )

  const filters = useMemo(
    () => [
      { key: 'benchStatus', label: 'Bench', type: 'select' as const, options: BENCH_STATUS_OPTIONS },
    ],
    [],
  )

  return (
    <div className="bg-white min-h-screen rounded-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-1">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      <div className="border border-[#E0E0E0] p-4 rounded-lg">
        <div className="flex items-center justify-end gap-3 mb-4 flex-wrap px-1">
          <Button
            className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1"
            onClick={() => navigate(ROUTES.STAFFING_CANDIDATE_CREATE)}
          >
            <Plus size={14} /> Add Candidate
          </Button>
        </div>

        <DataTable<Candidate>
          data={rows}
          columns={columns}
          loading={isLoading}
          searchable
          searchPlaceholder="Search by name, email or skills..."
          emptyMessage="No candidates yet."
          filters={filters}
          onRowClick={(row) => navigate(ROUTES.STAFFING_CANDIDATE_EDIT(row.candidateNumber))}
          onEdit={(row) => navigate(ROUTES.STAFFING_CANDIDATE_EDIT(row.candidateNumber))}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
