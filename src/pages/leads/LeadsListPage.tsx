import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable, ColumnDef } from '@/components/common/Table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {  Trash2, } from 'lucide-react';
import { PlusIcon } from '@/assets/icons/components/PlusIcon';
import { useNavigate } from "react-router-dom";
import { ROUTES } from '@/lib/route';
import { CreateLeadRequest } from '@/types/api.types';
import { LEAD_STATUS_OPTIONS_LIST, STATUS_COLOR } from '@/constants/LeadStatus';

type LeadsListProps = {
    leads: CreateLeadRequest[];
    loading?: boolean,
    initialStatuses?: string[];
    onStatusChange: (
      leadNumber: string,
      status: string
    ) => void;
    statusLoadingLeads?: Set<string>;
  };

export default function LeadsList({
    leads,        
    loading = false,
    initialStatuses = [],
    onStatusChange,
    statusLoadingLeads = new Set(),
}: LeadsListProps){
    const [selectedRows, setSelectedRows] = useState<CreateLeadRequest[]>([]);
    const [error] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (initialStatuses.length > 0) {
            void activeFilters;
            setActiveFilters({ leadStatus: initialStatuses[0] });
        } else {
            setActiveFilters({});
        }
    }, [initialStatuses]);

    const filteredLeads = useMemo(() => {
        if (initialStatuses.length === 0) return leads;
        return leads.filter(l => initialStatuses.includes(l.leadStatus ?? ""));
    }, [leads, initialStatuses]);
    
    // ── Columns ───────────────────────────────────────────────────────────────────
    const columns: ColumnDef<CreateLeadRequest>[] = useMemo(() => {
        return [
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
            key: "mobile",
            label: "Mobile",
            width: "220px",
            render: (_, row) => <span>{row.mobile ?? "—"}</span>,
        },
        {
            key: "leadSource",
            label: "Lead Source",
            width: "140px",
            render: (_, row) => <span>{row.leadSource ?? "—"}</span>,

        },
        {
            key: "leadStatus",
            label: "Lead Status",
            width: "200px",  
            render: (_, row) => {
                    const currentStatus = row.leadStatus ?? "None";
                    const isUpdating = statusLoadingLeads.has(row.leadNumber);
                    const cfg = STATUS_COLOR[currentStatus] ?? { bg: "bg-slate-100", text: "text-slate-600" };
                    const isLocked = currentStatus === "Deal Won";

                if (isLocked) {
                    return (
                        <div
                            className={`w-[160px] max-w-[160px] rounded-lg pl-2 pr-2 py-1 text-sm font-semibold
                    text-center truncate cursor-not-allowed select-none
                    ${cfg.bg} ${cfg.text}`}
                        >
                            {currentStatus}
                        </div>
                    );
                }
                    return (
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <select
                                value={currentStatus}
                                disabled={isUpdating}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    onStatusChange(row.leadNumber, e.target.value);
                                }}
                                className={`w-[160px] max-w-[160px] rounded-lg pl-2 pr-6 py-1 text-sm font-semibold 
            border-0 cursor-pointer text-center truncate
            focus:outline-none focus:ring-2 focus:ring-[#5752FE]
            disabled:cursor-not-allowed
            ${cfg.bg} ${cfg.text}`}
                            >
                                {LEAD_STATUS_OPTIONS_LIST.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            {isUpdating && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#5752FE] border-t-transparent" />
                                </div>
                            )}
                        </div>
                    );
                },
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
                            {row.leadOwner
                                ? row.leadOwner
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                : "—"}                        </AvatarFallback>
                    </Avatar>
                    <span>{row.leadOwner ?? "—"}</span>
                </div>
            ),
        },
    ]},[onStatusChange, leads]);

    const handleView = useCallback(
        (row: any) => navigate(ROUTES.LEADS_DETAIL(String(row.leadNumber))),
        [navigate]
      );

    const handleEdit = useCallback(
        (row: CreateLeadRequest ) => navigate(ROUTES.LEADS_EDIT(String(row.leadNumber))),
        [navigate]
    )

    const handleDelete = useCallback(() => { }, [])


    const handleSelection = useCallback(
        (rows: CreateLeadRequest[]) => setSelectedRows(rows),
        []
    )
    // ── Header Actions (Filter + Add Lead) ────────────────────────────────────
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
            <Button className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1" onClick={() => navigate(ROUTES.LEADS_CREATE)}>
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

            {/* Table */}
            <DataTable
                data={filteredLeads}
                columns={columns}
                searchable={false}
                searchPlaceholder="Search by name, email, company, phone"
                selectable
                pageSize={8}
                emptyMessage="No leads found."
                headerActions={headerActions}
                loading={loading}
                onRowClick={handleView}
                onSelectionChange={handleSelection}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
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
                        key: "leadSoure",
                        label: "Lead Source",
                        type: "select",
                        options: [
                            { label: "Web", value: "Web" },
                            { label: "Phone", value: "Phone" },
                            { label: "Email", value: "Email" },
                            { label: "Cold Call", value: "Cold Call" },
                            { label: "Existing Customer", value: "Existing Customer" },
                            { label: "Partner", value: "Partner" },
                            { label: "Other", value: "Other" },

                        ],
                    },
                    {
                        key: "leadOwner",
                        label: "Lead Owner",
                        type: "select",
                        options: [
                            { label: "None", value: "None" },
                            { label: "Attempted to Contact", value: "Attempted to Contact" },
                            { label: "Contact in Future", value: "Contact in Future" },
                            { label: "Contacted", value: "Contacted" },
                            { label: "Junk Lead", value: "Junk Lead" },
                            { label: "Lost Lead", value: "Lost Lead" },
                            { label: "Not Contacted", value: "Not Contacted" },
                            { label: "Pre-Qualified", value: "Pre-Qualified" },
                            { label: "Not Qualified", value: "Not Qualified" },
                        ],
                    },
                ]}
            />
        </div>
    );
}