import { useSession } from "next-auth/react";

/**
 *
 * Client component only hook
 * @returns the currently logged in user role
 */
export function useCurrentRole() {
  const session = useSession();

  return session.data?.user.role;
}
