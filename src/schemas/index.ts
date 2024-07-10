import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    })
    .max(30, {
      message: "Le nom doit contenir 30 caractères maximum.",
    }),
  description: z
    .string()
    .max(256, {
      message: "La description doit contenir 256 caractères maximum.",
    })
    .optional(),
});
