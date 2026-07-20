import { ReactNode } from "react";
import { ActiveUsersIcon, TenantsIcon, UpArrowIcon, UsersIcon } from "@/assets/icons/components";
import { ChartLine, ClipboardList, List, Phone } from "lucide-react";
import { getAllAccounts } from "@/api/account.api";
import { getAllTasks } from "@/api/tasks.api";
import { getAllLeads } from "@/api/leads.api";
import { ACCOUNT_COLORS, SOURCE_COLORS } from "@/constants/colors";
import { CreateAccountRequest, CreateLeadRequest, Lead } from "@/types/api.types";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface StatItem {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle: string;
  trend: {
    icon: ReactNode;
    text: string;
    color: string;
  };
}

export interface Task {
  id: number;
  subject: string;
  taskOwner: string;
  createdAt: string;
  priority: "High" | "Medium" | "Low";
  icon: ReactNode;
}

export interface Source {
  label: string;
  pct: number;
  color: string;
}

// ─────────────────────────────────────────────
// Chart Data
// ─────────────────────────────────────────────
export const PERIOD_DATA = {
  this_month: {
    labels: ["01", "06", "11", "16", "21", "26", "31"],
    values: [22000, 35000, 42000, 55000, 71000, 68000, 85000],
  },
  last_month: {
    labels: ["01", "06", "11", "16", "21", "26", "30"],
    values: [18000, 24000, 31000, 38000, 45000, 52000, 60000],
  },
  this_quarter: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    values: [30000, 42000, 55000, 61000, 74000, 80000, 95000],
  },
};

export function buildSourceData(leads: CreateLeadRequest[], period: string): Source[] {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = `${lm.getFullYear()}-${String(lm.getMonth() + 1).padStart(2, "0")}`;

  const filtered = leads.filter((l) => {
    const ym = l.creationDate?.slice(0, 7);
    if (period === "this_month") return ym === thisMonth;
    if (period === "last_month") return ym === lastMonth;
    return true;
  });

  const counts: Record<string, number> = {};
  filtered.forEach((l) => {
    const src = !l.leadSource || l.leadSource === "NA" ? "NA" : l.leadSource;
    counts[src] = (counts[src] || 0) + 1;
  });

  const total = filtered.length || 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      pct:   Math.round((count / total) * 100),
      color: SOURCE_COLORS[label] ?? "#94a3b8",
    }));
}

// ─────────────────────────────────────────────
// Role-wise STATS
// ─────────────────────────────────────────────
const upTrendLive = (text: string) => ({
  icon: <UpArrowIcon />,
  text,
  color: "text-[#22c55e]",
});

const RevenueIcon = () => (
  <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center">
    <ChartLine className="w-6 h-6 text-[#FBBC05]" />
  </div>
);
const TaskIcon = () => (
  <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center">
    <ClipboardList className="w-6 h-6 text-[#FBBC05]" />
  </div>
);

export function mapApiAccount(a: CreateAccountRequest, idx: number): CreateAccountRequest {
  const accountName = a.accountName ?? "—";

  const words = accountName.trim().split(" ");

  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : accountName.slice(0, 2).toUpperCase();

  return {

    accountNumber: a.accountNumber ?? "",

    accountName: a.accountName ?? "—",

    accountType: a.accountType ?? "—",

    accountOwner: a.accountOwner ?? "—",

    accountSite: a.accountSite
      ?? "—",
  };
}

// ─────────────────────────────────────────────
// Map raw API task → UI Task shape
// ─────────────────────────────────────────────
export function mapApiTask(t: any): Omit<Task, "icon"> & { icon: ReactNode } {
  return {
    id:       t.id,
    subject:    t.subject      ?? "Untitled Task",
    taskOwner: t.taskOwner   ?? "—",
    createdAt:     t.createdAt
      ? new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—",
    priority: t.priority   ?? "Low",
    icon:     <Phone className="w-3 h-3" />, 
  };
}

export function buildStats(
  role: "ADMIN" | "MANAGER" | "SALES",
  totalAccounts: number,
  activeAccounts: number,
  totalTasks: number,
  fmtRevenue : string
): StatItem[] {
  if (role === "ADMIN") return [
  { icon: <UsersIcon />, label: "Total Users", value: String(totalAccounts),  subtitle: "All Users in System", trend: upTrendLive() },
  { icon: <ActiveUsersIcon />, label: "Total Accounts", value: String(activeAccounts), subtitle:  "All Account in System", trend: upTrendLive() },
  { icon: <RevenueIcon/>, label: "Total Revenue", value: fmtRevenue,  subtitle: "total Revenue", trend: upTrendLive() },
  { icon: <TenantsIcon />, label: "Total Contacts", value: String(totalTasks), subtitle: "All Contact in System", trend: upTrendLive() },
];

  if (role === "MANAGER") return [
    { icon: <UsersIcon />, label: "Team Accounts", value: String(totalAccounts),  subtitle: "All accounts in team", trend: upTrendLive() },
    { icon: <ActiveUsersIcon />, label: "Total Accounts", value: String(activeAccounts), subtitle: "All Account in System", trend: upTrendLive() },
    { icon: <TaskIcon />,        label: "Team Tasks", value: String(totalTasks), subtitle: "All Tasks in ", trend: upTrendLive() },
    { icon: <TenantsIcon />, label: "Team Contacts", value: "—", subtitle: "All Teams Contacts", trend: upTrendLive() },
  ];

  return [
  { icon: <UsersIcon />, label: "My Accounts", value: String(totalAccounts),  subtitle: "All my accounts", trend: upTrendLive() },
  { icon: <ActiveUsersIcon />, label: "Total Accounts", value: String(activeAccounts), subtitle: "All Account in System", trend: upTrendLive() },
  { icon: <TaskIcon />, label: "My Tasks", value: String(totalTasks), subtitle: "Tasks in you y", trend: upTrendLive() },
  { icon: <TenantsIcon />, label: "My Contacts", value: "—", subtitle: "", trend: upTrendLive() },
  ];
}

// ─────────────────────────────────────────────
// Single fetch function — used by all 3 pages
// ─────────────────────────────────────────────
export async function fetchDashboardData(role: "ADMIN" | "MANAGER" | "SALES") {
  const [accRes, taskRes , leadRes] = await Promise.all([getAllAccounts(), getAllTasks() , getAllLeads()]);

  const rawAccounts = accRes?.data  ?? accRes  ?? [];
  const rawTasks    = taskRes?.data ?? taskRes ?? [];
  const rawLeads    = leadRes?.data ?? leadRes ?? [];

  const accounts = rawAccounts.map(mapApiAccount);
  const tasks    = rawTasks.map(mapApiTask);

  const totalAccounts  = accounts.length;
  const totalTasks     = tasks.length;

  const totalRevenue = rawLeads.reduce(
    (sum: number, lead: any) => sum + (parseFloat(lead.annualRevenue) || 0),
    0
  );

  const fmtRevenue = totalRevenue >= 1_000_000
    ? `${(totalRevenue / 1_000_000).toFixed(1)}M`
    : totalRevenue >= 1_000
    ? `${(totalRevenue / 1_000).toFixed(1)}K`
    : `${totalRevenue}`;

  const stats = buildStats(role, totalAccounts, accounts, totalTasks , fmtRevenue);

  return { accounts, tasks, stats , rawLeads};
}

export function buildGrowthData(leads: any[], period: string) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth(); // 0-indexed
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  if (period === "this_month") {
    const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
    // 7 evenly spaced labels
    const labelDays = [1, 5, 10, 15, 20, 25, daysInMonth];
    const buckets: Record<number, number> = {};
    labelDays.forEach((d) => (buckets[d] = 0));

    leads.forEach((l) => {
      const d = new Date(l.creationDate);
      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
        const day = d.getDate();
        // assign to nearest label bucket
        const nearest = labelDays.reduce((a, b) =>
          Math.abs(b - day) < Math.abs(a - day) ? b : a
        );
        buckets[nearest] += parseFloat(l.annualRevenue) || 0;
      }
    });

    return {
      labels: labelDays.map(String),
      values: labelDays.map((_, i) =>
        labelDays.slice(0, i + 1).reduce((sum, day) => sum + buckets[day], 0)
      ),
    };
  }

  if (period === "last_month") {
    const daysInMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();
    const labelDays = [1, 5, 10, 15, 20, 25, daysInMonth];
    const buckets: Record<number, number> = {};
    labelDays.forEach((d) => (buckets[d] = 0));

    leads.forEach((l) => {
      const d = new Date(l.creationDate);
      if (d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth) {
        const day = d.getDate();
        const nearest = labelDays.reduce((a, b) =>
          Math.abs(b - day) < Math.abs(a - day) ? b : a
        );
        buckets[nearest] += parseFloat(l.annualRevenue) || 0;
      }
    });

    return {
      labels: labelDays.map(String),
      values: labelDays.map((_, i) =>
        labelDays.slice(0, i + 1).reduce((sum, day) => sum + buckets[day], 0)
      ),
    };
  }

  if (period === "this_quarter") {
    // last 7 months
    const monthLabels = [];
    const monthBuckets: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(thisYear, thisMonth - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-US", { month: "short" });
      monthLabels.push({ label, key });
      monthBuckets[key] = 0;
    }

    leads.forEach((l) => {
      const key = l.creationDate?.slice(0, 7);
      if (key && monthBuckets[key] !== undefined) {
        monthBuckets[key] += parseFloat(l.annualRevenue) || 0;
      }
    });

    return {
      labels: monthLabels.map((m) => m.label),
      values: (() => {
        let running = 0;
        return monthLabels.map((m) => {
          running += monthBuckets[m.key];
          return running;
        });
      })(),
    };
  }

  return { labels: [], values: [] };
}
