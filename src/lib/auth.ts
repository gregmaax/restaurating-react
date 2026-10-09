import { auth } from "~/auth";
import { cache } from "react";

// React shares this promise within a server render, never across requests/users.
export const currentUser = cache(async () => {
  const session = await auth();

  return session?.user;
});

export async function currentRole() {
  const user = await currentUser();
  return user?.role;
}
