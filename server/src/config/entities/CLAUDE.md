# Entities

> TypeORM entities shared by SQLite (dev) and Postgres (prod): every column type must exist on both drivers.

## Architecture

```
index.ts          # entity registry (array passed to the DataSource)
User.ts           # account, role, Google link
Upload.ts         # uploaded file linked to a User
AdminAuditLog.ts  # append-only admin action log
```

## Column types

TypeORM rejects a type string the active driver does not list. SQLite and Postgres share few date or JSON types, so a type that works in dev can break in prod (or the reverse).

| Need | Use | Never |
|------|-----|-------|
| Creation / update / soft-delete date | `@CreateDateColumn()` / `@UpdateDateColumn()` / `@DeleteDateColumn()`, no `type` | `@Column({ type: "datetime" })` (Postgres has no `datetime`), `"timestamp"` / `"timestamptz"` (SQLite has neither) |
| Date set by the app | `@Column({ type: Date, nullable: true })` | any date type string |
| JSON | `"simple-json"` | `"json"`, `"jsonb"` |
| Enum | `"simple-enum"` | `"enum"` (Postgres only) |
| UUID | `@PrimaryGeneratedColumn("uuid")`; a plain uuid value as `varchar` (see `AdminAuditLog.targetUserId`) | `type: "uuid"` on a `@Column` |
| Other | `"varchar"`, `"text"`, `"integer"`, `"boolean"`, `"date"`, `"time"` | driver-specific types (`citext`, `inet`, arrays...) |

The date decorators and `type: Date` are portable because each driver maps them itself: `timestamp` on Postgres, `datetime` on SQLite.

Convention: a mutable entity has `createdAt` (`@CreateDateColumn`) and `updatedAt` (`@UpdateDateColumn`), as in `Upload.ts`. An append-only entity (`AdminAuditLog`) only needs `createdAt`. Never assign these fields in route code: TypeORM fills them on insert and update.

## Add a column

1. Pick the type from the table above.
2. Start the dev server: SQLite syncs the schema automatically.
3. Generate the Postgres migration (see `server/CLAUDE.md`) and read the generated SQL.
4. Personal data: apply the GDPR invariant from `server/CLAUDE.md`.

## Gotchas

- SQLite runs with `synchronize: true` and accepts things Postgres refuses, so a Postgres-only error shows up only at migration generation or in prod.
- `type: Date` must be explicit when the TS type is `Date | null`: reflect-metadata reports a union as `Object`, which no driver can map.
- `@CreateDateColumn` on an `updatedAt` field compiles and syncs but never changes after insert. Use `@UpdateDateColumn`.
