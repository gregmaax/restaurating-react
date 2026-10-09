"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import type { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Star } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { RestaurantSchema } from "~/schemas";
import {
  createRestaurant,
  updateRestaurant,
} from "~/actions/restaurant-actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import FormError from "../form-error";
import type { Category, Restaurant } from "~/server/db/schema";
import { useRouter } from "next/navigation";

export default function RestaurantForm({
  onSuccess,
  categoryId,
  restaurant,
  categories,
}: {
  onSuccess: (success: boolean) => void;
  categoryId: string;
  restaurant?: Restaurant;
  categories?: Category[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  const isUpdating = !!restaurant;

  //form definition
  const form = useForm<z.infer<typeof RestaurantSchema>>({
    resolver: zodResolver(RestaurantSchema),
    defaultValues: {
      id: restaurant?.id ?? "",
      city: restaurant?.city ?? "",
      name: restaurant?.name ?? "",
      description: restaurant?.description ?? "",
      rating: restaurant?.rating ?? undefined,
      categoryId: restaurant?.categoryId ?? categoryId,
    },
  });

  //passing prop up to close the dialog
  function sendSubmitSuccessUp() {
    const success = true;
    onSuccess(success);
  }

  //what happens on submit
  function onSubmit(values: z.infer<typeof RestaurantSchema>) {
    setError("");
    startTransition(async () => {
      const action = isUpdating ? updateRestaurant : createRestaurant;
      const actionName = isUpdating ? "modifié" : "ajouté";

      try {
        const result = await action(values);
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
        } else if (result.success) {
          toast.success(`Votre restaurant a bien été ${actionName} !`);
          sendSubmitSuccessUp();
          if (result.redirectTo) router.replace(result.redirectTo);
        }
      } catch {
        setError("Erreur inattendue");
        toast.error("Erreur inattendue");
      }
    });
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) =>
              categories ? (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isPending}
                      className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    {isUpdating
                      ? "Déplacez ce restaurant vers une autre catégorie."
                      : "Choisissez où ranger ce restaurant."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              ) : (
                <input type="hidden" {...field} />
              )
            }
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Le nom de cette bonne table"
                  />
                </FormControl>
                <FormDescription>
                  Le nom qui vous permettra de le retrouver.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Paris, Lyon, Bordeaux…"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Votre souvenir{" "}
                  <span className="font-normal text-muted-foreground">
                    facultatif
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Le plat à reprendre, l’ambiance, la table près de la fenêtre…"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Votre note{" "}
                  <span className="font-normal text-muted-foreground">
                    facultative
                  </span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) =>
                      field.onChange(parseInt(value, 10))
                    }
                    value={field.value?.toString() ?? ""}
                    className="flex gap-2"
                    aria-label="Votre note sur 5"
                    disabled={isPending}
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating}>
                        <FormControl>
                          <RadioGroupItem
                            value={rating.toString()}
                            className="peer sr-only"
                            aria-label={`${rating} étoile${rating > 1 ? "s" : ""} sur 5`}
                            id={`rating-${rating}`}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`rating-${rating}`}
                          className={`flex h-12 w-12 items-center justify-center gap-1 rounded-lg border peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                            field.value === rating
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-background hover:bg-muted/80"
                          } cursor-pointer transition-colors`}
                        >
                          <Star className="h-3.5 w-3.5" aria-hidden="true" />
                          {rating}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("rating") != null && (
            <button
              type="button"
              disabled={isPending}
              className="text-xs text-muted-foreground underline underline-offset-4"
              onClick={() =>
                form.setValue("rating", undefined, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              Retirer la note
            </button>
          )}
          <FormError message={error} />
          <Button type="submit" disabled={isPending} variant="custom_primary">
            {isPending
              ? "Enregistrement…"
              : !isUpdating
                ? "Ajouter le restaurant"
                : "Enregistrer les modifications"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
