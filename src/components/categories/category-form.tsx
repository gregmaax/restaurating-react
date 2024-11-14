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
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { CategorySchema } from "~/schemas";
import { createCategory, updateCategory } from "~/actions/category-actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import FormError from "../form-error";
import { Category } from "~/server/db/schema";

export default function CategoryForm({
  onSuccess,
  category,
}: {
  onSuccess: (success: boolean) => void;
  category?: Category;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const isUpdating = !!category;

  //form definition
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      id: category?.id! ?? "",
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  //passing prop up to close the dialog
  function sendSubmitSuccessUp() {
    const success = true;
    onSuccess(success);
  }

  //what happens on submit
  function onSubmit(values: z.infer<typeof CategorySchema>) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const action = isUpdating ? updateCategory : createCategory;
      const actionName = isUpdating ? "modifiée" : "ajoutée";

      try {
        const result = await action(values);
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
        } else if (result.success) {
          setSuccess(result.success);
          toast.success(`Votre catégorie a bien été ${actionName} !`);
          sendSubmitSuccessUp();
        }
      } catch (err) {
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
          <FormError message={error} />
          <Button type="submit" disabled={isPending} variant="custom_primary">
            {!isUpdating ? "Enregistrer" : "Modifier"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
