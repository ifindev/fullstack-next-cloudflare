declare global {
    namespace CloudflareEnv {
        interface Env {
            CLOUDFLARE_R2_URL: string;
            CLOUDFLARE_ACCOUNT_ID: string;
            CLOUDFLARE_D1_TOKEN: string;
            next_cf_app_bucket: R2Bucket;
            next_cf_app: D1Database;
        }
    }
}

// Extend the existing CloudflareEnv interface
declare module "@opennextjs/cloudflare" {
    interface CloudflareEnv {
        CLOUDFLARE_R2_URL: string;
        CLOUDFLARE_ACCOUNT_ID: string;
        CLOUDFLARE_D1_TOKEN: string;
    }
}

export {};
