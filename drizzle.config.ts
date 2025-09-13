/** biome-ignore-all lint/style/noNonNullAssertion: Ignore for this file */

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .dev.vars for drizzle studio
config({ path: ".dev.vars" });

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./drizzle/migrations",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: "757a32d1-5779-4f09-bcf3-b268013395d4",
        token: process.env.CLOUDFLARE_D1_TOKEN!,
    },
});
