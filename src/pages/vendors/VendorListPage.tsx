import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Handshake, Plus } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/components/common/Table'
import StatsCard from '@/components/common/StatsCards'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { deleteVendor, getVendors } from '@/api/vendor.api'
import type { Vendor } from '@/types/vendor.types'
import {
  PRIORITY_COLOR,
  STATUS_COLOR,
  VENDOR_PRIORITY_OPTIONS,
  VENDOR_STATUS_OPTIONS,
} from '@/constants/Vendor'

/** Vendors share candidate profiles. Hiring partners are accounts with accountType "Partner". */
export default function VendorListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading: loading } = useQuery({
    queryKey: ['vendor'],
    queryFn: getVendors,
  })

  const rows: Vendor[] = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data])

  const reload = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['vendor'] }),
    [queryClient],
  )

  const stats = useMemo(
    () => [
      {
        icon: <Handshake className="w-5 h-5" />,
        label: 'Total Vendors',
        value: rows.length,
        subtitle: 'Sharing candidate profiles',
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
    [rows],
  )

  const handleDelete = useCallback(
    async (row: Vendor | Vendor[]) => {
      const target = Array.isArray(row) ? row[0] : row
      if (!target?.vendorNumber) return
      try {
        await deleteVendor(target.vendorNumber)
        showToast({ title: 'Vendor deleted', description: `${target.companyName} was removed.`, type: 'success' })
        reload()
      } catch {
        showToast({ title: 'Delete failed', description: 'Please try again.', type: 'error' })
      }
    },
    [reload],
  )

  const columns: ColumnDef<Vendor>[] = useMemo(
    () => [
      {
        key: 'companyName',
        label: 'Company',
        width: '220px',
        render: (_, row) => <span className="font-medium">{row.companyName ?? '—'}</span>,
      },
      { key: 'vendorNumber', label: 'Vendor No.', width: '150px' },
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
    [],
  )

  const filters = useMemo(
    () => [
      { key: 'status', label: 'Status', type: 'select' as const, options: VENDOR_STATUS_OPTIONS },
      { key: 'priority', label: 'Priority', type: 'select' as const, options: VENDOR_PRIORITY_OPTIONS },
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
            onClick={() => navigate(ROUTES.VENDORS_CREATE)}
          >
            <Plus size={14} /> Add Vendor
          </Button>
        </div>

        <DataTable<Vendor>
          data={rows}
          columns={columns}
          loading={loading}
          searchable
          searchPlaceholder="Search vendors..."
          emptyMessage="No vendors yet."
          filters={filters}
          onRowClick={(row) => navigate(ROUTES.VENDORS_EDIT(row.vendorNumber))}
          onEdit={(row) => navigate(ROUTES.VENDORS_EDIT(row.vendorNumber))}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
