import { ReactNode } from "react";
import { ActiveUsersIcon, TenantsIcon, UpArrowIcon, UsersIcon } from "@/assets/icons/components";
import { ChartLine, ClipboardList, Phone } from "lucide-react";

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

export interface Account {
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

export interface Task {
  id: number;
  title: string;
  assignee: string;
  date: string;
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

export const SOURCES_DATA: Record<string, Source[]> = {
  this_month: [
    { label: "Website", pct: 32.5, color: "#4f6ef7" },
    { label: "Referral", pct: 24.1, color: "#22c55e" },
    { label: "Social Media", pct: 18.3, color: "#f59e0b" },
    { label: "Email Campaign", pct: 15.6, color: "#a855f7" },
    { label: "Others", pct: 9.5, color: "#94a3b8" },
  ],
  last_month: [
    { label: "Website", pct: 28.0, color: "#4f6ef7" },
    { label: "Referral", pct: 30.2, color: "#22c55e" },
    { label: "Social Media", pct: 14.8, color: "#f59e0b" },
    { label: "Email Campaign", pct: 18.0, color: "#a855f7" },
    { label: "Others", pct: 9.0, color: "#94a3b8" },
  ],
};

// ─────────────────────────────────────────────
// Accounts
// ─────────────────────────────────────────────
export const ACCOUNTS: Account[] = [
  { id: 1, initials: "N", color: "#4f6ef7", name: "Nextloop Solutions Pvt. Ltd.", industry: "Software & Tech", owner: "Arjun Singh", ownerAvatar: "AS", created: "May 20, 2024", status: "Active" },
  { id: 2, initials: "BF", color: "#22c55e", name: "Bright Future Pvt. Ltd.", industry: "Education", owner: "Priya Mehta", ownerAvatar: "PM", created: "May 18, 2024", status: "Active" },
  { id: 3, initials: "TN", color: "#f59e0b", name: "TechNova Solutions", industry: "IT Services", owner: "Rahul Verma", ownerAvatar: "RV", created: "May 17, 2024", status: "Active" },
  { id: 4, initials: "CT", color: "#a855f7", name: "Cloudify Technologies", industry: "Cloud Services", owner: "Neha Kapoor", ownerAvatar: "NK", created: "May 15, 2024", status: "Active" },
  { id: 5, initials: "D", color: "#ef4444", name: "Delta Systems", industry: "Manufacturing", owner: "Vikram Shah", ownerAvatar: "VS", created: "May 10, 2024", status: "Inactive" },
];

// ─────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────
export const TASKS: Task[] = [
  { id: 1, title: "Follow up with Nextloop Solutions", assignee: "Arjun Singh", date: "May 21, 2024", priority: "High", icon: <Phone className="w-3 h-3" /> },
  { id: 2, title: "Send proposal to Bright Future Pvt. Ltd.", assignee: "Priya Mehta", date: "May 22, 2024", priority: "Medium", icon: <ActiveUsersIcon /> },
  { id: 3, title: "Demo with Cloudify Technologies", assignee: "Neha Kapoor", date: "May 23, 2024", priority: "High", icon: <ActiveUsersIcon /> },
  { id: 4, title: "Onboard Delta Systems", assignee: "Vikram Shah", date: "May 24, 2024", priority: "Low", icon: <ActiveUsersIcon /> },
  { id: 5, title: "Prepare Q2 Account Report", assignee: "Rahul Verma", date: "May 25, 2024", priority: "Medium", icon: <TenantsIcon /> },
];

// ─────────────────────────────────────────────
// Role-wise STATS
// ─────────────────────────────────────────────
const upTrend = (text: string) => ({
  icon: <UpArrowIcon />,
  text,
  color: "text-[#22c55e]",
});

const revenueIcon = (
  <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center">
    <ChartLine className="w-6 h-6 text-[#FBBC05]" />
  </div>
);

export const ADMIN_STATS: StatItem[] = [
  { icon: <UsersIcon />, label: "Total Users", value: "2400", subtitle: "All Users in System", trend: upTrend("24%") },
  { icon: <ActiveUsersIcon />, label: "Active Accounts", value: "2344", subtitle: "vs last month", trend: upTrend("8.3%") },
  { icon: revenueIcon, label: "Total Revenue", value: "$24,334", subtitle: "vs last month", trend: upTrend("8.3%") },
  { icon: <TenantsIcon />, label: "Total Contacts", value: "248", subtitle: "vs last month", trend: upTrend("8.3%") },
];

export const MANAGER_STATS: StatItem[] = [
  { icon: <UsersIcon />, label: "Team Account", value: "2400", subtitle: "All Account in Team", trend: upTrend("24%") },
  { icon: <ActiveUsersIcon />, label: "Active Accounts", value: "2344", subtitle: "vs last month", trend: upTrend("8.3%") },
  { icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center"><ClipboardList className="w-6 h-6 text-[#FBBC05]" /></div>, label: "Team Tasks", value: "$24,334", subtitle: "vs last month", trend: upTrend("8.3%") },
  { icon: <TenantsIcon />, label: "Team Contacts", value: "248", subtitle: "vs last month", trend: upTrend("8.3%") },
];

export const SALES_STATS: StatItem[] = [
  { icon: <UsersIcon />, label: "My Accounts", value: "2400", subtitle: "All Account in System", trend: upTrend("24%") },
  { icon: <ActiveUsersIcon />, label: "Active Accounts", value: "2344", subtitle: "vs last month", trend: upTrend("8.3%") },
  { icon: <div className="w-[55px] h-[55px] rounded-[8px] bg-[#FBBC05]/10 flex items-center justify-center"><ClipboardList className="w-6 h-6 text-[#FBBC05]" /></div>, label: "My Task", value: "$24,334", subtitle: "vs last month", trend: upTrend("8.3%") },
  { icon: <TenantsIcon />, label: "My Contacts", value: "248", subtitle: "vs last month", trend: upTrend("8.3%") },
];