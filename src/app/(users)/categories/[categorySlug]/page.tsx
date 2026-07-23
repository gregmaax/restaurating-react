import { getCategoryBySlug } from "~/server/queries/categories";
import CategoryDetails from "~/components/categories/category-details";

export const dynamic = "force-dynamic";

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  return (
    <div>
      <CategoryDetails category={category} />
    </div>
  );
}
