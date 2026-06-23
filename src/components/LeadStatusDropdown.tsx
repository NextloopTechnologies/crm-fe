import { LEAD_STATUS_OPTIONS, STATUS_COLOR } from "@/constants/LeadStatus";
interface LeadStatusDropdownProps {
    leadNumber: string;
    currentStatus: string;
    onStatusChange: (leadNumber: string, status: string) => void;
    isUpdating?: boolean;
    size?: "sm" | "md";
}

export const LeadStatusDropdown = ({
    leadNumber,
    currentStatus,
    onStatusChange,
    isUpdating = false,
    size = "md",
}: LeadStatusDropdownProps) => {
    const status = (currentStatus ?? "None") as keyof typeof LEAD_STATUS_OPTIONS;
    const allowedOptions = LEAD_STATUS_OPTIONS[status] ?? [];
    const cfg = STATUS_COLOR[status] ?? { bg: "bg-slate-100", text: "text-slate-600" };

    const sizeClass = size === "sm"
        ? "w-full text-[11px] pl-2 pr-6 py-1"
        : "text-sm pl-2 pr-6 py-1 w-[160px] max-w-[160px] text-center";

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <select
                value={status}
                disabled={isUpdating || allowedOptions.length === 0}
                onChange={(e) => {
                    e.stopPropagation();
                    onStatusChange(leadNumber, e.target.value);
                }}
                className={`
          rounded-lg font-semibold border-0 cursor-pointer truncate appearance-none
          focus:outline-none focus:ring-2 focus:ring-[#5752FE]
          disabled:cursor-not-allowed disabled:opacity-50
          ${sizeClass} ${cfg.bg} ${cfg.text}
        `}
            >
                <option value={status}>{status}</option>
                {allowedOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>

            {/* Custom caret */}
            <div className={`pointer-events-none absolute inset-y-0 right-2 flex items-center ${cfg.text}`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                    <div className={`animate-spin rounded-full border-2 border-[#5752FE] border-t-transparent
            ${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`}
                    />
                </div>
            )}
        </div>
    );
};