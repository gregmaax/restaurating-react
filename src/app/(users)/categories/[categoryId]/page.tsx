import { getCategoryById } from "~/server/queries/categories";
import CategoryDetails from "~/components/categories/category-details";

export const dynamic = "force-dynamic";

export default async function CategoryDetailsPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const category = await getCategoryById(params.categoryId);
  return (
    <CategoryDetails
      name={category.name}
      description={category.description}
      categoryId={params.categoryId}
    />
  );
}
