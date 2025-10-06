import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
};

// Only run during `next dev`, not during `next build`
if (process.argv.includes("dev") || process.env.NODE_ENV === "development") {
    import("@opennextjs/cloudflare").then(
        ({ initOpenNextCloudflareForDev }) => {
            initOpenNextCloudflareForDev();
        },
    );
}

export default nextConfig;
