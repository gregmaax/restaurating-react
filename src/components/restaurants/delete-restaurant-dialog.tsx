"use client";

import { TrashIcon } from "lucide-react";
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
}: {
  restaurantId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    //logic
    startTransition(async () => {
      await deleteRestaurant(restaurantId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
        if (data.redirectTo) router.replace(data.redirectTo);
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
          variant="default"
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
          <Button variant="default" onClick={handleCancel}>
            Non
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant="custom_primary"
          >
            Oui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
