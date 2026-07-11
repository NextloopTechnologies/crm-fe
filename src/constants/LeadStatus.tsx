  export const STATUS_COLOR: Record<
    string,
    {
        bg: string;
        text: string;
        dot: string;
    }
> = {
  
  "New Lead": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        dot: "bg-blue-500",

    },

    Contacted: {
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        dot: "bg-cyan-500",

    },

    Interested: {
      bg: "bg-violet-50",
      text: "text-violet-700",
      dot: "bg-violet-500",

    },
    
    "Not-Interested": {
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",

    },
    
    "Meeting Scheduled": {
        bg: "bg-purple-50",
        text: "text-purple-700",
        dot: "bg-purple-500",

    },

    "Requirement Received": {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        dot: "bg-indigo-500",

    },

    "Proposal Shared": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",

    },

    "Commercial Discussion": {
        bg: "bg-orange-50",
        text: "text-orange-700",
        dot: "bg-orange-500",

    },

    "Profiles Shared": {
    bg: "bg-pink-50",
    text: "text-pink-700",
    dot: "bg-pink-500",
  },

    "Deal Won": {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },

    "Active Client": {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },

    "On Hold": {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
    },

    "No Response": {
      bg: "bg-slate-100",
      text: "text-slate-700",
      dot: "bg-slate-500",
    },

    "Cold Lead": {
      bg: "bg-gray-100",
      text: "text-gray-700",
      dot: "bg-gray-500",
    },

      "Hot Lead": {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
    },

      "Warm Lead": {
      bg: "bg-orange-100",
      text: "text-orange-700",
      dot: "bg-orange-500",
    },

    
     Lost: {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",

    },
};

export const LeadStatusBadge = ({
    status,
}: {
    status?: string;
}) => {
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
              {status ?? "None"}
            </span>
    );
};

export const LEAD_STATUS_OPTIONS_LIST = [
  { label: "New Lead", value: "New Lead" },
  { label: "Contacted", value: "Contacted" },
  { label: "Interested", value: "Interested" },
  { label: "Not Interested", value: "Not Interested" },
  { label: "Meeting Scheduled", value: "Meeting Scheduled" },
  { label: "Requirement Received", value: "Requirement Received" },
  { label: "Proposal Shared", value: "Proposal Shared" },
  { label: "Commercial Discussion", value: "Commercial Discussion" },
  { label: "Profiles Shared", value: "Profiles Shared" },
  { label: "Deal Won", value: "Deal Won" },
  { label: "Active Client", value: "Active Client" },
  { label: "On Hold", value: "On Hold" },
  { label: "No Response", value: "No Response" },
  { label: "Cold Lead", value: "Cold Lead" },
  { label: "Hot Lead", value: "Hot Lead" },
  { label: "Warm Lead", value: "Warm Lead" },
  { label: "Lost", value: "Lost" },
];

// ─────────────────────────────────────────────────────────────
// 4 pipeline columns only
// ─────────────────────────────────────────────────────────────

export type PipelineCol = "New Lead" | "Interested" | "Proposal" | "Won" | "Lost";

export const PIPELINE_COLUMNS: PipelineCol[] = ["New Lead", "Interested", "Proposal", "Won" ,"Lost"];

export const STATUS_TO_COLUMN: Record<string, PipelineCol> = {
  "New Lead": "New Lead",
  Contacted: "New Lead",

  Interested: "Interested",

  "Proposal Shared": "Proposal",

  "Deal Won": "Won",

  Lost: "Lost",
};

export const COLUMN_CONFIG: Record<PipelineCol, {
  color: string; light: string;
  badgeBg: string; badgeText: string;
  prefillStatus: string;
}> = {
  "New Lead": { color: "#6366f1", light: "#eef2ff", badgeBg: "bg-indigo-50", badgeText: "text-indigo-600", prefillStatus: "Attempted to Contact" },
  Interested: { color: "#8b5cf6", light: "#f5f3ff", badgeBg: "bg-violet-50", badgeText: "text-violet-600", prefillStatus: "Pre-Qualified" },
  Proposal: { color: "#f59e0b", light: "#fffbeb", badgeBg: "bg-amber-50", badgeText: "text-amber-600", prefillStatus: "Proposal Shared" },
  Won: { color: "#10b981", light: "#ecfdf5", badgeBg: "bg-emerald-50", badgeText: "text-emerald-600", prefillStatus: "Contacted" },
  Lost: { color: "#ef4444", light: "#fef2f2", badgeBg: "bg-red-50", badgeText: "text-red-500", prefillStatus: "Lost Lead" },
};

// ================================
// Rating Colors
// ================================

export const RATING_COLOR: Record<
  string,
  string
> = {
  Acquired: "text-emerald-600 bg-emerald-50",
  Active: "text-blue-600 bg-blue-50",
  "Market Failed": "text-red-600 bg-red-50",
  "Project Cancelled": "text-gray-600 bg-gray-100",
  "Shut Down": "text-orange-600 bg-orange-50",
};