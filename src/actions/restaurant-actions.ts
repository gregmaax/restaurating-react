"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { auth } from "~/auth";
import { RestaurantSchema } from "~/schemas";
import { categoryModule } from "~/server/category";

type ActionResult = {
  error?: string;
  success?: string;
  redirectTo?: string;
};

const restaurantFailureMessage = (reason: "validation" | "not_found") =>
  reason === "not_found"
    ? "Ce restaurant ou cette catégorie est introuvable."
    : "Erreur ! Champs invalides";

export const createRestaurant = async (
  values: z.infer<typeof RestaurantSchema>,
): Promise<ActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }
  const validated = RestaurantSchema.safeParse(values);
  if (!validated.success) return { error: "Erreur ! Champs invalides" };

  const result = await categoryModule.createRestaurant({
    userId: session.user.id,
    values: validated.data,
  });
  if (!result.ok) return { error: restaurantFailureMessage(result.reason) };

  const redirectTo = `/categories/${result.restaurant.category.slug}`;
  revalidatePath(redirectTo);
  return {
    success: "Votre restaurant a bien été ajouté !",
    redirectTo,
  };
};

export const updateRestaurant = async (
  values: z.infer<typeof RestaurantSchema>,
): Promise<ActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }
  const validated = RestaurantSchema.safeParse(values);
  if (!validated.success || !validated.data.id) {
    return { error: "Erreur ! Champs invalides" };
  }

  const result = await categoryModule.updateRestaurant({
    userId: session.user.id,
    restaurantId: validated.data.id,
    values: validated.data,
  });
  if (!result.ok) return { error: restaurantFailureMessage(result.reason) };

  const redirectTo = `/categories/${result.restaurant.category.slug}`;
  revalidatePath(redirectTo);
  return {
    success: "Votre restaurant a bien été modifié !",
    redirectTo,
  };
};

export const deleteRestaurant = async (
  restaurantId: string,
): Promise<ActionResult> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour effectuer cette action !" };
  }

  const result = await categoryModule.deleteRestaurant({
    userId: session.user.id,
    restaurantId,
  });
  if (!result.ok) return { error: restaurantFailureMessage(result.reason) };

  const redirectTo = `/categories/${result.category.slug}`;
  revalidatePath(redirectTo);
  return { success: "Votre restaurant a été supprimé !", redirectTo };
};
