import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

import { getSpecificUserCategories } from "~/server/queries/categories";
import Link from "next/link";
import { CreateCategoryDialog } from "../categories/create-category-dialog";
import RestaurantCounter from "~/components/restaurants/restaurant-counter";
import { slugify } from "~/utils/string-utils";

export default async function Sidebar() {
  const categories = await getSpecificUserCategories();
  return (
    <div className="bottom-0 left-0 top-0 w-72 border-r bg-background">
      <div className="h-full overflow-y-auto">
        <div className="border-b p-4">
          <CreateCategoryDialog />
        </div>
        <ScrollArea className="flex-1 p-4">
          <h3 className="mb-4 text-sm font-semibold">Catégories</h3>
          <div className="space-y-2">
            {categories.length === 0 ? <p>Aucune catégorie ajoutée</p> : null}
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="w-full justify-between"
                asChild
              >
                <Link href={`/categories/${slugify(category.slug)}`}>
                  <span className="flex-grow text-left">{category.name}</span>
                  <RestaurantCounter
                    categoryIdOrCount={category.id}
                    isInSidebar={true}
                  />
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
