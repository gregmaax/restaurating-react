import Link from "next/link";
import {
  CalendarIcon,
  Star,
  StarHalf,
  PencilIcon,
  MapPinIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Restaurant } from "~/server/db/schema";
import DeleteRestaurantDialog from "./delete-restaurant-dialog";

export default async function RestaurantList({
  restaurants,
}: {
  restaurants: Restaurant[];
}) {
  return (
    <div className="grid gap-4 p-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <Card
          key={restaurant.id}
          className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
        >
          <CardHeader className="space-y-2 p-4 pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex">
                <MapPinIcon className="mr-1 h-3 w-3" />
                <span className="truncate">{restaurant.city}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <CardTitle className="line-clamp-1 flex-grow text-lg">
                {restaurant.name}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="ml-2 h-7 flex-shrink-0 px-2 text-xs"
              >
                <Link href={`/restaurants/${restaurant.id}`} className="hidden">
                  View
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4 pb-2 pt-0">
            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {restaurant.description
                ? restaurant.description
                : "Aucune description ajoutée"}
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between px-4 py-2 pt-0">
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>Ajouté le {restaurant.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                aria-label={`Edit ${restaurant.id}`}
                className="h-7 px-2"
              >
                <PencilIcon className="h-3 w-3" />
              </Button>
              <DeleteRestaurantDialog
                restaurantId={restaurant.id}
                categoryId={restaurant.categoryId}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

interface StarRatingProps {
  rating: number;
}

function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div
      className="flex items-center"
      aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: fullStars }, (_, i) => (
        <Star key={`full-${i}`} className="h-3 w-3 fill-primary text-primary" />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-3 w-3 fill-primary text-primary" />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star key={`empty-${i}`} className="h-3 w-3 text-muted-foreground" />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
