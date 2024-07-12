export default async function CategoryDetails({
  params,
}: {
  params: { categoryId: string };
}) {
  return <div>Detail de la catégorie d'id : {params.categoryId}</div>;
}
