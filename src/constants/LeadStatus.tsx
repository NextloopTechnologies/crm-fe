export const LEAD_STATUS_OPTIONS = {
    None: [
      "Attempted to Contact",
      "Contact in Future",
      "Contacted",
      "Junk Lead",
      "Lost Lead",
      "Not Contacted",
      "Pre-Qualified",
      "Not Qualified",
    ],
  
    "Attempted to Contact": [
      "Contact in Future",
      "Contacted",
      "Junk Lead",
      "Lost Lead",
      "Pre-Qualified",
      "Not Qualified",
    ],
  
    "Not Contacted": [
      "Attempted to Contact",
      "Contact in Future",
      "Contacted",
      "Junk Lead",
      "Lost Lead",
      "Pre-Qualified",
      "Not Qualified",
    ],
  
    "Contact in Future": [
      "Attempted to Contact",
      "Contacted",
      "Junk Lead",
      "Lost Lead",
      "Pre-Qualified",
      "Not Qualified",
    ],
  
    Contacted: [
      "Pre-Qualified",
      "Lost Lead",
      "Not Qualified",
    ],
  
    "Pre-Qualified": [
      "Contacted",
      "Lost Lead",
    ],
  
    "Lost Lead": [],
    "Junk Lead": [],
    "Not Qualified": [],
  } as const;

  export const STATUS_COLOR: Record<
    string,
    {
        bg: string;
        text: string;
        dot: string;
    }
> = {
    Contacted: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",

    },

    "Attempted to Contact": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",

    },

    "Not Contacted": {
        bg: "bg-slate-100",
        text: "text-slate-600",
        dot: "bg-slate-400",

    },

    "Pre-Qualified": {
        bg: "bg-violet-50",
        text: "text-violet-700",
        dot: "bg-violet-500",

    },

    "Contact in Future": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        dot: "bg-blue-500",

    },

    "Lost Lead": {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",

    },

    "Junk Lead": {
        bg: "bg-gray-100",
        text: "text-gray-600",
        dot: "bg-gray-400",

    },

    "Not Qualified": {
        bg: "bg-red-50",
        text: "text-red-600",
        dot: "bg-red-400",

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
  { label: "None", value: "None" },
  { label: "Attempted to Contact", value: "Attempted to Contact" },
  { label: "Contact in Future", value: "Contact in Future" },
  { label: "Contacted", value: "Contacted" },
  { label: "Junk Lead", value: "Junk Lead" },
  { label: "Lost Lead", value: "Lost Lead" },
  { label: "Not Contacted", value: "Not Contacted" },
  { label: "Pre-Qualified", value: "Pre-Qualified" },
  { label: "Not Qualified", value: "Not Qualified" },
] as const;

// ─────────────────────────────────────────────────────────────
// 4 pipeline columns only
// ─────────────────────────────────────────────────────────────

export type PipelineCol = "New" | "Qualified" | "Contacted" | "Lost Lead";

export const PIPELINE_COLUMNS: PipelineCol[] = ["New", "Qualified", "Contacted", "Lost Lead"];

export const STATUS_TO_COLUMN: Record<string, PipelineCol> = {
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

export const COLUMN_CONFIG: Record<PipelineCol, {
  color: string; light: string;
  badgeBg: string; badgeText: string;
  prefillStatus: string;
}> = {
  "New": { color: "#6366f1", light: "#eef2ff", badgeBg: "bg-indigo-50", badgeText: "text-indigo-600", prefillStatus: "Attempted to Contact" },
  "Qualified": { color: "#8b5cf6", light: "#f5f3ff", badgeBg: "bg-violet-50", badgeText: "text-violet-600", prefillStatus: "Pre-Qualified" },
  "Contacted": { color: "#10b981", light: "#ecfdf5", badgeBg: "bg-emerald-50", badgeText: "text-emerald-600", prefillStatus: "Contacted" },
  "Lost Lead": { color: "#ef4444", light: "#fef2f2", badgeBg: "bg-red-50", badgeText: "text-red-500", prefillStatus: "Lost Lead" },
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