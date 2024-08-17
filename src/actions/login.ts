"use server";

import { error } from "console";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "~/auth";
import { sendVerificationEmail } from "~/lib/mail";
import { generateVerificationToken } from "~/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";
import { LoginSchema } from "~/schemas";
import { getUserByEmail } from "~/server/queries/users";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides !" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser?.email || !existingUser.password) {
    return { error: "Cet email n'existe pas !" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken[0]?.email!,
      verificationToken[0]?.token!,
    );

    return { success: "Email de confirmation envoyé !" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants invalides" };
        default:
          return { error: "Oups, erreur inattendue" };
      }
    }
    throw error;
  }
};
