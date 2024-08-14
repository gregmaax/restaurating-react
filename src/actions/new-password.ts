"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "~/schemas";
import { getPasswordResetTokenByToken } from "~/server/queries/password-reset-token";
import { getUserByEmail } from "~/server/queries/users";
import { db } from "~/server/db";
import { password_reset_tokens, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) {
  if (!token) {
    return { error: "Token introuvable" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champ invalide" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token invalide" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Le token a expiré" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Cet email n'existe pas" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, existingUser?.id!));

  await db
    .delete(password_reset_tokens)
    .where(eq(password_reset_tokens.id, existingToken.id));

  return { success: "Mot de passe réinitialisé" };
}
