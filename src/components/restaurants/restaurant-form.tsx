"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { z } from "zod";
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
import { Textarea } from "../ui/textarea";
import { RestaurantSchema } from "~/schemas";
import {
  createRestaurant,
  updateRestaurant,
} from "~/actions/restaurant-actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import FormError from "../form-error";
import { Restaurant } from "~/server/db/schema";

export default function RestaurantForm({
  onSuccess,
  categoryId,
  restaurant,
}: {
  onSuccess: (success: boolean) => void;
  categoryId: string;
  restaurant?: Restaurant;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const isUpdating = !!restaurant;

  //form definition
  const form = useForm<z.infer<typeof RestaurantSchema>>({
    resolver: zodResolver(RestaurantSchema),
    defaultValues: {
      id: restaurant?.id! ?? "",
      city: restaurant?.city ?? "",
      name: restaurant?.name ?? "",
      description: restaurant?.description! ?? "",
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
    console.log("Form submitted with values:", values); // Debug log
    setError("");
    setSuccess("");
    startTransition(async () => {
      const action = isUpdating ? updateRestaurant : createRestaurant;
      const actionName = isUpdating ? "modifié" : "ajouté";

      try {
        const result = await action(values);
        console.log("Action result:", result); // Debug log
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
        } else if (result.success) {
          setSuccess(result.success);
          toast.success(`Votre restaurant a bien été ${actionName} !`);
          sendSubmitSuccessUp();
        }
      } catch (err) {
        console.error("Error in form submission:", err); // Debug log
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    });
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>
                  Entrez le nom de votre restaurant.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Entrez une description..."
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
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) =>
                      field.onChange(parseInt(value, 10))
                    }
                    value={field.value?.toString()}
                    className="flex space-x-2"
                    disabled={isPending}
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <FormItem key={rating}>
                        <FormControl>
                          <RadioGroupItem
                            value={rating.toString()}
                            className="sr-only"
                            id={`rating-${rating}`}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`rating-${rating}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-sm border ${
                            field.value === rating
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-background hover:bg-muted/80"
                          } cursor-pointer transition-colors`}
                        >
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
          <FormError message={error} />
          <Button type="submit" disabled={isPending}>
            {!isUpdating ? "Enregistrer" : "Modifier"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
