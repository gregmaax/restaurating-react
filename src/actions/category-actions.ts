"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "~/auth";
import { CategorySchema } from "~/schemas";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";
import { deleteCategoryById } from "~/server/queries/categories";

export const createCategory = async (
  values: z.infer<typeof CategorySchema>,
) => {
  //check if there is a loggedin user
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  //action
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Erreur ! Champs invalides" };
  }

  await db.insert(categories).values({
    name: values.name,
    description: values.description,
    userId: session.user.id!,
  });

  revalidatePath("/categories");

  return { success: "Votre catégorie a bien été enregistrée !" };
};

export const deleteCategory = async (categoryId: string) => {
  //check if there is a loggedin user
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  await deleteCategoryById(categoryId);

  revalidatePath("/categories");

  return { success: "Votre catégorie a été supprimée !" };
};
