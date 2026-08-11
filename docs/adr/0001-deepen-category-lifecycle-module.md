---
status: accepted
date: 2026-08-11
---

# Deepen the Category lifecycle module

Category is the lifecycle owner of Restaurant, so one deep Category module will own Category and Restaurant writes, Restaurant membership, the Unassigned Category, name normalization, and canonical and historical slugs. Thin Next.js adapters will resolve the authenticated User, translate structured outcomes, and perform cache, navigation, and redirect effects; this concentrates ownership and persistence invariants behind one interface while keeping framework behavior outside the seam.

## Considered options

- Separate Category and Restaurant write modules were rejected because ownership, moves, and Category deletion would leak across their seam.
- Stable-ID URLs were rejected because they are less readable; immutable slugs were rejected because renamed Categories could retain misleading URLs. Mutable slugs with direct-to-Category history preserve readable canonical URLs and redirect old links.
- Cascading Restaurant deletion and rejecting non-empty Category deletion were rejected in favor of atomically moving Restaurants into one protected, lazily created Unassigned Category per User.
- A local PostgreSQL or PGLite adapter and a production driver switch were rejected for now because dev, preview, and production already use Neon HTTP. With only one real database adapter, no hypothetical persistence seam will be introduced.

## Consequences

- Restaurant ownership derives from Category; the duplicate `Restaurant.userId` is removed, and a foreign key prevents orphaned Restaurants.
- Category names are unique per User through a module-derived normalized key that ignores casing, accents, and insignificant whitespace.
- One per-User slug registry owns canonical and historical slugs. Previous slugs remain reserved until Category deletion and redirect permanently to the current slug.
- Neon HTTP transactional batches provide atomic deletion, reassignment, and slug-renaming outcomes.
- Schema changes use tracked, expand-and-contract migrations with a preflight audit that stops on ambiguous existing data; production builds no longer run `db:push`.
- Behavioral tests cross the deep module's interface on ephemeral Neon branches. Only small adapter tests remain for authentication translation, localized messages, Next.js effects, and historical-slug redirects.
