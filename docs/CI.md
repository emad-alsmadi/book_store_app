# Continuous Integration

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

## Triggers
- Pull requests targeting `main` / `master`
- Pushes to `main` / `master`

## Jobs

| Job | Steps |
|-----|--------|
| **API** | `npm ci` → `npm run test --workspace=apps/api` |
| **Website** | lint → `tsc --noEmit` → `next build` |
| **Dashboard** | `packages/types` typecheck → lint → jest → `tsc && vite build` |

## Local equivalents

```bash
npm ci
npm run test --workspace=apps/api
npm run lint --workspace=apps/website -- .
npx --workspace=apps/website tsc --noEmit
npm run build --workspace=apps/website
npm run type-check --workspace=packages/types
npm run lint --workspace=apps/dashboard
npm run test --workspace=apps/dashboard
npm run build --workspace=apps/dashboard
```

## Notes
- Uses **npm workspaces** + root `package-lock.json` (`npm ci`).
- `NEXT_PUBLIC_API_URL` is set in CI for the website build only (placeholder).
- Branch naming recommended: `feature/*`, `fix/*`, `refactor/*`, `chore/*` — keep `main` releasable.
- Do not treat CI green alone as production-ready; see `docs/PRODUCTION_CHECKLIST.md` when written.
