"use server";

import type {
    AuthResponse,
    SignInSchema,
    SignUpSchema,
} from "@/modules/auth/models/auth.model";
import { getAuthInstance } from "@/modules/auth/utils/auth-utils";

// #region SERVER ACTIONS

export const signIn = async ({
    email,
    password,
}: SignInSchema): Promise<AuthResponse> => {
    try {
        const auth = await getAuthInstance();
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
        const auth = await getAuthInstance();
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
export const signOut = async (): Promise<AuthResponse> => {
    try {
        const auth = await getAuthInstance();
        await auth.api.signOut({
            headers: await import("next/headers").then((m) => m.headers()),
        });

        return {
            success: true,
            message: "Signed out successfully",
        };
    } catch (error) {
        const err = error as Error;
        return {
            success: false,
            message: err.message || "An unknown error occurred.",
        };
    }
};
// #endregion
