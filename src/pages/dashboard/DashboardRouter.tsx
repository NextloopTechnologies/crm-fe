// pages/dashboard/DashboardRouter.tsx

import {
  AdminDashboardPage,
  ManagerDashboardPage,
  SalesDashboardPage,
} from "./index";

// ── Normalize backend roleName → UI role ──
const getRole = (): "ADMIN" | "MANAGER" | "SALES" => {
  const role = localStorage.getItem("roleName"); 

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
    case "ADMIN":
      return "ADMIN";

    case "MANAGER":
    case "manager":
      return "MANAGER";

    case "SALES":
    case "sales":
      return "SALES";

    default:
      return "ADMIN";
  }
};

// ── Role Map ──
const ROLE_MAP = {
  ADMIN: AdminDashboardPage,
  MANAGER: ManagerDashboardPage,
  SALES: SalesDashboardPage,
};

type Role = keyof typeof ROLE_MAP;

export default function DashboardRouter() {
  const role = getRole(); 

  const Dashboard = ROLE_MAP[role as Role] ?? AdminDashboardPage;

  return <Dashboard />;
}