"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "~/auth";
import { RestaurantSchema } from "~/schemas";
import { db } from "~/server/db";
import { restaurants } from "~/server/db/schema";
import { deleteRestaurantById } from "~/server/queries/restaurants";

export const createRestaurant = async (
  values: z.infer<typeof RestaurantSchema>,
) => {
  //check if there is a loggedin user
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  console.log("USER CHECK");

  //action
  const validatedFields = RestaurantSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Erreur ! Champs invalides" };
  }

  await db.insert(restaurants).values({
    city: values.city,
    name: values.name,
    description: values.description,
    rating: values.rating == undefined ? null : values.rating,
    categoryId: values.categoryId,
    userId: session.user.id!,
  });

  console.log("DONE");

  revalidatePath(`/categories/${values.categoryId}`);

  return { success: "Votre restaurant a bien été ajouté !" };
};

export const updateRestaurant = async (
  values: z.infer<typeof RestaurantSchema>,
) => {
  //check if there is a loggedin user
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  //action
  const validatedFields = RestaurantSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Erreur ! Champs invalides" };
  }

  await db
    .update(restaurants)
    .set({
      name: values.name,
      description: values.description,
      city: values.city,
      rating: values.rating,
      updatedAt: new Date(),
    })
    .where(eq(restaurants.id, values.id!));

  revalidatePath(`/categories/${values.categoryId}`);

  return { success: "Votre restaurant a bien été modifié !" };
};

export const deleteRestaurant = async (
  restaurantId: string,
  categoryId: string,
) => {
  //check if there is a loggedin user
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  await deleteRestaurantById(restaurantId);

  revalidatePath(`/categories/${categoryId}`);

  return { success: "Votre restaurant a été supprimé !" };
};
