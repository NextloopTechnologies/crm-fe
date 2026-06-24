import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable, ColumnDef } from '@/components/common/Table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { usersData, type User } from '../../data/user.data'
import { PlusIcon } from '@/assets/icons/components/PlusIcon'
import { useNavigate } from 'react-router-dom'
import StatsCard from '@/components/common/StatsCards'
import { ActiveUsersIcon, InActiveUsersIcon, TenantsIcon, UsersIcon } from '@/assets/icons/components'
import { ROUTES } from '@/lib/route'
import { getAllAccounts } from '@/api/account.api'

// ── Static helpers — component ke bahar ──────────────────────
const getStats = (data: User[]) => [
  { icon: <UsersIcon />, label: "Total Accounts", value: data.length, subtitle: "All accounts in system" },
  { icon: <ActiveUsersIcon />, label: "Active Accounts", value: data.filter(u => u.status === "active").length, subtitle: "Currently Active" },
  { icon: <InActiveUsersIcon />, label: "Inactive Accounts", value: data.filter(u => u.status === "inactive").length, subtitle: "Currently Inactive" },
  { icon: <TenantsIcon />, label: "Total Contacts", value: data.filter(u => u.role === "Admin").length, subtitle: "Across all accounts" },
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
    label: "Industry",
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

// ── Component ─────────────────────────────────────────────────
export default function AccountListPage() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  const navigate = useNavigate()

  const stats = useMemo(() => getStats(usersData), [])
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setAccountsLoading(true);
        const response = await getAllAccounts();
        setAccounts(response.data || response);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setAccountsLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      key: "accountName",
      label: "Account Name",
      width: "180px",
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.accountName}`} />
            <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
              {row.accountName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[#111127]">{row.accountName}</span>
        </div>
      ),
    },
    { key: "accountOwner", label: "Account Owner", width: "220px", render: (_, row) => <span>{(row as any).accountOwner ?? "—"}</span>, },
    { key: "phone", label: "Phone", width: "220px", render: (_, row) => {
      return (row as any).contacts?.[0]?.phone ?? "—";
    },},
    { key: "website", label: "Website", width: "220px", render: (_, row) => <span>{(row as any).website ?? "—"}</span>, },
    {
      key: "accountSite",
      label: "Account",
      render: (_, row) => <span>{(row as any).accountSite ?? "—"}</span>,
    },
  ], [])

  const handleView = useCallback(
    (row: any) => navigate(ROUTES.ACCOUNTS_EDIT(String(row.accountNumber))),
    [navigate]
  );

  const handleEdit = useCallback(
    (row: any) => navigate(ROUTES.ACCOUNTS_EDIT(String(row.accountNumber))),
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
        onClick={() => navigate(ROUTES.ACCOUNTS_CREATE)}
      >
        <PlusIcon />
        Add Account
      </Button>
    </div>
  ), [selectedRows.length, handleDeleteSelected, navigate])

  return (
    <div className="bg-white min-h-screen rounded-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      <DataTable
        data={accounts}
        columns={columns}
        filters={FILTERS}
        searchable
        searchPlaceholder="Search by name, email, location..."
        selectable
        pageSize={8}
        emptyMessage="No users found."
        headerActions={headerActions}
        loading={accountsLoading}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelection}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  )
}