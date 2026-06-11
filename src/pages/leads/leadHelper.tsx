import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ================================
// Utils
// ================================

export const formatDate = (
  raw?: string,
  includeTime = false
) => {
  if (!raw) return "—";

  try {
    return new Date(raw.replace(" ", "T")).toLocaleDateString(
      "en-IN",
      includeTime
        ? {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        : {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
    );
  } catch {
    return "—";
  }
};

export const formatCurrency = (val?: string) => {
  if (!val) return "—";

  const n = parseFloat(val);

  if (isNaN(n)) return "—";

  if (n >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(2)}M`;
  }

  if (n >= 1_000) {
    return `$${(n / 1_000).toFixed(1)}K`;
  }

  return `$${n}`;
};

export const displayValue = (val?: string) =>
  !val || val === "NA" ? "—" : val;

export const getInitials = (
  first?: string,
  last?: string
) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";

export const isWithin7Days = (creationDate?: string) => {
  if (!creationDate) return false;

  try {
    const d = new Date(creationDate.replace(" ", "T"));

    return (
      (Date.now() - d.getTime()) / 86400000 <= 7
    );
  } catch {
    return false;
  }
};

// ================================
// Status Colors
// ================================

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

// ================================
// Reusable Components
// ================================

export const LeadAvatar = ({
  firstName,
  lastName,
  email,
  size = "h-10 w-10",
}: {
  firstName?: string;
  lastName?: string;
  email?: string;
  size?: string;
}) => (
  <Avatar className={size}>
    <AvatarImage
      src={`${import.meta.env.VITE_AVATAR_URL}&seed=${email}`}
    />
    <AvatarFallback className="bg-[#5752FE1A] text-[#5752FE] font-semibold">
      {getInitials(firstName, lastName)}
    </AvatarFallback>
  </Avatar>
);

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
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
      />
      {status ?? "—"}
    </span>
  );
};

export const SectionTitle = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-7 h-7 rounded-lg bg-[#5752FE1A] flex items-center justify-center text-[#5752FE]">
      {icon}
    </div>

    <h3 className="text-[13px] font-semibold text-[#1e1e2d] uppercase tracking-wide">
      {label}
    </h3>

    <div className="flex-1 h-px bg-[#f1f5f9]" />
  </div>
);

export const Field = ({
  label,
  value,
  full = false,
}: {
  label: string;
  value: React.ReactNode;
  full?: boolean;
}) => (
  <div className={full ? "col-span-2" : ""}>
    <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">
      {label}
    </p>

    <p className="text-[13px] text-[#1e1e2d] font-medium">
      {value || "—"}
    </p>
  </div>
);