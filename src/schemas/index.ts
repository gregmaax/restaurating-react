import { z } from "zod";

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
