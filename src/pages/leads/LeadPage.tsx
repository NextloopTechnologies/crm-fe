import { useState, useEffect, useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import LeadsList from "./LeadsListPage";
import PipelinePage from "@/pages/PipelinePage";
import StatsCard from "@/components/common/StatsCards";
import { getAllLeads, updateLeadStatusbyLeadNumber } from "@/api/leads.api";
import { UsersIcon, NewLeadsIcon, ActiveUsersIcon, InActiveUsersIcon } from "@/assets/icons/components/index";
import { type CreateLeadRequest } from "@/types/api.types";
import { isWithin7Days } from "./leadHelper";
import { LEAD_STAGES } from "@/constants/LeadStatus";

export default function LeadsPage() {
    const [view, setView] = useState<"board" | "list">("board");
    const [initialStatuses, setInitialStatuses] = useState<string[]>([]);
    const [leadsLoading, setLeadsLoading] = useState(false);
    const [leads, setLeads] = useState<CreateLeadRequest[]>([]);
    const [search, setSearch] = useState("");
    const [statusLoadingLeads, setStatusLoadingLeads] = useState<Set<string>>(new Set());

    useEffect(() => {
        setLeadsLoading(true);
        getAllLeads()
            .then((res) => setLeads(Array.isArray(res.data) ? res.data : []))
            .catch(console.error)
            .finally(() => setLeadsLoading(false));

    }, []);

    const filteredLeads = useMemo(() => {
        const q = search.toLowerCase().trim();

        if (!q) return leads;

        return leads.filter((lead) =>
            [
                lead.firstName,
                lead.company,
                lead.email,
                lead.phone,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [leads, search]);

    const visibleLeads = useMemo(() => {
    return filteredLeads.filter(
        (lead) => lead.leadStatus !== ""
    );
}, [filteredLeads]);


    const handleStatusChange = async (
        leadNumber: string,
        status: string
    ) => {
        const lead = leads.find(l => l.leadNumber === leadNumber);
        if(lead?.leadStatus === "Deal Won") return;

        setStatusLoadingLeads(prev => new Set(prev).add(leadNumber));
        try {
            await updateLeadStatusbyLeadNumber(leadNumber, status);

        // NOTE: do NOT create an account here. LeadServiceImpl already creates
        // one automatically when the status transitions to "Deal Won", so
        // calling it from the client produced two identical accounts per win.

            setLeads(prev => prev.map(lead =>
                lead.leadNumber === leadNumber
                    ? { ...lead, leadStatus: status }
                    : lead
            ));
        } catch (error) {
            console.error("Status update failed", error);
        } finally {
            setStatusLoadingLeads(prev => {
            const updated = new Set(prev);
               updated.delete(leadNumber);
                return updated;
            });
        }
    };

    const stats = useMemo(() => {
        return [
            {
                icon: <UsersIcon />,
                label: "Total Leads",
                value: visibleLeads.length,
                subtitle: "All leads in pipeline",
            },
            {
                icon: <NewLeadsIcon />,
                label: "New (7 days)",
                value: visibleLeads.filter(l => isWithin7Days(l.creationDate)).length,
                subtitle: "Created this week",
            },
            {
                icon: <ActiveUsersIcon />,
                label: "Qualified",
                value: visibleLeads.filter(l => l.leadStatus === "Sales Qualified Lead").length,
                subtitle: "Sales qualified leads",
            },
            {
                icon: <InActiveUsersIcon />,
                label: "Won",
                value: visibleLeads.filter(l => l.leadStatus === "Deal Won").length,
                subtitle: "Converted to accounts",
            },
            {
                icon: <InActiveUsersIcon />,
                label: "Lost",
                value: visibleLeads.filter(l => l.leadStatus === "Lost").length,
                subtitle: "Closed without conversion",
            },
        ];
    }, [visibleLeads]);

    const handleCardClick = (lead: CreateLeadRequest) => {
        setInitialStatuses([lead.leadStatus ?? ""]);
        setView("list");
    };

    // Board columns are stage values, so a column maps to itself. The previous
    // lookup table keyed off pre-rename column names and retired statuses, so
    // every click resolved to [] and silently applied no filter.
    const handleColumnClick = (col: string) => {
        setInitialStatuses(LEAD_STAGES.some((st) => st.value === col) ? [col] : []);
        setView("list");
    };

    return (
        <div className="bg-white min-h-screen rounded-xl">

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-1">
                {stats.map(s => <StatsCard key={s.label} {...s} />)}
            </div>

            {/* Toggle + Search bar area */}
            <div className="mb-4 flex items-center gap-3">
                {/* Board / List toggle */}

                {/* Search */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search leads by name..."
                    className="w-min max-w-sm rounded-lg border border-[#E0E0E0] px-3 py-2 text-sm outline-none focus:border-[#5752FE]"
                />
                <button
                    tabIndex={-1}
                    style={{ border: view === "board" ? "1px solid #5752FE" : "1px solid #E0E0E0" }}
                    onClick={() => setView("board")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors
            ${view === "board" ? "bg-[#5752FE]/10 text-[#5752FE]" : "bg-white text-[#64748b] hover:border-[#5752FE]/40"}`}
                >
                    <LayoutGrid size={14} /> PipeLine
                </button>
                <button
                    tabIndex={-1}
                    style={{ border: view === "list" ? "1px solid #5752FE" : "1px solid #E0E0E0" }}
                    onClick={() => setView("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors
            ${view === "list" ? "bg-[#5752FE]/10 text-[#5752FE]" : "bg-white text-[#64748b] hover:border-[#5752FE]/40"}`}
                >
                    <List size={14} /> List
                </button>

            </div>

            <div className="rounded-lg">
                {view === "board"
                    ? <PipelinePage leads={visibleLeads} onCardClick={handleCardClick} onColumnClick={handleColumnClick} onStatusChange={handleStatusChange}/>
                    : <LeadsList leads={visibleLeads} loading={leadsLoading} initialStatuses={initialStatuses} onStatusChange={handleStatusChange} statusLoadingLeads={statusLoadingLeads} />
                }
            </div>
        </div>
    );
}