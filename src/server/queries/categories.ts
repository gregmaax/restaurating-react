import { and, desc, eq } from "drizzle-orm";
import { currentUser } from "~/lib/auth";
import { db } from "../db";
import { categories, categorySlugs } from "../db/schema";

export const getSpecificUserCategories = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  const rows = await db
    .select({ category: categories, canonicalSlug: categorySlugs.slug })
    .from(categories)
    .innerJoin(
      categorySlugs,
      and(
        eq(categorySlugs.categoryId, categories.id),
        eq(categorySlugs.isCanonical, true),
      ),
    )
    .where(eq(categories.userId, user.id))
    .orderBy(desc(categories.createdAt));

  return rows.map(({ category, canonicalSlug }) => ({
    ...category,
    slug: canonicalSlug,
  }));
};
