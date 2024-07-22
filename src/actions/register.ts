"use server";

import { z } from "zod";
import { RegisterSchema } from "~/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Champs invalides !" };
  }

  return {
    success: "Email envoyé",
  };
};
