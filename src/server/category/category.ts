import { randomUUID } from "node:crypto";
import { and, count, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type * as schemaType from "~/server/db/schema";
import type { Category } from "~/server/db/schema";
import { categories, categorySlugs, restaurants } from "~/server/db/schema";

type CategoryDatabase = NeonHttpDatabase<typeof schemaType>;

export type CategoryView = Omit<Category, "slug"> & { slug: string };

type ValidationFailure = {
  ok: false;
  reason: "validation";
};

type CategoryNameFailure = {
  ok: false;
  reason: "name_conflict";
};

export type CreateCategoryResult =
  | { ok: true; category: CategoryView }
  | ValidationFailure
  | CategoryNameFailure;

export type ResolveCategoryResult =
  | {
      ok: true;
      resolution: "canonical" | "historical";
      category: CategoryView;
    }
  | { ok: false; reason: "not_found" };

type CategoryMutationFailure =
  | ValidationFailure
  | CategoryNameFailure
  | { ok: false; reason: "not_found" | "protected_category" };

export type RestaurantView = {
  id: string;
  name: string;
  city: string;
  description: string | null;
  rating: number | null;
  category: CategoryView;
};

type RestaurantFailure = ValidationFailure | { ok: false; reason: "not_found" };

const normalizeName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("fr");

const slugify = (name: string) =>
  normalizeName(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

const databaseConstraint = (error: unknown) => {
  if (typeof error !== "object" || error === null) return undefined;

  const candidate = error as {
    constraint?: unknown;
    cause?: { constraint?: unknown };
  };
  const constraint = candidate.constraint ?? candidate.cause?.constraint;
  return typeof constraint === "string" ? constraint : undefined;
};

const categoryView = (
  category: typeof categories.$inferSelect,
  canonicalSlug: string,
): CategoryView => ({
  ...category,
  slug: canonicalSlug,
});

export const createCategoryModule = (database: CategoryDatabase) => {
  const getOwnedCategory = async (userId: string, categoryId: string) => {
    const rows = await database
      .select({ category: categories, canonicalSlug: categorySlugs.slug })
      .from(categories)
      .innerJoin(
        categorySlugs,
        and(
          eq(categorySlugs.categoryId, categories.id),
          eq(categorySlugs.isCanonical, true),
        ),
      )
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
      .limit(1);
    return rows[0];
  };

  const validateRestaurant = (values: {
    name: string;
    city: string;
    description?: string | null;
    rating?: number | null;
  }) =>
    !values.name.trim() ||
    values.name.trim().length > 30 ||
    !values.city.trim() ||
    values.city.trim().length > 45 ||
    (values.description?.length ?? 0) > 256 ||
    (values.rating != null &&
      (!Number.isInteger(values.rating) ||
        values.rating < 1 ||
        values.rating > 5));

  return {
    async createCategory(input: {
      userId: string;
      values: { name: string; description?: string | null };
    }): Promise<CreateCategoryResult> {
      const name = input.values.name.trim().replace(/\s+/g, " ");
      const nameKey = normalizeName(name);
      const baseSlug = slugify(name);

      if (
        !input.userId ||
        !name ||
        name.length > 30 ||
        !baseSlug ||
        (input.values.description?.length ?? 0) > 256 ||
        nameKey === "sans categorie"
      ) {
        return { ok: false, reason: "validation" };
      }

      const categoryId = randomUUID();
      const occupiedSlug = await database
        .select({ id: categorySlugs.id })
        .from(categorySlugs)
        .where(
          and(
            eq(categorySlugs.userId, input.userId),
            eq(categorySlugs.slug, baseSlug),
          ),
        )
        .limit(1);
      const slug = occupiedSlug.length
        ? `${baseSlug.slice(0, 55)}-${categoryId.slice(0, 8)}`
        : baseSlug;

      const category = {
        id: categoryId,
        name,
        nameKey,
        slug,
        kind: "ORDINARY" as const,
        description: input.values.description?.trim() ?? null,
        userId: input.userId,
      };

      try {
        await database.batch([
          database.insert(categories).values(category),
          database.insert(categorySlugs).values({
            categoryId,
            userId: input.userId,
            slug,
            isCanonical: true,
          }),
        ]);
      } catch (error) {
        if (databaseConstraint(error) === "category_user_name_key_unique") {
          return { ok: false, reason: "name_conflict" };
        }
        throw error;
      }

      const persisted = await getOwnedCategory(input.userId, categoryId);
      if (!persisted)
        throw new Error(`Created Category ${categoryId} is missing`);
      return {
        ok: true,
        category: categoryView(persisted.category, persisted.canonicalSlug),
      };
    },

    async updateCategory(input: {
      userId: string;
      categoryId: string;
      values: { name: string; description?: string | null };
    }): Promise<
      { ok: true; category: CategoryView } | CategoryMutationFailure
    > {
      const owned = await getOwnedCategory(input.userId, input.categoryId);
      if (!owned) return { ok: false, reason: "not_found" };

      const name = input.values.name.trim().replace(/\s+/g, " ");
      const nameKey = normalizeName(name);
      const baseSlug = slugify(name);
      if (
        !name ||
        name.length > 30 ||
        !baseSlug ||
        (input.values.description?.length ?? 0) > 256 ||
        nameKey === "sans categorie"
      ) {
        return { ok: false, reason: "validation" };
      }
      if (
        owned.category.kind === "UNASSIGNED" &&
        name !== owned.category.name
      ) {
        return { ok: false, reason: "protected_category" };
      }

      let slug = owned.canonicalSlug;
      const nameChanged = nameKey !== owned.category.nameKey;
      if (nameChanged) {
        const occupied = await database
          .select({ categoryId: categorySlugs.categoryId })
          .from(categorySlugs)
          .where(
            and(
              eq(categorySlugs.userId, input.userId),
              eq(categorySlugs.slug, baseSlug),
            ),
          )
          .limit(1);
        slug =
          occupied[0] && occupied[0].categoryId !== input.categoryId
            ? `${baseSlug.slice(0, 55)}-${input.categoryId.slice(0, 8)}`
            : baseSlug;
      }

      try {
        if (slug === owned.canonicalSlug) {
          await database
            .update(categories)
            .set({
              name,
              nameKey,
              description: input.values.description?.trim() ?? null,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(categories.id, input.categoryId),
                eq(categories.userId, input.userId),
              ),
            );
        } else {
          const existingAlias = await database
            .select({
              id: categorySlugs.id,
              categoryId: categorySlugs.categoryId,
            })
            .from(categorySlugs)
            .where(
              and(
                eq(categorySlugs.userId, input.userId),
                eq(categorySlugs.slug, slug),
              ),
            )
            .limit(1);
          const categoryUpdate = database
            .update(categories)
            .set({
              name,
              nameKey,
              slug,
              description: input.values.description?.trim() ?? null,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(categories.id, input.categoryId),
                eq(categories.userId, input.userId),
              ),
            );
          const retireCanonical = database
            .update(categorySlugs)
            .set({ isCanonical: false })
            .where(
              and(
                eq(categorySlugs.categoryId, input.categoryId),
                eq(categorySlugs.isCanonical, true),
              ),
            );

          if (existingAlias[0]?.categoryId === input.categoryId) {
            await database.batch([
              retireCanonical,
              database
                .update(categorySlugs)
                .set({ isCanonical: true })
                .where(eq(categorySlugs.id, existingAlias[0].id)),
              categoryUpdate,
            ]);
          } else {
            await database.batch([
              retireCanonical,
              database.insert(categorySlugs).values({
                categoryId: input.categoryId,
                userId: input.userId,
                slug,
                isCanonical: true,
              }),
              categoryUpdate,
            ]);
          }
        }
      } catch (error) {
        if (databaseConstraint(error) === "category_user_name_key_unique") {
          return { ok: false, reason: "name_conflict" };
        }
        throw error;
      }

      return {
        ok: true,
        category: categoryView(
          {
            ...owned.category,
            name,
            nameKey,
            slug,
            description: input.values.description?.trim() ?? null,
            updatedAt: new Date(),
          },
          slug,
        ),
      };
    },

    async deleteCategory(input: {
      userId: string;
      categoryId: string;
    }): Promise<
      | {
          ok: true;
          movedRestaurantCount: number;
          unassignedCategory: CategoryView | null;
        }
      | { ok: false; reason: "not_found" | "protected_category" }
    > {
      const owned = await getOwnedCategory(input.userId, input.categoryId);
      if (!owned) return { ok: false, reason: "not_found" };
      if (owned.category.kind === "UNASSIGNED") {
        return { ok: false, reason: "protected_category" };
      }

      const restaurantCountRow = await database
        .select({ value: count() })
        .from(restaurants)
        .where(eq(restaurants.categoryId, input.categoryId));
      const movedRestaurantCount = Number(restaurantCountRow[0]?.value ?? 0);
      if (movedRestaurantCount === 0) {
        await database
          .delete(categories)
          .where(
            and(
              eq(categories.id, input.categoryId),
              eq(categories.userId, input.userId),
            ),
          );
        return { ok: true, movedRestaurantCount: 0, unassignedCategory: null };
      }

      let unassigned = await database
        .select({ category: categories, canonicalSlug: categorySlugs.slug })
        .from(categories)
        .innerJoin(
          categorySlugs,
          and(
            eq(categorySlugs.categoryId, categories.id),
            eq(categorySlugs.isCanonical, true),
          ),
        )
        .where(
          and(
            eq(categories.userId, input.userId),
            eq(categories.kind, "UNASSIGNED"),
          ),
        )
        .limit(1)
        .then((rows) => rows[0]);

      const moveRestaurants = (categoryId: string) =>
        database
          .update(restaurants)
          .set({ categoryId, userId: input.userId, updatedAt: new Date() })
          .where(eq(restaurants.categoryId, input.categoryId));
      const deleteSource = database
        .delete(categories)
        .where(
          and(
            eq(categories.id, input.categoryId),
            eq(categories.userId, input.userId),
          ),
        );

      if (!unassigned) {
        const id = randomUUID();
        const baseSlug = "sans-categorie";
        const occupied = await database
          .select({ id: categorySlugs.id })
          .from(categorySlugs)
          .where(
            and(
              eq(categorySlugs.userId, input.userId),
              eq(categorySlugs.slug, baseSlug),
            ),
          )
          .limit(1);
        const slug = occupied.length
          ? `${baseSlug}-${id.slice(0, 8)}`
          : baseSlug;
        const category = {
          id,
          name: "Sans catégorie",
          nameKey: "sans categorie",
          slug,
          kind: "UNASSIGNED" as const,
          description: null,
          userId: input.userId,
        };
        await database.batch([
          database.insert(categories).values(category),
          database.insert(categorySlugs).values({
            categoryId: id,
            userId: input.userId,
            slug,
            isCanonical: true,
          }),
          moveRestaurants(id),
          deleteSource,
        ]);
        unassigned = {
          category: { ...category, createdAt: new Date(), updatedAt: null },
          canonicalSlug: slug,
        };
      } else {
        await database.batch([
          moveRestaurants(unassigned.category.id),
          deleteSource,
        ]);
      }

      return {
        ok: true,
        movedRestaurantCount,
        unassignedCategory: categoryView(
          unassigned.category,
          unassigned.canonicalSlug,
        ),
      };
    },

    async createRestaurant(input: {
      userId: string;
      values: {
        categoryId: string;
        name: string;
        city: string;
        description?: string | null;
        rating?: number | null;
      };
    }): Promise<{ ok: true; restaurant: RestaurantView } | RestaurantFailure> {
      if (validateRestaurant(input.values)) {
        return { ok: false, reason: "validation" };
      }
      const category = await getOwnedCategory(
        input.userId,
        input.values.categoryId,
      );
      if (!category) return { ok: false, reason: "not_found" };

      const row = {
        id: randomUUID(),
        name: input.values.name.trim(),
        city: input.values.city.trim(),
        description: input.values.description?.trim() ?? null,
        rating: input.values.rating ?? null,
        categoryId: category.category.id,
        userId: input.userId,
      };
      await database.insert(restaurants).values(row);
      return {
        ok: true,
        restaurant: {
          id: row.id,
          name: row.name,
          city: row.city,
          description: row.description,
          rating: row.rating,
          category: categoryView(category.category, category.canonicalSlug),
        },
      };
    },

    async updateRestaurant(input: {
      userId: string;
      restaurantId: string;
      values: {
        categoryId?: string;
        name: string;
        city: string;
        description?: string | null;
        rating?: number | null;
      };
    }): Promise<{ ok: true; restaurant: RestaurantView } | RestaurantFailure> {
      if (validateRestaurant(input.values)) {
        return { ok: false, reason: "validation" };
      }
      const current = await database
        .select({ restaurant: restaurants })
        .from(restaurants)
        .innerJoin(categories, eq(categories.id, restaurants.categoryId))
        .where(
          and(
            eq(restaurants.id, input.restaurantId),
            eq(categories.userId, input.userId),
          ),
        )
        .limit(1)
        .then((rows) => rows[0]?.restaurant);
      if (!current) return { ok: false, reason: "not_found" };

      const target = await getOwnedCategory(
        input.userId,
        input.values.categoryId ?? current.categoryId,
      );
      if (!target) return { ok: false, reason: "not_found" };

      const values = {
        name: input.values.name.trim(),
        city: input.values.city.trim(),
        description: input.values.description?.trim() ?? null,
        rating: input.values.rating ?? null,
        categoryId: target.category.id,
        userId: input.userId,
        updatedAt: new Date(),
      };
      await database
        .update(restaurants)
        .set(values)
        .where(eq(restaurants.id, input.restaurantId));
      return {
        ok: true,
        restaurant: {
          id: input.restaurantId,
          name: values.name,
          city: values.city,
          description: values.description,
          rating: values.rating,
          category: categoryView(target.category, target.canonicalSlug),
        },
      };
    },

    async deleteRestaurant(input: {
      userId: string;
      restaurantId: string;
    }): Promise<
      { ok: true; category: CategoryView } | { ok: false; reason: "not_found" }
    > {
      const owned = await database
        .select({
          category: categories,
          canonicalSlug: categorySlugs.slug,
        })
        .from(restaurants)
        .innerJoin(categories, eq(categories.id, restaurants.categoryId))
        .innerJoin(
          categorySlugs,
          and(
            eq(categorySlugs.categoryId, categories.id),
            eq(categorySlugs.isCanonical, true),
          ),
        )
        .where(
          and(
            eq(restaurants.id, input.restaurantId),
            eq(categories.userId, input.userId),
          ),
        )
        .limit(1)
        .then((rows) => rows[0]);
      if (!owned) return { ok: false, reason: "not_found" };

      await database
        .delete(restaurants)
        .where(eq(restaurants.id, input.restaurantId));
      return {
        ok: true,
        category: categoryView(owned.category, owned.canonicalSlug),
      };
    },

    async resolveCategory(input: {
      userId: string;
      slug: string;
    }): Promise<ResolveCategoryResult> {
      const rows = await database
        .select({
          category: categories,
          requestedIsCanonical: categorySlugs.isCanonical,
        })
        .from(categorySlugs)
        .innerJoin(categories, eq(categories.id, categorySlugs.categoryId))
        .where(
          and(
            eq(categorySlugs.userId, input.userId),
            eq(categorySlugs.slug, input.slug),
          ),
        )
        .limit(1);

      const row = rows[0];
      if (!row) return { ok: false, reason: "not_found" };

      const canonical = row.requestedIsCanonical
        ? input.slug
        : await database
            .select({ slug: categorySlugs.slug })
            .from(categorySlugs)
            .where(
              and(
                eq(categorySlugs.categoryId, row.category.id),
                eq(categorySlugs.isCanonical, true),
              ),
            )
            .limit(1)
            .then((result) => result[0]?.slug);

      if (!canonical) {
        throw new Error(`Category ${row.category.id} has no canonical slug`);
      }

      return {
        ok: true,
        resolution: row.requestedIsCanonical ? "canonical" : "historical",
        category: categoryView(row.category, canonical),
      };
    },
  };
};
