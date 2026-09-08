// pages/dashboard/DashboardRouter.tsx

import {
  AdminDashboardPage,
  ManagerDashboardPage,
  SalesDashboardPage,
} from "./index";

// ── Role Map ──
const ROLE_MAP = {
  ADMIN: AdminDashboardPage,
  MANAGER: ManagerDashboardPage,
  SALES: SalesDashboardPage,
};

type Role = keyof typeof ROLE_MAP;

/**
 * Least-privileged dashboard. Used whenever the stored role is missing or
 * unrecognised — falling back to ADMIN would show the admin view to anyone
 * with an empty or corrupted localStorage.
 */
const FALLBACK_ROLE: Role = "SALES";

// ── Normalize backend roleName → UI role ──
// The backend's RoleName enum is ADMIN | MANAGER | SALES | SUPER_ADMIN and
// compares case-insensitively, so normalise before matching.
const getRole = (): Role => {
  const role = localStorage.getItem("roleName")?.trim().toUpperCase();

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "ADMIN";

    case "MANAGER":
      return "MANAGER";

    case "SALES":
      return "SALES";

    default:
      return FALLBACK_ROLE;
  }
};

export default function DashboardRouter() {
  const Dashboard = ROLE_MAP[getRole()];

  return <Dashboard />;
}
