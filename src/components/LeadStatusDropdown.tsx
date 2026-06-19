import { updateLeadStatusbyLeadNumber } from "@/api/leads.api";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { getAvailableStatuses } from "./utils/leadStatus";
import { LeadStatusBadge } from "@/constants/LeadStatus";

export function LeadStatusDropdown({
    leadNumber,
    currentStatus,
    onSuccess,
}: {
    leadNumber: string;
    currentStatus?: string;
    onSuccess: (status: string) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);  
    const options = getAvailableStatuses(currentStatus);

    const handleChange = async (status: string) => {
        try {
            setLoading(true);
            await updateLeadStatusbyLeadNumber(leadNumber, status);
            onSuccess(status);
        } catch (error) {
            console.error("Failed to update lead status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setOpen(true); 
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <Select
                open={open}
                onOpenChange={setOpen}
                value={currentStatus || "None"}
                onValueChange={(status) => {
                    handleChange(status);
                    setOpen(false);
                }}
                disabled={loading || options.length === 0}
                
            >
                <SelectTrigger
                    className="w-[180px] border-0 p-0 shadow-none focus:ring-0"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <LeadStatusBadge status={currentStatus} />
                </SelectTrigger>

                <SelectContent onClick={(e) => e.stopPropagation()}>
                    {(!currentStatus || currentStatus === "None") && (
                        <SelectItem value="None" disabled>
                            — Select status —
                        </SelectItem>
                    )}
                    {options.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}