"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CategorySchema } from "~/schemas";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";

export const createCategory = async (
  values: z.infer<typeof CategorySchema>,
) => {
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Erreur ! Champs invalides" };
  }

  await db.insert(categories).values({
    name: values.name,
    description: values.description,
  });

  revalidatePath("/");

  return { success: "Votre catégorie a bien été enregistrée !" };
};
