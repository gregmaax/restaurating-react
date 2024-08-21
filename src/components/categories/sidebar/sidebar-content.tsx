import Link from "next/link";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Category } from "~/server/db/schema";

export default function SidebarContent({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <ScrollArea className="min-h-screen w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-6 text-sm font-medium leading-none">
          Vos catégories
        </h4>
        <div>
          {categories.length === 0 ? <p>Aucune catégorie ajoutée</p> : null}
          {categories.map((category) => (
            <div key={category.id}>
              <div className="cursor-pointer">
                <Link href={`/categories/${category.id}`}>
                  <span className="text-sm">{category.name}</span>
                </Link>
              </div>

              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
