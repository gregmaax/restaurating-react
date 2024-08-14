import { db } from "../db";

export async function getPasswordResetTokenByToken(token: string) {
  try {
    const passwordResetToken = await db.query.password_reset_tokens.findFirst({
      where: (model, { eq }) => eq(model.token, token),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const passwordResetToken = await db.query.password_reset_tokens.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
}
