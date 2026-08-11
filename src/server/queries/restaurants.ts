import { and, desc, eq } from "drizzle-orm";
import { currentUser } from "~/lib/auth";
import { db } from "../db";
import { categories, restaurants } from "../db/schema";

export const getAllRestaurantsByCategoryId = async (categoryId: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  return db
    .select({ restaurant: restaurants })
    .from(restaurants)
    .innerJoin(categories, eq(categories.id, restaurants.categoryId))
    .where(
      and(
        eq(restaurants.categoryId, categoryId),
        eq(categories.userId, user.id),
      ),
    )
    .orderBy(desc(restaurants.createdAt))
    .then((rows) => rows.map(({ restaurant }) => restaurant));
};
