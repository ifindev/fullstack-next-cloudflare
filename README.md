![Banner](banner.svg)

# ⚡ Full-Stack Next.js + Cloudflare Template

A production-ready template for building full-stack applications with Next.js 15 and Cloudflare's powerful edge infrastructure. Perfect for MVPs with generous free tiers and seamless scaling to enterprise-level applications.

**Inspired by the [Cloudflare SaaS Stack](https://github.com/supermemoryai/cloudflare-saas-stack)** - the same stack powering [Supermemory.ai](https://git.new/memory), which serves 20k+ users on just $5/month. This template modernizes that approach with Cloudflare Workers (vs Pages), includes comprehensive D1 and R2 examples, and provides a complete development workflow.

## 🎯 What You Get

- **⚡ Ultra-fast edge deployment** - 300+ locations worldwide with <100ms latency
- **💰 Generous free tiers** - Build MVPs without upfront costs
- **🔐 Complete authentication** - Google OAuth with Better Auth
- **🗃️ Edge database** - SQLite at the edge with Drizzle ORM
- **📦 Object storage** - S3-compatible R2 storage
- **🚀 Full DevOps pipeline** - GitHub Actions, preview deployments, automated migrations

### 🛠️ Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript + TailwindCSS 4 + Shadcn UI
- **Backend**: Cloudflare Workers + D1 Database + R2 Storage + Better Auth
- **DevOps**: Wrangler + GitHub Actions + Automated migrations

---

## 🚀 Quick Start

> **For experienced developers** - Get running in 5 minutes

### Prerequisites ✅
- [ ] [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
- [ ] Node.js 20+ and pnpm installed
- [ ] [Google OAuth app](https://console.cloud.google.com/) created

### Setup ⚡
```bash
# 1. Clone and install
git clone https://github.com/ifindev/fullstack-next-cloudflare.git
cd fullstack-next-cloudflare
pnpm install

# 2. Configure environment
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your Cloudflare Account ID, API token, and Google OAuth credentials

# 3. Setup database and secrets
pnpm run cf-typegen              # Generate Cloudflare types
pnpm run db:migrate:local        # Setup local database
pnpm run sync-secrets            # Sync secrets to Cloudflare Workers
pnpm run db:migrate:prod         # Setup production database

# 4. Start development
# Terminal 1:
pnpm run wrangler:dev
# Terminal 2:
pnpm dev
```

### Verify ✅
- [ ] App running at `http://localhost:3000`
- [ ] Google OAuth working
- [ ] Can create/edit todos
- [ ] Database visible in `pnpm run db:studio:local`

**Need help?** See [detailed setup guide](#-initial-project-setup) below.

---

## 📋 Prerequisites & Requirements

### Required Accounts
- [ ] **Cloudflare Account** - [Sign up for free](https://dash.cloudflare.com/sign-up)
  - Need: Account ID and API token with Workers + D1 permissions
- [ ] **Google Cloud Account** - [Console access](https://console.cloud.google.com/)
  - Need: OAuth 2.0 Client ID and Secret
- [ ] **GitHub Account** - For deployment automation (optional)

### Required Tools
- [ ] **Node.js 20+** - [Download](https://nodejs.org/)
- [ ] **pnpm** - `npm install -g pnpm`
- [ ] **Git** - For version control

### Tool Verification
```bash
# Verify installations
node --version    # Should be 20+
pnpm --version    # Should be 8+
git --version     # Any recent version
```

---

## 🔧 Initial Project Setup

Complete step-by-step setup guide with verification steps.

### Phase 1: Project & Environment Setup

#### Step 1: Clone and Install
```bash
# Clone the repository
git clone https://github.com/ifindev/fullstack-next-cloudflare.git
cd fullstack-next-cloudflare

# Install dependencies
pnpm install
```
**✅ Verify**: `node_modules` folder created and no errors shown.

#### Step 2: Create Cloudflare API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **My Profile** → **API Tokens**
2. Click **Create Token** → **Edit Cloudflare Workers** → **Use template**
3. **Add additional permissions**:
   - Account - D1:Edit
   - Account - D1:Read
   - Account - R2:Edit (optional, for storage)
4. Copy the generated token

# **📝 Note**: This token is used throughout the application for all Cloudflare operations - local development (Drizzle Studio), deployment (GitHub Actions), and CLI operations.

**✅ Verify**: Token starts with your account ID and contains proper permissions.

#### Step 3: Environment Configuration
```bash
# Copy environment template
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your credentials:
```bash
# Cloudflare Configuration (required)
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_API_TOKEN=your-api-token-here

# Authentication Secrets (required for Google OAuth)
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Storage (auto-configured, update if you have custom bucket)
CLOUDFLARE_R2_URL=https://your-account-id.r2.cloudflarestorage.com/next-cf-app
```

**Generate auth secret:**
```bash
openssl rand -base64 32
# Copy output to BETTER_AUTH_SECRET in .dev.vars
```

**✅ Verify**: All required environment variables have real values (no placeholders).

### Phase 2: Google OAuth Setup

#### Step 4: Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Choose **Web application**
5. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-worker-name.your-subdomain.workers.dev/api/auth/callback/google
   ```
6. Copy Client ID and Client Secret to `.dev.vars`

**✅ Verify**: Google OAuth credentials added to `.dev.vars` and URIs configured.

### Phase 3: Cloudflare Resources & Database

#### Step 5: Generate TypeScript Types
```bash
# Generate Cloudflare environment types
pnpm run cf-typegen
```
**✅ Verify**: `cloudflare-env.d.ts` file updated with your bindings.

#### Step 6: Database Setup
```bash
# Initialize local database
pnpm run db:migrate:local

# Verify database structure
pnpm run db:inspect:local
```
**✅ Verify**: Shows tables: `account`, `session`, `user`, `verification`, `todos`, `categories`.

#### Step 7: Deploy Secrets to Cloudflare
```bash
# Sync all secrets from .dev.vars to Workers (both prod and preview)
pnpm run sync-secrets

# Verify secrets were uploaded
wrangler secret list
```
**✅ Verify**: Shows `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLOUDFLARE_R2_URL`.

#### Step 8: Production Database Setup
```bash
# Setup production database
pnpm run db:migrate:prod

# Verify production database
pnpm run db:inspect:prod
```
**✅ Verify**: Production database has same tables as local.

### Phase 4: Development Environment

#### Step 9: Start Development Servers
```bash
# Terminal 1: Start Wrangler (D1 database access)
pnpm run wrangler:dev

# Terminal 2: Start Next.js (hot reload)
pnpm dev
```
**✅ Verify**: 
- Terminal 1: Shows "Ready on localhost:8787"
- Terminal 2: Shows "Ready on localhost:3000"

#### Step 10: Test Everything Works
1. Open `http://localhost:3000`
2. Click **Sign in with Google**
3. Complete OAuth flow
4. Create a todo item
5. Check database: `pnpm run db:studio:local`

**✅ Verify**: 
- [ ] App loads without errors
- [ ] Google OAuth completes successfully  
- [ ] Can create and edit todos
- [ ] Database shows user and todo records

> **🎉 Success!** Your development environment is ready. Skip to [Development Workflow](#-development-workflow).

---

## 💻 Development Workflow

Daily development patterns and common tasks.

### Daily Development Setup
```bash
# Terminal 1: Database access (keep running)
pnpm run wrangler:dev

# Terminal 2: Next.js with hot reload (keep running)  
pnpm dev
```
**Access**: App at `http://localhost:3000`, Database studio: `pnpm run db:studio:local`

### Making Database Changes
```bash
# 1. Modify schema files in src/modules/*/schemas/
# 2. Generate migration
pnpm run db:generate:named "add_new_feature"

# 3. Apply to local database
pnpm run db:migrate:local

# 4. Test your changes locally
# 5. Apply to production (after testing)
pnpm run db:migrate:prod
```

### Testing Different Environments
```bash
# Local development (recommended)
pnpm dev                    # Next.js with HMR
pnpm run wrangler:dev      # D1 access

# Cloudflare Workers runtime (for testing)
pnpm run dev:cf            # No HMR, but exact production environment

# Test with remote resources
pnpm run dev:remote        # Use production D1 and R2
```

### Code Quality
```bash
# Format and lint (run before commits)
pnpm run lint

# Regenerate types (after wrangler.jsonc changes)
pnpm run cf-typegen
```

---

## 🧪 Preview Deployment

Test your changes in a production-like environment before going live.

### Deploy to Preview
```bash
# Deploy to preview environment
pnpm run deploy:preview
```
**✅ Verify**: Deployment succeeds and returns preview URL.

### Essential Preview Testing
- [ ] **Authentication**: Test Google OAuth flow
- [ ] **Database**: Verify database queries work
- [ ] **Features**: Test all main app functionality
- [ ] **Performance**: Check loading times

### Preview Environment Secrets
Preview deployments use separate workers, ensure secrets are synced:
```bash
# Sync secrets to both production and preview
pnpm run sync-secrets

# Or sync to preview only
pnpm run sync-secrets:preview

# Verify preview worker has secrets
wrangler secret list --name your-app-name-preview
```

### Common Preview Issues
- **Authentication fails**: Check secrets synced with `pnpm run sync-secrets`
- **Database errors**: Verify migrations with `pnpm run db:migrate:prod` 
- **404 errors**: Ensure routes are properly configured

---

## 🚀 Production Deployment

Deploy your application to production.

### Pre-Deployment Checklist
- [ ] All tests passing locally
- [ ] Database migrations applied: `pnpm run db:migrate:prod`
- [ ] Secrets synced: `pnpm run sync-secrets`
- [ ] Google OAuth redirect URIs include production domain
- [ ] Preview deployment tested successfully

### Deploy to Production
```bash
# Deploy to production
pnpm run deploy
```

### Post-Deployment Verification
- [ ] Production URL accessible
- [ ] Google OAuth working
- [ ] Database connections successful
- [ ] All features working as expected

### Automatic Deployment (GitHub Actions)
Push to `main` branch triggers automatic deployment:
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

**Pipeline steps**: Install dependencies → Build → Apply migrations → Deploy → Verify

### Production Monitoring
```bash
# View database performance
wrangler d1 insights your-app-name --since 1h

# View application logs  
wrangler tail your-app-name

# View deployment status
wrangler deployments list
```

---

## 📚 Command Reference

Complete reference of all available commands.

### Core Development
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm dev` | Next.js development server with HMR | Daily development |
| `pnpm run wrangler:dev` | Wrangler dev server for D1 access | Daily development (Terminal 1) |
| `pnpm run dev:cf` | Cloudflare Workers runtime (no HMR) | Testing production environment |
| `pnpm run dev:remote` | Use remote D1/R2 resources | Testing with production data |
| `pnpm build` | Build for production | Local production testing |
| `pnpm start` | Serve production build locally | Local production testing |

### Database Operations
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm run db:generate` | Generate migration from schema changes | After modifying schemas |
| `pnpm run db:generate:named "name"` | Generate named migration | Descriptive migration names |
| `pnpm run db:migrate:local` | Apply migrations to local database | Local development |
| `pnpm run db:migrate:prod` | Apply migrations to production | Before deployment |
| `pnpm run db:studio:local` | Open Drizzle Studio for local DB | Visual database management |
| `pnpm run db:studio` | Open Drizzle Studio for production | Production database management |
| `pnpm run db:inspect:local` | List local database tables | Verify local schema |
| `pnpm run db:inspect:prod` | List production database tables | Verify production schema |
| `pnpm run db:reset:local` | Reset and reinitialize local database | Start fresh locally |

### Deployment & Secrets
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm run deploy` | Deploy to production | Production deployment |
| `pnpm run deploy:preview` | Deploy to preview environment | Preview testing |
| `pnpm run sync-secrets` | Sync secrets to all environments | Before any deployment |
| `pnpm run sync-secrets:prod` | Sync secrets to production only | Production-specific updates |
| `pnpm run sync-secrets:preview` | Sync secrets to preview only | Preview-specific updates |
| `pnpm run cf:secret NAME` | Manually add single secret | Individual secret updates |

### Development Tools
| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm run cf-typegen` | Generate Cloudflare TypeScript types | After wrangler.jsonc changes |
| `pnpm run lint` | Format and lint code | Before commits |
| `wrangler secret list` | List all secrets | Verify secret configuration |
| `wrangler whoami` | Check Cloudflare auth status | Verify authentication |

### Development Workflow Commands
```bash
# Complete first-time setup
pnpm run cf-typegen && pnpm run db:migrate:local && pnpm run sync-secrets && pnpm run db:migrate:prod

# Daily development startup
# Terminal 1: pnpm run wrangler:dev
# Terminal 2: pnpm dev

# After schema changes
pnpm run db:generate && pnpm run db:migrate:local && pnpm run db:migrate:prod

# Before deployment
pnpm run lint && pnpm run sync-secrets && pnpm run deploy:preview

# Production deployment
pnpm run deploy
```

---

## 🐛 Troubleshooting

Common issues and their solutions.

### Authentication Issues

**Problem**: "CLIENT_ID_AND_SECRET_REQUIRED" error
**Cause**: Google OAuth secrets not synced to Cloudflare Workers
**Solution**:
```bash
# Sync secrets to all environments
pnpm run sync-secrets

# Verify secrets exist
wrangler secret list
wrangler secret list --name your-app-name-preview
```

**Problem**: Google OAuth redirect URI mismatch
**Cause**: Google OAuth app not configured for your domain
**Solution**: Add redirect URIs in [Google Cloud Console](https://console.cloud.google.com/):
- `http://localhost:3000/api/auth/callback/google`
- `https://your-worker.your-account.workers.dev/api/auth/callback/google`

### Database Issues

**Problem**: "Table does not exist" errors
**Cause**: Database migrations not applied
**Solution**:
```bash
# Apply migrations to the affected environment
pnpm run db:migrate:local    # For local development
pnpm run db:migrate:prod     # For production/preview

# Verify tables exist
pnpm run db:inspect:local    # Check local
pnpm run db:inspect:prod     # Check production
```

**Problem**: Local D1 database not accessible
**Cause**: Wrangler dev server not running
**Solution**:
```bash
# Start Wrangler dev server (Terminal 1)
pnpm run wrangler:dev

# Keep running and start Next.js in another terminal
pnpm dev
```

### Deployment Issues

**Problem**: Preview/production deployment authentication fails
**Cause**: Secrets not synced to specific worker environment
**Solution**:
```bash
# Check which workers exist
wrangler secret list                                    # Main worker
wrangler secret list --name your-app-name-preview      # Preview worker

# Sync secrets to all environments
pnpm run sync-secrets
```

**Problem**: Build failures
**Cause**: TypeScript errors or missing dependencies
**Solution**:
```bash
# Regenerate Cloudflare types
pnpm run cf-typegen

# Check for TypeScript errors
pnpm run lint

# Verify all dependencies installed
pnpm install
```

### Development Issues

**Problem**: Hot reload not working
**Cause**: Using `pnpm run dev:cf` instead of `pnpm dev`
**Solution**: Use two terminals:
```bash
# Terminal 1: For D1 access
pnpm run wrangler:dev

# Terminal 2: For hot reload
pnpm dev
```

**Problem**: Environment variables not loading
**Cause**: `.dev.vars` file missing or malformed
**Solution**:
```bash
# Verify file exists and has correct format
cat .dev.vars

# Copy from template if missing
cp .dev.vars.example .dev.vars
```

### Getting Help

1. **Check logs**: `wrangler tail your-app-name`
2. **Verify setup**: Follow [verification steps](#verify-) in setup
3. **Check GitHub Issues**: [Project issues](https://github.com/ifindev/fullstack-next-cloudflare/issues)
4. **Cloudflare Docs**: [Workers documentation](https://developers.cloudflare.com/workers/)

---

## 🏗️ Project Architecture

Understanding the codebase structure for effective development.

### Module-Based Architecture
```
src/
├── app/                    # Next.js App Router (routes + global styles)
│   ├── (auth)/            # Auth-related pages  
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
├── components/             # Shared UI components
│   └── ui/                # Shadcn UI primitives
├── constants/             # App constants
├── db/                    # Database configuration
├── lib/                   # Shared utilities (auth, R2, utils)
├── modules/               # Feature modules (self-contained)
│   ├── auth/             # Authentication module
│   │   ├── actions/      # Server actions
│   │   ├── components/   # Auth components  
│   │   ├── schemas/      # Database schemas
│   │   └── utils/        # Auth utilities
│   ├── dashboard/        # Dashboard module
│   └── todos/            # Todo management module
│       ├── actions/      # Todo server actions
│       ├── components/   # Todo components
│       ├── schemas/      # Todo schemas
│       └── models/       # Type definitions
└── drizzle/              # Database migrations
```

### Key Architectural Patterns

**Module-Based Organization**: Each feature is self-contained with its own actions, components, schemas, and utilities.

**Server Actions Pattern**: All data mutations use Next.js Server Actions for type-safe server-side operations.

**Schema-First Design**: Database schemas defined with Drizzle ORM, exported from `src/db/schema.ts`.

**Cloudflare Integration**: 
- Database via D1 binding (`next_cf_app`)
- Storage via R2 binding (`next_cf_app_bucket`)
- Secrets via Cloudflare Workers environment

### Data Flow
1. **UI Components** → Server Actions → Database
2. **Authentication** → Better Auth + D1 storage
3. **File Storage** → R2 with signed URLs
4. **Type Safety** → End-to-end TypeScript from DB to UI

---

## 🔧 Advanced Configuration

Advanced setup options and customizations.

### Custom Domain Setup
1. **Cloudflare Dashboard** → **Workers & Pages** → Select your worker
2. **Settings** → **Triggers** → **Add Custom Domain**
3. Enter your domain (must be in your Cloudflare account)
4. **Update Google OAuth** redirect URIs to include custom domain

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
```

### R2 Storage Configuration
```bash
# Configure CORS for direct uploads
echo '[{
  "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}]' > cors.json

wrangler r2 bucket cors put your-bucket --file cors.json
```

### Performance Monitoring
Enable advanced analytics in `wrangler.jsonc`:
```jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  }
}
```

### Environment-Specific Configuration
Create environment-specific configurations:
```jsonc
// wrangler.jsonc
{
  "env": {
    "staging": {
      "name": "your-app-staging",
      "vars": { "ENVIRONMENT": "staging" }
    },
    "production": {
      "name": "your-app-production", 
      "vars": { "ENVIRONMENT": "production" }
    }
  }
}
```

---

## 📊 Performance & Monitoring

### Built-in Observability
- ✅ Cloudflare Analytics (enabled by default)
- ✅ Real User Monitoring (RUM)
- ✅ Error tracking and logging
- ✅ Performance metrics

### Database Monitoring
```bash
# Monitor database performance
wrangler d1 insights your-app-name --since 1h

# Export data for analysis
wrangler d1 export your-app-name --output backup.sql

# View metrics in Cloudflare Dashboard
# Navigate to Workers & Pages → D1 → your-database → Metrics
```

### Application Monitoring
```bash
# View real-time logs
wrangler tail your-app-name

# View deployment history
wrangler deployments list

# View worker analytics
# Cloudflare Dashboard → Workers & Pages → your-worker → Analytics
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

© 2025 Muhammad Arifin. All rights reserved.