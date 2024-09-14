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
import { createRestaurant } from "~/actions/restaurant-actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import FormError from "../form-error";

export default function RestaurantForm({
  onSuccess,
  categoryId,
}: {
  onSuccess: (success: boolean) => void;
  categoryId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //form definition
  const form = useForm<z.infer<typeof RestaurantSchema>>({
    resolver: zodResolver(RestaurantSchema),
    defaultValues: {
      city: "",
      name: "",
      description: "",
      rating: undefined,
      categoryId: categoryId,
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
    setSuccess("");
    startTransition(async () => {
      await createRestaurant(values).then((data) => {
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        }
        if (data.success) {
          setSuccess(data.success);
          toast.success(data.success);
          sendSubmitSuccessUp();
        }
      });
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
                  Entrez le nom de votre catégorie.
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                            field.value === rating.toString()
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
            Enregistrer
          </Button>
        </form>
      </Form>
    </div>
  );
}
