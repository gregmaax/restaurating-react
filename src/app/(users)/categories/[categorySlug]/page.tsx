import CategoryDetails from "~/components/categories/category-details";
import { currentUser } from "~/lib/auth";
import { categoryModule } from "~/server/category";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const user = await currentUser();
  if (!user?.id) notFound();

  const result = await categoryModule.resolveCategory({
    userId: user.id,
    slug: categorySlug,
  });
  if (!result.ok) notFound();
  if (result.resolution === "historical") {
    permanentRedirect(`/categories/${result.category.slug}`);
  }

  return (
    <div>
      <CategoryDetails category={result.category} />
    </div>
  );
}
