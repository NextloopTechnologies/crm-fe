// pages/Users/UsersList.tsx
import { useCallback, useMemo, useState } from 'react';
import { DataTable, ColumnDef, } from '@/components/common/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, } from 'lucide-react';
import { usersData, type User } from '../../data/user.data';
import { ActiveUsersIcon, InActiveUsersIcon, TenantsIcon, UsersIcon } from '@/assets/icons/components/index';
import { useNavigate } from "react-router-dom";
import StatsCard from '@/components/common/StatsCards';
import CustomBadge from "@/components/common/CommonBadge";
import { ROUTES } from '@/lib/route';

const roleColors: Record<string, string> = {
    Admin:
        "bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-50",
    Manager:
        "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50",
    Sales:
        "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-50",
};

const stats = [
    {
        icon: <UsersIcon />,
        label: "Total Users",
        value: usersData.length,
        subtitle: "All Users in System",
    },
    {
        icon: <ActiveUsersIcon />,
        label: "Active",
        value: usersData.filter((u) => u.status === "active").length,
        subtitle: "Currently Active",
    },
    {
        icon: <InActiveUsersIcon />,
        label: "Inactive",
        value: usersData.filter((u) => u.status === "inactive").length,
        subtitle: "Currently Inactive",
    },
    {
        icon: <TenantsIcon />,
        label: "Admins",
        value: usersData.filter((u) => u.role === "Admin").length,
        subtitle: "Tenants",
    },
];

const FILTERS = [
    {
        key: "role",
        label: "Role",
        type: "select" as const,
        options: [
            { label: "Admin", value: "Admin" },
            { label: "Manager", value: "Manager" },
            { label: "Developer", value: "Developer" },
            { label: "Viewer", value: "Viewer" },
        ],
    },
    {
        key: "status",
        label: "Status",
        type: "select" as const,
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
    },
    { key: "createdFrom", label: "Created From", type: "date" as const },
    { key: "createdTo", label: "Created To", type: "date" as const },
    { key: "lastLoginFrom", label: "Last Login From", type: "date" as const },
    { key: "lastLoginTo", label: "Last Login To", type: "date" as const },
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

export default function UsersList() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const navigate = useNavigate();

    // ── Columns ───────────────────────────────────────────────────────────────────
    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            key: "name",
            label: "Name",
            width: "180px",
            render: (_, row) => <UserCell name={row.name} />,
        },
        {
            key: "email",
            label: "Email",
            width: "220px",
            render: (val) => (
                <span className="text-sm text-[#6b6b8d]">{String(val)}</span>
            ),
        },
        {
            key: "role",
            label: "Role",
            width: "140px",
            render: (val) => (
                <CustomBadge
                    label={String(val)}
                    className={
                        roleColors[String(val)] ??
                        "bg-gray-100 text-gray-600 border border-gray-200"
                    }
                />
            ),
        },
        {
            key: "status",
            label: "Status",
            width: "140px",
            render: (val) => (
                <CustomBadge
                    label={
                        String(val).charAt(0).toUpperCase() +
                        String(val).slice(1)
                    }
                    className={
                        String(val) === "active"
                            ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-50"
                            : "bg-red-50 text-red-500 border border-red-200 hover:bg-red-50"
                    }
                />
            ),
        },
        {
            key: "location",
            label: "Last Login",
        },
        {
            key: "joinedAt",
            label: "Created At",
            render: (val) => (
                <span className="text-[#6b6b8d] text-sm">
                    {new Date(String(val)).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                    })}
                </span>
            ),
        },
    ], [])

    const handleEdit = useCallback((row: User) => navigate(ROUTES.REPORTS_EDIT(String(row.id))), [navigate])
    const handleDelete = useCallback((row: User | User[]) => console.log("Delete", row), [])
    const handleRowClick = useCallback((row: User) => console.log("Row clicked", row), [])
    const handleSelection = useCallback((rows: User[]) => setSelectedRows(rows), [])
    const handleDeleteSelected = useCallback(() => console.log("Delete selected", selectedRows), [selectedRows])

    // ── Header Actions (Filter + Add User) ────────────────────────────────────
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

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {stats.map((stat) => (
                    <StatsCard
                        key={stat.label}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        subtitle={stat.subtitle}
                    />
                ))}
            </div>

            {/* Table */}
            <DataTable
                data={usersData}
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
    );
}