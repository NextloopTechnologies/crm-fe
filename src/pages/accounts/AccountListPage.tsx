// pages/Users/UsersList.tsx
import { useState } from 'react';
import { DataTable, ColumnDef } from '@/components/common/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, } from 'lucide-react';
import { usersData, type User } from '../../data/user.data';
import { PlusIcon } from '@/assets/icons/components/PlusIcon';
import { useNavigate } from "react-router-dom";
import StatsCard from '@/components/common/StatsCards';
import CustomBadge from "@/components/common/CommonBadge";
import buildingIcon from "@/assets/icons/svgs/Building.svg";
import activeUserIcon from "@/assets/icons/svgs/ActiveUsericon.svg";
import inActiveUserIcon from "@/assets/icons/svgs/Inactiveusericon.svg";

const stats = [
    {
        icon: (
            <div className="w-[55px] h-[55px] flex items-center justify-center">
                <img
                    src={buildingIcon}
                    alt="building"
                    className="max-w-full max-h-full object-contain"
                />
            </div>
        ),
        label: "Total Accounts",
        value: usersData.length,
        subtitle: "All account in System",
    },
    {
        icon: (
            <div className="w-[55px] h-[55px] flex items-center justify-center">
                <img
                    src={activeUserIcon}
                    alt="active user"
                    className="max-w-full max-h-full object-contain"
                />
            </div>
        ),
        label: "Active Accounts",
        value: usersData.filter((u) => u.status === "active").length,
        subtitle: "Currently Active",
    },
    {
        icon: (
            <div className="w-[55px] h-[55px] flex items-center justify-center">
                <img
                    src={inActiveUserIcon}
                    alt="inactive user"
                    className="max-w-full max-h-full object-contain"
                />
            </div>
        ),
        label: "Inactive Accounts",
        value: usersData.filter((u) => u.status === "inactive").length,
        subtitle: "Currently Inactive",
    },
    // {
    //     icon: (
    //         <div className="w-[55px] h-[55px] flex items-center justify-center">
    //             <img
    //                 src={tenantsIcon}
    //                 alt="tenants"
    //                 className="max-w-full max-h-full object-contain"
    //             />
    //         </div>
    //     ),
    //     label: "Total Users",
    //     value: usersData.filter((u) => u.role === "Admin").length,
    //     subtitle: "Across all Tenants",
    // },
];


export default function AccountListPage() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const navigate = useNavigate();

    // ── Columns ───────────────────────────────────────────────────────────────────
    const columns: ColumnDef<User>[] = [
        {
            key: "name",
            label: "Account Name",
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
            key: "name",
            label: "Account Owner",
            width: "220px",
            render: (val) => (
                <span className="text-sm text-[#6b6b8d]">{String(val)}</span>
            ),
        },
        {
            key: "phone",
            label: "Phone",
            width: "220px",
            render: (val) => (
                <span className="text-sm text-[#6b6b8d]">{String(val)}</span>
            ),
        },
        {
            key: "location",
            label: "Website",
            width: "220px",
            render: (val) => (
                <span className="text-sm text-[#6b6b8d]">{String(val)}</span>
            ),
        },
        // {
        //     key: "location",
        //     label: "Website",
        //     width: "140px",
        //     render: (val) => (
        //         <CustomBadge
        //             label={
        //                 String(val).charAt(0).toUpperCase() +
        //                 String(val).slice(1)
        //             }
        //             className={
        //                 String(val) === "active"
        //                     ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-50"
        //                     : "bg-red-50 text-red-500 border border-red-200 hover:bg-red-50"
        //             }
        //         />
        //     ),
        // },
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

            {/* Add User */}
            <Button className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1" onClick={() => navigate("/accounts/create")}>
                <PlusIcon />
                Add Account
            </Button>
        </div>
    );

    return (
        <div className="bg-white min-h-screen rounded-xl">

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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
                searchable
                searchPlaceholder="Search by name, email, location..."
                selectable
                pageSize={8}
                emptyMessage="No users found."
                headerActions={headerActions}
                onRowClick={(row) => console.log("Row clicked", row)}
                onSelectionChange={(rows) => setSelectedRows(rows)}
                onEdit={(row) => navigate(`/accounts/${row.id}/edit`)}
                onDelete={(row) => console.log("Delete", row)}
                filters={[
                    {
                        key: "status",
                        label: "Status",
                        type: "select",
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ],
                    },
                    {
                        key: "role",
                        label: "Industry",
                        type: "select",
                        options: [
                            { label: "Admin", value: "Admin" },
                            { label: "Manager", value: "Manager" },
                            { label: "Developer", value: "Developer" },
                            { label: "Viewer", value: "Viewer" },
                        ],
                    },
                    { key: "createdFrom", label: "Created From", type: "date" },
                    { key: "createdTo", label: "Created To", type: "date" },
                ]}
            />
        </div>
    );
}