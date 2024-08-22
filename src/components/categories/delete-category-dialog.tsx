"use client";

import { deleteCategory } from "~/actions/category-actions";

import { Trash2 } from "lucide-react";
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

export default function DeleteCategoryDialog({
  categoryId,
}: {
  categoryId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConfirm = () => {
    //logic
    startTransition(async () => {
      await deleteCategory(categoryId).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
        router.push("/categories");
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
        <Button size="sm" variant="outline">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer une catégorie</DialogTitle>
          <DialogDescription>
            Voulez-vous continuer ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Non
          </Button>
          <Button onClick={handleConfirm}>Oui</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
