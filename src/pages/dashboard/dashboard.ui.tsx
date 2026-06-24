import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  ArcElement,
} from "chart.js";
import CustomBadge from "@/components/common/CommonBadge";
import StatsCard from "@/components/common/StatsCards";
import { ROUTES } from "@/lib/route";
import { buildGrowthData, buildSourceData, PERIOD_DATA, SOURCES_DATA } from "./dashboard.data";
import type { Account, StatItem, Task } from "./dashboard.data";
import { Lead } from "@/types/api.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  ArcElement
);

// ─────────────────────────────────────────────
// StatsGrid
// ─────────────────────────────────────────────
interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          subtitle={stat.subtitle}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// GrowthChart
// ─────────────────────────────────────────────
interface GrowthChartProps {
  title: string;
  leads: Lead[];
}

export function GrowthChart({ title, leads }: GrowthChartProps) {
  const [period, setPeriod] = useState<"this_month" | "last_month" | "this_quarter">("this_month");
  const chartData = buildGrowthData(leads, period);

  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white px-5 pt-5 pb-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-bold text-[#0f172a]">{title}</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as "this_month" | "last_month" | "this_quarter")}
          className="cursor-pointer rounded-[5px] border border-[#E0E0E0] px-[5px] py-[5px] text-[12px] text-[#7E7E7E] outline-none"
        >
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_quarter">This Quarter</option>
        </select>
      </div>

      <div style={{ height: 200 }}>
        <Line
          data={{
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.values,
                borderColor: "#4f6ef7",
                borderWidth: 2.2,
                backgroundColor: "rgba(79,110,247,0.12)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#4f6ef7",
                pointBorderColor: "#fff",
                pointBorderWidth: 1.5,
                pointRadius: 3.5,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 0 } },
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: "#94a3b8", font: { size: 10 } },
              },
              y: {
                min: 0,
                grid: { color: "#e2e8f0" },
                ticks: {
                  color: "#94a3b8",
                  font: { size: 10 },
                  callback: (v) => {
                    const n = Number(v);
                    if (n === 0) return "$0";
                    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
                    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
                    return `$${n}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SourceDonut
// ─────────────────────────────────────────────
interface SourceDonutProps {
  title: string;
  leads: Lead[];
}

export function SourceDonut({ title , leads}: SourceDonutProps) {
  const [sourcePeriod, setSourcePeriod] = useState<"this_month" | "last_month">("this_month");

  const currentSources = buildSourceData(leads, sourcePeriod);

  if (!currentSources.length) {
    return (
      <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-5 flex items-center justify-center h-[220px]">
        <span className="text-[12px] text-[#94a3b8]">No data available</span>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[#0f172a]">{title}</h2>
        <select
          value={sourcePeriod}
          onChange={(e) =>
            setSourcePeriod(e.target.value as "this_month" | "last_month")
          }
          className="cursor-pointer rounded-[5px] border border-[#E0E0E0] px-[5px] py-[5px] text-[12px] text-[#7E7E7E] outline-none"
        >
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div
          className="relative flex-shrink-0"
          style={{ width: 180, height: 180 }}
        >
          <Doughnut
            data={{
              labels: currentSources.map((s) => s.label),
              datasets: [
                {
                  data: currentSources.map((s) => s.pct),
                  backgroundColor: currentSources.map((s) => s.color),
                  borderWidth: 2,
                  borderColor: "#ffffff",
                  hoverOffset: 6,
                },
              ],
            }}
            options={{
              cutout: "68%",
              animation: {
                animateRotate: true,
                duration: 800,
                easing: "easeInOutQuart",
              },
              plugins: { legend: { display: false } },
            }}
          />
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[18px] font-semibold text-[#0f172a]">
              {currentSources[0].pct}%
            </span>
            <span className="text-[10px] text-[#64748b]">
              {currentSources[0].label}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-2">
          {currentSources.map((s) => (
            <div key={s.label} className="flex items-center gap-[6px]">
              <span
                className="h-[6px] w-[6px] flex-shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="flex-1 text-[12px] text-[#64748b]">
                {s.label}
              </span>
              <span className="text-[12px] font-semibold text-[#0f172a]">
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AccountsTable
// ─────────────────────────────────────────────
interface AccountsTableProps {
  title: string;
  accounts: Account[];
  onViewAll?: () => void;
}

export function AccountsTable({ title, accounts, onViewAll }: AccountsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  const filteredAccounts = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.industry.toLowerCase().includes(search.toLowerCase())
  )  .slice(0, 5);

  return (
    <div className="min-w-0 rounded-[14px] border border-[#e2e8f0] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#0f172a]">{title}</h2>
        <button
          onClick={() => navigation.navigate(ROUTES.ACCOUNTS)}
          className="cursor-pointer rounded-[5px] border border-[#E0E0E0] bg-transparent px-2 py-[2px] text-[11px] text-[#64748b]"
        >
          View All
        </button>
      </div>

      {filteredAccounts.length === 0 ? (
        <p className="text-center text-[12px] text-[#94a3b8] py-6">No accounts found</p>
      ) : (
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr>
            {(
              [
                "Account Name",
                "Industry",
                "Owner",
                "Account Site",
                "Status",
              ] as const
            ).map((h) => (
              <th
                key={h}
                className="border-b border-[#f1f5f9] px-[6px] py-1 text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-[#94a3b8]"
              >
                {h}
              </th>
            ))}
            <th />
          </tr>
        </thead>

        <tbody>
          {filteredAccounts.map((a) => (
            <tr key={a.id} className="border-b border-[#f8fafc]">
              {/* Account Name */}
              <td className="px-[6px] py-[7px]">
                <div className="flex items-center gap-[7px]">
                  <div
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[6px] text-[10px] font-bold"
                    style={{
                      background: a.color + "22",
                      color: a.color,
                    }}
                  >
                    {a.initials}
                  </div>
                  <span className="text-[12px] font-semibold text-[#0f172a]">
                    {a.name}
                  </span>
                </div>
              </td>

              {/* Industry */}
              <td className="px-[6px] py-[7px] text-[11px] text-[#64748b]">
                {a.industry}
              </td>

              {/* Owner */}
              <td className="px-[6px] py-[7px] text-[11px] text-[#374151]">
                {a.owner}
              </td>

              {/* Created At */}
              <td className="px-[6px] py-[7px] text-[11px] text-[#374151]">
                {a.owner}
              </td>

              {/* Status */}
              <td className="px-[6px] py-[7px]">
                <CustomBadge
                  label={a.status}
                  size="sm"
                  className={
                    a.status === "Active"
                      ? "border border-green-200 bg-green-50 text-green-600"
                      : "border border-red-200 bg-red-50 text-red-600"
                  }
                />
              </td>

              {/* Three dots menu */}
              <td className="relative px-[6px] py-[7px]">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === a.id ? null : a.id)
                  }
                  className="flex h-6 w-6 items-center justify-center rounded text-[16px] text-[#94a3b8] hover:bg-[#f1f5f9]"
                >
                  ⋮
                </button>

                {openMenuId === a.id && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />

                    <div className="absolute right-2 top-8 z-20 min-w-[130px] rounded-[8px] border border-[#e2e8f0] bg-white py-1 shadow-md">
                      {/* View */}
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          navigate(ROUTES.ACCOUNTS_EDIT(String('1')));
                        }}
                        className="flex w-full items-center gap-2 px-3 py-[7px] text-left text-[12px] text-[#374151] hover:bg-[#f8fafc]"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          navigate(ROUTES.ACCOUNTS_EDIT(String('1')));
                        }}
                        className="flex w-full items-center gap-2 px-3 py-[7px] text-left text-[12px] text-[#374151] hover:bg-[#f8fafc]"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TasksList
// ─────────────────────────────────────────────
interface TasksListProps {
  title: string;
  tasks: Task[];
  onViewAll?: () => void;
}

export function TasksList({ title, tasks, onViewAll }: TasksListProps) {
  return (
    <div className="min-w-0 rounded-[14px] border border-[#e2e8f0] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#0f172a]">{title}</h2>
        <button
          onClick={() => navigation.navigate(ROUTES.TASKS)}
          className="cursor-pointer rounded-[5px] border border-[#E0E0E0] bg-transparent px-2 py-[2px] text-[11px] text-[#64748b]"
        >
          View all
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-[12px] text-[#94a3b8] py-6">No tasks found</p>
      ) : (
      <div className="flex flex-col">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="mb-[6px] flex items-center gap-3 px-3 py-[10px]"
          >
            {/* Icon */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[14px]">
              {t.icon}
            </div>

            {/* Task Info */}
            <div className="min-w-0 flex-1">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-[#0f172a]">
                {t.subject}
              </p>
              <p className="mt-[2px] text-[10px] text-[#94a3b8]">
                {t.taskOwner}
              </p>
            </div>

            {/* Date */}
            <div className="w-[95px] flex-shrink-0 text-left text-[11px] text-[#94a3b8]">
              {t.createdAt}
            </div>

            {/* Priority Badge */}
            <div className="flex w-[72px] flex-shrink-0 justify-center">
              <CustomBadge
                label={t.priority}
                size="sm"
                className={
                  t.priority === "High"
                    ? "justify-center border border-red-200 bg-red-50 text-red-600"
                    : t.priority === "Medium"
                    ? "justify-center border border-yellow-200 bg-yellow-50 text-yellow-600"
                    : "justify-center border border-green-200 bg-green-50 text-green-600"
                }
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}