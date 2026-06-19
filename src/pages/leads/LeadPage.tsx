import { useState, useEffect, useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import LeadsList from "./LeadsListPage";
import PipelinePage from "@/pages/PipelinePage";
import StatsCard from "@/components/common/StatsCards";
import { getAllLeads } from "@/api/leads.api";
import { UsersIcon, NewLeadsIcon, ActiveUsersIcon, InActiveUsersIcon, UpArrowIcon, DownArrowIcon } from "@/assets/icons/components/index";

const COLUMN_TO_STATUSES: Record<string, string[]> = {
    "New": ["Not Contacted", "Attempted to Contact", "None"],
    "Qualified": ["Pre-Qualified", "Contact in Future"],
    "Contacted": ["Contacted"],
    "Lost Lead": ["Lost Lead", "Junk Lead", "Not Qualified"],
};

export default function LeadsPage() {
    const [view, setView] = useState<"board" | "list">("board");
    const [initialStatuses, setInitialStatuses] = useState<string[]>([]);
    const [leadsLoading, setLeadsLoading] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setLeadsLoading(true);
        getAllLeads()
            .then((res) => setLeads(res.data || res))
            .catch(console.error)
            .finally(() => setLeadsLoading(false));

    }, []);

    const filteredLeads = useMemo(() => {
        const q = search.toLowerCase().trim();

        if (!q) return leads;

        return leads.filter((lead) =>
            [
                lead.name,
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

    const handleStatusChange = (
        leadNumber: string,
        status: string
    ) => {
        setLeads((prev) =>
            prev.map((lead) =>
                lead.leadNumber === leadNumber
                    ? { ...lead, leadStatus: status }
                    : lead
            )
        );
    };

    const stats = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return [
            {
                icon: <UsersIcon />,
                label: "Total Leads",
                value: leads.length,
                subtitle: "All leads in pipeline",
                trend: { icon: <UpArrowIcon />, text: "24%", color: "text-[#22c55e]" },
            },
            {
                icon: <NewLeadsIcon />,
                label: "New (7 days)",
                value: leads.filter(l => new Date(l.creationDate?.replace(" ", "T")) >= sevenDaysAgo).length,
                subtitle: "Created this week",
                trend: { icon: <UpArrowIcon />, text: "12%", color: "text-[#22c55e]" },
            },
            {
                icon: <ActiveUsersIcon />,
                label: "Contacted",
                value: leads.filter(l => l.leadStatus === "Contacted").length,
                subtitle: "Reached out successfully",
                trend: { icon: <UpArrowIcon />, text: "8%", color: "text-[#22c55e]" },
            },
            {
                icon: <InActiveUsersIcon />,
                label: "Lost / Junk",
                value: leads.filter(l => ["Lost Lead", "Junk Lead", "Not Qualified"].includes(l.leadStatus ?? "")).length,
                subtitle: "Closed without conversion",
                trend: { icon: <DownArrowIcon />, text: "5%", color: "text-[#EB4335]" },
            },
        ];
    }, [leads]);

    const handleCardClick = (lead: any) => {
        setInitialStatuses([lead.leadStatus ?? ""]);
        setView("list");
    };

    const handleColumnClick = (col: string) => {
        setInitialStatuses(COLUMN_TO_STATUSES[col] ?? []);
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
                    ? <PipelinePage leads={filteredLeads} onCardClick={handleCardClick} onColumnClick={handleColumnClick} />
                    : <LeadsList leads={filteredLeads} loading={leadsLoading} initialStatuses={initialStatuses} onStatusChange={handleStatusChange} />
                }
            </div>
        </div>
    );
}