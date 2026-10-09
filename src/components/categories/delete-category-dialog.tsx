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
    startTransition(async () => {
      try {
        const data = await deleteCategory(categoryId);
        if (data.error) {
          toast.error(data.error);
          return;
        }
        if (data.success) {
          toast.success(data.success);
          setOpen(false);
          router.push("/categories");
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
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:bg-red-50 hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer une catégorie</DialogTitle>
          <DialogDescription>
            La catégorie sera supprimée. Ses restaurants seront conservés dans «
            Sans catégorie ».
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
            Supprimer la catégorie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
