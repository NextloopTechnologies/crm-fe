// InlineSelectDropdown.tsx
import SelectDropdown from "@/components/common/SelectDropdown";
import { Label } from "@/components/ui/label";

interface InlineSelectProps {
    id?: string;
    label?: string;
    placeholder?: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (val: string) => void;
    required?: boolean;
    error?: string;
    leftIcon?: React.ReactNode;
}

export function InlineSelectDropdown({
    label, placeholder, options, value, onChange, required, error, leftIcon
}: InlineSelectProps) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-1">
                {label && (
                    <Label className="w-20 shrink-0 text-sm font-medium text-[#111127]">
                        {label}
                    </Label>
                )}

                <div className="w-full max-w-[320px]">
                    <SelectDropdown
                        placeholder={placeholder}
                        options={options}
                        value={value}
                        onChange={onChange}
                        required={required}
                        leftIcon={leftIcon}
                        error={error}
                    />
                </div>
            </div>
            {error && (
                <p className="text-[0.8125rem] font-medium text-red-500 pl-28">{error}</p>
            )}
        </div>
    );
}