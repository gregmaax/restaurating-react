"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "~/auth";
import { RestaurantSchema } from "~/schemas";
import { db } from "~/server/db";
import { restaurants } from "~/server/db/schema";

export const createRestaurant = async (
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

  await db.insert(restaurants).values({
    city: values.city,
    name: values.name,
    description: values.description,
    categoryId: values.categoryId,
    userId: session.user.id,
  });

  revalidatePath(`/categories/${values.categoryId}`);

  return { success: "Votre restaurant a bien été ajouté !" };
};
