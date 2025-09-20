import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function getDb() {
    const { env } = await getCloudflareContext();
    return drizzle(env.next_cf_app, { schema });
}

export * from "./schema";
