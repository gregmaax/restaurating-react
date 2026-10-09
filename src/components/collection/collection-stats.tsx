import { MapPin, Star, Utensils, Heart } from "lucide-react";
import type { Restaurant } from "~/server/db/schema";
import { restaurantStats } from "./restaurant-view";

export function CollectionStats({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  const stats = restaurantStats(restaurants);
  const items = [
    {
      label: "Restaurants",
      value: stats.total,
      detail: "Dans votre carnet",
      icon: Utensils,
      color: "bg-secondary text-primary",
    },
    {
      label: "Bonnes tables",
      value: stats.favorites,
      detail: "Notées 4 ou 5 étoiles",
      icon: Heart,
      color: "bg-secondary text-primary",
    },
    {
      label: "Villes",
      value: stats.cities,
      detail: "À explorer",
      icon: MapPin,
      color: "bg-ivory text-cocoa",
    },
    {
      label: "Note moyenne",
      value: stats.average ?? "—",
      detail: stats.average ? "Sur 5 étoiles" : "Aucune note pour le moment",
      icon: Star,
      color: "bg-ivory text-cocoa",
    },
  ];
  return (
    <div className="my-8 grid grid-cols-2 gap-y-6 rounded-2xl border bg-muted/40 px-5 py-6 lg:grid-cols-4">
      {items.map(({ label, value, detail, icon: Icon, color }, index) => (
        <div
          key={label}
          className={`flex items-start gap-3 px-1 sm:px-3 ${index ? "lg:border-l" : ""}`}
        >
          <span className={`stat-icon hidden sm:flex ${color}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
              {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
