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
  restaurantName,
}: {
  restaurantId: string;
  restaurantName: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const data = await deleteRestaurant(restaurantId);
        if (data.error) {
          toast.error(data.error);
          return;
        }
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
          if (data.redirectTo) router.replace(data.redirectTo);
        }
      } catch {
        toast.error("La suppression a échoué. Réessayez.");
      }
    });
  };

  const handleCancel = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Supprimer ${restaurantName}`}
          className="h-9 w-9 text-muted-foreground hover:bg-red-50 hover:text-destructive"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer un restaurant</DialogTitle>
          <DialogDescription>
            Le restaurant « {restaurantName} » sera retiré de votre carnet.
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant="destructive"
          >
            Supprimer le restaurant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
