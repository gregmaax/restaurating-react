"use client";

import { useCurrentRole } from "~/hooks/use-current-role";
import { UserRole } from "~/interfaces/user-role";
import FormError from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export function RoleGate({ children, allowedRole }: RoleGateProps) {
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return (
      <FormError message="Vous n'avez pas les permissions pour voir ce contenu" />
    );
  }

  return <>{children}</>;
}
