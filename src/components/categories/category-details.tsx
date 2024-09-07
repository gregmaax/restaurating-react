import { Button } from "~/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";
import DeleteCategoryDialog from "./delete-category-dialog";
import RestaurantList from "../restaurants/restaurants-list";
import { CreateRestaurantDialog } from "../restaurants/create-restaurant-dialog";
import { getAllRestaurantsByCategoryId } from "~/server/queries/restaurants";

export default async function CategoryDetails({
  categoryId,
  name,
  description,
}: {
  categoryId: string;
  name: string;
  description: string | null;
}) {
  const restaurants = await getAllRestaurantsByCategoryId(categoryId);
  const restaurantsCount = restaurants.length;
  return (
    <div className="container mx-auto flex flex-col">
      <div className="w-full px-4 py-6 md:px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
            <p className="text-sm text-muted-foreground">
              {description ? description : "Aucune description"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {restaurantsCount}{" "}
              {restaurantsCount === 1 ? "restaurant" : "restaurants"}
            </span>
            <div className="flex flex-wrap gap-2">
              <CreateRestaurantDialog categoryId={categoryId} />
              <Button size="sm" variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <DeleteCategoryDialog categoryId={categoryId} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <RestaurantList restaurants={restaurants} />
      </div>
    </div>
  );
}
