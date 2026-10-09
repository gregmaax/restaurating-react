import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { createCategoryModule } from "~/server/category/category";
import { db } from "~/server/db";
import { getSpecificUserCategories } from "./categories";
import { getAllUserRestaurants } from "./restaurants";

const currentUser = vi.hoisted(() => ({ id: "" }));
vi.mock("~/lib/auth", () => ({ currentUser: async () => currentUser }));
vi.mock("~/server/db", async () => {
  const databaseUrl = process.env.TEST_DATABASE_URL;
  if (!databaseUrl)
    throw new Error("TEST_DATABASE_URL is required for collection query tests");
  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  const schema = await import("~/server/db/schema");
  return { db: drizzle(neon(databaseUrl), { schema }) };
});

const categoryModule = createCategoryModule(db);

describe("Authenticated collection queries", () => {
  it("lists canonical categories and restaurants belonging to the current user", async () => {
    const userId = randomUUID();
    const otherUserId = randomUUID();
    currentUser.id = userId;
    // Exercise the page lookup before writing any fixtures.
    expect(await getSpecificUserCategories()).toEqual([]);

    const owned = await categoryModule.createCategory({
      userId,
      values: { name: "À essayer" },
    });
    const other = await categoryModule.createCategory({
      userId: otherUserId,
      values: { name: "À essayer" },
    });
    if (!owned.ok || !other.ok)
      throw new Error("Expected fixture categories to be created");
    const restaurant = await categoryModule.createRestaurant({
      userId,
      values: {
        name: "Mon bistrot",
        city: "Paris",
        categoryId: owned.category.id,
      },
    });
    const otherRestaurant = await categoryModule.createRestaurant({
      userId: otherUserId,
      values: {
        name: "Autre bistrot",
        city: "Paris",
        categoryId: other.category.id,
      },
    });
    if (!restaurant.ok || !otherRestaurant.ok)
      throw new Error("Expected fixture restaurants to be created");
    const renamed = await categoryModule.updateCategory({
      userId,
      categoryId: owned.category.id,
      values: { name: "Bonnes tables" },
    });
    if (!renamed.ok) throw new Error("Expected category rename to succeed");

    expect(await getSpecificUserCategories()).toMatchObject([
      { id: owned.category.id, slug: renamed.category.slug },
    ]);
    expect((await getAllUserRestaurants()).map((item) => item.id)).toEqual([
      restaurant.restaurant.id,
    ]);
  });
});
