"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

import { RegisterSchema } from "~/schemas";
import { users } from "~/server/db/schema";
import { getUserByEmail } from "~/server/queries/users";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides !" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Cet email est déjà utilisé" };
  }

  await db
    .insert(users)
    .values({ email: email, name: name, password: hashedPassword });

  //TODO: Send verification token

  return {
    success: "Compte crée !",
  };
};
