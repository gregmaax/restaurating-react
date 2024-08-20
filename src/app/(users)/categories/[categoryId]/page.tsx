export const dynamic = "force-dynamic";

export default function CategoryDetailsPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <div className="container flex flex-col gap-10">
      <div>Détails catégorie id : {params.categoryId}</div>
      <div>Liste de restaurants</div>
    </div>
  );
}
