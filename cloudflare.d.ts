declare module "@opennextjs/cloudflare" {
    interface CloudflareEnv {
        CLOUDFLARE_ACCOUNT_ID: string;
        CLOUDFLARE_D1_TOKEN: string;
        CLOUDFLARE_R2_URL: string;
        next_cf_app_bucket: R2Bucket;
        next_cf_app: D1Database;
        ASSETS: Fetcher;
    }
}

export {};
