# Database migrations

Schema changes are committed under `drizzle/` and applied with `pnpm db:migrate`.
The command runs the Category lifecycle data audit before Drizzle applies any
pending migration. `db:push` is reserved for local schema exploration and must
not be used for shared environments.

## Environments

Dev, preview, and production remain databases in the existing Neon project. CI
creates a short-lived child branch of `main`, applies every tracked migration,
runs the behavioral suite, and deletes that branch even when verification fails.

Vercel runs `pnpm db:migrate:deploy` before its Next.js build. The command is
limited to Vercel Preview and Production environments, uses the environment's
own `DATABASE_URL`, runs the preflight audit, and then applies pending tracked
migrations. A failed audit or migration fails the deployment, so Vercel keeps
the previous deployment active. Because a migration can succeed before a later
application build fails, every deployment migration must remain compatible with
the currently deployed application.

Preview builds use the Preview Neon database. When a pull request is merged,
the Production build applies the same tracked migrations to the Production Neon
database before building the new application version. Keep the three Vercel
environment variables scoped to their matching Neon databases.

## Rollout and rollback

Use expand-and-contract changes when a deployed version still reads an old
column. Migration `0001_category_lifecycle_expand` therefore retains and
dual-writes `category.slug` and `restaurant.userId` while the slug registry and
Category-derived ownership become authoritative. Remove those compatibility
columns in a later tracked contract migration after the expanded application is
deployed everywhere.

Before a dev migration, create a temporary Neon branch. If verification fails,
delete that branch and keep dev unchanged. Once a migration has reached a shared
environment, never edit its SQL or roll the migration journal backward. Restore
behavior with a new compensating migration; use Neon's point-in-time restore only
for exceptional data recovery.
