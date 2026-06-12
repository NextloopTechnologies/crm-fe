import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable, ColumnDef } from '@/components/common/Table'
import { Button } from '@/components/ui/button'
import { Calendar, ClipboardList, Clock3, Trash2 } from 'lucide-react'
import { usersData, type User } from '../../data/user.data'
import { PlusIcon } from '@/assets/icons/components/PlusIcon'
import { useNavigate } from 'react-router-dom'
import StatsCard from '@/components/common/StatsCards'
import CustomBadge from '@/components/common/CommonBadge'
import activeUserIcon from '@/assets/icons/svgs/ActiveUsericon.svg'
import { ROUTES } from '@/lib/route'
import { getAllAccounts } from '@/api/account.api'
import { getAllTasks } from '@/api/tasks.api'

// ── Static constants — component ke bahar ────────────────────
const getStats = (data: User[]) => [
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#5752FE1A] flex items-center justify-center"><ClipboardList className="w-6 h-6 text-[#5752FE]" /></div>,
    label: "Total Tasks",
    value: data.length,
    subtitle: "All Tasks in System",
  },
  {
    icon: <div className="w-[55px] h-[55px] flex items-center justify-center"><img src={activeUserIcon} alt="active user" className="max-w-full max-h-full object-contain" /></div>,
    label: "Completed Tasks",
    value: data.filter(u => u.status === "active").length,
    subtitle: "% of total tasks",
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center"><Clock3 className="w-6 h-6 text-[#FBBC05]" /></div>,
    label: "In Progress",
    value: data.filter(u => u.status === "inactive").length,
    subtitle: "% of total tasks",
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-red-100 flex items-center justify-center"><Calendar className="w-6 h-6 text-red-600" /></div>,
    label: "Overdue",
    value: data.filter(u => u.status === "inactive").length,
    subtitle: "% of total tasks",
  },
]

const FILTERS = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    key: "role",
    label: "Priority",
    type: "select" as const,
    options: [
      { label: "Admin", value: "Admin" },
      { label: "Manager", value: "Manager" },
      { label: "Developer", value: "Developer" },
      { label: "Viewer", value: "Viewer" },
    ],
  },
  { key: "dueDateFrom", label: "Due Date From", type: "date" as const },
  { key: "dueDateTo", label: "Due Date To", type: "date" as const },
  { key: "createdFrom", label: "Created From", type: "date" as const },
  { key: "createdTo", label: "Created To", type: "date" as const },
]

// ── Reusable renderers ────────────────────────────────────────
const TextCell = ({ val }: { val: unknown }) => (
  <span className="text-sm text-[#6b6b8d]">{String(val)}</span>
)

const BadgeCell = ({ val }: { val: unknown }) => {
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
}

// ── Component ─────────────────────────────────────────────────
export default function TaskListPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([]);
  const navigate = useNavigate()
  const [tasksLoading, setTasksLoading] = useState(true);

  const stats = useMemo(() => getStats(tasks), [])

  useEffect(() => {
      const fetchAccounts = async () => {
        try {
          setTasksLoading(true);
          const response = await getAllTasks();
          setTasks(response.data || response);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setTasksLoading(false);
        }
      };
      fetchAccounts();
    }, []);
    
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      key: "subject",
      label: "Subject",
      width: "180px",
      render: (_, row) => <span>{(row as any).subject ?? "—"}</span>, },
    
    {
      key: "joinedAt",
      label: "Due Date",
      render: (_, row) => (
        <span className="text-[#6b6b8d] text-sm">
          {new Date(String((row as any).dueDate ?? "-")).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      ),
    },
    { key: "status", label: "Status", width: "140px", render: (_,row) => <BadgeCell val={(row as any).status} /> },
    { key: "priority", label: "Priority", width: "140px", render: (_,row) => <BadgeCell val={(row as any).priority} /> },
    { key: "location", label: "Related To", width: "220px", render: (_,row) => <TextCell val={(row as any).relatedToType} /> },
    // { key: "contactName", label: "Contact Name", width: "220px", render: (_,row) => <TextCell val={(row as any).contactName} /> },
    { key: "taskOwner", label: "Task Owner", width: "220px", render: (_,row) => <TextCell val={(row as any).taskOwner} /> },
  ], [])

  const handleEdit = useCallback(
    (row: any) => navigate(ROUTES.TASKS_EDIT(String(row.taskNumber))),
    [navigate]
  )

  const handleDelete = useCallback((row: User | User[]) => { }, [])

  const handleRowClick = useCallback((row: User) => { }, [])

  const handleSelection = useCallback(
    (rows: User[]) => setSelectedRows(rows),
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
        onClick={() => navigate(ROUTES.TASKS_CREATE)}
      >
        <PlusIcon />
        Add Task
      </Button>
    </div>
  ), [selectedRows.length, handleDeleteSelected, navigate])

  return (
    <div className="bg-white min-h-screen rounded-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(stat => <StatsCard key={stat.label} {...stat} />)}
      </div>

      <DataTable
        data={tasks}
        columns={columns}
        filters={FILTERS}
        searchable
        searchPlaceholder="Search by name, email, location..."
        selectable
        pageSize={8}
        emptyMessage="No users found."
        headerActions={headerActions}
        loading={tasksLoading}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelection}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}