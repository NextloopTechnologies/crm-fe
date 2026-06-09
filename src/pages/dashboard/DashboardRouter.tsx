// pages/dashboard/DashboardRouter.tsx

import {
  AdminDashboardPage,
  ManagerDashboardPage,
  SalesDashboardPage,
} from "./index";

// ── Normalize backend roleName → UI role ──
const getRole = (): "admin" | "manager" | "sales" => {
  const role = localStorage.getItem("roleName"); 

  switch (role) {
    case "Super_admin":
    case "ADMIN":
    case "admin":
      return "admin";

    case "Manager":
    case "manager":
      return "manager";

    case "Sales":
    case "sales":
      return "sales";

    default:
      return "admin";
  }
};

// ── Role Map ──
const ROLE_MAP = {
  admin: AdminDashboardPage,
  manager: ManagerDashboardPage,
  sales: SalesDashboardPage,
};

type Role = keyof typeof ROLE_MAP;

export default function DashboardRouter() {
  const role = getRole(); 

  const Dashboard = ROLE_MAP[role as Role] ?? AdminDashboardPage;

  return <Dashboard />;
}