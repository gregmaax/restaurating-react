"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import CategoryForm from "./category-form";
import { Button } from "../ui/button";
import { EditorPanel } from "../shared/editor-panel";

export function CreateCategoryDialog({
  className = "w-full",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <EditorPanel
      open={open}
      onOpenChange={setOpen}
      title="Nouvelle catégorie"
      description="Regroupez vos restaurants par cuisine, par occasion ou simplement selon vos envies."
      trigger={
        <Button className={className}>
          <Plus />
          Nouvelle catégorie
        </Button>
      }
    >
      <CategoryForm onSuccess={() => setOpen(false)} />
    </EditorPanel>
  );
}
