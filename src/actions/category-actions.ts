"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "~/auth";
import { CategorySchema } from "~/schemas";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";
import { deleteCategoryById } from "~/server/queries/categories";
import { capitalize, slugify } from "~/utils/string-utils";

export const createCategory = async (
  values: z.infer<typeof CategorySchema>,
) => {
  //check if there is a loggedin user
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  //validate fields using zod schemas
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Erreur ! Champs invalides" };
  }

  // Check if the category with the same name already exists
  const existingCategory = await db.query.categories.findFirst({
    where: (model, { eq }) => eq(model.name, capitalize(values.name)),
  });

  if (existingCategory) {
    return { error: "Une catégorie avec ce nom existe déjà !" };
  }

  //insert the new category
  await db.insert(categories).values({
    name: capitalize(values.name),
    slug: slugify(values.name),
    description: values.description,
    userId: session.user.id!,
  });

  revalidatePath("/categories");

  return { success: "Votre catégorie a bien été enregistrée !" };
};

export const updateCategory = async (
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

  await db
    .update(categories)
    .set({
      name: values.name,
      description: values.description,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, values.id!));

  revalidatePath(`/categories/${values.id}`);

  return { success: "Votre catégorie a bien été modifiée !" };
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
