# Nextloop CRM — Frontend

React + Vite + TypeScript frontend for the Nextloop CRM platform.

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| State (global) | Zustand 4 |
| State (server) | TanStack Query 5 |
| Tables | TanStack Table 8 |
| Forms | React Hook Form 7 + Zod 3 |
| Routing | React Router 6 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Toasts | Sonner |
| Dates | Day.js |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local
# Edit .env.local with your backend URL

# 3. Start development server
npm run dev
# Opens at http://localhost:3000
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Prettier |
| `npm run type-check` | TypeScript type check |

## Project Structure

```
src/
├── api/           API call functions (one file per module)
├── components/
│   ├── ui/        shadcn/ui components (add with npx shadcn-ui@latest add ...)
│   ├── layout/    AppShell, Sidebar, TopBar
│   └── common/    DataTable, StatusBadge, PageHeader, EmptyState
├── features/      One folder per CRM module
│   ├── auth/
│   ├── leads/
│   ├── clients/
│   ├── pipeline/
│   ├── tasks/
│   ├── projects/
│   └── notifications/
├── hooks/         Global custom hooks
├── lib/           axios, queryClient, utils
├── pages/         Page components (one per route)
├── router/        Route definitions + ProtectedRoute
├── stores/        Zustand stores (auth, ui)
└── types/         TypeScript interfaces and enums
```

## Adding shadcn/ui Components

```bash
# Run this once to initialise shadcn/ui
npx shadcn-ui@latest init

# Then add components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add card
```

## Backend Connection

The frontend proxies all `/api` requests to `http://localhost:8080` in development.
Make sure the Spring Boot backend is running before testing authenticated routes.

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Nextloop CRM
```
