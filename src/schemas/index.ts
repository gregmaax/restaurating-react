import { z } from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Le nouveau mot de passe est requis",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Le mot de passe est requis",
      path: ["password"],
    },
  );

export const LoginSchema = z.object({
  email: z.string().email({ message: "Entrez un email valide." }),
  password: z.string().min(1, { message: "Un mot de passe est requis." }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Entrez un email valide." }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  name: z.string().min(1, { message: "Un nom d'utilisateur est requis." }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Entrez un email valide." }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "6 caractères minimum." }),
});

export const CategorySchema = z.object({
  id: z.string().optional(),
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

export const RestaurantSchema = z.object({
  id: z.string().optional(),
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
  city: z.string().min(1, { message: "La ville est requise" }),
  rating: z.number().int().min(1).max(5).optional(),
  categoryId: z.string(),
});
