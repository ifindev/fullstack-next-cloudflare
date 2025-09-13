"use server";

import { auth } from "@/lib/auth";
import {
    type AuthResponse,
    type SignInSchema,
    type SignUpSchema,
    signInSchema,
    signUpSchema,
} from "@/lib/validations/auth.validation";

// Re-export schemas for convenience
export { signInSchema, signUpSchema };

// #region SERVER ACTIONS

export const signIn = async ({
    email,
    password,
}: SignInSchema): Promise<AuthResponse> => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        return {
            success: true,
            message: "Signed in succesfully",
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            message: err.message || "An unknown error occured.",
        };
    }
};

export const signUp = async ({
    email,
    password,
    username,
}: SignUpSchema): Promise<AuthResponse> => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: username,
            },
        });

        return {
            success: true,
            message: "Signed up succesfully",
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            message: err.message || "An unknown error occured.",
        };
    }
};
// #endregion
