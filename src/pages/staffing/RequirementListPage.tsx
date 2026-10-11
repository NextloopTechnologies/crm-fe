import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Briefcase, KanbanSquare, Plus, Target, Users } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/common/Table'
import { InlineSelectDropdown } from '@/components/common/InlineSelectDropDown'
import StatsCard from '@/components/common/StatsCards'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { changeRequirementStatus, deleteRequirement, getRequirements } from '@/api/staffing.api'
import { apiErrorMessage, type Requirement } from '@/types/staffing.types'
import {
  NEUTRAL_CHIP,
  PRIORITY_CHIP,
  PRIORITY_OPTIONS,
  REQUIREMENT_STATUS_OPTIONS,
} from '@/constants/Staffing'

/** The demand side: job descriptions waiting to be filled. */
export default function RequirementListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['staffing-requirement'],
    queryFn: getRequirements,
  })

  const rows: Requirement[] = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data],
  )

  const reload = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['staffing-requirement'] }),
    [queryClient],
  )

  const stats = useMemo(() => {
    const open = rows.filter((r) => r.status === 'OPEN')
    // Seats, not requirements: one open role needing four people is four gaps
    // to fill, and counting it as one understates the work outstanding.
    const seats = open.reduce((total, r) => total + (r.positions ?? 1), 0)
    const filled = rows.reduce((total, r) => total + (r.filledPositions ?? 0), 0)

    return [
      {
        icon: <Briefcase className="w-5 h-5" />,
        label: 'Open requirements',
        value: open.length,
        subtitle: 'Accepting submissions',
      },
      {
        icon: <Users className="w-5 h-5" />,
        label: 'Open positions',
        value: seats,
        subtitle: 'Seats still to fill',
      },
      {
        icon: <Target className="w-5 h-5" />,
        label: 'Filled',
        value: filled,
        subtitle: 'Candidates placed',
      },
      {
        icon: <Briefcase className="w-5 h-5" />,
        label: 'Critical',
        value: rows.filter((r) => r.priority === 'CRITICAL').length,
        subtitle: 'Needing attention now',
      },
    ]
  }, [rows])

  const changeStatus = useMutation({
    mutationFn: ({ requirementNumber, status }: { requirementNumber: string; status: string }) =>
      changeRequirementStatus(requirementNumber, status),

    onSuccess: (res) => {
      if (res?.status === 'Success' || res?.code === '0x0200') {
        showToast({ title: 'Status updated', description: res?.description ?? '', type: 'success' })

        // Closing a requirement that still has live candidates is allowed but
        // strands them, so the API says so and the toast passes it on.
        if (res?.warning) {
          showToast({ title: 'Heads up', description: res.warning, type: 'warning' })
        }
      } else {
        showToast({
          title: 'Not updated',
          description: res?.description ?? 'Please try again.',
          type: 'error',
        })
      }
      reload()
    },

    onError: (err: unknown) => {
      showToast({ title: 'Not updated', description: apiErrorMessage(err), type: 'error' })
      reload()
    },
  })

  const handleDelete = useCallback(
    async (row: Requirement | Requirement[]) => {
      const target = Array.isArray(row) ? row[0] : row
      if (!target?.requirementNumber) return
      try {
        await deleteRequirement(target.requirementNumber)
        showToast({
          title: 'Requirement deleted',
          description: `${target.jobTitle} was removed.`,
          type: 'success',
        })
        reload()
      } catch {
        showToast({ title: 'Delete failed', description: 'Please try again.', type: 'error' })
      }
    },
    [reload],
  )

  const columns: ColumnDef<Requirement>[] = useMemo(
    () => [
      {
        key: 'jobTitle',
        label: 'Role',
        width: '220px',
        render: (_, row) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.jobTitle ?? '—'}</span>
            <span className="text-xs text-slate-400">{row.requirementNumber}</span>
          </div>
        ),
      },
      {
        key: 'clientName',
        label: 'Client',
        width: '160px',
        render: (_, row) => row.clientName || <span className="text-slate-400">—</span>,
      },
      {
        key: 'location',
        label: 'Location',
        width: '140px',
        render: (_, row) => row.location || <span className="text-slate-400">—</span>,
      },
      {
        key: 'positions',
        label: 'Filled',
        width: '110px',
        render: (_, row) => {
          const total = row.positions ?? 1
          const filled = row.filledPositions ?? 0
          const done = filled >= total
          return (
            <span className={done ? 'font-semibold text-emerald-600' : 'font-medium'}>
              {filled}/{total}
            </span>
          )
        },
      },
      {
        key: 'skills',
        label: 'Skills',
        width: '200px',
        render: (_, row) => {
          const skills = row.skills ?? []
          if (skills.length === 0) return <span className="text-slate-400">—</span>
          // Two chips and a count, so a role listing ten skills does not set
          // the row height for the whole table.
          return (
            <span className="flex flex-wrap items-center gap-1" title={skills.join(', ')}>
              {skills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex px-2 py-0.5 rounded-pill bg-[#ebebff] text-xs font-medium text-[#5b5bd6]"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 2 && (
                <span className="text-xs font-medium text-[#6b6b8a]">+{skills.length - 2}</span>
              )}
            </span>
          )
        },
      },
      {
        key: 'targetDate',
        label: 'Age',
        width: '130px',
        render: (_, row) => {
          if (!row.creationDate) return <span className="text-slate-400">—</span>

          // creationDate arrives as a SQL timestamp ("2026-09-18 15:49:43.0"),
          // which Safari refuses to parse as a Date. Normalising to ISO keeps
          // this from reading "NaN days" on half the team's browsers.
          const opened = new Date(row.creationDate.replace(' ', 'T').split('.')[0])
          if (Number.isNaN(opened.getTime())) return <span className="text-slate-400">—</span>

          const days = Math.floor((Date.now() - opened.getTime()) / 86_400_000)
          const overdue =
            row.targetDate != null && row.status === 'OPEN' && new Date(row.targetDate) < new Date()

          return (
            <span className="flex flex-col">
              <span className={overdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                {days === 0 ? 'today' : `${days}d open`}
              </span>
              {row.targetDate && (
                <span className={`text-[11px] ${overdue ? 'text-rose-500' : 'text-slate-400'}`}>
                  {overdue ? 'past target' : `by ${row.targetDate}`}
                </span>
              )}
            </span>
          )
        },
      },
      {
        key: 'status',
        label: 'Status',
        width: '150px',
        render: (_, row) => (
          // Stops the click reaching the row handler, which would navigate
          // away the moment the dropdown is opened.
          <span onClick={(e) => e.stopPropagation()} className="block">
            <InlineSelectDropdown
              options={REQUIREMENT_STATUS_OPTIONS}
              value={row.status ?? ''}
              onChange={(next) => {
                if (!next || next === row.status) return
                changeStatus.mutate({ requirementNumber: row.requirementNumber, status: next })
              }}
            />
          </span>
        ),
      },
      {
        key: 'priority',
        label: 'Priority',
        width: '120px',
        render: (_, row) => {
          const cfg = PRIORITY_CHIP[row.priority ?? 'MEDIUM'] ?? NEUTRAL_CHIP
          return (
            <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
              {row.priority ?? '—'}
            </span>
          )
        },
      },
      {
        key: 'board',
        label: 'Board',
        width: '110px',
        render: (_, row) => (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5752FE] hover:underline"
            onClick={(e) => {
              // The row itself opens the edit form, so the board link has to
              // stop the click before it bubbles up to that handler.
              e.stopPropagation()
              navigate(ROUTES.STAFFING_BOARD(row.requirementNumber))
            }}
          >
            <KanbanSquare size={14} /> Open
          </button>
        ),
      },
    ],
    [navigate, changeStatus],
  )

  const filters = useMemo(
    () => [
      { key: 'status', label: 'Status', type: 'select' as const, options: REQUIREMENT_STATUS_OPTIONS },
      { key: 'priority', label: 'Priority', type: 'select' as const, options: PRIORITY_OPTIONS },
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
            onClick={() => navigate(ROUTES.STAFFING_REQUIREMENT_CREATE)}
          >
            <Plus size={14} /> Add Requirement
          </Button>
        </div>

        <DataTable<Requirement>
          data={rows}
          columns={columns}
          loading={isLoading}
          searchable
          searchPlaceholder="Search by role, client or location..."
          emptyMessage="No requirements yet."
          filters={filters}
          onRowClick={(row) => navigate(ROUTES.STAFFING_REQUIREMENT_DETAIL(row.requirementNumber))}
          onEdit={(row) => navigate(ROUTES.STAFFING_REQUIREMENT_EDIT(row.requirementNumber))}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
