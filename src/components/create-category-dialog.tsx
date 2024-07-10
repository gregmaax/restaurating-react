import CategoryForm from "./category-form";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function CreateCategoryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Nouvelle catégorie</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une catégorie</DialogTitle>
          <DialogDescription className="hidden">
            Modale de création de catégorie.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm />
      </DialogContent>
    </Dialog>
  );
}
