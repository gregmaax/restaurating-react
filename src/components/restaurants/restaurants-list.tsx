"use client";

import Link from "next/link";
import {
  CalendarIcon,
  TrashIcon,
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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  categoryId: string;
  userId: string;
  rating: number;
  location: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Joe's Diner",
    description: "Classic American cuisine in a cozy setting",
    createdAt: new Date("2023-01-15"),
    categoryId: "american",
    userId: "user1",
    rating: 4.5,
    location: "Toulouse",
  },
  {
    id: "2",
    name: "Sushi Paradise",
    description: "Fresh sushi and Japanese delicacies",
    createdAt: new Date("2023-02-20"),
    categoryId: "japanese",
    userId: "user2",
    rating: 4.0,
    location: "Lyon",
  },
  {
    id: "3",
    name: "Mama Mia Pizzeria",
    description: "Authentic Italian pizzas and pasta",
    createdAt: new Date("2023-03-10"),
    categoryId: "italian",
    userId: "user3",
    rating: 3.5,
    location: "Barcelona",
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div
      className="flex items-center"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-3 w-3 fill-primary text-primary" />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-3 w-3 fill-primary text-primary" />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-3 w-3 text-muted-foreground" />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default function RestaurantList() {
  const handleDelete = (id: string) => {
    console.log(`Delete restaurant with id: ${id}`);
    // In a real application, you would implement the actual delete logic here
  };

  const handleEdit = (id: string) => {
    console.log(`Edit restaurant with id: ${id}`);
    // In a real application, you would implement the actual edit logic here
  };

  return (
    <div className="grid gap-4 p-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {mockRestaurants.map((restaurant) => (
        <Card
          key={restaurant.id}
          className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
        >
          <CardHeader className="space-y-2 p-4 pb-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPinIcon className="mr-1 h-3 w-3" />
              <span className="truncate">{restaurant.location}</span>
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
                <Link href={`/restaurants/${restaurant.id}`}>View</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4 pb-2 pt-0">
            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
              {restaurant.description}
            </p>
            <StarRating rating={restaurant.rating} />
          </CardContent>
          <CardFooter className="flex items-center justify-between p-2 pt-0">
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>Added on {restaurant.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(restaurant.id)}
                aria-label={`Edit ${restaurant.name}`}
                className="h-7 px-2"
              >
                <PencilIcon className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(restaurant.id)}
                aria-label={`Delete ${restaurant.name}`}
                className="h-7 px-2"
              >
                <TrashIcon className="h-3 w-3" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
