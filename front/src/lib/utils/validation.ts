import { z } from "zod";

export const emailSchema = z.string().email("L'adresse email n'est pas valide");

export const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

export const usernameSchema = z
  .string()
  .min(4, "Le nom d'utilisateur doit contenir au moins 4 caractères")
  .max(30, "Le nom d'utilisateur ne peut pas dépasser 30 caractères")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores"
  );

export const validateEmail = (email: string) => {
  const result = emailSchema.safeParse(email);
  return {
    success: result.success,
    error: result.success ? null : result.error.message,
  };
};

export const validatePassword = (password: string) => {
  const result = passwordSchema.safeParse(password);
  return {
    success: result.success,
    error: result.success ? null : result.error.message,
  };
};

export const validateUsername = (username: string) => {
  const result = usernameSchema.safeParse(username);
  return {
    success: result.success,
    error: result.success ? null : result.error.message,
  };
};

export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: usernameSchema,
  birthDate: z.date().max(new Date(), "La date ne peut pas être dans le futur"),
});

export type UserSchema = z.infer<typeof userSchema>;
