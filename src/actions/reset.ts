"use server";

import { z } from "zod";
import { ResetSchema } from "~/schemas";
import { getUserByEmail } from "~/server/queries/users";
import { sendPasswordResetEmail } from "~/lib/mail";
import { generatePasswordResetToken } from "~/lib/token";

export async function reset(values: z.infer<typeof ResetSchema>) {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Email invalide" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email inconnu" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken[0]?.email!,
    passwordResetToken[0]?.token!,
  );

  return { success: "Email de réinitialisation envoyé" };
}
