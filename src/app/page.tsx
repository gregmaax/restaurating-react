export const dynamic = "force-dynamic";

export default async function HomePage() {
  //const categories = await db.query.categories.findMany();
  return (
    <main className="container">
      <div className="flex flex-wrap gap-4">{process.env.NODE_ENV}</div>
    </main>
  );
}
