"use server";

import * as z from "zod";

import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { SettingsSchema } from "~/schemas";
import { getUserByEmail, getUserById } from "~/server/queries/users";
import { currentUser } from "~/lib/auth";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { generateVerificationToken } from "~/lib/token";
import { sendVerificationEmail } from "~/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOAuth) {
    (values.email = undefined),
      (values.password = undefined),
      (values.newPassword = undefined);
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email déjà utilisé" };
    }

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(
      verificationToken[0]?.email!,
      verificationToken[0]?.token!,
    );

    return { success: "Vérifier votre nouvel email !" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Mot de passe incorrect !" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db
    .update(users)
    .set({ ...values })
    .where(eq(users.id, dbUser.id));

  return { success: "Profil mis à jour" };
};
