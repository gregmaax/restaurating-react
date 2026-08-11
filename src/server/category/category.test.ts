import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { describe, expect, it } from "vitest";
import * as schema from "~/server/db/schema";
import { createCategoryModule } from "./category";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL is required for Category module tests");
}

const testDb = drizzle(neon(testDatabaseUrl), { schema });
const categoryModule = createCategoryModule(testDb);

describe("Category module", () => {
  it("creates and resolves a Category through its canonical slug", async () => {
    const userId = `test-user-${randomUUID()}`;

    const created = await categoryModule.createCategory({
      userId,
      values: {
        name: "Cafés",
        description: "Adresses préférées",
      },
    });

    expect(created).toMatchObject({
      ok: true,
      category: {
        name: "Cafés",
        slug: "cafes",
      },
    });

    if (!created.ok) throw new Error("Expected Category creation to succeed");

    await expect(
      categoryModule.resolveCategory({ userId, slug: created.category.slug }),
    ).resolves.toMatchObject({
      ok: true,
      resolution: "canonical",
      category: created.category,
    });
  });

  it("keeps historical slugs and gives colliding slugs a stable id suffix", async () => {
    const userId = `test-user-${randomUUID()}`;
    const first = await categoryModule.createCategory({
      userId,
      values: { name: "Café!" },
    });
    const second = await categoryModule.createCategory({
      userId,
      values: { name: "Café?" },
    });
    if (!first.ok || !second.ok)
      throw new Error("Expected successful creation");

    expect(first.category.slug).toBe("cafe");
    expect(second.category.slug).toBe(`cafe-${second.category.id.slice(0, 8)}`);

    const renamed = await categoryModule.updateCategory({
      userId,
      categoryId: first.category.id,
      values: { name: "Bistro" },
    });
    expect(renamed).toMatchObject({
      ok: true,
      category: { slug: "bistro" },
    });
    await expect(
      categoryModule.resolveCategory({ userId, slug: "cafe" }),
    ).resolves.toMatchObject({
      ok: true,
      resolution: "historical",
      category: { id: first.category.id, slug: "bistro" },
    });
  });

  it("enforces normalized names per user while allowing them across users", async () => {
    const firstUser = `test-user-${randomUUID()}`;
    const secondUser = `test-user-${randomUUID()}`;

    expect(
      await categoryModule.createCategory({
        userId: firstUser,
        values: { name: "  Cafés   favoris " },
      }),
    ).toMatchObject({ ok: true });
    expect(
      await categoryModule.createCategory({
        userId: firstUser,
        values: { name: "cafes favoris" },
      }),
    ).toEqual({ ok: false, reason: "name_conflict" });
    expect(
      await categoryModule.createCategory({
        userId: secondUser,
        values: { name: "cafes favoris" },
      }),
    ).toMatchObject({ ok: true });
  });

  it("hides another user's identifiers as not found", async () => {
    const ownerId = `test-user-${randomUUID()}`;
    const strangerId = `test-user-${randomUUID()}`;
    const created = await categoryModule.createCategory({
      userId: ownerId,
      values: { name: "Privée" },
    });
    if (!created.ok) throw new Error("Expected successful creation");

    await expect(
      categoryModule.resolveCategory({
        userId: strangerId,
        slug: created.category.slug,
      }),
    ).resolves.toEqual({ ok: false, reason: "not_found" });
    await expect(
      categoryModule.updateCategory({
        userId: strangerId,
        categoryId: created.category.id,
        values: { name: "Volée" },
      }),
    ).resolves.toEqual({ ok: false, reason: "not_found" });
  });

  it("atomically moves restaurants to the protected Unassigned Category", async () => {
    const userId = `test-user-${randomUUID()}`;
    const source = await categoryModule.createCategory({
      userId,
      values: { name: "À essayer" },
    });
    if (!source.ok) throw new Error("Expected successful creation");
    const restaurant = await categoryModule.createRestaurant({
      userId,
      values: {
        categoryId: source.category.id,
        name: "Le Test",
        city: "Paris",
        description: null,
        rating: 4,
      },
    });
    if (!restaurant.ok) throw new Error("Expected successful creation");

    const deleted = await categoryModule.deleteCategory({
      userId,
      categoryId: source.category.id,
    });
    expect(deleted).toMatchObject({
      ok: true,
      movedRestaurantCount: 1,
      unassignedCategory: {
        name: "Sans catégorie",
        slug: "sans-categorie",
        kind: "UNASSIGNED",
      },
    });

    const moved = await categoryModule.updateRestaurant({
      userId,
      restaurantId: restaurant.restaurant.id,
      values: { name: "Le Test", city: "Lyon", rating: 4 },
    });
    expect(moved).toMatchObject({
      ok: true,
      restaurant: { category: { kind: "UNASSIGNED" } },
    });
    if (!deleted.ok || !deleted.unassignedCategory) {
      throw new Error("Expected an Unassigned Category");
    }
    await expect(
      categoryModule.updateCategory({
        userId,
        categoryId: deleted.unassignedCategory.id,
        values: { name: "Autre nom" },
      }),
    ).resolves.toEqual({ ok: false, reason: "protected_category" });
    await expect(
      categoryModule.deleteCategory({
        userId,
        categoryId: deleted.unassignedCategory.id,
      }),
    ).resolves.toEqual({ ok: false, reason: "protected_category" });

    const secondSource = await categoryModule.createCategory({
      userId,
      values: { name: "Deuxième source" },
    });
    if (!secondSource.ok) throw new Error("Expected successful creation");
    const secondRestaurant = await categoryModule.createRestaurant({
      userId,
      values: {
        categoryId: secondSource.category.id,
        name: "Deuxième test",
        city: "Paris",
      },
    });
    if (!secondRestaurant.ok) throw new Error("Expected successful creation");
    await expect(
      categoryModule.deleteCategory({
        userId,
        categoryId: secondSource.category.id,
      }),
    ).resolves.toMatchObject({
      ok: true,
      unassignedCategory: { id: deleted.unassignedCategory.id },
    });
  });

  it("allows duplicate restaurant names and moves only within the owner scope", async () => {
    const userId = `test-user-${randomUUID()}`;
    const otherUserId = `test-user-${randomUUID()}`;
    const source = await categoryModule.createCategory({
      userId,
      values: { name: "Source" },
    });
    const target = await categoryModule.createCategory({
      userId,
      values: { name: "Target" },
    });
    const foreign = await categoryModule.createCategory({
      userId: otherUserId,
      values: { name: "Foreign" },
    });
    if (!source.ok || !target.ok || !foreign.ok) {
      throw new Error("Expected successful creation");
    }

    const first = await categoryModule.createRestaurant({
      userId,
      values: {
        categoryId: source.category.id,
        name: "Même nom",
        city: "Lille",
      },
    });
    const second = await categoryModule.createRestaurant({
      userId,
      values: {
        categoryId: source.category.id,
        name: "Même nom",
        city: "Lille",
      },
    });
    expect(first).toMatchObject({ ok: true });
    expect(second).toMatchObject({ ok: true });
    if (!first.ok) throw new Error("Expected successful creation");

    await expect(
      categoryModule.updateRestaurant({
        userId,
        restaurantId: first.restaurant.id,
        values: {
          categoryId: foreign.category.id,
          name: "Même nom",
          city: "Lille",
        },
      }),
    ).resolves.toEqual({ ok: false, reason: "not_found" });
    await expect(
      categoryModule.updateRestaurant({
        userId,
        restaurantId: first.restaurant.id,
        values: {
          categoryId: target.category.id,
          name: "Même nom",
          city: "Lille",
        },
      }),
    ).resolves.toMatchObject({
      ok: true,
      restaurant: { category: { id: target.category.id } },
    });

    await expect(
      categoryModule.deleteRestaurant({
        userId: otherUserId,
        restaurantId: first.restaurant.id,
      }),
    ).resolves.toEqual({ ok: false, reason: "not_found" });
    await expect(
      categoryModule.deleteRestaurant({
        userId,
        restaurantId: first.restaurant.id,
      }),
    ).resolves.toMatchObject({
      ok: true,
      category: { id: target.category.id, slug: target.category.slug },
    });
  });
});
