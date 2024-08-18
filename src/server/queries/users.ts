import { db } from "../db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.email, email),
    });

    return user;
  } catch {
    return null;
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.id, userId),
    });

    return user;
  } catch {
    return null;
  }
}
