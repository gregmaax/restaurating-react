import DeleteCategoryDialog from "./delete-category-dialog";
import RestaurantList from "../restaurants/restaurants-list";
import { CreateRestaurantDialog } from "../restaurants/create-restaurant-dialog";
import { getAllRestaurantsByCategoryId } from "~/server/queries/restaurants";
import RestaurantCounter from "../restaurants/restaurant-counter";
import { UpdateCategoryDialog } from "./update-category-dialog";
import { Category } from "~/server/db/schema";

export default async function CategoryDetails({
  category,
}: {
  category: Category;
}) {
  const restaurants = await getAllRestaurantsByCategoryId(category.id);
  const restaurantCount = restaurants.length;

  return (
    <div className="container mx-auto flex flex-col">
      <div className="w-full px-4 py-6 md:px-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {category.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {category.description
                ? category.description
                : "Aucune description"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RestaurantCounter
              isInSidebar={false}
              categoryIdOrCount={restaurantCount}
            />
            <div className="flex flex-wrap gap-2">
              <CreateRestaurantDialog categoryId={category.id} />
              <UpdateCategoryDialog category={category} />
              <DeleteCategoryDialog categoryId={category.id} />
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
