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
import { createCategory } from "~/actions/category-actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function CategoryForm({
  onSuccess,
}: {
  onSuccess: (success: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //form definition
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  //passing prop up to close the dialog
  function sendSubmitSuccessUp() {
    const success = true;
    onSuccess(success);
  }

  //what happens on submit
  function onSubmit(values: z.infer<typeof CategorySchema>) {
    // setError("");
    // setSuccess("");
    // startTransition(async () => {
    //   await createCategory(values).then((data) => {
    //     if (data.error) {
    //       setError(data.error);
    //       toast.error(data.error);
    //     }
    //     if (data.success) {
    //       setSuccess(data.success);
    //       toast.success(data.success);
    //       sendSubmitSuccessUp();
    //     }
    //   });
    // });
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
          <Button type="submit" disabled={isPending}>
            Enregistrer
          </Button>
        </form>
      </Form>
    </div>
  );
}
