// pages/Users/UsersList.tsx
import { useState } from 'react';
import { DataTable, ColumnDef, RowAction } from '@/components/common/Table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, UserPlus } from 'lucide-react';
import { usersData, type User } from '../../data/user.data';
import { ActiveUsersIcon, InActiveUsersIcon, TenantsIcon, UsersIcon } from '@/assets/icons/components/index';
// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => (
    <Badge
        className={
            status === "active"
                ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-50"
                : "bg-red-50 text-red-500 border border-red-200 hover:bg-red-50"
        }
    >
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${status === "active" ? "bg-green-500" : "bg-red-400"}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
);

// ── Role Badge ────────────────────────────────────────────────────────────────
const roleColors: Record<string, string> = {
    Admin: "bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-50",
    Manager: "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50",
    Developer: "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-50",
    Viewer: "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-50",
};

const RoleBadge = ({ role }: { role: string }) => (
    <Badge className={roleColors[role] ?? "bg-gray-100 text-gray-600"}>
        {role}
    </Badge>
);

// ── User Cell ─────────────────────────────────────────────────────────────────
const UserCell = ({ name, email }: { name: string; email: string }) => (
    <div className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
            <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
                {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <span className="text-sm font-medium text-[#111127]">{name}</span>
            <span className="text-xs text-[#9898b3]">{email}</span>
        </div>
    </div>
);

// ── Columns ───────────────────────────────────────────────────────────────────
const columns: ColumnDef<User>[] = [
    {
        key: "name",
        label: "Name",
        sortable: true,
        width: "180px",
        render: (_, row) => (
            <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.name}`} />
                    <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
                        {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-[#111127]">{row.name}</span>
            </div>
        ),
    },
    {
        key: "email",
        label: "Email",
        sortable: true,
        width: "220px",
        render: (val) => (
            <span className="text-sm text-[#6b6b8d]">{String(val)}</span>
        ),
    },
    {
        key: "phone",
        label: "Phone",
        sortable: false,
    },
    {
        key: "role",
        label: "Role",
        sortable: true,
        render: (val) => <RoleBadge role={String(val)} />,
    },
    {
        key: "status",
        label: "Status",
        sortable: true,
        render: (val) => <StatusBadge status={String(val)} />,
    },
    {
        key: "location",
        label: "Location",
        sortable: true,
    },
    {
        key: "joinedAt",
        label: "Joined",
        sortable: true,
        render: (val) => (
            <span className="text-[#6b6b8d] text-sm">
                {new Date(String(val)).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                })}
            </span>
        ),
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function UsersList() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const rowActions: RowAction<User>[] = [
        {
            label: "View",
            icon: <Eye size={14} />,
            onClick: (row) => console.log("View", row),
        },
        {
            label: "Edit",
            icon: <Pencil size={14} />,
            onClick: (row) => console.log("Edit", row),
        },
        {
            label: "Delete",
            icon: <Trash2 size={14} />,
            onClick: (row) => console.log("Delete", row),
            className: "text-red-500 focus:text-red-500",
        },
    ];

    return (
        <div className="bg-white min-h-screen p-3 rounded-xl">

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    {
                        icon: <UsersIcon />,
                        label: "Total Users",
                        value: usersData.length,
                        subtitle: "All Users in System",
                    },
                    {
                        icon: <ActiveUsersIcon />,
                        label: "Active",
                        value: usersData.filter(u => u.status === "active").length,
                        subtitle: "Currently Active",
                    },
                    {
                        icon: <InActiveUsersIcon />,
                        label: "Inactive",
                        value: usersData.filter(u => u.status === "inactive").length,
                        subtitle: "Currently Inactive",
                    },
                    {
                        icon: <TenantsIcon />,
                        label: "Admins",
                        value: usersData.filter(u => u.role === "Admin").length,
                        subtitle: "Tenants",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-3 rounded-[10px] border border-[#ECECEC] px-4 py-4"
                    >
                        {/* Icon Box */}
                        <div className="p-2 rounded-lg">
                            {stat.icon}
                        </div>

                        {/* Text Content */}
                        <div>
                            <p className="text-sm ">{stat.label}</p>
                            <p className="text-xl font-bold leading-tight">{stat.value}</p>
                            <p className="text-[10px] text-[#717171]">{stat.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <DataTable
                data={usersData}
                columns={columns}
                rowActions={rowActions}
                searchable
                searchPlaceholder="Search by name, email, location..."
                selectable
                pageSize={8}
                emptyMessage="No users found."
                onRowClick={(row) => console.log("Row clicked", row)}
                onSelectionChange={(rows) => setSelectedRows(rows)}
            />
        </div>
    );
}