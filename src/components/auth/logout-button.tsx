"use client";

import { logout } from "~/actions/logout";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export function LogoutButton({ children }: LogoutButtonProps) {
  const router = useRouter();
  const onClick = () => {
    logout().then(() => {
      router.push("/auth/login");
    });
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}
