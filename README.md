# Pinpoint

A collaborative bug evidence workspace. **Phase 1 only:** a runnable React shell and Express liveness endpoint. All displayed project records and identities are synthetic fixtures, not authenticated users or saved data. Pinpoint does not execute browser tests.

## Run locally

Use Node.js 24 LTS and npm 11 (the versions used to check this foundation).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5187. API: http://127.0.0.1:4000/api/health.
Stop both with Ctrl+C. No secrets, database, or storage account are needed.

```sh
npm run check
npm test
npm run build
```

To run the compiled API: `npm start -w @pinpoint/api`. To inspect the frontend build: `npm run preview -w @pinpoint/web`. Preview does not proxy API requests; the health indicator will show unavailable. `npm run dev` is the integrated local workflow. There is no deployment configuration in this phase.

The API defaults to port 4000 and accepts a `PORT` environment variable. If changed, also update the development proxy in `apps/web/vite.config.ts`. Both servers bind to the local computer. This project does not load `.env` files yet.

## Structure and choices

```text
apps/web/src/
  App.tsx                    Responsive shell and local section navigation
  components/ApiHealth.tsx   Real API loading/success/error/retry behavior
  components/Badge.tsx       Shared status and outcome labels
  features/overview/BugWorkspace.tsx  Local sample list/detail preview
  features/overview/demo.ts  Explicit synthetic display fixtures
  styles.css                 Tailwind integration and shell styles
apps/api/src/
  app.ts                     Express middleware and route composition
  server.ts                  Port configuration and process lifecycle
  features/health/           Health HTTP route
  app.test.ts                HTTP contract checks
docs/SPECIFICATION.md         Product, permissions, model and phase boundaries
```

npm workspaces let both applications share one installation and lockfile. This is a modular monolith: one API process, organized by feature as it grows. Splitting Express app creation from listening lets HTTP tests exercise the real middleware without starting the development server. Strict TypeScript catches shape mismatches before runtime; input validation will still be necessary at API boundaries.

Section navigation is local UI state, not URL routing or protected routing yet. Tailwind v4 is connected through its Vite plugin; custom CSS handles the shell's visual details. Database, JWT, object storage, and domain models are intentionally planned rather than half-connected dependencies.

Interview explanation: “Pinpoint separates a bug's lifecycle from evidence outcomes. Each reproduction and verification preserves its own environment snapshot. Verification references a particular fix, so closing a bug can be traced to specific recorded evidence.” This describes the planned domain; Phase 1 implements only the foundation.

## Manual verification

- Run `npm run dev`; open the frontend and confirm the API indicator becomes connected.
- Open `/api/health` on port 4000; expect `{"status":"ok","service":"pinpoint-api"}`.
- Navigate through sidebar sections. Bugs, matrix and activity display labeled samples; Members and Settings remain planned.
- Resize to a narrow phone width; use the menu toggle and check that cards stack without horizontal overflow.
- Navigate with Tab; check visible focus, skip link, menu button, navigation and refresh button.
- Stop the API, then press Refresh; expect unavailable. Restart it and refresh; expect connected.
- Refresh the page; all sample records remain fixtures and no actions persist.

## Phase 1 limits

Local sample search, status/severity filters, selection and a static environment matrix are visual previews only. No authentication, authorization, database, project CRUD, bug editing, server-side filters, uploads, matrix aggregation, verification, activity persistence or concurrency controls. No automatic test execution, real-time updates, GitHub integration or deployment. API health is liveness only; it does not assert dependency readiness. Summary counts are derived only from the synthetic fixtures, never real usage or product metrics.

Implementation references: [Vite](https://vite.dev/guide/), [Tailwind Vite setup](https://tailwindcss.com/docs/installation/using-vite), [Express 5](https://expressjs.com/guide/migrating-5/).
