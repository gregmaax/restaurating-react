"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";
import type { Category } from "~/server/db/schema";
import CategoryForm from "./category-form";
import { Button } from "../ui/button";
import { EditorPanel } from "../shared/editor-panel";

export function UpdateCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  return (
    <EditorPanel
      open={open}
      onOpenChange={setOpen}
      title="Modifier la catégorie"
      description="Un nouveau nom, une nouvelle envie. Vos restaurants restent dans cette catégorie."
      trigger={
        <Button variant="outline" size="sm">
          <Pencil />
          Modifier
        </Button>
      }
    >
      <CategoryForm onSuccess={() => setOpen(false)} category={category} />
    </EditorPanel>
  );
}
