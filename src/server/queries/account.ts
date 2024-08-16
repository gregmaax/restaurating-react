import { db } from "../db";
import { accounts } from "../db/schema";

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
