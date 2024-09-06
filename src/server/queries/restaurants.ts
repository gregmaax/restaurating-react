import { currentUser } from "~/lib/auth";
import { db } from "../db";

export const getAllRestaurantsByCategoryId = async (categoryId: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  //return only the restaurants that matches the loggedIn userId and the categoryId
  const restaurants = await db.query.restaurants.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.categoryId, categoryId), eq(model.userId, user.id!)),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });

  return restaurants;
};

export const getRestaurantById = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) throw new Error("Unauthorized");

  const restaurant = await db.query.restaurants.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!restaurant) throw new Error("Category not found");

  if (restaurant.userId !== user.id) throw new Error("Unauthorized");

  return restaurant;
};
