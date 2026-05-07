// pages/Users/UsersList.tsx
import { useState } from 'react';
import { DataTable, ColumnDef, RowAction } from '@/components/common/Table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, UserPlus, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usersData, type User } from '../../data/user.data';
import { ActiveUsersIcon, DownArrowIcon, InActiveUsersIcon, NoActivityIcon, TenantsIcon, UpArrowIcon, UsersIcon } from '@/assets/icons/components/index';
import { PlusIcon } from '@/assets/icons/components/PlusIcon';
import { useNavigate } from "react-router-dom";
import StatsCard from '@/components/common/StatsCards';
import { NewLeadsIcon } from '@/assets/icons/components/index';


// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => (
    <Badge
        className={cn(
            "w-[90px] justify-center text-center",
            status === "active"
                ? "bg-green-50 text-green-600 border border-green-200 rounded-[4px] px-5 py-3 hover:bg-green-50"
                : "bg-red-50 text-red-500 border border-red-200 rounded-[4px] px-5 py-3 hover:bg-red-50"
        )}
    >
        <span className={`${status === "active" ? "bg-green-500" : "bg-red-400"}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
);

// ── Role Badge ────────────────────────────────────────────────────────────────
const roleColors: Record<string, string> = {
    Admin: "bg-purple-50 text-purple-600 border border-purple-200 rounded-[4px] px-5 py-3 hover:bg-purple-50",
    Manager: "bg-blue-50 text-blue-600 border border-blue-200 rounded-[4px] px-5 py-3 hover:bg-blue-50",
    Developer: "bg-orange-50 text-orange-600 border border-orange-200 rounded-[4px] px-5 py-3 hover:bg-orange-50",
    Viewer: "bg-gray-50 text-gray-600 border border-gray-200 rounded-[4px] px-5 py-3 hover:bg-gray-50",
};

// ── Role Badge ────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }: { role: string }) => (
    <Badge
        className={cn(
            "w-[90px] justify-center text-center",
            roleColors[role] ?? "bg-gray-100 text-gray-600"
        )}
    >
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

// ── Filter Options ────────────────────────────────────────────────────────────
const filtersConfig = [
    {
        key: "status",
        label: "Status",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" }
        ]
    },
    {
        key: "role",
        label: "Role",
        options: [
            { label: "Admin", value: "Admin" },
            { label: "Manager", value: "Manager" },
            { label: "Developer", value: "Developer" },
            { label: "Viewer", value: "Viewer" }
        ]
    }
];

const stats = [
    {
        icon: <UsersIcon />,
        label: "Total Users",
        value: usersData.length,
        subtitle: "All Users in System",
        trend: { icon: <UpArrowIcon />, text: "24%" , color : "text-[#22c55e]" },
      },
    {
        icon: <NewLeadsIcon/>,
        label: "New Leads",
        value: usersData.filter((u) => u.status === "active").length,
        subtitle: "vs last 7 days",
        trend: { icon: <UpArrowIcon />, text: "12%" , color : "text-[#22c55e]" },
    },
    {
        icon: <NoActivityIcon />,
        label: "No Activity",
        value: usersData.filter((u) => u.status === "inactive").length,
        subtitle: "vs last 7 days",
        trend: { icon: <DownArrowIcon />, text: "12%" , color : "text-[#EB4335]" },

    },
];


export default function LeadsList() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const navigate = useNavigate();

    // ── Columns ───────────────────────────────────────────────────────────────────
    const columns: ColumnDef<User>[] = [
        {
            key: "name",
            label: "Name",
            width: "220px",
            render: (val) => (
                <span>{String(val)}</span>
            ),
        },
        {
            key: "name",
            label: "Company",
            width: "220px",
            render: (val) => (
                <span>{String(val)}</span>
            ),
        },
        {
            key: "email",
            label: "Email",
            width: "220px",
            render: (val) => (
                <span >{String(val)}</span>
            ),
        },
        {
            key: "phone",
            label: "Phone",
            width: "220px",
            render: (val) => (
                <span >{String(val)}</span>
            ),
        },
        {
            key: "role",
            label: "Lead Source",
            width: "140px",
            render: (val) => <RoleBadge role={String(val)} />,
        },
       
        {
            key: "name",
            label: "Lead Owner",
            width: "180px",
            render: (_, row) => (
                <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.name}`} />
                        <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
                            {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <span>{row.name}</span>
                </div>
            ),
        },
    ];

    // ── Header Actions (Filter + Add User) ────────────────────────────────────
    const headerActions = (
        <div className="flex items-center gap-2">
            {/* Delete Selected */}
            {selectedRows.length > 0 && (
                <Button
                    variant="outline"
                    className="h-9 px-4 text-sm rounded-[10px] border-red-200 text-red-500 hover:bg-red-50 gap-2"
                    onClick={() => console.log("Delete selected", selectedRows)}
                >
                    <Trash2 size={14} />
                    Delete ({selectedRows.length})
                </Button>
            )}

            {/* Add Lead */}
            <Button className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1" onClick={() => navigate("/leads/add")}>
                <PlusIcon />
                Add Lead
            </Button>
        </div>
    );

    return (
        <div className="bg-white min-h-screen p-3 rounded-xl">

            {/* Stats Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
                {stats.map((stat) => (
                    <StatsCard
                        key={stat.label}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        trend={stat.trend}

                    />
                ))}
            </div>

            {/* Table */}
            <DataTable
                data={usersData}
                columns={columns}
                searchable
                searchPlaceholder="Search by name, email, location..."
                selectable
                pageSize={8}
                emptyMessage="No users found."
                headerActions={headerActions}
                onRowClick={(row) => console.log("Row clicked", row)}
                onSelectionChange={(rows) => setSelectedRows(rows)}
                onEdit={(row) => console.log("Edit", row)}
                onDelete={(row) => console.log("Delete", row)}
                filters={[
                    {
                        key: "role",
                        label: "Company",
                        type: "select",
                        options: [
                            { label: "Admin", value: "Admin" },
                            { label: "Manager", value: "Manager" },
                            { label: "Developer", value: "Developer" },
                            { label: "Viewer", value: "Viewer" },
                        ],
                    },
                    {
                        key: "status",
                        label: "Lead Source",
                        type: "select",
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ],
                    },
                    {
                        key: "status",
                        label: "Lead Owner",
                        type: "select",
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ],
                    },
                ]}
            />
        </div>
    );
}