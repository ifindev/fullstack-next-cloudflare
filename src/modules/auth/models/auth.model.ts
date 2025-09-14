import { z } from "zod";

export const signInSchema = z.object({
    email: z
        .email()
        .refine((email) => email !== "", { message: "Email is required" }),
    password: z
        .string()
        .min(8, { message: "Password should contain minimum 8 character(s)" }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = signInSchema.extend({
    username: z
        .string()
        .min(3, { message: "Username should contain minimum 3 character(s)" }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export type AuthResponse = {
    success: boolean;
    message: string;
};
