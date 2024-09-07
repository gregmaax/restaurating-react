import { getRestaurantCountOfCategory } from "~/server/queries/restaurants";

export default async function RestaurantCounter({
  categoryIdOrCount,
  isInSidebar,
}: {
  categoryIdOrCount: number | string;
  isInSidebar: boolean;
}) {
  const count =
    typeof categoryIdOrCount === "string"
      ? await getRestaurantCountOfCategory(categoryIdOrCount)
      : categoryIdOrCount;

  const baseClasses =
    "inline-flex items-center justify-center bg-primary/10 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20";

  if (isInSidebar) {
    return (
      <span className="relative inline-block h-5 w-5">
        <span className={`${baseClasses} absolute inset-0 rounded-full`}>
          {count}
        </span>
      </span>
    );
  }

  return (
    <span className={`${baseClasses} rounded-full px-2.5 py-0.5`}>
      {count} {count === 1 ? "restaurant" : "restaurants"}
    </span>
  );
}
