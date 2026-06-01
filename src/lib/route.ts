// lib/routes.ts
export const ROUTES = {
  // Auth
  LOGIN: "/login",
  SIGNUP: "/signUp",
  FORGOT_PASSWORD: "/forgot-password",

  // Core
  DASHBOARD: "/dashboard",

  // Leads
  LEADS: "/leads",
  LEADS_CREATE: "/leads/create",
  LEADS_EDIT: (id: string) => `/leads/${id}/edit`,

  // Users
  USERS: "/users",
  USERS_CREATE: "/users/create",
  USERS_EDIT: (id: string) => `/users/${id}/edit`,

  // Tenants
  TENANTS: "/tenants",
  TENANTS_CREATE: "/tenants/create",
  TENANTS_EDIT: (id: string) => `/tenants/${id}/edit`,

  // Accounts
  ACCOUNTS: "/accounts",
  ACCOUNTS_CREATE: "/accounts/create",
  ACCOUNTS_EDIT: (id: string) => `/accounts/${id}/edit`,

  // Tasks
  TASKS: "/tasks",
  TASKS_CREATE: "/tasks/create",
  TASKS_EDIT: (id: string) => `/tasks/${id}/edit`,

  // Reports
  REPORTS: "/reports",
  REPORTS_CREATE: "/reports/create",
  REPORTS_EDIT: (id: string) => `/reports/${id}/edit`,

  // Profile
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  DELETE_ACCOUNT_PAGE : "/profile/delete",
  ACCOUNT_INFORMATION_PAGE : "/profile/account-info",  
  // Projects
  PROJECT: "/projects",

  // Pieline
  PIPELINE: "/pipeline",

  // Settings
  SETTINGS: "/settings",
} as const