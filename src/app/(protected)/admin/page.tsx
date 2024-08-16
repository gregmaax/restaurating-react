"use client";

import { toast } from "sonner";
import { admin } from "~/actions/admin";
import { RoleGate } from "~/components/auth/role-gate";
import FormSuccess from "~/components/form-success";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function AdminPage() {
  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.success) {
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
  };

  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Allowed API Route");
      } else {
        toast.error("Forbidden API Route");
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader className="text-center text-2xl font-semibold">
        🔑 Admin
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole="ADMIN">
          <FormSuccess message="Vous etes autorisé à voir ce contenu" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
