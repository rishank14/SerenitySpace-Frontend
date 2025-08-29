import { z } from "zod";

export const signUpSchema = z.object({
   email: z.string().trim().email("Invalid email address"),
   username: z
      .string()
      .trim()
      .min(3, "Username too short")
      .max(20, "Username too long"),
   password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
   identifier: z
      .string()
      .trim()
      .min(3, "Enter a valid email or username")
      .refine(
         (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || val.length >= 3,
         "Enter a valid email or username"
      ),
   password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
