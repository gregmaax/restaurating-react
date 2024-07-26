"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

import { RegisterSchema } from "~/schemas";
import { users } from "~/server/db/schema";
import { getUserByEmail } from "~/server/queries/users";
import { generateVerificationToken } from "~/lib/token";
import { sendVerificationEmail } from "~/lib/mail";

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

  const verificationToken = await generateVerificationToken(email);
  //if (verificationToken.length > 0) {
  //  possibly check the length before sending the email to check the object
  //}
  await sendVerificationEmail(
    verificationToken[0]?.email!,
    verificationToken[0]?.token!,
  );

  return {
    success: "Email de vérification envoyé !",
  };
};
