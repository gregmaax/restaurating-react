import { Button } from "~/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteCategoryDialog from "./delete-category-dialog";

export default function CategoryDetails({
  categoryId,
  name,
  description,
}: {
  categoryId: string;
  name: string;
  description: string | null;
}) {
  return (
    <div className="w-full bg-secondary px-4 py-6 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              12 restaurants
            </span>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <DeleteCategoryDialog categoryId={categoryId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
