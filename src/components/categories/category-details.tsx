import DeleteCategoryDialog from "./delete-category-dialog";
import RestaurantList from "../restaurants/restaurants-list";
import { CreateRestaurantDialog } from "../restaurants/create-restaurant-dialog";
import { getAllRestaurantsByCategoryId } from "~/server/queries/restaurants";
import { UpdateCategoryDialog } from "./update-category-dialog";
import type { Category } from "~/server/db/schema";
import { getSpecificUserCategories } from "~/server/queries/categories";
import { CollectionStats } from "../collection/collection-stats";

export default async function CategoryDetails({
  category,
}: {
  category: Category;
}) {
  const [restaurants, categories] = await Promise.all([
    getAllRestaurantsByCategoryId(category.id),
    getSpecificUserCategories(),
  ]);
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="page-title">{category.name}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {category.description?.trim()
              ? category.description
              : "Toutes les bonnes adresses de cette catégorie."}
          </p>
        </div>
        <CreateRestaurantDialog categoryId={category.id} />
      </div>
      {category.kind === "ORDINARY" && (
        <div className="mt-5 flex gap-2">
          <UpdateCategoryDialog category={category} />
          <DeleteCategoryDialog categoryId={category.id} />
        </div>
      )}
      <CollectionStats restaurants={restaurants} />
      <RestaurantList restaurants={restaurants} categories={categories} />
    </>
  );
}
