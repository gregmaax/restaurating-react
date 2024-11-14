"use client";

import { useState } from "react";
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
import RestaurantForm from "./restaurant-form";

export function CreateRestaurantDialog({ categoryId }: { categoryId: string }) {
  const [open, setOpen] = useState(false);

  //handle the prop
  function handleSuccess() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="custom_primary" size="sm">
          <FaPlus className="mr-2" /> Ajouter un restaurant
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un restaurant</DialogTitle>
          <DialogDescription className="hidden">
            Modale d&apos;ajout de restaurant.
          </DialogDescription>
        </DialogHeader>
        <RestaurantForm onSuccess={handleSuccess} categoryId={categoryId} />
      </DialogContent>
    </Dialog>
  );
}
