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
import { PencilIcon } from "lucide-react";
import { Restaurant } from "~/server/db/schema";

export function UpdateRestaurantDialog({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const [open, setOpen] = useState(false);

  //handle the prop
  function handleSuccess() {
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2"
          aria-label={`Edit ${restaurant.id}`}
        >
          <PencilIcon className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier un restaurant</DialogTitle>
          <DialogDescription className="hidden">
            Modale de modification d&apos;un restaurant.
          </DialogDescription>
        </DialogHeader>
        <RestaurantForm
          onSuccess={handleSuccess}
          categoryId={restaurant.categoryId}
          restaurant={restaurant}
        />
      </DialogContent>
    </Dialog>
  );
}
