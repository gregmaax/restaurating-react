import type { Restaurant } from "~/server/db/schema";

export type RestaurantTab = "all" | "favorites" | "unrated";
export type RestaurantSort = "recent" | "name" | "rating";
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr")
    .trim();

export function selectRestaurants(
  restaurants: Restaurant[],
  filters: {
    search: string;
    city: string;
    tab: RestaurantTab;
    sort: RestaurantSort;
  },
) {
  const query = normalizeSearch(filters.search);
  return restaurants
    .filter((restaurant) => {
      const matchesSearch = normalizeSearch(
        `${restaurant.name} ${restaurant.city} ${restaurant.description ?? ""}`,
      ).includes(query);
      return (
        matchesSearch &&
        (!filters.city || restaurant.city === filters.city) &&
        (filters.tab !== "favorites" || (restaurant.rating ?? 0) >= 4) &&
        (filters.tab !== "unrated" || restaurant.rating == null)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name, "fr");
      if (filters.sort === "rating")
        return (
          (b.rating ?? 0) - (a.rating ?? 0) ||
          a.name.localeCompare(b.name, "fr")
        );
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function restaurantStats(restaurants: Restaurant[]) {
  const rated = restaurants.filter((restaurant) => restaurant.rating != null);
  return {
    total: restaurants.length,
    favorites: restaurants.filter((restaurant) => (restaurant.rating ?? 0) >= 4)
      .length,
    unrated: restaurants.length - rated.length,
    cities: new Set(
      restaurants.map((restaurant) => normalizeSearch(restaurant.city)),
    ).size,
    average: rated.length
      ? (
          rated.reduce((sum, restaurant) => sum + restaurant.rating!, 0) /
          rated.length
        ).toLocaleString("fr-FR", {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        })
      : null,
  };
}
