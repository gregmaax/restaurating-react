import { getCategoryBySlug } from "~/server/queries/categories";
import CategoryDetails from "~/components/categories/category-details";

export const dynamic = "force-dynamic";

export default async function CategoryDetailsPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const category = await getCategoryBySlug(params.categorySlug);
  return (
    <div className="flex-1 overflow-y-auto">
      <CategoryDetails category={category} />
    </div>
  );
}
