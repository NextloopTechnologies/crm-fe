/// <reference types="vite/client" />

/**
 * Central access point for build-time environment configuration.
 *
 * Keep this in sync with `.env.example` — reading `import.meta.env` directly
 * from feature code is how the names drifted apart in the first place.
 */

/**
 * Base URL for the CRM backend.
 *
 * Falls back to the relative `/api`, which the Vite dev server proxies to the
 * backend (see `server.proxy` in `vite.config.ts`). The fallback is what makes
 * `npm run dev` work with no `.env` present at all.
 *
 * Note: the backend mounts every controller at `/api/...` — there is no `/v1`
 * segment. See the `@RequestMapping` values in crm-be (e.g. `/api/auth`,
 * `/api/account`, `/api/lead`).
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || '/api'

/**
 * Avatar service endpoint. Consumers append `&seed=<value>`, so the URL is
 * expected to already carry a query string.
 */
export const AVATAR_URL: string =
  import.meta.env.VITE_AVATAR_URL ||
  'https://api.dicebear.com/9.x/initials/svg?radius=50'
