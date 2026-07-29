import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtitle?: string;
  trend?: { icon: React.ReactNode; text: string; color?: string };
  className?: string;
}

const StatsCard = ({
  icon,
  label,
  value,
  subtitle,
  trend,
  className = "",
}: StatsCardProps) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-[10px] border border-[#ECECEC] px-4 py-4 ${className}`}
    >
      {/* Icon */}
      <div className="p-2 rounded-lg">
        {icon}
      </div>

      {/* Content */}
      <div>
        <p className="text-sm">{label}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-xl font-bold leading-tight">{value}</p>
          {trend && (
           <span className={`flex items-center gap-0.5 text-[11px] font-medium ${trend.color ?? "text-[#22c55e]"}`}>
           {trend.icon}
           {trend.text}
         </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[10px] text-[#717171]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;