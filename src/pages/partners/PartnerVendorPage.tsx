import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Handshake, Plus } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/common/Table'
import StatsCard from '@/components/common/StatsCards'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { deletePartnerVendor, getPartnerVendors } from '@/api/partnerVendor.api'
import type { PartnerVendor, PartnerType } from '@/types/partnerVendor.types'
import {
  PARTNER_PRIORITY_OPTIONS,
  PARTNER_STATUS_OPTIONS,
  PRIORITY_COLOR,
  STATUS_COLOR,
} from '@/constants/PartnerVendor'

/**
 * Partners and vendors live on one screen because they are the same shape of
 * record — the toggle just changes which `partnerType` the API is asked for.
 */
export default function PartnerVendorPage() {
  const navigate = useNavigate()
  const [type, setType] = useState<PartnerType>('PARTNER')
  const queryClient = useQueryClient()

  // Keyed by type, so flipping the toggle refetches and each side stays cached.
  const { data, isLoading: loading } = useQuery({
    queryKey: ['partner-vendor', type],
    queryFn: () => getPartnerVendors(type),
  })

  const rows: PartnerVendor[] = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data],
  )

  const reload = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['partner-vendor'] }),
    [queryClient],
  )

  const noun = type === 'PARTNER' ? 'Partner' : 'Vendor'

  const stats = useMemo(
    () => [
      {
        icon: <Handshake className="w-5 h-5" />,
        label: `Total ${noun}s`,
        value: rows.length,
        subtitle: type === 'PARTNER' ? 'Sharing requirements' : 'Sharing candidate profiles',
      },
      {
        icon: <Handshake className="w-5 h-5" />,
        label: 'Active',
        value: rows.filter((r) => r.status === 'ACTIVE').length,
        subtitle: 'Currently transactable',
      },
      {
        icon: <Handshake className="w-5 h-5" />,
        label: 'High priority',
        value: rows.filter((r) => r.priority === 'HIGH').length,
        subtitle: 'Needing attention',
      },
      {
        icon: <Handshake className="w-5 h-5" />,
        label: 'MSA signed',
        value: rows.filter((r) => r.msaSigned).length,
        subtitle: 'Agreement in place',
      },
    ],
    [rows, noun, type],
  )

  const handleDelete = useCallback(
    async (row: PartnerVendor | PartnerVendor[]) => {
      const target = Array.isArray(row) ? row[0] : row
      if (!target?.partnerNumber) return
      try {
        await deletePartnerVendor(target.partnerNumber)
        showToast({ title: `${noun} deleted`, description: `${target.companyName} was removed.`, type: 'success' })
        reload()
      } catch {
        showToast({ title: 'Delete failed', description: 'Please try again.', type: 'error' })
      }
    },
    [noun, reload],
  )

  const columns: ColumnDef<PartnerVendor>[] = useMemo(
    () => [
      {
        key: 'companyName',
        label: 'Company',
        width: '220px',
        render: (_, row) => <span className="font-medium">{row.companyName ?? '—'}</span>,
      },
      { key: 'partnerNumber', label: `${noun} No.`, width: '150px' },
      { key: 'contactPerson', label: 'Contact', width: '160px' },
      { key: 'email', label: 'Email', width: '220px' },
      { key: 'mobile', label: 'Mobile', width: '140px' },
      {
        key: 'status',
        label: 'Status',
        width: '120px',
        render: (_, row) => {
          const cfg = STATUS_COLOR[row.status ?? ''] ?? { bg: 'bg-slate-100', text: 'text-slate-600' }
          return (
            <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
              {row.status ?? '—'}
            </span>
          )
        },
      },
      {
        key: 'priority',
        label: 'Priority',
        width: '120px',
        render: (_, row) => {
          const cfg = PRIORITY_COLOR[row.priority ?? ''] ?? { bg: 'bg-slate-100', text: 'text-slate-600' }
          return (
            <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
              {row.priority ?? '—'}
            </span>
          )
        },
      },
      {
        key: 'msaSigned',
        label: 'MSA',
        width: '110px',
        render: (_, row) => (
          <span className={row.msaSigned ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
            {row.msaSigned ? 'Signed' : 'Not signed'}
          </span>
        ),
      },
    ],
    [noun],
  )

  const filters = useMemo(
    () => [
      { key: 'status', label: 'Status', type: 'select' as const, options: PARTNER_STATUS_OPTIONS },
      { key: 'priority', label: 'Priority', type: 'select' as const, options: PARTNER_PRIORITY_OPTIONS },
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
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap px-1">
          {/* Partner / Vendor toggle — mirrors the Leads board/list switch */}
          <div className="flex items-center gap-2">
            {(['PARTNER', 'VENDOR'] as PartnerType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={`h-9 px-4 rounded-[10px] text-sm font-medium transition ${
                  type === t
                    ? 'bg-[#5752FE] text-white'
                    : 'border border-[#E0E0E0] text-[#111127] hover:bg-[#f8f8fc]'
                }`}
              >
                {t === 'PARTNER' ? 'Partners' : 'Vendors'}
              </button>
            ))}
          </div>

          <Button
            className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1"
            onClick={() => navigate(ROUTES.PARTNERS_CREATE, { state: { partnerType: type } })}
          >
            <Plus size={14} /> Add {noun}
          </Button>
        </div>

        <DataTable<PartnerVendor>
          data={rows}
          columns={columns}
          loading={loading}
          searchable
          searchPlaceholder={`Search ${noun.toLowerCase()}s...`}
          emptyMessage={`No ${noun.toLowerCase()}s yet.`}
          filters={filters}
          onRowClick={(row) => navigate(ROUTES.PARTNERS_EDIT(row.partnerNumber))}
          onEdit={(row) => navigate(ROUTES.PARTNERS_EDIT(row.partnerNumber))}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
