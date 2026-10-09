import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Star, Utensils } from "lucide-react";
import { auth } from "~/auth";
import { Button } from "~/components/ui/button";
import { Brand } from "~/components/shared/brand";
import RestaurantList from "~/components/restaurants/restaurants-list";
import { CollectionStats } from "~/components/collection/collection-stats";
import type { Category, Restaurant } from "~/server/db/schema";

const categoryNames = ["À partager", "Cuisine du monde", "Les incontournables"];
const categories: Category[] = categoryNames.map((name, index) => ({
  id: `example-category-${index}`,
  name,
  nameKey: name,
  slug: `example-${index}`,
  kind: "ORDINARY",
  description: null,
  createdAt: new Date("2026-01-01T12:00:00Z"),
  updatedAt: null,
  userId: "example",
}));
const examples = [
  {
    name: "La petite trattoria",
    city: "Paris",
    description: "Les pâtes fraîches et la grande tablée du vendredi.",
    rating: 5,
    category: 0,
  },
  {
    name: "Maison Sésame",
    city: "Lyon",
    description: "Un déjeuner au soleil, à refaire.",
    rating: 4,
    category: 2,
  },
  {
    name: "Bistrot des amis",
    city: "Bordeaux",
    description: "La cuisine du marché, tout simplement.",
    rating: 5,
    category: 2,
  },
  {
    name: "Osteria Alba",
    city: "Paris",
    description: "Une adresse conseillée pour notre prochaine sortie.",
    rating: null,
    category: 1,
  },
  {
    name: "Bao & compagnie",
    city: "Lyon",
    description: "Petites assiettes, grandes découvertes.",
    rating: 4,
    category: 1,
  },
  {
    name: "Café Junot",
    city: "Paris",
    description: "Le prochain brunch du dimanche.",
    rating: null,
    category: 0,
  },
];
const restaurants: Restaurant[] = examples.map(
  ({ category, ...restaurant }, index) => ({
    ...restaurant,
    id: `example-restaurant-${index}`,
    categoryId: categories[category]!.id,
    userId: "example",
    createdAt: new Date(
      `2026-01-${String(20 - index).padStart(2, "0")}T12:00:00Z`,
    ),
    updatedAt: null,
  }),
);

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/categories");
  return (
    <div className="min-h-svh px-0 md:p-3">
      <div className="mx-auto min-h-svh max-w-[1440px] bg-white md:rounded-2xl md:border">
        <header className="flex h-20 items-center justify-between gap-2 border-b px-4 sm:px-8 lg:px-10">
          <Link href="/" aria-label="Restaurating, accueil">
            <Brand />
          </Link>
          <Button asChild size="sm" className="px-3 text-xs sm:px-4 sm:text-sm">
            <Link href="/auth/signin">Se connecter</Link>
          </Button>
        </header>
        <main className="page-content">
          <section className="relative isolate mb-9 overflow-hidden rounded-2xl bg-ivory p-6 sm:p-8">
            <div className="relative z-10 max-w-[520px]">
              <h1 className="text-3xl font-semibold leading-[1.13] tracking-[-0.055em] text-foreground sm:text-[42px]">
                Le carnet de vos
                <br className="hidden sm:block" /> bonnes tables.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Les restaurants à essayer. Ceux que vous avez aimés. Et tous les
                souvenirs qui vont avec.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button asChild>
                  <Link href="/auth/signin">
                    Créer mon carnet
                    <ArrowUpRight />
                  </Link>
                </Button>
                <span className="text-xs text-muted-foreground">
                  Personnel. Privé. À votre goût.
                </span>
              </div>
            </div>
            <div
              className="pointer-events-none absolute -right-14 top-1/2 hidden h-[280px] w-[280px] -translate-y-1/2 items-center justify-center rounded-full border-[18px] border-white/60 bg-[#ffe2d5]/60 shadow-[inset_0_0_0_2px_#dfd3ba,0_0_0_1px_#dfd3ba] xl:flex"
              aria-hidden="true"
            >
              <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full border border-sand bg-white/75">
                <Utensils className="h-14 w-14 rotate-[-15deg] stroke-[1.3] text-primary" />
              </div>
              <span className="absolute bottom-12 left-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-honey text-cocoa">
                <Star className="h-6 w-6 fill-current" />
              </span>
            </div>
          </section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Un aperçu de votre carnet
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explorez ces restaurants d&apos;exemple. Votre carnet vous
                attend.
              </p>
            </div>
            <span className="rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
              Aperçu interactif
            </span>
          </div>
          <CollectionStats restaurants={restaurants} />
          <RestaurantList
            restaurants={restaurants}
            categories={categories}
            preview
          />
        </main>
      </div>
    </div>
  );
}
