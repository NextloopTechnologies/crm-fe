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
    }
> = {
    Contacted: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
    },

    "Attempted to Contact": {
        bg: "bg-amber-50",
        text: "text-amber-700",
    },

    "Not Contacted": {
        bg: "bg-slate-100",
        text: "text-slate-600",
    },

    "Pre-Qualified": {
        bg: "bg-violet-50",
        text: "text-violet-700",
    },

    "Contact in Future": {
        bg: "bg-blue-50",
        text: "text-blue-700",
    },

    "Lost Lead": {
        bg: "bg-red-50",
        text: "text-red-700",
    },

    "Junk Lead": {
        bg: "bg-gray-100",
        text: "text-gray-600",
    },

    "Not Qualified": {
        bg: "bg-red-50",
        text: "text-red-600",
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
