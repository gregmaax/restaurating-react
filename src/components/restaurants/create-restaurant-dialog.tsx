"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import RestaurantForm from "./restaurant-form";
import { Button } from "../ui/button";
import { EditorPanel } from "../shared/editor-panel";
import type { Category } from "~/server/db/schema";

export function CreateRestaurantDialog({
  categoryId,
  categories,
}: {
  categoryId: string;
  categories?: Category[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <EditorPanel
      open={open}
      onOpenChange={setOpen}
      title="Ajouter un restaurant"
      description="Une table à essayer ou un repas à retenir ? Ajoutez-la à votre carnet."
      trigger={
        <Button>
          <Plus />
          Ajouter un restaurant
        </Button>
      }
    >
      <RestaurantForm
        onSuccess={() => setOpen(false)}
        categoryId={categoryId}
        categories={categories}
      />
    </EditorPanel>
  );
}
