import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function getDb() {
    const { env } = await getCloudflareContext();
    // !starterconf - update this to match your D1 database binding name
    // change "next_cf_app" to your D1 database binding name on `wrangler.jsonc`
    return drizzle(env.next_cf_app, { schema });
}

export * from "./schema";
