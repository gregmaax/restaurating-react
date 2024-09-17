"use client";

import { useState } from "react";
import CategoryForm from "./category-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FaPlus } from "react-icons/fa";
import { Pencil } from "lucide-react";
import { Category } from "~/server/db/schema";

export function UpdateCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);

  //handle the prop
  function handleSuccess() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier une catégorie</DialogTitle>
          <DialogDescription className="hidden">
            Modale de modification de catégorie.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm onSuccess={handleSuccess} category={category} />
      </DialogContent>
    </Dialog>
  );
}
