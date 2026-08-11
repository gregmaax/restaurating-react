"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { auth } from "~/auth";
import { CategorySchema } from "~/schemas";
import { categoryModule } from "~/server/category";

type ActionResult = {
  error?: string;
  success?: string;
  redirectTo?: string;
};

const categoryFailureMessage = (
  reason: "validation" | "name_conflict" | "not_found" | "protected_category",
) => {
  switch (reason) {
    case "name_conflict":
      return "Une catégorie avec ce nom existe déjà !";
    case "not_found":
      return "Cette catégorie est introuvable.";
    case "protected_category":
      return "La catégorie Sans catégorie ne peut pas être modifiée ou supprimée.";
    case "validation":
      return "Erreur ! Champs invalides";
  }
};

export const createCategory = async (
  values: z.infer<typeof CategorySchema>,
): Promise<ActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  const validated = CategorySchema.safeParse(values);
  if (!validated.success) return { error: "Erreur ! Champs invalides" };

  const result = await categoryModule.createCategory({
    userId: session.user.id,
    values: validated.data,
  });
  if (!result.ok) return { error: categoryFailureMessage(result.reason) };

  revalidatePath("/categories");
  return { success: "Votre catégorie a bien été enregistrée !" };
};

export const updateCategory = async (
  values: z.infer<typeof CategorySchema>,
): Promise<ActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  const validated = CategorySchema.safeParse(values);
  if (!validated.success || !validated.data.id) {
    return { error: "Erreur ! Champs invalides" };
  }

  const result = await categoryModule.updateCategory({
    userId: session.user.id,
    categoryId: validated.data.id,
    values: validated.data,
  });
  if (!result.ok) return { error: categoryFailureMessage(result.reason) };

  const redirectTo = `/categories/${result.category.slug}`;
  revalidatePath("/categories");
  revalidatePath(redirectTo);
  return {
    success: "Votre catégorie a bien été modifiée !",
    redirectTo,
  };
};

export const deleteCategory = async (
  categoryId: string,
): Promise<ActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  const result = await categoryModule.deleteCategory({
    userId: session.user.id,
    categoryId,
  });
  if (!result.ok) return { error: categoryFailureMessage(result.reason) };

  revalidatePath("/categories");
  return { success: "Votre catégorie a été supprimée !" };
};
