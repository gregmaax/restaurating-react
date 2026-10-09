import { describe, expect, it } from "vitest";
import type { Restaurant } from "~/server/db/schema";
import { restaurantStats, selectRestaurants } from "./restaurant-view";

const restaurant = (id: string, values: Partial<Restaurant>): Restaurant => ({
  id,
  name: "Restaurant",
  city: "Paris",
  description: null,
  rating: null,
  categoryId: "category",
  userId: "user",
  createdAt: new Date("2026-01-01T12:00:00Z"),
  updatedAt: null,
  ...values,
});
const restaurants = [
  restaurant("cafe", {
    name: "Café Sésame",
    city: "Lyon",
    description: "Déjeuner en terrasse",
    rating: 5,
  }),
  restaurant("bistrot", {
    name: "Bistrot",
    city: "Paris",
    rating: 3,
    createdAt: new Date("2026-02-01T12:00:00Z"),
  }),
  restaurant("alba", { name: "Alba", city: "Lyon" }),
];
const filters = {
  search: "",
  city: "",
  tab: "all" as const,
  sort: "recent" as const,
};

describe("Restaurant collection", () => {
  it("combines accent-insensitive search, city and rating filters", () => {
    expect(
      selectRestaurants(restaurants, {
        ...filters,
        search: "  SESAME ",
        city: "Lyon",
        tab: "favorites",
      }).map((item) => item.id),
    ).toEqual(["cafe"]);
    expect(
      selectRestaurants(restaurants, {
        ...filters,
        search: "dejeuner",
        city: "Paris",
      }),
    ).toEqual([]);
    expect(
      selectRestaurants(restaurants, {
        ...filters,
        city: "Lyon",
        tab: "unrated",
      }).map((item) => item.id),
    ).toEqual(["alba"]);
  });

  it("sorts notes with unrated restaurants last without changing the source", () => {
    const sourceOrder = restaurants.map((item) => item.id);
    expect(
      selectRestaurants(restaurants, { ...filters, sort: "rating" }).map(
        (item) => item.id,
      ),
    ).toEqual(["cafe", "bistrot", "alba"]);
    expect(selectRestaurants(restaurants, filters)[0]?.id).toBe("bistrot");
    expect(
      selectRestaurants(restaurants, { ...filters, sort: "name" }).map(
        (item) => item.id,
      ),
    ).toEqual(["alba", "bistrot", "cafe"]);
    expect(restaurants.map((item) => item.id)).toEqual(sourceOrder);
  });

  it("excludes missing notes from the average and handles an empty carnet", () => {
    expect(restaurantStats(restaurants)).toEqual({
      total: 3,
      favorites: 1,
      unrated: 1,
      cities: 2,
      average: "4,0",
    });
    expect(restaurantStats([])).toEqual({
      total: 0,
      favorites: 0,
      unrated: 0,
      cities: 0,
      average: null,
    });
  });
});
