#!/usr/bin/env node

/**
 * sync-secrets.js - Sync secrets from .dev.vars to Cloudflare Workers
 * Usage: node scripts/sync-secrets.js or pnpm run sync-secrets
 */

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// Colors for console output
const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
};

const log = {
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.yellow}🔐 ${msg}${colors.reset}`),
};

async function main() {
    log.info("Syncing secrets from .dev.vars to Cloudflare Workers...");

    // Check if .dev.vars exists
    const devVarsPath = path.join(process.cwd(), ".dev.vars");
    if (!fs.existsSync(devVarsPath)) {
        log.error("Error: .dev.vars file not found!");
        console.log("Please create .dev.vars file with your secrets first.");
        process.exit(1);
    }

    // Check if wrangler is available
    try {
        execSync("wrangler --version", { stdio: "ignore" });
    } catch (error) {
        log.error("Error: wrangler CLI not found!");
        console.log("Please install wrangler: npm install -g wrangler");
        process.exit(1);
    }

    // Read .dev.vars file
    const envContent = fs.readFileSync(devVarsPath, "utf8");

    // Parse environment variables
    const envVars = {};
    envContent.split("\n").forEach((line) => {
        line = line.trim();
        if (line && !line.startsWith("#")) {
            const [key, ...valueParts] = line.split("=");
            if (key && valueParts.length > 0) {
                let value = valueParts.join("=").trim();
                // Remove quotes if present
                value = value.replace(/^["'](.*)["']$/, "$1");
                envVars[key] = value;
            }
        }
    });

    // List of secrets to sync (includes some configuration that needs to be in Workers env)
    const secrets = [
        "BETTER_AUTH_SECRET", // Secret: Better Auth JWT secret
        "GOOGLE_CLIENT_ID", // Secret: Google OAuth client ID
        "GOOGLE_CLIENT_SECRET", // Secret: Google OAuth client secret
        "CLOUDFLARE_R2_URL", // Config: R2 bucket URL (not secret but needs to be in env)
    ];

    console.log("\n📋 Found secrets to sync:");

    // Check which secrets exist
    const missingSecrets = [];
    secrets.forEach((secret) => {
        if (envVars[secret]) {
            console.log(`  ${colors.green}✅ ${secret}${colors.reset}`);
        } else {
            console.log(`  ${colors.red}❌ ${secret} (missing)${colors.reset}`);
            missingSecrets.push(secret);
        }
    });

    // Exit if any secrets are missing
    if (missingSecrets.length > 0) {
        log.error("Missing required secrets in .dev.vars:");
        missingSecrets.forEach((secret) => console.log(`  - ${secret}`));
        console.log(
            "\nPlease add all required secrets to .dev.vars before running this script.",
        );
        process.exit(1);
    }

    console.log(
        `\n${colors.yellow}🚀 Uploading secrets to Cloudflare Workers...${colors.reset}`,
    );

    // Get worker names from command line args or use defaults
    const workers = process.argv.includes("--preview-only")
        ? ["next-cf-app-preview"]
        : process.argv.includes("--production-only")
          ? ["next-cf-app"]
          : ["next-cf-app", "next-cf-app-preview"];

    console.log(`\n📋 Syncing to workers: ${workers.join(", ")}`);

    // Upload each secret to each worker
    for (const worker of workers) {
        console.log(
            `\n🎯 Uploading secrets to: ${colors.yellow}${worker}${colors.reset}`,
        );

        for (const secret of secrets) {
            const value = envVars[secret];
            process.stdout.write(`  Uploading ${secret}... `);

            try {
                execSync(
                    `echo "${value}" | wrangler secret put ${secret} --name ${worker}`,
                    {
                        stdio: ["pipe", "ignore", "ignore"],
                    },
                );
                console.log(`${colors.green}✅${colors.reset}`);
            } catch (error) {
                console.log(`${colors.red}❌${colors.reset}`);
                log.error(`Failed to upload ${secret} to ${worker}`);
                process.exit(1);
            }
        }
    }

    log.success("All secrets successfully synced to Cloudflare Workers!");
    console.log(
        `\n${colors.yellow}📝 Note: Secrets are now available in your deployed Workers.${colors.reset}`,
    );
    console.log(
        `You can verify with: ${colors.yellow}wrangler secret list${colors.reset}`,
    );
}

main().catch((error) => {
    log.error(`Script failed: ${error.message}`);
    process.exit(1);
});
