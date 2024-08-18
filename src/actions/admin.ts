"use server";

import { error } from "console";
import { currentRole } from "~/lib/auth";

export const admin = async () => {
  const role = await currentRole();

  if (role === "ADMIN") {
    return { success: "Allowed Server Action" };
  }

  return { error: "Forbidden Server Action" };
};
