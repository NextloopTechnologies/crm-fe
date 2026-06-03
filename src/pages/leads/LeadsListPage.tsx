// pages/Users/UsersList.tsx
import { useCallback, useEffect, useState } from 'react';
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
import CustomBadge from "@/components/common/CommonBadge";
import { ROUTES } from '@/lib/route';
import { getAllLeads } from '@/api/leads.api';

const stats = [
    {
        icon: <UsersIcon />,
        label: "Total Users",
        value: usersData.length,
        subtitle: "All Users in System",
        trend: { icon: <UpArrowIcon />, text: "24%", color: "text-[#22c55e]" },
    },
    {
        icon: <NewLeadsIcon />,
        label: "New Leads",
        value: usersData.filter((u) => u.status === "active").length,
        subtitle: "vs last 7 days",
        trend: { icon: <UpArrowIcon />, text: "12%", color: "text-[#22c55e]" },
    },
    {
        icon: <NoActivityIcon />,
        label: "No Activity",
        value: usersData.filter((u) => u.status === "inactive").length,
        subtitle: "vs last 7 days",
        trend: { icon: <DownArrowIcon />, text: "12%", color: "text-[#EB4335]" },

    },
];


export default function LeadsList() {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const response = await getAllLeads();
                setLeads(response.data || response);
            } catch (error) {
                console.error("Error fetching leads:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);
    // ── Columns ───────────────────────────────────────────────────────────────────
    const columns: ColumnDef<any>[] = [
        {
            key: "name",
            label: "Name",
            width: "220px",
            render: (_, row) => <span>{row.firstName ?? "—"}</span>,
        },
        {
            key: "company",       
            label: "Company",
            width: "220px",
            render: (_, row) => <span>{(row as any).company ?? "—"}</span>,
        },
        {
            key: "email",
            label: "Email",
            width: "220px",
            render: (_, row) => <span>{row.email ?? "—"}</span>,
        },
        {
            key: "phone",
            label: "Phone",
            width: "220px",
            render: (_, row) => <span>{row.phone ?? "—"}</span>,
        },
        {
            key: "leadSource",
            label: "Lead Source",
            width: "140px",
            render: (_, row) => <span>{row.leadSource ?? "—"}</span>,

        },
        {
            key: "leadOwner",
            label: "Lead Owner",
            width: "180px",
            render: (_, row) => (
                <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={`${import.meta.env.VITE_AVATAR_URL}&seed=${row.leadOwner}`} />
                        <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
                            {row.leadOwner?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <span>{row.leadOwner ?? "—"}</span>
                </div>
            ),
        },
    ];

    const handleEdit = useCallback(
        (row: any ) => navigate(ROUTES.LEADS_EDIT(String(row.leadNumber))),
        [navigate]
    )

    const handleDelete = useCallback((row: User | User[]) => { }, [])

    const handleRowClick = useCallback((row: User) => { }, [])

    const handleSelection = useCallback(
        (rows: User[]) => setSelectedRows(rows),
        []
    )

    const handleDeleteSelected = useCallback(() => { }, [selectedRows])

    // ── Header Actions (Filter + Add User) ────────────────────────────────────
    const headerActions = (
        <div className="flex items-center gap-2">
            {/* Delete Selected */}
            {selectedRows.length > 0 && (
                <Button
                    variant="outline"
                    className="h-9 px-4 text-sm rounded-[10px] border-red-200 text-red-500 hover:bg-red-50 gap-2"
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
        <div className="bg-white min-h-screen rounded-xl">

            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 001.5 0v-4a.75.75 0 00-1.5 0v4zm.75 2.5a.75.75 0 110-1.5.75.75 0 010 1.5z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}
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
                data={leads}
                columns={columns}
                searchable
                searchPlaceholder="Search by name, email, location..."
                selectable
                pageSize={8}
                emptyMessage="No leads found."
                headerActions={headerActions}
                onRowClick={handleRowClick}
                onSelectionChange={handleSelection}
                onEdit={handleEdit}
                onDelete={handleDelete}
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