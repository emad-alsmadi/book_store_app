# TrendVaulta Monorepo Setup Guide

Setup and day-to-day workflow for the TrendVaulta retail e-commerce monorepo (beauty / fashion / lifestyle).

## Architecture overview

```
trendvaulta/
├── apps/
│   ├── website/        # Next.js storefront (port 3001)
│   ├── dashboard/      # Vite + React admin (port 3002)
│   └── api/            # Express.js API (port 3000)
├── packages/
│   ├── ui/             # Shared UI (@trendvaulta/ui)
│   ├── types/          # Shared TypeScript types (@trendvaulta/types)
│   └── api-client/     # Shared API client (@trendvaulta/api-client)
├── package.json        # npm workspaces + root scripts
└── pnpm-workspace.yaml # Optional leftover; prefer npm workspaces from root package.json
```

Catalog domain: **products and brands** (not digital templates).

## Prerequisites

- Node.js 18 or higher
- npm 9+ (primary package manager for this repo)
- MongoDB (local or Atlas)
- Stripe keys if you exercise checkout

## Installation

### 1. Install dependencies

From the repository root:

```bash
npm install
```

This installs dependencies for all workspace apps and packages.

### 2. Environment setup

Create `apps/api/.env` (API loads dotenv from its own process):

```env
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://localhost:27017/trendvaulta
DB_NAME=trendvaulta

JWT_SECRET_KEY=replace-me
JWT_EXPIRE=30d

FRONTEND_URL=http://localhost:3001
DASHBOARD_URL=http://localhost:3002
ALLOWED_ORIGINS=

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FROM_EMAIL=noreply@trendvaulta.com
FROM_NAME=TrendVaulta

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Optional storefront env (`apps/website/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Website rewrites `/api/*` to `NEXT_PUBLIC_API_URL` (default `http://localhost:3000`).  
Dashboard Vite proxies `/api` → `http://localhost:3000` (see `apps/dashboard/vite.config.ts`).

## Development

### Start all services

```bash
npm run dev
```

Starts:

- API — http://localhost:3000
- Website — http://localhost:3001
- Dashboard — http://localhost:3002

### Start individual services

```bash
npm run dev:api
npm run dev:website
npm run dev:dashboard
```

Or from an app folder:

```bash
cd apps/api && npm run dev
```

## Building

```bash
npm run build
```

Individual:

```bash
npm run build:website
npm run build:dashboard
```

API has no compile step (`npm start` / `npm run dev` run Node directly).

## Shared packages

### `@trendvaulta/types`

**Location:** `packages/types/`

```typescript
import type { /* shared types */ } from '@trendvaulta/types';
```

### `@trendvaulta/ui`

**Location:** `packages/ui/`

Used mainly by the dashboard (Vite aliases). Prefer existing components before adding new shared UI.

### `@trendvaulta/api-client`

**Location:** `packages/api-client/`

Dashboard may use this package. The storefront primarily uses `apps/website/src/lib/api.ts`. Always verify paths against `apps/api/routes/` — do not assume package endpoints are complete.

## App roles

### Dashboard (`apps/dashboard`)

- Overview / stats
- Users, products, brands, orders
- Coupons, offers, reviews, settings
- Stack: React 19, Vite, React Router, TanStack Query, Tailwind, Recharts

### Website (`apps/website`)

- Product browsing, brands, cart, checkout (Stripe)
- Auth, wishlist, reviews, order history
- Homepage storefront rails (offers, recommendations, lookbooks, etc.)
- Stack: Next.js 16 App Router, React 19, TanStack Query, Zustand, Tailwind

### API (`apps/api`)

- REST under `/api/`
- JWT auth (`verfiyToken`), Joi validation, Mongoose
- Stripe Checkout + webhook
- Nodemailer (password reset; order confirmation when wired)
- Default port `3000` (`PORT` env override)

## Useful scripts (root)

| Script | Purpose |
|---|---|
| `npm run dev` | All three apps |
| `npm run test:api` | API tests |
| `npm run typecheck:website` | Website typecheck |
| `npm run lint` | Lint workspaces |

## Deployment notes

- **API**: Node host (e.g. Render). See `apps/api/render.yaml`. Use MongoDB Atlas in production. Point Stripe webhooks to `POST /api/webhooks/stripe`.
- **Website**: Vercel (or similar) with `NEXT_PUBLIC_API_URL` pointing at the deployed API.
- **Dashboard**: Build with `npm run build:dashboard` and host `apps/dashboard/dist`; configure API base URL / proxy as needed.
- Set production `FRONTEND_URL`, `DASHBOARD_URL`, and CORS allowlists.

Liveness check currently available on the API: `GET /api/trendvaulta`.  
Readiness (`GET /api/ready`) is defined in `apps/api/routes/health.js` — ensure that router is mounted in `app.js` before relying on it in production.

## Troubleshooting

### Dependencies not found

```bash
# PowerShell
Remove-Item -Recurse -Force node_modules, apps\*\node_modules, packages\*\node_modules -ErrorAction SilentlyContinue
npm install
```

### Port already in use

- API: `PORT` in `apps/api/.env`
- Website: `-p` in `apps/website/package.json` `dev` script
- Dashboard: `server.port` in `apps/dashboard/vite.config.ts`

### CORS blocked

Ensure `FRONTEND_URL` / `DASHBOARD_URL` / `ALLOWED_ORIGINS` match the browser origin. Local defaults include `http://localhost:3001` outside production.

## Best practices

1. Prefer small, app-local changes; share via `@trendvaulta/*` only when reuse is real.
2. Look up API contracts in `apps/api/routes/` + controllers — never guess.
3. Match the existing design system of the app you edit.
4. Suggest conventional commits; do not commit unless asked.
5. See `AGENTS.md` and `.cursor/rules/` for agent workflow constraints.

## Support

Open an issue in the repository with reproduction steps and which app (api / website / dashboard) is affected.
