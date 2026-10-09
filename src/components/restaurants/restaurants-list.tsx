"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  LayoutGrid,
  List,
  MapPin,
  Search,
  Star,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Category, Restaurant } from "~/server/db/schema";
import DeleteRestaurantDialog from "./delete-restaurant-dialog";
import { UpdateRestaurantDialog } from "./update-restaurant-dialog";
import {
  restaurantStats,
  selectRestaurants,
  type RestaurantSort,
  type RestaurantTab,
} from "~/components/collection/restaurant-view";

const colors = [
  "bg-[#ffe2d5] text-primary",
  "bg-[#ffeab5] text-cocoa",
  "bg-[#f1e7d6] text-cocoa",
  "bg-[#ffeab5] text-cocoa",
  "bg-[#f9d5c8] text-[#923923]",
];
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Paris",
});

export default function RestaurantList({
  restaurants,
  categories,
  preview = false,
}: {
  restaurants: Restaurant[];
  categories: Category[];
  preview?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [tab, setTab] = useState<RestaurantTab>("all");
  const [sort, setSort] = useState<RestaurantSort>("recent");
  const [view, setView] = useState<"list" | "grid">("list");
  const stats = restaurantStats(restaurants);
  const visible = selectRestaurants(restaurants, { search, city, tab, sort });
  const cities = [
    ...new Set(restaurants.map((restaurant) => restaurant.city)),
  ].sort((a, b) => a.localeCompare(b, "fr"));
  const filtered = !!search || !!city || tab !== "all";
  const tabs: { value: RestaurantTab; label: string; count: number }[] = [
    { value: "all", label: "Tous les restaurants", count: stats.total },
    { value: "favorites", label: "Bonnes tables", count: stats.favorites },
    { value: "unrated", label: "À noter", count: stats.unrated },
  ];

  const resetFilters = () => {
    setSearch("");
    setCity("");
    setTab("all");
  };
  return (
    <section aria-label="Votre carnet de restaurants">
      <div
        className="flex gap-5 overflow-x-auto border-b sm:gap-7"
        aria-label="Filtrer par note"
      >
        {tabs.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            aria-pressed={tab === item.value}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-0.5 pb-4 pt-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${tab === item.value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <span className={item.value === "all" ? "hidden sm:inline" : ""}>
              {item.label}
            </span>
            {item.value === "all" && <span className="sm:hidden">Tous</span>}
            <span
              className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${tab === item.value ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 py-5">
        <div className="relative min-w-[180px] flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Rechercher un restaurant"
            placeholder="Un restaurant, une ville, un souvenir…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10 pr-9"
          />
          {search && (
            <button
              type="button"
              aria-label="Effacer la recherche"
              onClick={() => setSearch("")}
              className="absolute right-2 top-2 rounded p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          className="filter-select"
          aria-label="Filtrer par ville"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        >
          <option value="">Toutes les villes</option>
          {cities.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <ArrowUpDown
            className="hidden h-4 w-4 text-muted-foreground sm:block"
            aria-hidden="true"
          />
          <select
            aria-label="Trier les restaurants"
            className="h-11 border-transparent bg-muted/60 pr-10 text-muted-foreground"
            value={sort}
            onChange={(event) => setSort(event.target.value as RestaurantSort)}
          >
            <option value="recent">Ajouts récents</option>
            <option value="name">Nom de A à Z</option>
            <option value="rating">Meilleures notes</option>
          </select>
          <div className="hidden gap-1 rounded-lg border p-1 md:flex">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              aria-label="Vue liste"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List />
            </Button>
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              aria-label="Vue cartes"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid />
            </Button>
          </div>
        </div>
      </div>
      {visible.length ? (
        <div
          className={
            view === "grid"
              ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              : "overflow-hidden rounded-2xl border"
          }
        >
          {view === "list" && (
            <div className="hidden grid-cols-[minmax(180px,1.5fr)_minmax(110px,0.8fr)_minmax(100px,1fr)_100px_110px_80px] items-center gap-4 border-b bg-muted/70 px-5 py-3 text-xs text-muted-foreground lg:grid">
              <span>Restaurant</span>
              <span>Ville</span>
              <span>Catégorie</span>
              <span>Votre note</span>
              <span>Ajouté le</span>
              <span className="sr-only">Actions</span>
            </div>
          )}
          {visible.map((restaurant) => {
            const category = categories.find(
              (item) => item.id === restaurant.categoryId,
            );
            const colorIndex =
              [...restaurant.name].reduce(
                (sum, character) => sum + character.charCodeAt(0),
                0,
              ) % colors.length;
            const initials = restaurant.name
              .split(/\s+/)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toLocaleUpperCase("fr");
            const actions = preview ? null : (
              <div className="order-5 flex justify-end gap-1 lg:order-none">
                <UpdateRestaurantDialog
                  restaurant={restaurant}
                  categories={categories}
                />
                <DeleteRestaurantDialog
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                />
              </div>
            );
            return view === "grid" ? (
              <article
                key={restaurant.id}
                className="flex flex-col rounded-2xl border p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className={`restaurant-initials ${colors[colorIndex]}`}>
                    {initials}
                  </span>
                  <Rating rating={restaurant.rating} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {restaurant.name}
                </h3>
                <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {restaurant.city}
                </span>
                <p className="my-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {restaurant.description?.trim()
                    ? restaurant.description
                    : "Ajoutez quelques mots pour vous souvenir de cette table."}
                </p>
                <div className="flex items-center justify-between gap-2 border-t pt-4">
                  <span className="truncate rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {category?.name ?? "Sans catégorie"}
                  </span>
                  {actions}
                </div>
              </article>
            ) : (
              <article
                key={restaurant.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b px-5 py-4 last:border-b-0 hover:bg-muted/60 lg:grid-cols-[minmax(180px,1.5fr)_minmax(110px,0.8fr)_minmax(100px,1fr)_100px_110px_80px] lg:items-center lg:gap-4"
              >
                <div className="order-1 col-span-2 flex min-w-0 items-center gap-3 lg:order-none lg:col-span-1">
                  <span className={`restaurant-initials ${colors[colorIndex]}`}>
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="truncate text-sm font-medium"
                      title={restaurant.name}
                    >
                      {restaurant.name}
                    </h3>
                    <p
                      className="mt-0.5 truncate text-xs text-muted-foreground"
                      title={restaurant.description ?? undefined}
                    >
                      {restaurant.description?.trim()
                        ? restaurant.description
                        : "Aucun souvenir ajouté"}
                    </p>
                  </div>
                </div>
                <span className="order-2 flex items-center gap-1.5 pl-14 text-sm text-muted-foreground lg:order-none lg:pl-0">
                  <MapPin
                    className="h-3.5 w-3.5 lg:hidden"
                    aria-hidden="true"
                  />
                  {restaurant.city}
                </span>
                <div className="order-4 min-w-0 pl-14 lg:order-none lg:pl-0">
                  <span className="inline-block max-w-full truncate rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {category?.name ?? "Sans catégorie"}
                  </span>
                </div>
                <div className="order-3 lg:order-none">
                  <Rating rating={restaurant.rating} />
                </div>
                <span className="hidden text-xs text-muted-foreground lg:block">
                  {dateFormatter.format(new Date(restaurant.createdAt))}
                </span>
                {actions}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            {filtered ? <Search /> : <Utensils />}
          </span>
          <h3 className="text-lg font-semibold">
            {filtered
              ? "Aucun restaurant ne correspond"
              : "Votre prochaine bonne table commence ici"}
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {filtered
              ? "Essayez un autre nom, une autre ville ou retirez les filtres."
              : "Ajoutez votre premier restaurant. Vous pourrez le noter et garder vos souvenirs de repas."}
          </p>
          {filtered && (
            <Button variant="outline" className="mt-5" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <p role="status" aria-live="polite">
          {visible.length} restaurant{visible.length > 1 ? "s" : ""}
          {filtered ? ` sur ${restaurants.length}` : " dans ce carnet"}
        </p>
        <p className="hidden sm:block">
          {preview
            ? "Restaurants d'exemple"
            : "Vos bonnes adresses, pour vous."}
        </p>
      </div>
    </section>
  );
}

function Rating({ rating }: { rating: number | null }) {
  return rating == null ? (
    <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
      À noter
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-1.5 rounded-md bg-ivory px-2 py-1 text-xs font-medium tabular-nums text-cocoa"
      aria-label={`${rating} étoiles sur 5`}
    >
      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
      {rating}
      <span className="opacity-60">/ 5</span>
    </span>
  );
}
