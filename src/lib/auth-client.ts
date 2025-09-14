import { createAuthClient } from "better-auth/react";

// Create the auth client for client-side usage
// The baseURL will be automatically determined from the current origin
export const authClient = createAuthClient({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : typeof window !== "undefined"
              ? window.location.origin
              : "",
});
