# <Project name>

> <One-line pitch: what the product does and for whom.>

Full-stack TypeScript: Express + TypeORM + Passport + Socket.io / Vue 3 + Pinia + vue-i18n / Tailwind v4 + shadcn-vue. Postgres (SQLite fallback in dev), sessions in Redis (SQLite in dev). Single app on http://localhost:3000: Vite runs as Express middleware, there is no separate Vite dev server.

## Structure

```
server/src/     # Express API + WebSocket (see server/CLAUDE.md)
webapp/src/     # Vue 3 SPA (see webapp/CLAUDE.md)
docs/           # RGPD-CHECKLIST.md
public/uploads/ # Uploaded files (Multer)
```

## Module docs

| Module | File | Content |
|--------|------|---------|
| Backend | `server/CLAUDE.md` | Routes, entities, migrations, admin, WebSocket, GDPR invariant |
| Frontend | `webapp/CLAUDE.md` | Router guards, apiClient, stores, i18n, design system |

## Commands (from root)

```bash
npm run dev          # server + webapp, hot reload
npm run build        # tsc server + vite build -> dist/
npm start            # run the production build
npm test             # Jest (server only)
npm run lint         # ESLint + Prettier (also lint:webapp / lint:server)
npm run dockerize    # Postgres + Redis + app via Docker Compose
```

Windows: `npm start` and `migration:*` use POSIX `VAR=x cmd` syntax and fail under cmd.exe. Run them from Git Bash.

## Environment

`.env.example` is the source of truth. `SESSION_SECRET` is required in production (the server refuses to start without it). Without `POSTGRES_URL`, the app falls back to SQLite (`sqlite.db`).

## Conventions

- Vue: `<script setup lang="ts">`, Pinia stores in Composition API style
- HTTP from the front: always `apiClient` (returns `{ data, error }`, never throws)
- Backend: Zod schema + `validateBody`, handlers wrapped in `asyncHandler`, business errors via `throw new AppError(msg, status)`
- Icons: `lucide-vue-next`, no emoji in code, UI, commits or logs
- UI strings: new strings through i18n (`webapp/src/lib/lang/`)

## Verification

CI runs `lint` and `build` on push, so both must pass. Check with `npm run lint`, `npm run build` and `npx vue-tsc --noEmit -p webapp/tsconfig.json`. `npm test` only contains a placeholder test. The user tests changes manually in the browser: do not start the dev server, write e2e scripts or take screenshots unless asked.

## Maintaining CLAUDE.md files

Local CLAUDE.md files only load when a file in their folder is read, so this root file must stay short and point to them.

- Changing a module means updating its CLAUDE.md in the same change.
- A non-trivial new module (its own store + composables + several components, or logic with traps) gets its own `<folder>/CLAUDE.md` and a row in the table above.
- Template: `# Title` + `> one-line purpose`, `## Architecture` (tree: file -> role), `## API` (TS signatures only), `## Add a <X>` (numbered steps), `## Gotchas` (real traps + why).
- Never repeat what a parent CLAUDE.md already says. No copied code, no roadmap or bug checklists. Anything needed *before* entering a folder (e.g. "check existing components") goes in the parent file. Write in English.
