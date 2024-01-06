import { z } from "zod";

export const userSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, {
    message: "Please enter a password with at least 6 characters",
  }),
});

export type SignInRequest = z.infer<typeof userSchema>;
export type SignUpRequest = z.infer<typeof userSchema>;
