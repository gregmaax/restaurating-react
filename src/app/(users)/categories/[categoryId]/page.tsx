export default async function CategoryDetails({
  params,
}: {
  params: { categoryId: string };
}) {
  return <div>Detail de la catégorie id : {params.categoryId}</div>;
}
