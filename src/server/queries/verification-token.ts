import { db } from "../db";

export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await db.query.verification_tokens.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await db.query.verification_tokens.findFirst({
      where: (model, { eq }) => eq(model.token, token),
    });

    return verificationToken;
  } catch {
    return null;
  }
}
