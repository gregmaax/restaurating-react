"use server";

import { z } from "zod";
import { LoginSchema } from "~/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Champs invalides !" };
  }

  return {
    success: "Email envoyé",
  };
};
