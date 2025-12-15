/** biome-ignore-all lint/style/noNonNullAssertion: Ignore for this file */

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .dev.vars for drizzle studio
config({ path: ".dev.vars" });

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/drizzle",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: "a1d231c7-b7e7-4e7a-aa0e-78a56c2e123a",
        token: process.env.CLOUDFLARE_D1_TOKEN!,
    },
});
