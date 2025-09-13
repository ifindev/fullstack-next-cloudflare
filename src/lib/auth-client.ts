import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createAuthClient } from "better-auth/react";

export const authClient = async () => {
    const { env } = await getCloudflareContext();
    return createAuthClient({
        baseURL: env.BETTER_AUTH_URL,
    });
};
