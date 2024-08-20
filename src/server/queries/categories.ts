import { db } from "../db";

export const getSpecificUserCategories = async (userId: string) => {
  const categories = await db.query.categories.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return categories;
};

export const getAllCategories = async () => {
  const categories = await db.query.categories.findMany();

  return categories;
};
