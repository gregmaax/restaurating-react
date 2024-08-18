import { DefaultSession } from "next-auth";
import { UserRole } from "./interfaces/user-role";

export type ExtendedUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER";
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
