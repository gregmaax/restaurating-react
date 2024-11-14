export default function RestaurantCounter({
  count,
  isInSidebar,
}: {
  count: number;
  isInSidebar: boolean;
}) {
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
