import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-2 py-1 text-[10px] min-w-[52px]",
  md: "px-3 py-2 text-xs min-w-[70px]",
  lg: "px-4 py-3 text-sm min-w-[90px]",
};

export default function CustomBadge({
  label,
  className,
  size = "lg",
}: CustomBadgeProps) {
  return (
    <Badge
      className={cn(
        "inline-flex items-center justify-center rounded-[4px] leading-none",
        sizeClasses[size],
        className
      )}
    >
      <span className="leading-none">{label}</span>
    </Badge>
  );
}