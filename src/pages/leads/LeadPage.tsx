import { useState, useEffect, useMemo } from "react";
import { LayoutGrid, List } from "lucide-react";
import LeadsList from "./LeadsListPage";
import PipelinePage from "@/pages/PipelinePage";
import StatsCard from "@/components/common/StatsCards";
import { getAllLeads, getLeadByLeadNumber, updateLeadStatusbyLeadNumber } from "@/api/leads.api";
import { UsersIcon, NewLeadsIcon, ActiveUsersIcon, InActiveUsersIcon, UpArrowIcon, DownArrowIcon } from "@/assets/icons/components/index";
import { CreateAccountRequest, CreateLeadRequest } from "@/types/api.types";
import { isWithin7Days } from "./leadHelper";
import { createAccount } from "@/api/account.api";
import { replaceNAWithEmpty } from "@/lib/utils";

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

   const createAccountFromLead = async (leadNumber: string) => {
    const leadResponse = await getLeadByLeadNumber(leadNumber);
    const lead = leadResponse.data;

    const accountPayload: CreateAccountRequest = {
        accountName: lead.company ?? "",
        accountType: lead.leadType ?? "New Business",
        rating: lead.rating === "NA" ? "" : lead.rating ?? "",
        website: lead.website === "NA" ? "" : lead.website ?? "",
        employees: String(lead.noOfEmployees ?? "").replace("NA", ""),
        annualRevenue: String(lead.annualRevenue ?? "").replace("NA", ""),
        parentAccount: lead.leadNumber,
        contacts: [
            {
                title: lead.title === "NA" ? "" : lead.title ?? "",
                firstName: lead.firstName === "NA" ? "" : lead.firstName ?? "",
                lastName: lead.lastName === "NA" ? "" : lead.lastName ?? "",
                email: lead.email === "NA" ? "" : lead.email ?? "",
                secondaryEmail: lead.secondaryEmail === "NA" ? "" : lead.secondaryEmail ?? "",
                phone: lead.phone === "NA" ? "" : lead.phone ?? "",
                mobile: lead.mobile === "NA" ? "" : lead.mobile ?? "",
                skypeId: lead.skypeId === "NA" ? "" : lead.skypeId ?? "",
                fax: lead.fax === "NA" ? "" : lead.fax ?? "",
            }
        ],

        addresses: [
            {
                country: lead.leadAddressResponseDto?.country === "NA" ? "" : lead.leadAddressResponseDto?.country ?? "",
                flatNo: lead.leadAddressResponseDto?.flatNo === "NA" ? "" : lead.leadAddressResponseDto?.flatNo ?? "",
                street: lead.leadAddressResponseDto?.street === "NA" ? "" : lead.leadAddressResponseDto?.street ?? "",
                city: lead.leadAddressResponseDto?.city === "NA" ? "" : lead.leadAddressResponseDto?.city ?? "",
                state: lead.leadAddressResponseDto?.state === "NA" ? "" : lead.leadAddressResponseDto?.state ?? "",
                zipCode: lead.leadAddressResponseDto?.zipCode === "NA" ? "" : lead.leadAddressResponseDto?.zipCode ?? "",
                latitude: String(lead.leadAddressResponseDto?.latitude ?? ""),
                longitude: String(lead.leadAddressResponseDto?.longitude ?? ""),
            }
        ],
    };

    await createAccount(accountPayload);
};

    const handleStatusChange = async (
        leadNumber: string,
        status: string
    ) => {
        const lead = leads.find(l => l.leadNumber === leadNumber);
        if(lead?.leadStatus === "Deal Won") return;

        setStatusLoadingLeads(prev => new Set(prev).add(leadNumber));
        try {
            await updateLeadStatusbyLeadNumber(leadNumber, status);

        if (status === "Deal Won") {
            await createAccountFromLead(leadNumber);
        }

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
                trend: { icon: <UpArrowIcon />, text: "24%", color: "text-[#22c55e]" },
            },
            {
                icon: <NewLeadsIcon />,
                label: "New (7 days)",
                value: visibleLeads.filter(l => isWithin7Days(l.creationDate)).length,
                subtitle: "Created this week",
                trend: { icon: <UpArrowIcon />, text: "12%", color: "text-[#22c55e]" },
            },
            {
                icon: <ActiveUsersIcon />,
                label: "Intrested",
                value: visibleLeads.filter(l => l.leadStatus === "Attempted to Contact").length,
                subtitle: "Reached out successfully",
                trend: { icon: <UpArrowIcon />, text: "8%", color: "text-[#22c55e]" },
            },
            {
                icon: <InActiveUsersIcon />,
                label: "Lost / Junk",
                value: visibleLeads.filter(l => ["Lost Lead", "Junk Lead", "Not Qualified"].includes(l.leadStatus ?? "")).length,
                subtitle: "Closed without conversion",
                trend: { icon: <DownArrowIcon />, text: "5%", color: "text-[#EB4335]" },
            },
        ];
    }, [leads]);

    const handleCardClick = (lead: CreateLeadRequest) => {
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
                    ? <PipelinePage leads={visibleLeads} onCardClick={handleCardClick} onColumnClick={handleColumnClick} onStatusChange={handleStatusChange}/>
                    : <LeadsList leads={visibleLeads} loading={leadsLoading} initialStatuses={initialStatuses} onStatusChange={handleStatusChange} statusLoadingLeads={statusLoadingLeads} />
                }
            </div>
        </div>
    );
}