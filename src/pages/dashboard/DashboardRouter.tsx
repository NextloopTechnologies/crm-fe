// pages/dashboard/DashboardRouter.tsx

import { AdminDashboardPage, ManagerDashboardPage, SalesDashboardPage } from "./index";

const ROLE_MAP = {
  admin:   AdminDashboardPage,
  manager: ManagerDashboardPage,
  sales:   SalesDashboardPage,
};

type Role = keyof typeof ROLE_MAP;

export default function DashboardRouter() {
  const role = (localStorage.getItem("dev_role") ?? "admin") as Role;
  const Dashboard = ROLE_MAP[role] ?? AdminDashboardPage;
  return <Dashboard />;
}