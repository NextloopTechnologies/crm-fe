// pages/Users/UsersList.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable, ColumnDef } from '@/components/common/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusIcon, Trash2 } from 'lucide-react';
import { ActiveUsersIcon, InActiveUsersIcon, TenantsIcon, UsersIcon } from '@/assets/icons/components/index';
import { useNavigate } from "react-router-dom";
import StatsCard from '@/components/common/StatsCards';
import CustomBadge from "@/components/common/CommonBadge";
import { ROUTES } from '@/lib/route';
import { getAllUsers } from '@/api/user.api';
import { toInputDateTime } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────
interface User {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    roleName: string;
    isActive: boolean | string;   
    phone: string;
    creationDate: string;
}

// ── Role hierarchy ────────────────────────────────────────────
const ROLE_HIERARCHY: Record<string, string[]> = {
    SUPER_ADMIN: ["SUPER_ADMIN", "ADMIN", "MANAGER", "SALES"],
    ADMIN:       ["ADMIN", "MANAGER", "SALES"],
    MANAGER:     ["MANAGER", "SALES"],
    SALES:       ["SALES"],
};

const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-50",
    ADMIN:       "bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-50",
    MANAGER:     "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-50",
    SALES:       "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-50",
};

const getCurrentRole = () => {
  return localStorage.getItem("roleName")?.toUpperCase() || "";
};

const getStats = (data: User[]) => {
  const role = getCurrentRole();

  const allStats = [
    {
      key: "TOTAL",
      icon: <UsersIcon />,
      label: "Total Users",
      value: data.length,
      subtitle: "All Users in System",
    },
    {
      key: "ADMIN",
      icon: <TenantsIcon />,
      label: "Admins",
      value: data.filter((u) => u.roleName?.toUpperCase() === "ADMIN").length,
      subtitle: "Admin Users",
    },
    {
      key: "MANAGER",
      icon: <ActiveUsersIcon />,
      label: "Managers",
      value: data.filter((u) => u.roleName?.toUpperCase() === "MANAGER").length,
      subtitle: "Manager Users",
    },
    {
      key: "SALES",
      icon: <InActiveUsersIcon />,
      label: "Sales",
      value: data.filter((u) => u.roleName?.toUpperCase() === "SALES").length,
      subtitle: "Sales Users",
    },
  ];

  const visibilityMap: Record<string, string[]> = {
    SUPER_ADMIN: ["TOTAL", "ADMIN", "MANAGER", "SALES"],
    ADMIN: ["TOTAL", "MANAGER", "SALES"],
    MANAGER: ["SALES"],
  };

  const allowedKeys = visibilityMap[role] || [];

  return allStats.filter((stat) => allowedKeys.includes(stat.key));
};

const FILTERS = [
    {
        key: "roleName",
        label: "Role",
        type: "select" as const,
        options: [
            { label: "Super Admin", value: "SUPER_ADMIN" },
            { label: "Admin",       value: "ADMIN" },
            { label: "Manager",     value: "MANAGER" },
            { label: "Sales",       value: "SALES" },
        ],
    },
    {
        key: "isActive",
        label: "Status",
        type: "select" as const,
        options: [
            { label: "Active",   value: "Y" },
            { label: "Inactive", value: "0" },
        ],
    },
    { key: "createdFrom",    label: "Created From",    type: "date" as const },
    { key: "createdTo",      label: "Created To",      type: "date" as const },
    { key: "lastLoginFrom",  label: "Last Login From", type: "date" as const },
    { key: "lastLoginTo",    label: "Last Login To",   type: "date" as const },
];

// ── User Avatar Cell ──────────────────────────────────────────
const UserCell = ({ firstName, lastName }: { firstName: string; lastName: string }) => {
    const fullName = `${firstName} ${lastName}`;
    return (
        <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`} />
                <AvatarFallback className="text-xs bg-[#5752FE1A] text-[#5752FE] font-semibold">
                    {`${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-[#111127]">{fullName}</span>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────
export default function UsersList() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Get logged-in user's role — adjust based on your auth hook/store
    const currentRole = localStorage.getItem("roleName") ?? "SALES";

    const stats = useMemo(() => getStats(users), [users]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getAllUsers();
                const allUsers: User[] = response.data ?? response;

                // Filter users based on current role's visibility
                const visibleRoles = ROLE_HIERARCHY[currentRole] ?? ["SALES"];
                const filtered = allUsers.filter(u =>
                    visibleRoles.includes(u.roleName?.toUpperCase())
                );

                setUsers(filtered);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentRole]);

    // ── Columns ───────────────────────────────────────────────
    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            key: "firstName",
            label: "Name",
            width: "180px",
            render: (_, row) => (
                <UserCell firstName={row.firstName} lastName={row.lastName} />
            ),
        },
        {
            key: "email",
            label: "Email",
            width: "220px",
            render: (_, row) => (
                <span className="text-sm text-[#6b6b8d]">{row.email}</span>
            ),
        },
        {
            key: "roleName",
            label: "Role",
            width: "120px",
            render: (_, row) => (
                <CustomBadge
                    label={row.roleName}
                    className={
                        roleColors[row.roleName?.toUpperCase()] ??
                        "bg-gray-100 text-gray-600 border border-gray-200"
                    }
                />
            ),
        },
        {
            key: "Organization",
            label: "Organization",
            width: "120px",
            render: (_, row) => {
                return (
                    //should be fetch from data;
                <span className="text-sm text-[#6b6b8d]">NextLoop Technologies</span>
            );
            },
        },
        {
            key: "phone",
            label: "Phone",
            render: (_, row) => (
                <span className="text-sm text-[#6b6b8d]">{row.phone}</span>
            ),
        },
        {
            key: "creationDate",
            label: "Created At",
            render: (_, row) => {
                const isoString = toInputDateTime(row.creationDate);
                const date = new Date(isoString);

                return (
                    <span className="text-[#6b6b8d] text-sm">
                        {isNaN(date.getTime())
                            ? "—"
                            : date.toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                            })}
                    </span>
                );
            },
        },
    ], []);

    // Disable edit if current user is NOT SUPER_ADMIN and target user is SUPER_ADMIN
    const canEdit = useCallback((row: User) => {
        if (currentRole !== "SUPER_ADMIN" && row.roleName?.toUpperCase() === "SUPER_ADMIN") {
            return false;
        }
        return true;
    }, [currentRole]);

    const handleView = useCallback(
        (row: User) => navigate(ROUTES.USERS_EDIT(String(row.email))),
        [navigate]
      );

    const handleEdit = useCallback(
        (row: User) => {
            if (!canEdit(row)) return;
            navigate(ROUTES.USERS_EDIT(String(row.email)), { state: row.email });
        },
        [navigate, canEdit]
    );

    const handleDelete    = useCallback((_row: User | User[]) => { }, []);
    const handleRowClick  = useCallback((_row: User) => { }, []);
    const handleSelection = useCallback((rows: User[]) => setSelectedRows(rows), []);
    const handleDeleteSelected = useCallback(() => { }, [selectedRows]);

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
                onClick={() => navigate(ROUTES.USERS_CREATE)}
            >
                <PlusIcon />
                Add User
            </Button>
        </div>
    ), [selectedRows.length, handleDeleteSelected, navigate]);

    return (
        <div className="bg-white min-h-screen rounded-xl">

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

            <DataTable
                data={users}
                columns={columns}
                filters={FILTERS}
                searchable
                searchPlaceholder="Search by name, email"
                selectable
                pageSize={8}
                loading={loading}
                emptyMessage="No users found."
                headerActions={headerActions}
                onRowClick={handleView}
                onSelectionChange={handleSelection}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                // Pass canEdit so table can disable the icon visually
                isEditDisabled={(row) => !canEdit(row as User)}
            />
        </div>
    );
}