import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

import { getSpecificUserCategories } from "~/server/queries/categories";
import Link from "next/link";
import { CreateCategoryDialog } from "../create-category-dialog";

export default async function SidebarDeux() {
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
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href={`/categories/${category.id}`}>{category.name}</Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
