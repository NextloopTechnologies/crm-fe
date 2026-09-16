// ─────────────────────────────────────────────────────────────
// Lead funnel — single source of truth.
//
// Status and pipeline column are the same thing: every stage below is both a
// value stored in `lead_entity.lead_status` and a column on the pipeline board.
//
// `value` is what the API stores and what the backend whitelist validates
// (LeadValidator.LEAD_STATUS_REGEX and UpdateLeadStatusRequest). `label` is
// display only. They differ for exactly one stage: "Won" is stored as
// "Deal Won", because LeadServiceImpl keys automatic account creation off that
// literal string. Rename it there before changing it here.
// ─────────────────────────────────────────────────────────────

export const LEAD_STAGES = [
  { value: "New Lead", label: "New Lead" },
  { value: "Contacted", label: "Contacted" },
  { value: "Sales Qualified Lead", label: "Sales Qualified Lead (SQL)" },
  { value: "Proposal Sent", label: "Proposal Sent" },
  { value: "Deal Won", label: "Won" },
  { value: "Lost", label: "Lost" },
  { value: "Follow-up Later", label: "Follow-up Later" },
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number]["value"];

export const LEAD_STATUS_OPTIONS_LIST = LEAD_STAGES.map((s) => ({
  label: s.label,
  value: s.value,
}));

/** Display name for a stored status value. */
export const getStatusLabel = (status?: string): string =>
  LEAD_STAGES.find((s) => s.value === status)?.label ?? status ?? "None";

// ================================
// Colors
// ================================

type StatusColor = { bg: string; text: string; dot: string };

const STAGE_COLORS: Record<LeadStage, StatusColor> = {
  "New Lead": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Contacted: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  "Sales Qualified Lead": { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  "Proposal Sent": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Deal Won": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Lost: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "Follow-up Later": { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
};

// Retired statuses. The Flyway migration rewrites existing rows, but keeping
// these keys means anything still holding an old value renders sensibly
// instead of falling back to grey.
const LEGACY_COLORS: Record<string, StatusColor> = {
  Interested: STAGE_COLORS["Sales Qualified Lead"],
  "Meeting Scheduled": STAGE_COLORS["Sales Qualified Lead"],
  "Requirement Received": STAGE_COLORS["Sales Qualified Lead"],
  "Hot Lead": STAGE_COLORS["Sales Qualified Lead"],
  "Warm Lead": STAGE_COLORS["Sales Qualified Lead"],
  "Pre-Qualified": STAGE_COLORS["Sales Qualified Lead"],
  "Proposal Shared": STAGE_COLORS["Proposal Sent"],
  "Commercial Discussion": STAGE_COLORS["Proposal Sent"],
  "Profiles Shared": STAGE_COLORS["Proposal Sent"],
  "Active Client": STAGE_COLORS["Deal Won"],
  "Not Interested": STAGE_COLORS.Lost,
  "Non Interested": STAGE_COLORS.Lost,
  "Lost Lead": STAGE_COLORS.Lost,
  "Junk Lead": STAGE_COLORS.Lost,
  "Not Qualified": STAGE_COLORS.Lost,
  "On Hold": STAGE_COLORS["Follow-up Later"],
  "No Response": STAGE_COLORS["Follow-up Later"],
  "Cold Lead": STAGE_COLORS["Follow-up Later"],
  "Contact in Future": STAGE_COLORS["Follow-up Later"],
  "Attempted to Contact": STAGE_COLORS["New Lead"],
  "Not Contacted": STAGE_COLORS["New Lead"],
  None: STAGE_COLORS["New Lead"],
};

export const STATUS_COLOR: Record<string, StatusColor> = {
  ...STAGE_COLORS,
  ...LEGACY_COLORS,
};

export const LeadStatusBadge = ({ status }: { status?: string }) => {
  const cfg = STATUS_COLOR[status ?? ""] ?? {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`
        inline-flex
        w-[160px]
        items-center
        justify-center
        rounded-lg
        px-2
        py-1
        text-sm
        font-semibold
        ${cfg.bg}
        ${cfg.text}
      `}
    >
      {getStatusLabel(status)}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// Pipeline board — one column per stage
// ─────────────────────────────────────────────────────────────

export type PipelineCol = LeadStage;

export const PIPELINE_COLUMNS: PipelineCol[] = LEAD_STAGES.map((s) => s.value);

/**
 * Status → board column. Stages map to themselves; retired values are folded
 * into their successor so pre-migration leads still appear on the board.
 */
export const STATUS_TO_COLUMN: Record<string, PipelineCol> = {
  ...Object.fromEntries(LEAD_STAGES.map((s) => [s.value, s.value])),

  None: "New Lead",
  "Not Contacted": "New Lead",
  "Attempted to Contact": "New Lead",

  Interested: "Sales Qualified Lead",
  "Pre-Qualified": "Sales Qualified Lead",
  "Meeting Scheduled": "Sales Qualified Lead",
  "Requirement Received": "Sales Qualified Lead",
  "Hot Lead": "Sales Qualified Lead",
  "Warm Lead": "Sales Qualified Lead",

  "Proposal Shared": "Proposal Sent",
  "Commercial Discussion": "Proposal Sent",
  "Profiles Shared": "Proposal Sent",

  "Active Client": "Deal Won",

  "Not Interested": "Lost",
  "Non Interested": "Lost",
  "Lost Lead": "Lost",
  "Junk Lead": "Lost",
  "Not Qualified": "Lost",

  "On Hold": "Follow-up Later",
  "No Response": "Follow-up Later",
  "Cold Lead": "Follow-up Later",
  "Contact in Future": "Follow-up Later",
} as Record<string, PipelineCol>;

export const COLUMN_CONFIG: Record<
  PipelineCol,
  {
    color: string;
    light: string;
    badgeBg: string;
    badgeText: string;
    /** Status pre-selected when adding a lead straight into this column. */
    prefillStatus: LeadStage;
  }
> = {
  "New Lead": { color: "#6366f1", light: "#eef2ff", badgeBg: "bg-indigo-50", badgeText: "text-indigo-600", prefillStatus: "New Lead" },
  Contacted: { color: "#06b6d4", light: "#ecfeff", badgeBg: "bg-cyan-50", badgeText: "text-cyan-600", prefillStatus: "Contacted" },
  "Sales Qualified Lead": { color: "#8b5cf6", light: "#f5f3ff", badgeBg: "bg-violet-50", badgeText: "text-violet-600", prefillStatus: "Sales Qualified Lead" },
  "Proposal Sent": { color: "#f59e0b", light: "#fffbeb", badgeBg: "bg-amber-50", badgeText: "text-amber-600", prefillStatus: "Proposal Sent" },
  "Deal Won": { color: "#10b981", light: "#ecfdf5", badgeBg: "bg-emerald-50", badgeText: "text-emerald-600", prefillStatus: "Deal Won" },
  Lost: { color: "#ef4444", light: "#fef2f2", badgeBg: "bg-red-50", badgeText: "text-red-500", prefillStatus: "Lost" },
  "Follow-up Later": { color: "#eab308", light: "#fefce8", badgeBg: "bg-yellow-50", badgeText: "text-yellow-600", prefillStatus: "Follow-up Later" },
};

// ================================
// Rating Colors
// ================================

export const RATING_COLOR: Record<string, string> = {
  Acquired: "text-emerald-600 bg-emerald-50",
  Active: "text-blue-600 bg-blue-50",
  "Market Failed": "text-red-600 bg-red-50",
  "Project Cancelled": "text-gray-600 bg-gray-100",
  "Shut Down": "text-orange-600 bg-orange-50",
};
