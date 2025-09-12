# Next.js 15 + Cloudflare Workers + D1 + Drizzle

A full-stack Next.js application with Cloudflare Workers, D1 database, and Drizzle ORM featuring a complete Todo API with CRUD operations.

## 🚀 Prerequisites

- Node.js 18+ installed
- A Cloudflare account
- Git installed
- pnpm (recommended) or npm/yarn

## 📋 Table of Contents

1. [Quick Start (Clone & Run)](#1-quick-start-clone--run)
2. [Environment Setup](#2-environment-setup)
3. [Database Setup](#3-database-setup)
4. [Development](#4-development)
5. [API Usage](#5-api-usage)
6. [Deployment](#6-deployment)
7. [Project Structure](#7-project-structure)
8. [Troubleshooting](#8-troubleshooting)
9. [Building from Scratch](#9-building-from-scratch)

## 1. Quick Start (Clone & Run)

### Clone the repository

```bash
# Clone the project
git clone <repository-url>
cd next-cf-app

# Install dependencies
pnpm install

# Quick start development (after setting up environment and database)
# Terminal 1: Start wrangler for local D1 database
pnpm run wrangler:dev

# Terminal 2: Start Next.js development server
pnpm dev
```

## 2. Environment Setup

### Get Cloudflare credentials & API Token

You'll need these from your Cloudflare account:

1. **Account ID**: Found in your Cloudflare dashboard (right sidebar)
2. **API Token**: 
   - Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Setup permissions for the following things
   
```bash
  Account - D1: Read
  Account - D1: Edit
  Account - Workers Agents Configuration: Edit
  Account - Workers Scripts: Edit
  Account - R2 Storage: Read
  Account - R2 Storage: Edit
  Zone - Zone: Read (only if using custom domains)
```

### Create environment file

Create `.dev.vars` in your project root:

```bash
# Copy the example file
cp .dev.vars.example .dev.vars

# Edit with your credentials
# CLOUDFLARE_ACCOUNT_ID=your-account-id-here
# CLOUDFLARE_D1_TOKEN=your-api-token-here
# CLOUDFLARE_R2_URL=your-r2-url-here
```

Or create `.dev.vars` manually:

```bash
# Load .env.development* files when running `wrangler dev`
NEXTJS_ENV=development

# Drizzle Kit credentials for D1
CLOUDFLARE_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_D1_TOKEN=your-api-token-here
```

## 3. Database Setup

### Option A: Use existing database (Recommended)

The project is pre-configured with a Cloudflare D1 database. The migrations are already generated, so you just need to apply them:

```bash
# Apply migrations to local development database
pnpm run db:migrate:local

# Verify the database was created
pnpm run db:inspect:local
```

### Option B: Create your own database

If you want to create your own D1 database:

```bash
# Create a new D1 database
wrangler d1 create your-app-name

# Update wrangler.jsonc with your database_id
# Update drizzle.config.ts with your database_id

# Generate and apply migrations
pnpm run db:generate
pnpm run db:migrate:local
```

Or if you want to custom name the migration file, you can do it with

```bash
pnpm run db:generate:named "migration_name" # e.g., add todo table
pnpm run db:migrate:local
```

## 4. Development

### Generate TypeScript types

```bash
# Generate Cloudflare environment types
pnpm run cf-typegen
```

### Start development server

For the best development experience with both Next.js HMR and local D1 database access, you need to run two commands:

**Step 1: Start Wrangler (for local D1 database)**
```bash
# In terminal 1: Start wrangler for local D1 database access
pnpm run wrangler:dev
```

**Step 2: Start Next.js development server**
```bash
# In terminal 2: Start Next.js with HMR
pnpm dev
```

This setup gives you:
- ✅ Next.js HMR (Hot Module Replacement) at `http://localhost:3000`
- ✅ Local D1 database access via Wrangler
- ✅ Fast development iteration

### Alternative development options

```bash
# Option 1: Cloudflare Workers runtime (single command, no HMR)
pnpm run dev:cf

# Option 2: Test with remote database
pnpm run dev:remote
```

**Development URLs:**
- Next.js with HMR: `http://localhost:3000` (recommended)
- Cloudflare Workers runtime: `http://localhost:8787`

## 5. API Usage

### Available Endpoints

The project includes a Todo API with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/[id]` | Get a specific todo |
| PUT | `/api/todos/[id]` | Update a todo |
| DELETE | `/api/todos/[id]` | Delete a todo |

**Note:** The PUT and DELETE endpoints for individual todos are implemented in `/api/todos/[id]/route.ts` using dynamic routes.

### Test the API

```bash
# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Drizzle", "description": "Master Drizzle ORM with D1"}'

# Get all todos
curl http://localhost:3000/api/todos

# Get specific todo
curl http://localhost:3000/api/todos/1

# Update a todo
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/todos/1
```

### Database Management

```bash
# View all tables
pnpm run db:inspect:local

# Query todos directly
wrangler d1 execute next-cf-app --local --command="SELECT * FROM todos;"

# Reset database (careful!)
pnpm run db:reset:local

# Open Drizzle Studio for dev database
pnpm run db:studio:local

# Open Drizzle Studio (database GUI) for Prod database
# Beware that you need to setup correct authentication so that Drizzle can have access to CF D1
pnpm run db:studio
```

## 6. Deployment

### Deploy to production

```bash
# First, apply migrations to production database
pnpm run db:migrate:prod

# Deploy the application
pnpm run deploy
```

Your app will be available at `https://next-cf-app.<your-subdomain>.workers.dev`

### Set up custom domain (optional)

1. Go to your Cloudflare dashboard
2. Navigate to Workers & Pages
3. Click on your worker
4. Go to Settings → Triggers
5. Add a custom domain

## 7. Project Structure

```
next-cf-app/
├── src/
│   ├── app/
│   │   ├── api/todos/          # Todo API routes
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   └── libs/
│       └── db/
│           ├── index.ts        # Database connection
│           └── schema.ts       # Database schema & types
├── drizzle/
│   └── migrations/             # Generated SQL migrations
├── public/                     # Static assets
├── drizzle.config.ts          # Drizzle configuration
├── wrangler.jsonc             # Cloudflare Workers config
├── package.json               # Dependencies & scripts
├── .dev.vars                  # Environment variables (local)
└── README.md                  # This file
```

## 8. Troubleshooting

### Common Issues and Solutions

**Issue**: `Property 'DB' does not exist on type 'CloudflareEnv'`
**Solution**: Run `pnpm run cf-typegen` to generate types

**Issue**: `No migrations to apply!` or migration errors
**Solution**: 
```bash
# Check if migrations exist
ls -la drizzle/migrations/
# If you see migration files, try applying them
pnpm run db:migrate:local
```

**Issue**: `Error: The entry-point file at ".open-next/worker.js" was not found`
**Solution**: Run `pnpm run build:cf` before running Cloudflare dev server

**Issue**: `sh: @opennextjs/cloudflare: No such file or directory`
**Solution**: Make sure you've installed dependencies with `pnpm install`. The scripts use `npx` to run the OpenNext Cloudflare adapter.

**Issue**: Drizzle Studio fails with `accountId: undefined` and `token: undefined`
**Solution**: Make sure your `.dev.vars` file exists with correct `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_D1_TOKEN` values. The drizzle config automatically loads these environment variables.

**Issue**: Database connection fails
**Solution**: 
1. Make sure `.dev.vars` file exists with correct credentials
2. Check that `wrangler.jsonc` has the correct database binding
3. Verify your Cloudflare API token has D1 permissions

**Issue**: API returns 500 errors
**Solution**: 
1. Check the browser console or terminal for error details
2. Ensure the database has been migrated: `pnpm run db:migrate:local`
3. Verify the todo table exists: `pnpm run db:inspect:local`

### Useful Commands

```bash
# View database schema
wrangler d1 execute next-cf-app --local --command="SELECT sql FROM sqlite_master WHERE type='table';"

# Check what tables exist
pnpm run db:inspect:local

# Reset local database (careful!)
pnpm run db:reset:local

# View migration status
wrangler d1 migrations list next-cf-app --local

# Open Drizzle Studio (database GUI)
pnpm run db:studio
```

## 9. Building from Scratch

If you want to understand how this project was built from scratch, here's the comprehensive guide:

### Create a new Next.js project with Cloudflare

```bash
# Create project using C3 (create-cloudflare CLI)
npm create cloudflare@latest my-nextjs-app

# Follow the prompts:
# ✅ What would you like to start with? → Framework Starter
# ✅ Which development framework would you like to use? → Next.js
# ✅ Do you want to use TypeScript? → Yes
# ✅ Do you want to deploy your application? → No (we'll do this later)

# Navigate to project directory
cd my-nextjs-app
```

### Install additional dependencies

```bash
# Install Drizzle ORM and related packages
pnpm install drizzle-orm zod drizzle-zod

# Install development dependencies
pnpm install -D drizzle-kit @types/node

# Update to latest OpenNext Cloudflare adapter
pnpm install -D @opennextjs/cloudflare@latest
```

### Create D1 Database

```bash
# Create a new D1 database
wrangler d1 create my-app-db

# Copy the database_id from the output and update your wrangler.jsonc
```

### Configure Drizzle and Database Schema

Create the database schema, connection utilities, and API routes as shown in the project structure. See the existing files in this repository for the complete implementation.

## 🎉 Congratulations!

You now have a fully functional Next.js application running on Cloudflare Workers with:

- ✅ Server-side rendering with Next.js 15
- ✅ Edge deployment on Cloudflare Workers
- ✅ SQLite database with D1
- ✅ Type-safe database operations with Drizzle ORM
- ✅ Input validation with Zod
- ✅ Complete Todo CRUD API
- ✅ Local development environment
- ✅ Production deployment pipeline

## 📚 Next Steps

- Add authentication with [Better Auth](https://better-auth.com) or [Auth.js](https://authjs.dev)
- Build a frontend UI to interact with the Todo API
- Set up file uploads with [Cloudflare R2](https://developers.cloudflare.com/r2/)
- Add real-time features with [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- Implement caching with [Cloudflare KV](https://developers.cloudflare.com/kv/)
- Set up monitoring with [Cloudflare Analytics](https://developers.cloudflare.com/analytics/)

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve this project!

---

**Happy coding! 🚀**