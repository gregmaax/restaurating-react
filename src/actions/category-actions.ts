"use server";

import { z } from "zod";
import { CategorySchema } from "~/schemas";

export const createCategory = async (
  values: z.infer<typeof CategorySchema>,
) => {
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Erreur ! Champs invalides" };
  }

  return { success: "Votre catégorie a bien été enregistrée !" };
};
