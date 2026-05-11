// components/common/CommonBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
  label: string;
  className?: string;
}

export default function CustomBadge({
  label,
  className,
}: CustomBadgeProps) {
  return (
    <Badge
      className={cn(
        "w-[90px] flex items-center justify-center gap-2 leading-none rounded-[4px] px-3 py-3",
        className
      )}
    >
      <span className="leading-none">{label}</span>
    </Badge>
  );
}