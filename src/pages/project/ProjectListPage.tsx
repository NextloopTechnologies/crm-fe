import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable, ColumnDef } from '@/components/common/Table'
import { Button } from '@/components/ui/button'
import { Calendar, ClipboardList, Clock3, Trash2 } from 'lucide-react'
import { PlusIcon } from '@/assets/icons/components/PlusIcon'
import { useNavigate } from 'react-router-dom'
import StatsCard from '@/components/common/StatsCards'
import CustomBadge from '@/components/common/CommonBadge'
import activeUserIcon from '@/assets/icons/svgs/ActiveUsericon.svg'
import { ROUTES } from '@/lib/route'
import { getAllProjects } from '@/api/projects.api'
import { Label } from 'radix-ui'
import { formatDate, parseDateOnly } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


// ── Static constants ──────────────────────────────────────────
const getStats = (data: any[]) => [
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#5752FE1A] flex items-center justify-center"><ClipboardList className="w-6 h-6 text-[#5752FE]" /></div>,
    label: "Total Projects",
    value: data.length,
    subtitle: "All Projects in System",
  },
  {
    icon: <div className="w-[55px] h-[55px] flex items-center justify-center"><img src={activeUserIcon} alt="active user" className="max-w-full max-h-full object-contain" /></div>,
    label: "Completed Projects",
    value: data.filter(p => p.projectStatus === "Completed").length,
    subtitle: "% of total projects",
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center"><Clock3 className="w-6 h-6 text-[#FBBC05]" /></div>,
    label: "In Progress",
    value: data.filter(p => p.projectStatus === "In Progress").length,
    subtitle: "% of total projects",
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-red-100 flex items-center justify-center"><Calendar className="w-6 h-6 text-red-600" /></div>,
    label: "On Hold",
    value: data.filter(p => p.projectStatus === "On Hold").length,
    subtitle: "% of total projects",
  },
]

const FILTERS = [
  {
    key: "projectStatus",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Planning", value: "Planning" },
      { label: "In Progress", value: "In Progress" },
      { label: "On Hold", value: "On Hold" },
      { label: "Completed", value: "Completed" },
      { label: "Cancelled", value: "Cancelled" },
    ],
  },
  {
    key: "projectType",
    label: "Project Type",
    type: "select" as const,
    options: [
      { label: "Backend", value: "Backend" },
      { label: "Frontend", value: "Frontend" },
      { label: "Full Stack", value: "Full Stack" },
      { label: "Mobile", value: "Mobile" },
      { label: "Other" , value: "Value"}
    ],
  },
  { key: "startDateFrom", label: "Start Date From", type: "date" as const },
  { key: "startDateTo", label: "Start Date To", type: "date" as const },
  { key: "endDateFrom", label: "End Date From", type: "date" as const },
  { key: "endDateTo", label: "End Date To", type: "date" as const },
]

// ── Reusable renderers ────────────────────────────────────────
const TextCell = ({ val }: { val: unknown }) => (
  <span className="text-sm text-[#6b6b8d]">{String(val)}</span>
)

const BadgeCell = ({ val }: { val: unknown }) => {
  const label = String(val)
  const badgeStyles: Record<string, string> = {
    "Planning":    "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50",
    "In Progress": "bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-50",
    "On Hold":     "bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-50",
    "Completed":   "bg-green-50 text-green-600 border border-green-200 hover:bg-green-50",
    "Cancelled":   "bg-red-50 text-red-500 border border-red-200 hover:bg-red-50",
  }
  return (
    <CustomBadge
      label={label}
      className={badgeStyles[label] ?? "bg-gray-50 text-gray-500 border border-gray-200"}
    />
  )
}

const PriorityBadge = ({ val }: { val: unknown }) => {
  const label = String(val)
  const styles: Record<string, string> = {
    "High":   "bg-red-50 text-red-500 border border-red-200 hover:bg-red-50",
    "Medium": "bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-50",
    "Low":    "bg-green-50 text-green-600 border border-green-200 hover:bg-green-50",
  }
  return (
    <CustomBadge
      label={label}
      className={styles[label] ?? "bg-gray-50 text-gray-500 border border-gray-200"}
    />
  )
}

// ── Component ─────────────────────────────────────────────────
export default function ProjectListPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [projectsloading, setProjectsLoading] = useState(false)
  const navigate = useNavigate()

  const stats = useMemo(() => getStats(projects), [projects])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true)
        const response = await getAllProjects()
        setProjects(response.data || response)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setProjectsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      key: "projectName",
      label: "Project Name",
      width: "180px",
      render: (_, row) => (
        <span className="text-sm font-medium text-[#1a1a2e]">
          {(row as any).projectName ?? "—"}
        </span>
      ),
    },
    {
      key: "projectStatus",
      label: "Status",
      width: "140px",
      render: (_, row) => <BadgeCell val={(row as any).projectStatus ?? "—"} />,
    },
    {
      key: "projectType",
      label: "Project Type",
      width: "140px",
      render: (_, row) => <TextCell val={(row as any).projectType ?? "—"} />,
    },
    { 
      key: "assignee", 
      label: "Owner", 
      width: "220px", 
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.assignee}`} />
            <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
              {row.taskOwner?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-[#6b6b8d]">{row.assignee ?? "—"}</span>
        </div>
      )
    },
    {
      key: "startDate",
      label: "Start Date",
      width: "130px",
      render: (_, row) => (
        <span className="text-[#6b6b8d] text-sm">
          {parseDateOnly(String((row as any).startDate ?? "NA"))}
        </span>
      ),
    },
    {
      key: "endDate",
      label: "End Date",
      width: "130px",
      render: (_, row) => (
        <span className="text-[#6b6b8d] text-sm">
          {parseDateOnly(String((row as any).endDate ?? "NA"))}
        </span>
      ),
    },
  ], [])


  const handleView = useCallback(
    (row: any) => navigate(ROUTES.PROJECT_EDIT(String(row.projectNumber))),
    [navigate]

  );
  const handleEdit = useCallback(
    (row: any) => {
      navigate(ROUTES.PROJECT_EDIT(String(row.projectNumber)));
    },
    [navigate]
  );

  const handleDelete = useCallback((row: any | any[]) => { }, [])

  const handleRowClick = useCallback((row: any) => { }, [])

  const handleSelection = useCallback(
    (rows: any[]) => setSelectedRows(rows),
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
      <Button
        className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1"
        onClick={() => navigate(ROUTES.PROJECT_CREATE)}
      >
        <PlusIcon />
        Add Project
      </Button>
    </div>
  ), [selectedRows.length, handleDeleteSelected, navigate])

  return (
    <div className="bg-white min-h-screen rounded-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(stat => <StatsCard key={stat.label} {...stat} />)}
      </div>

      <DataTable
        data={projects}
        columns={columns}
        filters={FILTERS}
        searchable
        searchPlaceholder="Search by project name, owner, assignee..."
        selectable
        pageSize={8}
        loading={projectsloading}
        emptyMessage="No projects found."
        headerActions={headerActions}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelection}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  )
}