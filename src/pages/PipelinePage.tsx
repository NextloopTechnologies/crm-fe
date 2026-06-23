// pages/Pipeline/PipelinePage.tsx
import { useCallback,  useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus, Calendar, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/route";
import { formatDate, isWithin7Days, LeadAvatar } from "./leads/leadHelper";
import { COLUMN_CONFIG, LEAD_STATUS_OPTIONS, PIPELINE_COLUMNS, PipelineCol, STATUS_COLOR, STATUS_TO_COLUMN } from "@/constants/LeadStatus";
import { CreateLeadRequest } from "@/types/api.types";
import { LeadStatusDropdown } from "@/components/LeadStatusDropdown";

const resolveColumn = (lead: CreateLeadRequest): PipelineCol => {
  if (isWithin7Days(lead.creationDate ?? "")) return "New";
  return STATUS_TO_COLUMN[lead.leadStatus ?? ""] ?? "New";
};

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
  onStatusChange,
  isUpdating,
  
}: {
  lead: CreateLeadRequest;
  col: PipelineCol;
  onEdit: (l: CreateLeadRequest) => void;
  onStatusChange: (leadNumber: string, status: string) => void;
  isUpdating?: boolean;

}) => {
  
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

      </div>

      <div className="border-t border-[#f1f5f9]" />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] ml-auto">
          <Calendar size={10} />
          {lead.creationDate ? formatDate(lead.creationDate) : "—"}
        </div>
      </div>

      {/* Status Selector */}
      <LeadStatusDropdown
        leadNumber={lead.leadNumber}
        currentStatus={lead.leadStatus ?? "None"}
        onStatusChange={onStatusChange}
        isUpdating={isUpdating}
        size="sm"
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Kanban Column
// ─────────────────────────────────────────────────────────────
interface KanbanColumnProps {
  col: PipelineCol;
  leads: CreateLeadRequest[];
  onAddLead: (col: PipelineCol) => void;
  onEdit: (lead: CreateLeadRequest) => void;
  onColumnClick?: (col: PipelineCol) => void;
  onStatusChange: (leadNumber: string, status: string) => void;
  statusLoadingLeads?: Set<string>;
}

const KanbanColumn = ({
  col,
  leads,
  onAddLead,
  onEdit,
  onColumnClick,
  onStatusChange,
  statusLoadingLeads,
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
                onStatusChange={onStatusChange}
                isUpdating={statusLoadingLeads?.has(lead.leadNumber)}
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
  leads: CreateLeadRequest[];
  onCardClick?: (lead: CreateLeadRequest) => void;
  onColumnClick?: (col: string) => void;
  onStatusChange: (leadNumber: string, status: string) => void;
  statusLoadingLeads?: Set<string>;
};

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function PipelinePage({
  leads,
  onColumnClick,
  onCardClick,
  onStatusChange,
  statusLoadingLeads = new Set(),

}: PipelinePageProps){
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const navigate = useNavigate();

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;


  // Group into 4 columns with search + filters applied
  const grouped = useMemo<Record<PipelineCol, CreateLeadRequest[]>>(() => {
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

  const handleEdit = useCallback((l: CreateLeadRequest) => navigate(ROUTES.LEADS_DETAIL(String(l.leadNumber))), [navigate]);

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
                  onStatusChange={onStatusChange}
                  statusLoadingLeads={statusLoadingLeads}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}