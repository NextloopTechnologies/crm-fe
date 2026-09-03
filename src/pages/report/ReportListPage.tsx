import { useCallback, useMemo, useState } from 'react'
import { DataTable, ColumnDef } from '@/components/common/Table'
import { Button } from '@/components/ui/button'
import { Clock3, Download, FileText, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatsCard from '@/components/common/StatsCards'
import CustomBadge from '@/components/common/CommonBadge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTES } from '@/lib/route'
import activeUserIcon from '@/assets/icons/svgs/ActiveUsericon.svg'
import { ReportFormData } from '@/components/forms/ReportForm'
import { reportData } from '@/data/report.data'

// ── Static constants — component ke bahar ────────────────────
const getStats = (data: ReportFormData[]) => [
    {
        icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#5752FE1A] flex items-center justify-center"><FileText className="w-6 h-6 text-[#5752FE]" /></div>,
        label: "Total Reports",
        value: data.length,
        subtitle: "All Reports in System",
    },
    {
        icon: <div className="w-[55px] h-[55px] flex items-center justify-center"><img src={activeUserIcon} alt="active user" className="max-w-full max-h-full object-contain" /></div>,
        label: "Scheduled Reports",
        value: data.filter(u => u.status === "active").length,
        subtitle: "Reports running on schedule",
    },
    {
        icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center"><Clock3 className="w-6 h-6 text-[#FBBC05]" /></div>,
        label: "Recently Viewed",
        value: data.filter(u => u.status === "inactive").length,
        subtitle: "Reports viewed recently",
    },
    {
        icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#4285F4]/10 flex items-center justify-center"><Download className="w-6 h-6 text-[#4285F4]" /></div>,
        label: "Total Downloads",
        value: data.filter(u => u.status === "inactive").length,
        subtitle: "All reports downloads",
    },
]

const FILTERS = [
    {
        key: "role",
        label: "Category",
        type: "select" as const,
        options: [
            { label: "Admin", value: "Admin" },
            { label: "Manager", value: "Manager" },
            { label: "Developer", value: "Developer" },
            { label: "Viewer", value: "Viewer" },
        ],
    },
    { key: "createdFrom", label: "Created From", type: "date" as const },
    { key: "createdTo", label: "Created To", type: "date" as const },
]

// ── Reusable renderers ──────────────────
const UserCell = ({ name }: { name: string }) => (
    <div className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
            <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
                {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-[#111127]">{name}</span>
    </div>
)

// ── Component ─────────────────────────────────────────────────
export default function ReportListPage() {
    const [selectedRows, setSelectedRows] = useState<ReportFormData[]>([])
    const navigate = useNavigate()

    const stats = useMemo(() => getStats(reportData), [])

    const columns = useMemo<ColumnDef<ReportFormData>[]>(() => [
        {
            key: "name",
            label: "Report Name",
            width: "180px",
            render: (_, row) => <UserCell name={row.reportName ?? ""} />,
        },
        {
            key: "status",
            label: "Category",
            width: "140px",
            render: (val) => {
                const label = String(val)
                return (
                    <CustomBadge
                        label={label.charAt(0).toUpperCase() + label.slice(1)}
                        className={
                            label === "active"
                                ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-50"
                                : "bg-red-50 text-red-500 border border-red-200 hover:bg-red-50"
                        }
                    />
                )
            },
        },
        {
            key: "location",
            label: "Description",
            width: "220px",
            render: (val) => <span className="text-sm text-[#6b6b8d]">{String(val)}</span>,
        },
        {
            key: "name",
            label: "Created By",
            width: "180px",
            render: (_, row) => <UserCell name={row.username ?? ""} />,
        },
        {
            key: "joinedAt",
            label: "Created At",
            render: (val) => (
                <span className="text-[#6b6b8d] text-sm">
                    {new Date(String(val)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
            ),
        },
        {
            key: "name",
            label: "Schedule",
            width: "220px",
            render: (val) => <span className="text-sm text-[#6b6b8d]">{String(val)}</span>,
        },
    ], [])

    const handleEdit = useCallback(
        (row: ReportFormData) => navigate(ROUTES.REPORTS_EDIT(String(row.id))),
        [navigate]
    )

    const handleDelete = useCallback(() => { }, [])

    const handleRowClick = useCallback(() => { }, [])

    const handleSelection = useCallback(
        (rows: ReportFormData[]) => setSelectedRows(rows),
        []
    )

    const handleDeleteSelected = useCallback(() => { }, [selectedRows])

    const headerActions = useMemo(() => (
        <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
                <Button
                    variant="outline"
                    className="h-9 px-4 text-sm rounded-[10px] border-red-200 text-red-500 hover:bg-red-50 gap-2"
                    onClick={handleDeleteSelected}
                >
                    <Trash2 size={14} />
                    Delete ({selectedRows.length})
                </Button>
            )}
        </div>
    ), [selectedRows.length, handleDeleteSelected])

    return (
        <div className="bg-white min-h-screen rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {stats.map(stat => <StatsCard key={stat.label} {...stat} />)}
            </div>

            <DataTable
                data={reportData}
                columns={columns}
                filters={FILTERS}
                searchable
                searchPlaceholder="Search by name, email, location..."
                selectable
                pageSize={8}
                emptyMessage="No users found."
                headerActions={headerActions}
                onRowClick={handleRowClick}
                onSelectionChange={handleSelection}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}