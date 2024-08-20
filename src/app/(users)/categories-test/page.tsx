import CategoriesList from "~/components/categories/categories-list";
import { CreateCategoryDialog } from "~/components/categories/create-category-dialog";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function Categories() {
  const categories = await db.query.categories.findMany();
  return (
    <div className="container p-10">
      <div className="my-4">
        <CreateCategoryDialog />
      </div>
      <CategoriesList categories={categories} />
    </div>
  );
}
