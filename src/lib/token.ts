import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "~/server/db";
import { verification_tokens } from "~/server/db/schema";
import { getVerificationTokenByEmail } from "~/server/queries/verification-token";

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verification_tokens)
      .where(eq(verification_tokens.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(verification_tokens)
    .values({ email, token, expires })
    .returning();

  return verificationToken;
}
