// components/common/SelectDropdown.tsx

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

export interface SelectOptionGroup {
  groupLabel?: string;
  options: SelectOption[];
}

export interface SelectDropdownProps {
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  placeholder = "Select an option",
  options,
  groups,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  hint,
  leftIcon,
  className,
  triggerClassName,
}) => {
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        {/* Trigger */}
        <SelectTrigger
          className={cn(
            "h-10 w-full rounded-lg h-auto py-5 px-3 text-sm shadow-none",
            "bg-transparent",
            "text-gray-800 data-[placeholder]:text-gray-400",
            // Always show ring — not just on focus
            "ring-1 ring-gray-200",
            "border-0 outline-none",
            // On focus/open, deepen the ring
            "focus:ring-2 focus:ring-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError
              ? "ring-red-400 focus:ring-red-400"
              : "ring-gray-200 hover:ring-gray-400",
            leftIcon && "pl-2",
            triggerClassName
          )}
        >
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>


        {/* Dropdown content — no background fill, clean outline */}
        <SelectContent
          className={cn(
            "rounded-lg border border-gray-200 bg-white shadow-sm",
            // Remove default shadcn padding/margin at top
            "mt-1 p-0 overflow-hidden"
          )}
          // Prevent content shifting / gap between trigger and dropdown
          sideOffset={4}
          align="start"
        >
          {/* Flat options */}
          {options && options.length > 0 && (
            <SelectGroup className="p-1">
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    "cursor-pointer rounded-md text-sm text-gray-700 px-3 py-2",
                    "focus:bg-gray-50 focus:text-gray-900",
                    "data-[state=checked]:font-medium data-[state=checked]:text-blue-600",
                    "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {opt.leftIcon && (
                      <span className="flex items-center justify-center shrink-0">
                        {opt.leftIcon}
                      </span>
                    )}
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {/* Grouped options */}
          {groups &&
            groups.map((group, idx) => (
              <SelectGroup key={idx} className="p-1">
                {group.groupLabel && (
                  <SelectLabel className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                    {group.groupLabel}
                  </SelectLabel>
                )}
                {group.options.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className={cn(
                      "cursor-pointer rounded-md text-sm text-gray-700 px-3 py-2",
                      "focus:bg-gray-50 focus:text-gray-900",
                      "data-[state=checked]:font-medium data-[state=checked]:text-blue-600",
                      "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {opt.leftIcon && (
                        <span className="flex items-center justify-center shrink-0">
                          {opt.leftIcon}
                        </span>
                      )}
                      {opt.label}
                    </span>
                  </SelectItem>
                ))}
                {/* Divider between groups */}
                {idx < groups.length - 1 && (
                  <div className="mx-2 my-1 border-t border-gray-100" />
                )}
              </SelectGroup>
            ))}
        </SelectContent>
      </Select>

      {/* Error / Hint */}
      {hasError ? (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      ) : hint ? (
        <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
};

export default SelectDropdown;