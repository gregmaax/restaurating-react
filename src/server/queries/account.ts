import { db } from "../db";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.query.accounts.findFirst({
      where: (model, { eq }) => eq(model.userId, userId),
    });

    return account;
  } catch {
    return null;
  }
};
