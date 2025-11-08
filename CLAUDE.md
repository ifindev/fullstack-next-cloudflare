# Claude Code Project Context

**Project:** fullstack-next-cloudflare-demo
**Type:** Modular starter kit / template
**Last Updated:** 2025-11-08

---

## Project Overview

### Tech Stack

**Frontend:**
- Next.js 15.4.6 (App Router, React Server Components)
- React 19.1.0
- TailwindCSS v4
- shadcn/ui (Radix UI components)
- React Hook Form + Zod validation

**Backend & Infrastructure:**
- Cloudflare Workers (via @opennextjs/cloudflare 1.11.1)
- Cloudflare D1 (SQLite at the edge)
- Cloudflare R2 (object storage)
- Cloudflare Workers AI (optional)
- better-auth 1.3.9 (authentication)
- Drizzle ORM (database toolkit)

**DevOps:**
- Wrangler 4.46.0 (Cloudflare CLI)
- pnpm (package manager)
- GitHub Actions (CI/CD - if configured)

### Project Status

This is a **production-ready modular starter kit** that can be forked and customized for new applications.

**Current features:**
- ✅ Authentication (better-auth with Google OAuth)
- ✅ Database (D1 with Drizzle ORM)
- ✅ Example CRUD module (todos with categories)
- ✅ Dark/light mode theming
- ✅ Modular architecture (see MODULES.md)

**Intentionally missing:**
- ❌ Automated tests (manual testing only)
- ❌ Payment integration
- ❌ Email sending
- ❌ Advanced AI features (example exists, not production-ready)

---

## Development Workflow

### Starting Development

**Two-terminal setup (recommended):**

```bash
# Terminal 1: Start Wrangler (provides D1 database access)
pnpm run wrangler:dev

# Terminal 2: Start Next.js (provides hot module reload)
pnpm run dev
```

**Access points:**
- **Next.js app:** http://localhost:3000 (use this for development)
- **Wrangler dev:** http://localhost:8787 (Cloudflare runtime, no HMR)

**Alternative (single terminal, no HMR):**
```bash
pnpm run dev:cf
```

### Why Two Terminals?

- **Wrangler** provides local D1 database access and Cloudflare bindings
- **Next.js dev** provides fast refresh and better DX
- They run on different ports but share the local D1 instance

### Environment Setup

**Required files:**
- `.dev.vars` - Local development secrets (gitignored)
- `wrangler.jsonc` - Cloudflare configuration

**Key environment variables:**
```bash
# .dev.vars
CLOUDFLARE_ACCOUNT_ID=your-account-id
BETTER_AUTH_SECRET=your-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDFLARE_R2_URL=https://pub-xxxxx.r2.dev
```

Generate auth secret:
```bash
openssl rand -base64 32
```

---

## Build & Deploy

### Local Build

```bash
# Build for Cloudflare Workers
pnpm run build:cf

# This runs: @opennextjs/cloudflare build
# Output: .worker-next/ directory
```

**Verify build succeeded:**
1. Check for `.worker-next/` directory
2. No TypeScript errors in output
3. No build warnings about missing bindings

### Deployment

**Preview deployment (test before production):**
```bash
pnpm run deploy:preview

# Uses wrangler.jsonc [env.preview] config
```

**Production deployment:**
```bash
pnpm run deploy

# Uses wrangler.jsonc main config
```

### Post-Deployment Checks

1. **Visit deployed URL** - Check app loads
2. **Test authentication** - Login with Google OAuth
3. **Test CRUD operations** - Create/edit/delete a todo
4. **Check database** - Verify data persists
5. **Check categories** - Verify category colors work

**Common deployment issues:**
- Missing environment variables (check Wrangler secrets)
- Database migrations not applied (run `db:migrate:prod`)
- OAuth redirect URI mismatch (update Google OAuth settings)

---

## Testing Strategy

**Current approach:** Manual testing (no automated test suite)

### Manual Testing Checklist

**Basic smoke test (5 minutes):**
- [ ] App loads at http://localhost:3000
- [ ] No console errors
- [ ] Dark/light theme toggle works
- [ ] Login redirects to Google OAuth
- [ ] After login, redirects to dashboard
- [ ] Can create a new todo
- [ ] Can edit a todo
- [ ] Can delete a todo (with confirmation dialog)
- [ ] Can create a category
- [ ] Category color picker works
- [ ] Can assign category to todo
- [ ] Category color displays on todo card
- [ ] Logout works

**Database verification:**
```bash
# Open Drizzle Studio
pnpm run db:studio:local

# Check tables exist:
# - user
# - session
# - account
# - verification
# - todos
# - categories

# Verify data:
# - User record exists after login
# - Todos show correct userId
# - Categories show correct userId and color
```

**Build verification:**
```bash
# 1. Clean build
rm -rf .next .worker-next

# 2. Build for Cloudflare
pnpm run build:cf

# 3. Check for errors
# - No TypeScript errors
# - No "module not found" errors
# - No warnings about missing bindings

# 4. Check output
ls -la .worker-next/
# Should contain worker bundle
```

### Testing New Features

When adding a new feature module (see MODULE_TEMPLATE.md):

1. **Create feature** (e.g., invoices module)
2. **Start dev servers** (wrangler + next)
3. **Test CRUD operations:**
   - Create item
   - View list
   - Edit item
   - Delete item
4. **Verify database:**
   - Check Drizzle Studio
   - Confirm user isolation (create second user, verify they only see their data)
5. **Test error handling:**
   - Submit invalid form data
   - Verify Zod validation works
   - Check error messages display
6. **Build and deploy to preview:**
   - `pnpm run deploy:preview`
   - Test on live preview URL

---

## Database Workflow

### Schema Structure

**Location:** `src/db/schema.ts`

Schemas are defined in modules but exported centrally:

```typescript
// Module schema: src/modules/todos/schemas/todo.schema.ts
export const todos = sqliteTable("todos", { ... });

// Central export: src/db/schema.ts
export { todos } from "@/modules/todos/schemas/todo.schema";
```

**Why?** Allows Drizzle to generate migrations from all schemas while keeping modules self-contained.

### Creating Migrations

**When to create a migration:**
- Adding a new module with database tables
- Modifying existing table schema
- Adding/removing columns
- Changing column types

**Steps:**

```bash
# 1. Modify schema file in src/modules/[module]/schemas/

# 2. Generate migration with descriptive name
pnpm run db:generate:named "add_invoices_table"

# 3. Review generated migration in src/drizzle/
# - Check SQL is correct
# - Verify no unintended changes

# 4. Apply to local database
pnpm run db:migrate:local

# 5. Verify in Drizzle Studio
pnpm run db:studio:local

# 6. Test your feature with the new schema

# 7. Commit migration file
git add src/drizzle/XXXX_add_invoices_table.sql
git commit -m "feat: add invoices table migration"
```

### Migration Commands

```bash
# Local (development)
pnpm run db:migrate:local

# Preview (test environment)
pnpm run db:migrate:preview

# Production (live)
pnpm run db:migrate:prod

# Inspect tables
pnpm run db:inspect:local
pnpm run db:inspect:preview
pnpm run db:inspect:prod

# Open Drizzle Studio
pnpm run db:studio:local
pnpm run db:studio  # For remote DB
```

### Database Reset (Local Only)

**Warning:** This deletes all local data!

```bash
# Reset local database (drops all tables and reapplies migrations)
pnpm run db:reset:local

# Or manually:
rm -rf .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite*
pnpm run db:migrate:local
```

---

## Architecture Decisions

### Why Modular Architecture?

**Decision:** Feature-based modules (`src/modules/auth`, `src/modules/todos`, etc.)

**Reasons:**
- ✅ Easy to remove unwanted features when forking
- ✅ Clear separation of concerns
- ✅ Self-contained and reusable
- ✅ Industry standard (T3 Stack, Next.js Boilerplate use same pattern)
- ✅ No plugin system overhead (50-100+ hours to build)

**See:** MODULES.md for complete guide

### Why better-auth?

**Alternatives considered:** Clerk, Auth.js, custom JWT

**Chosen:** better-auth 1.3.9

**Reasons:**
- ✅ TypeScript-first with excellent DX
- ✅ Works with D1 (many auth libs don't)
- ✅ Lightweight (no external services required)
- ✅ Session management built-in
- ✅ Social auth (Google OAuth) easy to configure
- ❌ **Blocker:** No Next.js 16 support yet (tracking issue #5263)

### Why Cloudflare Workers?

**Alternatives considered:** Vercel, Netlify, traditional servers

**Chosen:** Cloudflare Workers + @opennextjs/cloudflare

**Reasons:**
- ✅ Edge deployment (300+ locations globally)
- ✅ Generous free tier (perfect for MVPs)
- ✅ D1 database included (SQLite at edge)
- ✅ R2 storage (S3-compatible, no egress fees)
- ✅ Workers AI (on-demand ML inference)
- ✅ Scales automatically
- ✅ No cold starts (unlike Lambda)

**Trade-offs:**
- ❌ Not all npm packages work (no native modules)
- ❌ 10ms CPU limit (but restarts for new requests)
- ❌ Learning curve for Workers-specific patterns

### Module Dependencies

**Rule:** Modules can depend on `auth`, but NOT on each other.

```
auth (required)
  ↓
dashboard (required - layout)
  ↓
todos (optional - example feature)
```

**Why?**
- Prevents circular dependencies
- Makes modules truly reusable
- Simplifies reasoning about the codebase

**Shared logic goes in:**
- `/src/lib/` - Utilities
- `/src/services/` - Business logic
- `/src/components/` - Shared UI

---

## Known Issues & Gotchas

### 1. Radix UI Select Empty String Issue

**Problem:** Radix UI Select doesn't allow empty string values in SelectItems.

**Solution:** Use sentinel value like `"__any__"` instead of `""`.

```typescript
// ❌ Breaks:
<SelectItem value="">Any Category</SelectItem>

// ✅ Works:
<SelectItem value="__any__">Any Category</SelectItem>

// Then handle in logic:
const categoryId = value === "__any__" ? null : value;
```

**Location:** Fixed in `src/modules/todos/components/todo-form.tsx:96`

### 2. Two Terminal Requirement

**Problem:** Need both Wrangler and Next.js dev servers running.

**Why:**
- Wrangler provides D1 database access
- Next.js provides hot module reload
- They don't conflict (different ports)

**Solution:** Use two terminals or `pnpm run dev:cf` (no HMR).

### 3. D1 Local Database Persistence

**Location:** `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/`

**Gotcha:** Local database persists between restarts (good and bad).

**Good:** Don't lose data when restarting dev server.
**Bad:** Stale data can cause confusion.

**Reset if needed:**
```bash
rm -rf .wrangler/state
pnpm run db:migrate:local
```

### 4. Better-auth Session Cookies

**Cookie name:** `better-auth.session_token`

**Gotcha:** Must be logged in to test protected routes.

**Testing API routes with curl:**
1. Login in browser
2. DevTools → Application → Cookies → Copy session token
3. Use in curl: `-H "Cookie: better-auth.session_token=xxx"`

### 5. Cloudflare Account Selection

**Problem (after @opennextjs/cloudflare 1.11.1 upgrade):**

Wrangler dev may show account selection error if you have 100+ Cloudflare accounts.

**Solution:** Set `CLOUDFLARE_ACCOUNT_ID` in `.dev.vars` (already done).

### 6. Build Cache Stale Modules

**Problem:** After upgrading dependencies, old build cache can cause errors.

**Solution:**
```bash
rm -rf .next .worker-next
pnpm run build:cf
```

**When:** After any dependency upgrade or wrangler.jsonc changes.

### 7. Next.js 16 Upgrade Not Possible Yet

**Blockers:**
- better-auth: No Next.js 16 support (issue #5263)
- @opennextjs/cloudflare: Proxy system partially supported (issue #972)

**Timeline:** Reassess Q1 2026

**See:** docs/NEXTJS_16_UPGRADE.md for full research

---

## Common Commands Quick Reference

### Development

```bash
# Start dev (two terminals)
pnpm run wrangler:dev  # Terminal 1
pnpm run dev           # Terminal 2

# Start dev (single terminal, no HMR)
pnpm run dev:cf

# Start dev with remote Cloudflare resources
pnpm run dev:remote
```

### Database

```bash
# Generate migration
pnpm run db:generate:named "description"

# Apply migrations
pnpm run db:migrate:local    # Development
pnpm run db:migrate:preview  # Preview env
pnpm run db:migrate:prod     # Production

# Inspect database
pnpm run db:inspect:local
pnpm run db:studio:local

# Reset local database (WARNING: deletes data)
pnpm run db:reset:local
```

### Build & Deploy

```bash
# Build for Cloudflare
pnpm run build:cf

# Deploy to preview
pnpm run deploy:preview

# Deploy to production
pnpm run deploy

# Generate Cloudflare types (after wrangler.jsonc changes)
pnpm run cf-typegen
```

### Secrets Management

```bash
# Add secret to Cloudflare Workers
pnpm run cf:secret BETTER_AUTH_SECRET

# Or use wrangler directly:
echo "secret-value" | wrangler secret put SECRET_NAME
```

### Code Quality

```bash
# Format code with Biome
pnpm run lint
```

---

## File Structure Reference

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── api/               # API routes
│   │   └── dashboard/         # Protected pages
│   ├── components/            # Shared UI components
│   │   └── ui/                # shadcn/ui components
│   ├── db/                    # Database configuration
│   │   ├── index.ts          # DB connection
│   │   └── schema.ts         # Central schema exports
│   ├── modules/               # Feature modules (see MODULES.md)
│   │   ├── auth/             # Authentication (required)
│   │   ├── dashboard/        # Dashboard layout (required)
│   │   └── todos/            # Example CRUD (optional)
│   ├── lib/                   # Shared utilities
│   └── drizzle/              # Database migrations
├── docs/                      # Documentation
│   ├── API_ENDPOINTS.md
│   ├── DATABASE_SCHEMA.md
│   ├── IMPLEMENTATION_PHASES.md
│   └── NEXTJS_16_UPGRADE.md
├── MODULES.md                 # Module system guide
├── MODULE_TEMPLATE.md         # How to create modules
├── CLAUDE.md                  # This file
├── README.md                  # Project README
├── SESSION.md                 # Session state tracking
├── package.json               # Dependencies & scripts
├── wrangler.jsonc             # Cloudflare config
├── .dev.vars                  # Local secrets (gitignored)
└── .env.example               # Environment template
```

---

## When Context Clears

**If you're a fresh Claude Code session reading this:**

1. **Read this file first** - You're doing it!
2. **Check SESSION.md** - Understand current work state
3. **Review MODULES.md** - Understand architecture
4. **Check recent commits** - `git log --oneline -10`
5. **Check docs/** - Project-specific documentation
6. **Ask the user** - What are we working on today?

**Key commands to understand current state:**
```bash
git status              # What's changed
git log --oneline -5    # Recent work
git branch -a           # Available branches
ls -la docs/            # Available documentation
```

---

## Contributing to This Project

**Before making changes:**

1. **Read MODULES.md** - Understand module system
2. **Check existing patterns** - Follow established conventions
3. **Test manually** - Use checklist above
4. **Build before committing** - `pnpm run build:cf`
5. **Write descriptive commits** - Follow conventional commits

**Module changes:**
- Keep modules self-contained
- Update `src/db/schema.ts` if adding tables
- Generate migrations for schema changes
- Update MODULES.md if changing architecture

**Documentation changes:**
- Update this file if workflow changes
- Update README.md for user-facing changes
- Update MODULE_TEMPLATE.md if adding new patterns

---

## Resources

**Project Documentation:**
- [README.md](./README.md) - Setup and deployment
- [MODULES.md](./MODULES.md) - Module system guide
- [MODULE_TEMPLATE.md](./MODULE_TEMPLATE.md) - Create new modules
- [SESSION.md](./SESSION.md) - Current session state

**Technical Documentation:**
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [better-auth](https://www.better-auth.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind v4](https://tailwindcss.com/docs)

**Cloudflare Specific:**
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [R2 Storage](https://developers.cloudflare.com/r2/)
- [Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Last Updated:** 2025-11-08
**Maintainer:** Jez (jeremy@jezweb.net)
**Claude Code Version:** This file is optimized for Claude Code CLI
