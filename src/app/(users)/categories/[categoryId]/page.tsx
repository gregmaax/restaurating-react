export const dynamic = "force-dynamic";

export default function CategoryDetailsPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <div className="container flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span>Détails catégorie id : {params.categoryId}</span>
      </div>
      <div>Liste de restaurants</div>
    </div>
  );
}
