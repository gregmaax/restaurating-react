import { Separator } from "~/components/ui/separator";
import { getCategoryById } from "~/server/queries/categories";

export const dynamic = "force-dynamic";

export default async function CategoryDetailsPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const category = await getCategoryById(params.categoryId);
  return (
    <div className="container flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span>Détails catégorie params.categoryId : {params.categoryId}</span>
        <Separator />
        <div className="flex flex-col gap-2">
          <span>Détails catégorie nom : {category.name}</span>
          <span>Détails catégorie id : {category.id}</span>
          <span>Détails catégorie description : {category.description}</span>
        </div>
      </div>
      <div>Liste de restaurants</div>
    </div>
  );
}
