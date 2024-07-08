import CategoriesList from "~/components/categories-list";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await db.query.categories.findMany();
  return (
    <main className="container p-10">
      <CategoriesList categories={categories} />
    </main>
  );
}
