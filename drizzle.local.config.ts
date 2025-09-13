import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./drizzle/migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: "file:./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/be1c14135daa5434f0307e4141c5ae761791f49828a594a2ee437ac594cdd108.sqlite",
    },
});
