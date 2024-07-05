import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await db.query.categories.findMany();
  return (
    <main className="container flex flex-row gap-2 p-10">
      {categories.map((category) => (
        <Card key={category.id} className="w-1/5 h-1/5">
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </main>
  );
}
