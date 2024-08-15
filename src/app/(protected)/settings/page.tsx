"use client";
import { useCurrentUser } from "~/hooks/use-current-user";

export default function SettingsPage() {
  const user = useCurrentUser();
  return <div className="rounded-xl bg-white p-10">Settings page</div>;
}
