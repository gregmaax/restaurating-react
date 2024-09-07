"use client";

import { deleteCategory } from "~/actions/category-actions";

import { Trash2, TrashIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteRestaurant } from "~/actions/restaurant-actions";

export default function DeleteRestaurantDialog({
  restaurantId,
  categoryId,
}: {
  restaurantId: string;
  categoryId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    //logic
    startTransition(async () => {
      await deleteRestaurant(restaurantId, categoryId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
        router.push(`/categories/${categoryId}`);
      });
    });

    //close modal
    setOpen(false);
  };

  const handleCancel = () => {
    console.log("Action cancelled");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          aria-label={`Delete ${restaurantId}`}
          className="h-7 px-2"
        >
          <TrashIcon className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer un restaurant</DialogTitle>
          <DialogDescription>
            Voulez-vous continuer ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Non
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            Oui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
