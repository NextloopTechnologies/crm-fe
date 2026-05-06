# Nextloop CRM — Frontend

> A modern CRM platform built for IT outsourcing and digital marketing companies.
> Built with React 18, Vite 5, TypeScript, Tailwind CSS, and shadcn/ui.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Clone & Setup](#clone--setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Adding shadcn/ui Components](#adding-shadcnui-components)
- [Dev Mode — No Backend](#dev-mode--no-backend)
- [Connecting to Backend](#connecting-to-backend)
- [Code Quality](#code-quality)
- [Build for Production](#build-for-production)

---

## Tech Stack

| Layer              | Library / Tool               | Version  |
|--------------------|------------------------------|----------|
| Framework          | React                        | ^18.x    |
| Build Tool         | Vite                         | ^5.x     |
| Language           | TypeScript                   | ^5.x     |
| Styling            | Tailwind CSS                 | ^3.x     |
| Component Library  | shadcn/ui (Radix + Lucide)   | latest   |
| Icons              | Lucide React                 | latest   |
| Global State       | Zustand                      | ^4.x     |
| Server State       | TanStack Query               | ^5.x     |
| Data Tables        | TanStack Table               | ^8.x     |
| Forms              | React Hook Form              | ^7.x     |
| Validation         | Zod                          | ^3.x     |
| Routing            | React Router                 | ^6.x     |
| Charts             | Recharts                     | ^2.x     |
| Date Utilities     | Day.js                       | ^1.x     |
| Toasts             | Sonner                       | latest   |
| HTTP Client        | Axios                        | ^1.x     |
| Linting            | ESLint                       | ^9.x     |
| Formatting         | Prettier                     | ^3.x     |
| Git Hooks          | Husky + lint-staged          | ^9.x     |

---

## Prerequisites

Make sure the following are installed on your machine before starting:

| Tool      | Version  | Download                          |
|-----------|----------|-----------------------------------|
| Node.js   | 18+      | https://nodejs.org                |
| npm       | 9+       | Comes with Node.js                |
| Git       | Latest   | https://git-scm.com               |

To verify your versions:

```bash
node --version    # should be v18.x or higher
npm --version     # should be 9.x or higher
git --version
```

---

## Clone & Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-org/crm-frontend.git
cd crm-frontend
```

### Step 2 — Install all dependencies

```bash
npm install
```

This installs all packages listed in `package.json` including React, Tailwind, shadcn/ui, Zustand, TanStack Query, and all dev tools.

### Step 3 — Set up environment variables

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in your values:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Nextloop CRM
```

### Step 4 — Initialise shadcn/ui (first time only)

```bash
npx shadcn@latest init
```

When prompted, select:
- **Component library** → Radix
- **Preset** → Nova - Lucide / Geist
- **Base color** → Slate
- **CSS variables** → yes

Then add the required components:

```bash
npx shadcn@latest add button input label dialog sheet badge dropdown-menu table card tooltip select textarea separator avatar
```

### Step 5 — Start the development server

```bash
npm run dev
```

The app will open at **http://localhost:3000**

---

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser.

| Variable            | Description                          | Example                              |
|---------------------|--------------------------------------|--------------------------------------|
| `VITE_API_BASE_URL` | Spring Boot backend base URL         | `http://localhost:8080/api/v1`       |
| `VITE_APP_NAME`     | Application name shown in the UI     | `Nextloop CRM`                       |

> Never commit `.env.local` to Git — it is already listed in `.gitignore`.

---

## Running the Project

```bash
# Development server (hot reload enabled)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Project Structure

```
crm-frontend/
├── public/                        Static assets (favicon, icons)
├── src/
│   ├── api/                       API call functions — one file per module
│   │   ├── auth.api.ts
│   │   ├── leads.api.ts
│   │   ├── clients.api.ts
│   │   ├── projects.api.ts
│   │   ├── tasks.api.ts
│   │   ├── pipeline.api.ts
│   │   ├── interactions.api.ts
│   │   └── notifications.api.ts
│   │
│   ├── components/
│   │   ├── ui/                    shadcn/ui components (auto-generated)
│   │   ├── layout/                AppShell, Sidebar, TopBar
│   │   └── common/                DataTable, StatusBadge, PageHeader,
│   │                              EmptyState, LoadingSpinner
│   │
│   ├── features/                  One folder per CRM module
│   │   ├── auth/                  LoginPage
│   │   ├── leads/                 useLeads hooks
│   │   ├── clients/               (ready to build)
│   │   ├── pipeline/              usePipeline hooks
│   │   ├── tasks/                 useTasks hooks
│   │   ├── projects/              (ready to build)
│   │   └── notifications/         useNotifications hooks
│   │
│   ├── hooks/                     Global reusable hooks
│   │   ├── useDebounce.ts
│   │   └── usePermission.ts       Role-based access helper
│   │
│   ├── lib/                       Core utilities
│   │   ├── axios.ts               Axios instance with JWT interceptor
│   │   ├── queryClient.ts         TanStack Query client config
│   │   └── utils.ts               cn(), formatDate(), formatCurrency()
│   │
│   ├── pages/                     One page component per route
│   │   ├── DashboardPage.tsx
│   │   ├── LeadsPage.tsx
│   │   ├── LeadDetailPage.tsx
│   │   ├── ClientsPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── TasksPage.tsx
│   │   ├── PipelinePage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── router/
│   │   ├── index.tsx              All routes — lazy loaded
│   │   └── ProtectedRoute.tsx     Auth guard for private routes
│   │
│   ├── stores/                    Zustand global state
│   │   ├── auth.store.ts          Current user, token, login/logout
│   │   └── ui.store.ts            Sidebar open/collapsed, theme
│   │
│   ├── types/
│   │   ├── api.types.ts           TypeScript interfaces for all API data
│   │   └── enums.ts               LeadStage, UserRole, TaskStatus, etc.
│   │
│   ├── index.css                  Tailwind base + shadcn/ui CSS variables
│   └── main.tsx                   App entry point
│
├── .env.example                   Environment variable template
├── .eslintrc.json                 ESLint config
├── .gitignore                     Files excluded from Git
├── .prettierrc                    Prettier formatting config
├── components.json                shadcn/ui config
├── index.html                     HTML entry point
├── package.json                   Dependencies and scripts
├── tailwind.config.js             Tailwind config with brand colors
├── tsconfig.json                  TypeScript config
└── vite.config.ts                 Vite config with path aliases and proxy
```

---

## Available Scripts

| Script              | Command                                    | Description                              |
|---------------------|--------------------------------------------|------------------------------------------|
| `dev`               | `vite`                                     | Start development server at port 3000    |
| `build`             | `tsc && vite build`                        | Type-check and build for production      |
| `preview`           | `vite preview`                             | Preview production build locally         |
| `lint`              | `eslint src --ext ts,tsx`                  | Run ESLint across all TypeScript files   |
| `lint:fix`          | `eslint src --ext ts,tsx --fix`            | Auto-fix all fixable ESLint issues       |
| `format`            | `prettier --write src/`                    | Format all source files with Prettier    |
| `type-check`        | `tsc --noEmit`                             | TypeScript type check without building   |

---

## Adding shadcn/ui Components

Add components one by one or in bulk as needed:

```bash
# Single component
npx shadcn@latest add button

# Multiple at once
npx shadcn@latest add button input dialog sheet badge table card

# Commonly used in this project
npx shadcn@latest add command popover calendar checkbox radio-group switch tabs progress
```

All components are added to `src/components/ui/` and are fully customisable.

---

## Dev Mode — No Backend

During development before the Spring Boot backend is ready, three small changes bypass authentication and disable API calls so all pages are viewable:

**1. `src/router/ProtectedRoute.tsx`** — auth check is commented out, all routes are accessible

**2. `src/main.tsx`** — a fake admin user is seeded into Zustand so the TopBar and sidebar render correctly

**3. `src/features/notifications/useNotifications.ts`** — `enabled: false` stops the notification polling from throwing errors

To navigate to any page directly in dev mode:

| Page               | URL                          |
|--------------------|------------------------------|
| Dashboard          | http://localhost:3000/dashboard |
| Leads List         | http://localhost:3000/leads     |
| Lead Detail        | http://localhost:3000/leads/1   |
| Clients            | http://localhost:3000/clients   |
| Projects           | http://localhost:3000/projects  |
| Tasks              | http://localhost:3000/tasks     |
| Pipeline           | http://localhost:3000/pipeline  |
| Reports            | http://localhost:3000/reports   |
| User Management    | http://localhost:3000/settings/users |
| Settings           | http://localhost:3000/settings  |

---

## Connecting to Backend

When the Spring Boot backend is ready at `http://localhost:8080`, revert the three dev-mode changes:

### 1. Restore ProtectedRoute

```tsx
// src/router/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
```

### 2. Remove fake user from main.tsx

Delete these lines from `src/main.tsx`:

```tsx
// Remove these lines
useAuthStore.getState().login(
  'dev-token',
  'dev-refresh-token',
  { id: 1, name: 'Dev User', email: 'dev@nextloop.com', role: 'ADMIN' }
)
```

### 3. Re-enable notifications polling

```ts
// src/features/notifications/useNotifications.ts
export const useNotifications = () =>
  useQuery({
    queryKey: [KEY],
    queryFn: notifApi.getNotifications,
    refetchInterval: 30000,
    // remove: enabled: false
  })
```

### 4. Confirm .env.local is pointing to your backend

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

The Vite dev server proxies all `/api` requests to the backend automatically via the config in `vite.config.ts`.

---

## Code Quality

### ESLint — check for errors

```bash
npm run lint
```

### Prettier — auto-format code

```bash
npm run format
```

### TypeScript — type check without building

```bash
npm run type-check
```

### Git Hooks (Husky)

On every `git commit`, Husky automatically runs:
- ESLint on staged `.ts` and `.tsx` files
- Prettier on staged files

To set up Husky after cloning (run once):

```bash
npx husky install
```

---

## Build for Production

```bash
# 1. Make sure .env.local has production values
VITE_API_BASE_URL=https://api.yourproductiondomain.com/api/v1

# 2. Build
npm run build

# 3. The output is in the dist/ folder — deploy this to your server or CDN
```

The build output in `dist/` can be served by:
- **Nginx** — point root to the `dist/` folder
- **Vercel** — connect the repo, it detects Vite automatically
- **Netlify** — set build command to `npm run build`, publish directory to `dist`

---

## Roles & Permissions

The app enforces role-based access using the `usePermission()` hook.

| Role          | Access Level                                      |
|---------------|---------------------------------------------------|
| `SUPER_ADMIN` | Full access including white-label admin panel     |
| `ADMIN`       | Full access to all modules and user management    |
| `MANAGER`     | View entire team's leads, clients, tasks          |
| `SALES_EXEC`  | Own leads, clients, and tasks only                |
| `VIEWER`      | Read-only access to all modules                   |

---

## Phase Roadmap

| Phase   | Status        | Description                                      |
|---------|---------------|--------------------------------------------------|
| Phase 1 | 🔨 In Progress | Core CRM — Leads, Clients, Pipeline, Tasks       |
| Phase 2 | 📋 Planned     | Billing, WhatsApp API, AI integration            |
| Phase 3 | 📋 Planned     | White-label multi-tenant product                 |

---

## Contributing

1. Create a feature branch — `git checkout -b feature/lead-detail-page`
2. Make your changes
3. Run lint and type check — `npm run lint && npm run type-check`
4. Commit — Husky will auto-lint before the commit goes through
5. Push and open a pull request

---

*Nextloop Technologies — CRM Platform — Phase 1*