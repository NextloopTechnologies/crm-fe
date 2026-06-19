// pages/Pipeline/PipelinePage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Users, TrendingUp, PhoneCall, XCircle,
  Plus, Calendar, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatsCard from "@/components/common/StatsCards";
import { ROUTES } from "@/lib/route";
import { UpArrowIcon, DownArrowIcon } from "@/assets/icons/components/index";
import { formatDate, LeadAvatar, getInitials } from "./leads/leadHelper";

// ─────────────────────────────────────────────────────────────
// 4 pipeline columns only
// ─────────────────────────────────────────────────────────────

type PipelineCol = "New" | "Qualified" | "Contacted" | "Lost Lead";

const PIPELINE_COLUMNS: PipelineCol[] = ["New", "Qualified", "Contacted", "Lost Lead"];

const STATUS_TO_COLUMN: Record<string, PipelineCol> = {
  "Not Contacted": "New",
  "Attempted to Contact": "New",
  "None": "New",
  "Pre-Qualified": "Qualified",
  "Contact in Future": "Qualified",
  "Contacted": "Contacted",
  "Lost Lead": "Lost Lead",
  "Junk Lead": "Lost Lead",
  "Not Qualified": "Lost Lead",
};

const COLUMN_CONFIG: Record<PipelineCol, {
  color: string; light: string;
  badgeBg: string; badgeText: string;
  prefillStatus: string;
}> = {
  "New": { color: "#6366f1", light: "#eef2ff", badgeBg: "bg-indigo-50", badgeText: "text-indigo-600", prefillStatus: "Attempted to Contact" },
  "Qualified": { color: "#8b5cf6", light: "#f5f3ff", badgeBg: "bg-violet-50", badgeText: "text-violet-600", prefillStatus: "Pre-Qualified" },
  "Contacted": { color: "#10b981", light: "#ecfdf5", badgeBg: "bg-emerald-50", badgeText: "text-emerald-600", prefillStatus: "Contacted" },
  "Lost Lead": { color: "#ef4444", light: "#fef2f2", badgeBg: "bg-red-50", badgeText: "text-red-500", prefillStatus: "Lost Lead" },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const isWithin7Days = (creationDate: string) => {
  try {
    const d = new Date(creationDate.replace(" ", "T"));
    return (Date.now() - d.getTime()) / 86_400_000 <= 7;
  } catch { return false; }
};

const resolveColumn = (lead: any): PipelineCol => {
  if (isWithin7Days(lead.creationDate ?? "")) return "New";
  return STATUS_TO_COLUMN[lead.leadStatus ?? ""] ?? "New";
};

// ─────────────────────────────────────────────────────────────
// Stats
// ─────────────────────────────────────────────────────────────
const buildStats = (leads: any[]) => [
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#5752FE1A] flex items-center justify-center"><Users className="w-6 h-6 text-[#5752FE]" /></div>,
    label: "Total Leads", value: leads.length, subtitle: "All leads in pipeline",
    trend: { icon: <UpArrowIcon />, text: "24%", color: "text-[#22c55e]" },
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-indigo-50 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-indigo-500" /></div>,
    label: "New (7 days)", value: leads.filter(l => isWithin7Days(l.creationDate ?? "")).length,
    subtitle: "Created this week",
    trend: { icon: <UpArrowIcon />, text: "12%", color: "text-[#22c55e]" },
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-emerald-50 flex items-center justify-center"><PhoneCall className="w-6 h-6 text-emerald-500" /></div>,
    label: "Contacted", value: leads.filter(l => l.leadStatus === "Contacted").length,
    subtitle: "Reached out successfully",
    trend: { icon: <UpArrowIcon />, text: "8%", color: "text-[#22c55e]" },
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-red-50 flex items-center justify-center"><XCircle className="w-6 h-6 text-red-500" /></div>,
    label: "Lost / Junk", value: leads.filter(l => ["Lost Lead", "Junk Lead", "Not Qualified"].includes(l.leadStatus ?? "")).length,
    subtitle: "Closed without conversion",
    trend: { icon: <DownArrowIcon />, text: "5%", color: "text-[#EB4335]" },
  },
];

// ─────────────────────────────────────────────────────────────
// Filter config
// ─────────────────────────────────────────────────────────────
interface Filters {
  leadSource: string;
  leadOwner: string;
  industry: string;
  dateFrom: string;
  dateTo: string;
}

const EMPTY_FILTERS: Filters = {
  leadSource: "", leadOwner: "", industry: "", dateFrom: "", dateTo: "",
};

// ─────────────────────────────────────────────────────────────
// Lead Card
// ─────────────────────────────────────────────────────────────
const LeadCard = ({
  lead,
  col,
  onEdit,
}: {
  lead: any;
  col: PipelineCol;
  onEdit: (l: any) => void;
}) => {
  const cfg = COLUMN_CONFIG[col];

  return (
    <div
      onClick={() => onEdit(lead)}
      className="bg-white border border-[#e8e8f0] rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md hover:border-[#5752FE]/30 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <LeadAvatar
            firstName={lead.firstName}
            lastName={lead.lastName}
            email={lead.email}
            size="h-8 w-8"
          />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#1e1e2d] truncate">
              {[lead.firstName, lead.lastName].filter(Boolean).join(" ") || "—"}
            </p>
            {lead.company && lead.company !== "NA" && (
              <p className="text-[11px] text-[#94a3b8] truncate">{lead.company}</p>
            )}
          </div>
        </div>

        {/* 3-dot menu */}
        {/* <div className="relative flex-shrink-0">
          <button
            onClick={() => setOpen(p => !p)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] transition-colors"
          >
            <MoreVertical size={14} />
          </button>
          {open && (
            <div className="absolute right-0 top-8 z-20 bg-white border border-[#e2e8f0] rounded-xl shadow-lg py-1 w-36">
              <button onClick={() => { setOpen(false); onEdit(lead); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#334155] hover:bg-[#f8fafc]">
                <Pencil size={12} /> Edit
              </button>
              <button onClick={() => { setOpen(false); onDelete(lead); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div> */}
      </div>

      {/* Details */}
      {/* <div className="flex flex-col gap-1.5">
        {lead.company && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b8d]">
            <Building2 size={11} className="text-[#94a3b8] flex-shrink-0" />
            <span className="truncate">{lead.company}</span>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b8d]">
            <Mail size={11} className="text-[#94a3b8] flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div> */}

      <div className="border-t border-[#f1f5f9]" />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] ml-auto">
          <Calendar size={10} />
          {lead.creationDate ? formatDate(lead.creationDate) : "—"}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Kanban Column
// ─────────────────────────────────────────────────────────────
interface KanbanColumnProps {
  col: PipelineCol;
  leads: any[];
  onAddLead: (col: PipelineCol) => void;
  onEdit: (lead: any) => void;
  onColumnClick?: (col: PipelineCol) => void;
}

const KanbanColumn = ({
  col,
  leads,
  onAddLead,
  onEdit,
  onColumnClick,
}: KanbanColumnProps) => {
  const cfg = COLUMN_CONFIG[col];
  const visibleLeads = leads.slice(0,5);
  const totalRevenue = leads.reduce((s, l) => s + parseFloat(l.annualRevenue ?? "0"), 0);
  const valueLabel = totalRevenue > 0 ? `$${(totalRevenue / 1_000_000).toFixed(1)}M` : "";

  return (
    <div className="flex-shrink-0 w-[250px] flex flex-col">
      {/* Top accent */}
      <div className="h-[3px] rounded-t-md" style={{ background: cfg.color }} />

      <div
        className="flex flex-col flex-1 rounded-b-2xl border border-t-0 border-[#e8e8f0]"
        style={{ background: cfg.light }}
      >
        {/* Header */}
        <div className="px-4 pt-3 pb-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onColumnClick?.(col)}>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#1e1e2d]">{col}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: cfg.color }}
            >
              {leads.length}
            </span>
          </div>
          {/* {valueLabel && (
            <p className="text-[11px] text-[#94a3b8] mt-0.5">{valueLabel}</p>
          )} */}
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto px-3 pb-2 flex flex-col gap-2 max-h-[520px]">
          {visibleLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-[#cbd5e1]">
              <Users size={28} className="opacity-30 mb-1" />
              <p className="text-[11px]">No leads here</p>
            </div>
          ) : (
            visibleLeads.map((lead, i) => (
              <LeadCard
                key={lead.leadNumber ?? i}
                lead={lead}
                col={col}
                onEdit={onEdit}
              />
            ))
          )}
        </div>
        {leads.length > 5 && (
          <button
            onClick={() => onAddLead(col)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed text-[12px] font-semibold transition-colors hover:bg-white/60"
            style={{ borderColor: cfg.color, color: cfg.color }}
          >
            View all {leads.length} leads
          </button>
        )}
      </div>
    </div>
  );
};

type PipelinePageProps = {
  leads: any[];
  onCardClick?: (lead: any) => void;
  onColumnClick?: (col: string) => void;
};

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function PipelinePage({
  leads,
  onColumnClick,
  onCardClick,

}: PipelinePageProps){
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const navigate = useNavigate();

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  const handleApply = () => {
    setAppliedFilters({ ...filters });
    setFilterOpen(false);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setFilterOpen(false);
  };

  const setFilter = (key: keyof Filters, val: string) =>
    setFilters(p => ({ ...p, [key]: val }));

  // Group into 4 columns with search + filters applied
  const grouped = useMemo<Record<PipelineCol, any[]>>(() => {
    const af = appliedFilters;

    const filtered = leads.filter((l) => {
      const matchSource = !af.leadSource || l.leadSource === af.leadSource;
      const matchOwner = !af.leadOwner || l.leadOwner === af.leadOwner;
      const matchIndustry = !af.industry || l.industry === af.industry;

      let matchDate = true;
      if (af.dateFrom || af.dateTo) {
        try {
          const created = new Date(l.creationDate?.replace(" ", "T") ?? "");
          if (af.dateFrom && created < new Date(af.dateFrom)) matchDate = false;
          if (af.dateTo && created > new Date(af.dateTo + "T23:59:59")) matchDate = false;
        } catch { matchDate = false; }
      }

      return matchSource && matchOwner && matchIndustry && matchDate;
    });

    const map = { New: [], Qualified: [], Contacted: [], "Lost Lead": [] } as Record<PipelineCol, any[]>;
    filtered.forEach(l => map[resolveColumn(l)].push(l));
    return map;
  }, [leads, appliedFilters]);

  const handleAddLead = useCallback((col: PipelineCol) => {
    navigate(ROUTES.LEADS_CREATE, {
      state: { prefillStatus: COLUMN_CONFIG[col].prefillStatus },
    });
  }, [navigate]);

  const handleEdit = useCallback((l: any) => navigate(ROUTES.LEADS_DETAIL(String(l.leadNumber))), [navigate]);

  return (
    <div className="bg-white min-h-screen rounded-xl flex flex-col">

      <div className="border border-[#E0E0E0] p-4 rounded-lg">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap px-1">
          <div className="flex items-center gap-2 flex-wrap">
           
            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {Object.entries(appliedFilters).map(([key, val]) =>
                  val ? (
                    <span
                      key={key}
                      className="flex items-center gap-1 bg-[#5752FE]/10 text-[#5752FE] text-[11px] font-semibold px-2 py-1 rounded-full"
                    >
                      {val}
                      <button
                        onClick={() => {
                          const next = { ...appliedFilters, [key]: "" };
                          setAppliedFilters(next);
                          setFilters(next);
                        }}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>

          <Button
            className="bg-[#5752FE] hover:bg-[#4a45e0] text-white rounded-[10px] px-4 text-sm gap-1"
            onClick={() => navigate(ROUTES.LEADS_CREATE)}
          >
            <Plus size={14} /> Add Lead
          </Button>
        </div>

        {/* Kanban */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-[#94a3b8] text-sm py-20">
            Loading pipeline...
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto pb-4 px-1">
            <div className="flex gap-4 min-h-[480px]">
              {PIPELINE_COLUMNS.map(col => (
                <KanbanColumn
                  key={col}
                  col={col}
                  leads={grouped[col]}
                  onAddLead={handleAddLead}
                  onEdit={handleEdit}
                  onColumnClick={onColumnClick} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}