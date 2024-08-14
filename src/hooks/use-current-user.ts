import { useSession } from "next-auth/react";

/**
 *
 * Client component only hook
 * @returns the currently logged in user
 */
export function useCurrentUser() {
  const session = useSession();

  return session.data?.user;
}
