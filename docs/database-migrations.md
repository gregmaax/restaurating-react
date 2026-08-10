# Database migrations

Schema changes are committed under `drizzle/` and applied with `pnpm db:migrate`.
The command runs the Category lifecycle data audit before Drizzle applies any
pending migration. Application builds never mutate a database and must not use
`db:push`.

## Environments

Dev, preview, and production remain databases in the existing Neon project. CI
creates a short-lived child branch of `main`, applies every tracked migration,
runs the behavioral suite, and deletes that branch even when verification fails.

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
