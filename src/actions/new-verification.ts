"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users, verification_tokens } from "~/server/db/schema";
import { getUserByEmail } from "~/server/queries/users";
import { getVerificationTokenByToken } from "~/server/queries/verification-token";

export async function newVerification(token: string) {
  console.log("Enter New Verification function");
  const existingToken = await getVerificationTokenByToken(token);
  console.log(existingToken);

  if (!existingToken) {
    return { error: "Le token n'existe pas" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Le token a expiré" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingToken) {
    return { error: "Cet email n'existe pas" };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), email: existingToken.email })
    .where(eq(users.id, existingUser?.id!));

  await db
    .delete(verification_tokens)
    .where(eq(verification_tokens.id, existingToken.id));

  return { success: "Email vérifié !" };
}
