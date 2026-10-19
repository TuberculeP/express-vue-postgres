# Frontend

> Vue 3 SPA served by Express (Vite middleware in dev, `dist/client` in prod). All API calls go to `/api` with the session cookie.

## Architecture

```
src/
  main.ts                 # createApp + router + i18n + pinia, imports assets/index.css
  App.vue                 # AppLayout + RouterView
  router.ts               # routes + authGuard / adminGuard
  layouts/AppLayout.vue   # header (profile, admin link, logout) when authenticated
  stores/authStore.ts     # user, isAuthenticated
  views/
    Main.vue              # /app
    ProfileView.vue       # /app/profile (GDPR: export, rename, delete account)
    auth/                 # LoginView, RegisterView
    admin/AdminUsers.vue  # /app/admin/users <-> /api/admin/users + audit log
  components/ui/          # shadcn-vue components (see Design system)
  lib/
    utils.ts              # cn()
    utils/apiClient.ts    # HTTP client
    utils/websocket.ts    # Socket.io client
    utils/types.ts        # shared front types (User...)
    lang/                 # i18n: index.ts, fr.json, en.json
  assets/index.css        # Tailwind + theme tokens
```

Alias `@` -> `webapp/src`.

## API

```typescript
// lib/utils/apiClient.ts - never throws
apiClient.get<T>(url, params?): Promise<{ data: T; error: null } | { data: null; error: string }>
apiClient.post|put|patch|delete<T>(url, data?, config?)  // FormData -> multipart automatically

// stores/authStore.ts - use storeToRefs()
user: Ref<User | undefined>
isAuthenticated: ComputedRef<boolean>

// lib/utils/websocket.ts
onSocketConnected(cb: (socket) => void)
onSocketEvent(event, cb): () => void   // returns unsubscribe
socket.emit(event, data)
```

i18n: locale `fr`, fallback `en`, Composition mode (`useI18n()` / `$t`). A missing key returns the key itself and logs a warning. The template views still hardcode French strings; new strings go through i18n.

## Add a page

1. Component in `views/` (subfolder per area).
2. Lazy route in `router.ts`: `component: () => import("./views/...")`, with a `name`.
3. Admin page: `meta: { requiresAdmin: true }`. Link in `AppLayout.vue` if needed.
4. Strings in `lib/lang/fr.json` and `en.json`.

## Design system

Tailwind v4 + shadcn-vue (style new-york, built on reka-ui). Theme tokens are HSL CSS variables in `assets/index.css` (`:root` + `@theme`), used through Tailwind classes (`bg-background`, `text-primary`...). Never hardcode colors.

Existing components (import from `@/components/ui/<name>`). Check this list before writing a component, and update it when adding one:

| Component | Exports |
|-----------|---------|
| `button` | `Button`, `buttonVariants`, `ButtonVariants` (class-variance-authority) |
| `card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` |
| `input` | `Input` |

- Add one: `npx shadcn-vue@latest add <name>` (configured by `components.json`). Do not rewrite generated files unless needed.
- Merge classes with `cn()` from `@/lib/utils`.
- Icons: `lucide-vue-next`.

## Gotchas

- `router.ts` (`getGuardedRoutes`): **any route whose path contains `"app"` gets `authGuard` automatically**. A public route must not contain "app" in its path. Guards call `/auth/check` and refresh `authStore.user` on every navigation.
- `apiClient` `error` is the Axios message ("Request failed with status code 400"), **not** the server's `message`. To show server validation errors, use axios directly or extend `apiClient`.
- `websocket.ts` connects at import time (websocket transport only).
