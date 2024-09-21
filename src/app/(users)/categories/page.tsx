import NoCategory from "~/components/categories/no-category";

export const dynamic = "force-dynamic";

export default function CategoryPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <NoCategory />
    </div>
  );
}
