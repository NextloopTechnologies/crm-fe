import { ActiveUsersIcon, InActiveUsersIcon, TenantsIcon, UpArrowIcon, UsersIcon } from "@/assets/icons/components";
import { Checkbox } from "@/components/common/Checkbox";
import CustomBadge from "@/components/common/CommonBadge";
import StatsCard from "@/components/common/StatsCards";
import { ChartLine, Phone } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";

interface GrowthPoint {
  date: string;
  value: number;
}

interface Source {
  label: string;
  pct: number;
  color: string;
}

interface Account {
  id: number;
  initials: string;
  color: string;
  name: string;
  industry: string;
  owner: string;
  ownerAvatar: string;
  created: string;
  status: "Active" | "Inactive";
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  date: string;
  priority: "High" | "Medium" | "Low";
  icon: string;
}

const STATS = [
  {
    icon: <UsersIcon />,
    label: "Total Users",
    value: '2400',
    subtitle: "All Users in System",
    trend: { icon: <UpArrowIcon />, text: "24%", color: "text-[#22c55e]" },
  },
  {
    icon: <ActiveUsersIcon />,
    label: "Active Accounts",
    value: '2344',
    subtitle: "vs last month",
    trend: { icon: <UpArrowIcon />, text: "8.3%", color: "text-[#22c55e]" },
  },
  {
    icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center"><ChartLine className="w-6 h-6 text-[#FBBC05]" /></div>,
    label: "Total Revenue",
    value: '$24,334',
    subtitle: "vs last month",
    trend: { icon: <UpArrowIcon />, text: "8.3%", color: "text-[#22c55e]" },

  },
  {
    icon: <TenantsIcon />,
    label: "Total Contacts",
    value: '248',
    subtitle: "vs last month",
    trend: { icon: <UpArrowIcon />, text: "8.3%", color: "text-[#22c55e]" },
  }
];
const GROWTH_DATA: GrowthPoint[] = [
  { date: "May 01", value: 22000 },
  { date: "May 06", value: 35000 },
  { date: "May 11", value: 42000 },
  { date: "May 16", value: 55000 },
  { date: "May 21", value: 71000 },
  { date: "May 26", value: 68000 },
  { date: "May 31", value: 85000 },
];

const SOURCES: Source[] = [
  { label: "Website", pct: 32.5, color: "#4f6ef7" },
  { label: "Referral", pct: 24.1, color: "#22c55e" },
  { label: "Social Media", pct: 18.3, color: "#f59e0b" },
  { label: "Email Campaign", pct: 15.6, color: "#a855f7" },
  { label: "Others", pct: 9.5, color: "#94a3b8" },
];

const ACCOUNTS: Account[] = [
  { id: 1, initials: "N", color: "#4f6ef7", name: "Nextloop Solutions Pvt. Ltd.", industry: "Software & Tech", owner: "Arjun Singh", ownerAvatar: "AS", created: "May 20, 2024", status: "Active" },
  { id: 2, initials: "BF", color: "#22c55e", name: "Bright Future Pvt. Ltd.", industry: "Education", owner: "Priya Mehta", ownerAvatar: "PM", created: "May 18, 2024", status: "Active" },
  { id: 3, initials: "TN", color: "#f59e0b", name: "TechNova Solutions", industry: "IT Services", owner: "Rahul Verma", ownerAvatar: "RV", created: "May 17, 2024", status: "Active" },
  { id: 4, initials: "CT", color: "#a855f7", name: "Cloudify Technologies", industry: "Cloud Services", owner: "Neha Kapoor", ownerAvatar: "NK", created: "May 15, 2024", status: "Active" },
  { id: 5, initials: "D", color: "#ef4444", name: "Delta Systems", industry: "Manufacturing", owner: "Vikram Shah", ownerAvatar: "VS", created: "May 10, 2024", status: "Inactive" },
];

const TASKS = [
  { id: 1, title: "Follow up with Nextloop Solutions", assignee: "Arjun Singh", date: "May 21, 2024", priority: "High", icon: <Phone className="w-3 h-3"/> },
  { id: 2, title: "Send proposal to Bright Future Pvt. Ltd.", assignee: "Priya Mehta", date: "May 22, 2024", priority: "Medium", icon : <ActiveUsersIcon/> },
  { id: 3, title: "Demo with Cloudify Technologies", assignee: "Neha Kapoor", date: "May 23, 2024", priority: "High", icon : <ActiveUsersIcon/> },
  { id: 4, title: "Onboard Delta Systems", assignee: "Vikram Shah", date: "May 24, 2024", priority: "Low", icon : <ActiveUsersIcon/> },
  { id: 5, title: "Prepare Q2 Account Report", assignee: "Rahul Verma", date: "May 25, 2024", priority: "Medium", icon: <TenantsIcon /> },
];

// ── Donut chart (pure SVG) ────────────────────────────────────────────────────
interface DonutChartProps {
  data: Source[];
  total: number;
}

function DonutChart({ data = [], total = 0 }: DonutChartProps) {
  const cx = 110, cy = 110, r = 95, sw = 40;
    let angle = -90;

  const slices = data.map((d) => {
    const deg = (d.pct / 100) * 360;
    const start = angle;
    angle += deg;
    return { ...d, start, deg };
  });

  function arc(
    cxA: number, cyA: number, rA: number,
    startDeg: number, deg: number
  ): string {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = cxA + rA * Math.cos(toRad(startDeg));
    const y1 = cyA + rA * Math.sin(toRad(startDeg));
    const x2 = cxA + rA * Math.cos(toRad(startDeg + deg));
    const y2 = cyA + rA * Math.sin(toRad(startDeg + deg));
    const large = deg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${rA} ${rA} 0 ${large} 1 ${x2} ${y2}`;
  }

  return (
    <svg viewBox="0 0 220 220" width={180} height={180}>
      {slices.map((s, i) => (
        <path
          key={i}
          d={arc(cx, cy, r - sw / 2, s.start, s.deg - 1)}
          fill="none"
          stroke={s.color}
          strokeWidth={sw}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
}

// ── Sparkline area chart ──────────────────────────────────────────────────────
interface AreaChartProps {
  data: GrowthPoint[];
}

function AreaChart({ data = [] }: AreaChartProps) {
  const W = 580, H = 200;
  const pad = { t: 20, r: 20, b: 40, l: 64 };

  const xs = data.map((_, i) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r));
  const vals = data.map((d) => d.value);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const ys = vals.map((v) => pad.t + ((maxV - v) / (maxV - minV)) * (H - pad.t - pad.b));

  const coordStr = xs.map((x, i) => `${x},${ys[i]}`);
  const area = `M${xs[0]},${H - pad.b} L${coordStr.join(" L")} L${xs[xs.length - 1]},${H - pad.b} Z`;
  const line = `M${coordStr.join(" L")}`;

  const yLabels = [0, 20000, 40000, 60000, 80000, 100000].filter(
    (v) => v >= 0 && v <= maxV + 15000
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f6ef7" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#4f6ef7" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {yLabels.map((v) => {
        const y = pad.t + ((maxV - v) / (maxV - minV)) * (H - pad.t - pad.b);
        return (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
              {v === 0 ? "$0" : `$${v / 1000}0K`}
            </text>
          </g>
        );
      })}

      <path d={area} fill="url(#grad)" />
      <path d={line} fill="none" stroke="#4f6ef7" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />

      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={3.5} fill="#4f6ef7" stroke="#fff" strokeWidth={1.5} />
      ))}
      {data.map((d, i) => (
        <text key={i} x={xs[i]} y={H - pad.b + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">
          {d.date.split(" ")[1]}
        </text>
      ))}
      {data.map((d, i) => (
        <text key={`lbl-${i}`} x={xs[i]} y={H - pad.b + 28} textAnchor="middle" fontSize={10} fill="#94a3b8">
          {[0, 2, 4, 6].includes(i) ? d.date.split(" ")[0] : ""}
        </text>
      ))}
    </svg>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<string>("Dashboard");
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState<string>("");

  function toggleTask(id: number): void {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const filteredAccounts = ACCOUNTS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen font-['Inter','Segoe_UI',sans-serif]">
      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6">
  
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {STATS.map((stat) => (
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
  
          {/* ── Charts row ── */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
  
            {/* Account Growth */}
            <div className="rounded-[14px] border border-[#e2e8f0] bg-white px-5 pt-5 pb-3">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[#0f172a]">
                  Account Growth
                </h2>
  
                <select className="cursor-pointer rounded-[5px] border border-[#E0E0E0] px-[5px] py-[5px] text-[12px] text-[#7E7E7E] outline-none">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
  
              <AreaChart data={GROWTH_DATA} />
            </div>
  
            {/* Accounts by Source */}
            <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[#0f172a]">
                  Accounts by Source
                </h2>
  
                <select className="cursor-pointer rounded-[5px] border border-[#E0E0E0] px-[5px] py-[5px] text-[12px] text-[#7E7E7E] outline-none">
                <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
  
              <div className="flex items-center gap-4">
                <DonutChart data={SOURCES} total={24} />
  
                <div className="flex flex-1 flex-col gap-2">
                  {SOURCES.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-[6px]"
                    >
                      <span
                        className="h-[6px] w-[6px] flex-shrink-0 rounded-[5px]"
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
          </div>
  
          {/* ── Bottom row ── */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
  
            {/* Recent Accounts */}
            <div className="min-w-0 rounded-[14px] border border-[#e2e8f0] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-[#0f172a]">
                  Recent Accounts
                </h2>
  
                <button className="cursor-pointer rounded-[5px] border border-[#E0E0E0] bg-transparent px-2 py-[2px] text-[11px] text-[#64748b]">
                  View All
                </button>
              </div>
  
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    {(
                      [
                        "Account Name",
                        "Industry",
                        "Owner",
                        "Created At",
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
                    <tr
                      key={a.id}
                      className="border-b border-[#f8fafc]"
                    >
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
  
                      <td className="px-[6px] py-[7px] text-[11px] text-[#64748b]">
                        {a.industry}
                      </td>
  
                      <td className="px-[6px] py-[7px] text-[11px] text-[#374151]">
                        {a.owner}
                      </td>
  
                      <td className="px-[6px] py-[7px] text-[11px] text-[#374151]">
                        {a.created}
                      </td>
  
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
  
                      <td className="cursor-pointer px-[6px] py-[7px] text-[14px] text-[#94a3b8]">
                        ⋮
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            {/* Upcoming Tasks */}
            <div className="min-w-0 rounded-[14px] border border-[#e2e8f0] bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-[#0f172a]">
                  Upcoming Tasks
                </h2>
  
                <button className="cursor-pointer rounded-[5px] border border-[#E0E0E0] bg-transparent px-2 py-[2px] text-[11px] text-[#64748b]">
                  View all
                </button>
              </div>
  
              <div className="flex flex-col">
                {TASKS.map((t) => (
                  <div
                    key={t.id}
                    className="mb-[6px] flex items-center gap-3 px-3 py-[10px]"
                  >
                    {/* Checkbox */}
                    <Checkbox
                      id={`task-${t.id}`}
                      checked={checkedTasks[t.id] || false}
                      onCheckedChange={() => toggleTask(t.id)}
                      className="h-3.5 w-3.5 flex-shrink-0 border-[#dcdcf0] hover:border-[#5b5bd6]"
                    />
  
                    {/* Icon */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] text-[14px]">
                      {t.icon}
                    </div>
  
                    {/* Task Info */}
                    <div className="min-w-0 flex-1">
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-[#0f172a]">
                        {t.title}
                      </p>
  
                      <p className="mt-[2px] text-[10px] text-[#94a3b8]">
                        {t.assignee}
                      </p>
                    </div>
  
                    {/* Date */}
                    <div className="w-[95px] flex-shrink-0 text-left text-[11px] text-[#94a3b8]">
                      {t.date}
                    </div>
  
                    {/* Priority */}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}