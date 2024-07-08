import { Category } from "~/server/db/schema";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

export default async function CategoriesList({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <main className="grid grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </main>
  );
}
