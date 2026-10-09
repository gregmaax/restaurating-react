import Link from "next/link";
import { Folder } from "lucide-react";
import { getSpecificUserCategories } from "~/server/queries/categories";
import { getAllUserRestaurants } from "~/server/queries/restaurants";
import RestaurantList from "~/components/restaurants/restaurants-list";
import { CollectionStats } from "~/components/collection/collection-stats";
import { CreateRestaurantDialog } from "~/components/restaurants/create-restaurant-dialog";
import { CreateCategoryDialog } from "~/components/categories/create-category-dialog";

export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  const [categories, restaurants] = await Promise.all([
    getSpecificUserCategories(),
    getAllUserRestaurants(),
  ]);
  const firstCategory = categories[0];
  const restaurantCounts = new Map<string, number>();
  for (const restaurant of restaurants) {
    restaurantCounts.set(
      restaurant.categoryId,
      (restaurantCounts.get(restaurant.categoryId) ?? 0) + 1,
    );
  }
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="page-title">Mon carnet</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Vos découvertes, vos envies et les tables où revenir.
          </p>
        </div>
        {firstCategory ? (
          <CreateRestaurantDialog
            categoryId={firstCategory.id}
            categories={categories}
          />
        ) : (
          <CreateCategoryDialog className="" />
        )}
      </div>
      <CollectionStats restaurants={restaurants} />
      {categories.length > 0 && (
        <section className="mb-8" aria-label="Mes catégories">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Mes catégories</h2>
            <span className="text-xs text-muted-foreground">
              {categories.length} catégorie{categories.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category, index) => {
              const count = restaurantCounts.get(category.id) ?? 0;
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="flex min-w-[180px] max-w-[240px] shrink-0 items-center gap-3 rounded-xl border px-4 py-3 hover:border-primary/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span
                    className={`rounded-lg p-2 ${index % 3 === 0 ? "bg-secondary text-primary" : index % 3 === 1 ? "bg-ivory text-cocoa" : "bg-ivory text-cocoa"}`}
                  >
                    <Folder className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {count} restaurant{count > 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <RestaurantList restaurants={restaurants} categories={categories} />
    </>
  );
}
