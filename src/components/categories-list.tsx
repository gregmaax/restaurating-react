import { Category } from "~/server/db/schema";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

export default async function CategoriesList({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
