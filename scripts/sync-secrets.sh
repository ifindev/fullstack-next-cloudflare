#!/bin/bash

# sync-secrets.sh - Sync secrets from .dev.vars to Cloudflare Workers
# Usage: ./scripts/sync-secrets.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔐 Syncing secrets from .dev.vars to Cloudflare Workers...${NC}"

# Check if .dev.vars exists
if [ ! -f ".dev.vars" ]; then
    echo -e "${RED}❌ Error: .dev.vars file not found!${NC}"
    echo "Please create .dev.vars file with your secrets first."
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Error: wrangler CLI not found!${NC}"
    echo "Please install wrangler: npm install -g wrangler"
    exit 1
fi

# Function to extract value from .dev.vars
get_env_value() {
    local key=$1
    local value=$(grep "^${key}=" .dev.vars | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    echo "$value"
}

# List of secrets to sync
SECRETS=(
    "BETTER_AUTH_SECRET"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "CLOUDFLARE_R2_URL"
)

echo "📋 Found secrets to sync:"

# Check which secrets exist in .dev.vars
missing_secrets=()
for secret in "${SECRETS[@]}"; do
    value=$(get_env_value "$secret")
    if [ -z "$value" ]; then
        echo -e "  ${RED}❌ $secret (missing)${NC}"
        missing_secrets+=("$secret")
    else
        echo -e "  ${GREEN}✅ $secret${NC}"
    fi
done

# Exit if any secrets are missing
if [ ${#missing_secrets[@]} -ne 0 ]; then
    echo -e "\n${RED}❌ Missing required secrets in .dev.vars:${NC}"
    for secret in "${missing_secrets[@]}"; do
        echo "  - $secret"
    done
    echo -e "\nPlease add all required secrets to .dev.vars before running this script."
    exit 1
fi

echo -e "\n${YELLOW}🚀 Uploading secrets to Cloudflare Workers...${NC}"

# Upload each secret
for secret in "${SECRETS[@]}"; do
    value=$(get_env_value "$secret")
    echo -n "  Uploading $secret... "
    
    if echo "$value" | wrangler secret put "$secret" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
    else
        echo -e "${RED}❌${NC}"
        echo -e "${RED}Failed to upload $secret${NC}"
        exit 1
    fi
done

echo -e "\n${GREEN}🎉 All secrets successfully synced to Cloudflare Workers!${NC}"
echo -e "\n${YELLOW}📝 Note: Secrets are now available in your deployed Workers.${NC}"
echo -e "You can verify with: ${YELLOW}wrangler secret list${NC}"