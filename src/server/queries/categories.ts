import { currentUser } from "~/lib/auth";
import { db } from "../db";
import { categories } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const getAllCategories = async () => {
  const categories = await db.query.categories.findMany();

  return categories;
};

export const getSpecificUserCategories = async () => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  const categories = await db.query.categories.findMany({
    where: (model, { eq }) => eq(model.userId, user.id!),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });

  return categories;
};

export const getCategoryById = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  const category = await db.query.categories.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!category) throw new Error("Category not found");

  if (category.userId !== user.id) throw new Error("Unauthorized");

  return category;
};

export const deleteCategoryById = async (categoryId: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, user.id)));

  //redirect("/categories");
};
