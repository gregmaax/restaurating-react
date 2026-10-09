"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";
import type { Category, Restaurant } from "~/server/db/schema";
import RestaurantForm from "./restaurant-form";
import { Button } from "../ui/button";
import { EditorPanel } from "../shared/editor-panel";

export function UpdateRestaurantDialog({
  restaurant,
  categories,
}: {
  restaurant: Restaurant;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <EditorPanel
      open={open}
      onOpenChange={setOpen}
      title={restaurant.name}
      description="Mettez à jour les détails, changez de catégorie ou gardez une note de votre dernier repas."
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground"
          aria-label={`Modifier ${restaurant.name}`}
        >
          <Pencil />
        </Button>
      }
    >
      <RestaurantForm
        onSuccess={() => setOpen(false)}
        categoryId={restaurant.categoryId}
        restaurant={restaurant}
        categories={categories}
      />
    </EditorPanel>
  );
}
