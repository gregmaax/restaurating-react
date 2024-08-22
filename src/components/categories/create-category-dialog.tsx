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

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);

  //handle the prop
  function handleSuccess() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <FaPlus className="mr-2" /> Nouvelle catégorie
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une catégorie</DialogTitle>
          <DialogDescription className="hidden">
            Modale de création de catégorie.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
