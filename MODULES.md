# Module System Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-08

---

## Overview

This project uses a **feature-based module architecture** where each feature is self-contained within its own module directory. This makes it easy to:

- **Add new features** by copying the module pattern
- **Remove unwanted features** by deleting the module folder
- **Reuse features** across different projects
- **Maintain code** with clear separation of concerns

**Architecture Pattern:** Similar to T3 Stack, Next.js Boilerplate, and other production Next.js applications.

---

## Module Structure

```
src/modules/
├── auth/           ← Required (authentication & user management)
├── dashboard/      ← Required (protected page layout)
└── todos/          ← Optional (example CRUD feature)
```

Each module follows this internal structure:

```
module-name/
├── actions/        ← Server actions (mutations, queries)
├── components/     ← React components
├── models/         ← Database queries (if needed)
├── schemas/        ← Zod validation schemas
├── utils/          ← Helper functions (if needed)
├── hooks/          ← Custom React hooks (if needed)
├── [name].page.tsx ← Page component (if needed)
├── [name].layout.tsx ← Layout component (if needed)
└── [name].route.ts ← Route configuration (if needed)
```

---

## Available Modules

### ✅ Required Modules

#### 1. **auth** - Authentication & User Management

**Purpose:** Handles user authentication, session management, and authorization.

**Dependencies:**
- better-auth (authentication library)
- Cloudflare D1 (user/session storage)

**Database Tables:**
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts
- `verification` - Email verification tokens

**Key Files:**
- `src/modules/auth/schemas/auth.schema.ts` - Database schemas
- `src/modules/auth/actions/auth.action.ts` - Login/signup actions
- `src/modules/auth/utils/auth-client.ts` - Better-auth client
- `src/modules/auth/components/login-form.tsx` - Login UI
- `src/modules/auth/components/signup-form.tsx` - Signup UI

**Routes:**
- `/login` - Login page
- `/signup` - Signup page
- `/api/auth/*` - Better-auth API routes

**Can be removed?** ❌ No - Required for user authentication

**Alternative:** Replace with different auth (Clerk, Auth.js, custom JWT)

---

#### 2. **dashboard** - Protected Page Layout

**Purpose:** Main layout for authenticated users.

**Dependencies:**
- auth module (for session checking)

**Database Tables:** None

**Key Files:**
- `src/modules/dashboard/dashboard.layout.tsx` - Main layout
- `src/modules/dashboard/dashboard.page.tsx` - Dashboard home
- `src/modules/dashboard/dashboard.route.ts` - Route config

**Routes:**
- `/dashboard` - Main dashboard page

**Can be removed?** ⚠️ Only if you create alternative protected layout

---

### 📦 Optional Modules

#### 3. **todos** - Todo CRUD Example

**Purpose:** Example feature demonstrating full CRUD operations with categories.

**Dependencies:**
- auth module (for user context)
- Cloudflare D1 (data storage)

**Database Tables:**
- `todos` - Todo items
- `categories` - Todo categories

**Key Files:**
- `src/modules/todos/schemas/todo.schema.ts` - Todo database schema
- `src/modules/todos/schemas/category.schema.ts` - Category schema
- `src/modules/todos/actions/get-todos.action.ts` - Fetch todos
- `src/modules/todos/actions/create-todo.action.ts` - Create todo
- `src/modules/todos/actions/update-todo.action.ts` - Update todo
- `src/modules/todos/actions/delete-todo.action.ts` - Delete todo
- `src/modules/todos/actions/create-category.action.ts` - Create category
- `src/modules/todos/components/todo-card.tsx` - Todo display
- `src/modules/todos/components/todo-form.tsx` - Todo editor
- `src/modules/todos/components/add-category.tsx` - Category creator

**Routes:**
- `/dashboard/todos` - Todo list page
- `/dashboard/todos/new` - Create todo page
- `/dashboard/todos/[id]` - Edit todo page

**Can be removed?** ✅ Yes - This is an example feature

**How to remove:** See "Removing a Module" section below

---

## How to Remove a Module

### Example: Removing the Todos Module

**Step 1: Delete the module folder**
```bash
rm -rf src/modules/todos
```

**Step 2: Remove database schemas**

Edit `src/db/schema.ts`:
```typescript
// Before:
export { categories } from "@/modules/todos/schemas/category.schema";
export { todos } from "@/modules/todos/schemas/todo.schema";

// After: (remove the above lines)
```

**Step 3: Remove routes**

Delete or update files that reference the todos module:
- `src/app/dashboard/todos/` - Delete entire folder
- Any imports of todos components or actions

**Step 4: Generate new migration**

If you've already run migrations with the todos tables:
```bash
# Option A: Generate migration to drop tables
pnpm run db:generate:named "remove_todos"

# Then manually edit the migration to drop tables:
# DROP TABLE IF EXISTS todos;
# DROP TABLE IF EXISTS categories;

# Option B: Reset local database entirely
pnpm run db:reset:local
```

**Step 5: Test**
```bash
pnpm run dev
# Verify app works without the module
```

---

## How to Add a New Module

### Example: Adding an "Invoices" Module

**Step 1: Create module folder**
```bash
mkdir -p src/modules/invoices/{actions,components,models,schemas}
```

**Step 2: Create database schema**

Create `src/modules/invoices/schemas/invoice.schema.ts`:
```typescript
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const invoices = sqliteTable("invoices", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    amount: integer("amount").notNull(),
    status: text("status").notNull(), // 'draft', 'sent', 'paid'
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices);
export const selectInvoiceSchema = createSelectSchema(invoices);
```

**Step 3: Export schema**

Add to `src/db/schema.ts`:
```typescript
export { invoices } from "@/modules/invoices/schemas/invoice.schema";
```

**Step 4: Generate migration**
```bash
pnpm run db:generate:named "add_invoices"
pnpm run db:migrate:local
```

**Step 5: Create server actions**

Create `src/modules/invoices/actions/get-invoices.action.ts`:
```typescript
"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { auth } from "@/modules/auth/utils/auth-utils";
import { eq } from "drizzle-orm";

export async function getInvoices() {
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Unauthorized", data: null };
    }

    try {
        const userInvoices = await db
            .select()
            .from(invoices)
            .where(eq(invoices.userId, session.user.id));

        return { success: true, data: userInvoices, error: null };
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return { success: false, error: "Failed to fetch invoices", data: null };
    }
}
```

**Step 6: Create components**

Create `src/modules/invoices/components/invoice-list.tsx`:
```typescript
import { getInvoices } from "../actions/get-invoices.action";

export async function InvoiceList() {
    const { data: invoices, error } = await getInvoices();

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {invoices?.map((invoice) => (
                <div key={invoice.id}>
                    Invoice #{invoice.id} - ${invoice.amount / 100}
                </div>
            ))}
        </div>
    );
}
```

**Step 7: Create routes**

Create `src/app/dashboard/invoices/page.tsx`:
```typescript
import { InvoiceList } from "@/modules/invoices/components/invoice-list";

export default function InvoicesPage() {
    return (
        <div>
            <h1>Invoices</h1>
            <InvoiceList />
        </div>
    );
}
```

**Step 8: Test**
```bash
pnpm run dev
# Visit http://localhost:3000/dashboard/invoices
```

---

## Module Best Practices

### ✅ DO:

1. **Keep modules self-contained**
   - All module code stays in `/src/modules/[name]/`
   - Minimize dependencies on other modules (except auth)

2. **Follow consistent structure**
   - Use the same folder pattern: actions/, components/, schemas/, models/
   - Name files descriptively: `get-todos.action.ts`, `todo-card.tsx`

3. **Export schemas properly**
   - Add to `src/db/schema.ts` for Drizzle to detect
   - Use `createInsertSchema` and `createSelectSchema` for type safety

4. **Use Server Actions**
   - All mutations through Server Actions (not API routes)
   - Add `"use server"` directive at top of action files

5. **Validate with Zod**
   - Create schemas for all input data
   - Use `zodResolver` in forms

6. **Handle authentication**
   - Check `auth()` in all server actions
   - Return proper error responses for unauthorized access

### ❌ DON'T:

1. **Don't create circular dependencies**
   - Modules shouldn't depend on each other (except auth)
   - Extract shared logic to `/src/lib/` or `/src/services/`

2. **Don't bypass the module structure**
   - Keep all feature code in the module folder
   - Don't scatter components across multiple directories

3. **Don't skip database migrations**
   - Always generate migrations for schema changes
   - Test migrations locally before production

4. **Don't hardcode user IDs**
   - Always use `session.user.id` from `auth()`
   - Filter database queries by user ID

5. **Don't expose internal module details**
   - Export only what's needed
   - Keep implementation details private

---

## Module Dependencies

```
┌─────────────┐
│    auth     │  ← Required by all modules
└─────────────┘
       ↑
       │
┌──────┴──────┐
│  dashboard  │  ← Layout for protected pages
└─────────────┘
       ↑
       │
┌──────┴──────┐
│    todos    │  ← Example feature module
└─────────────┘
```

**Rule:** Modules can depend on `auth`, but not on each other.

If two modules need shared logic, extract it to:
- `/src/lib/` - Shared utilities
- `/src/services/` - Business logic services
- `/src/components/` - Shared UI components

---

## Database Integration

### Schema Location

Database schemas live in modules but are exported centrally:

```typescript
// src/modules/todos/schemas/todo.schema.ts
export const todos = sqliteTable("todos", { ... });

// src/db/schema.ts (central export)
export { todos } from "@/modules/todos/schemas/todo.schema";
```

This allows:
- ✅ Drizzle to generate migrations from all schemas
- ✅ Modules to import only what they need
- ✅ Type safety across the entire app

### Migration Workflow

**When adding a module with database tables:**
```bash
# 1. Create schema in module
# 2. Export from src/db/schema.ts
# 3. Generate migration
pnpm run db:generate:named "add_invoices_table"

# 4. Apply locally
pnpm run db:migrate:local

# 5. Verify
pnpm run db:inspect:local

# 6. Commit migration file
git add src/drizzle/*.sql
git commit -m "feat: add invoices table"
```

**When removing a module with database tables:**
```bash
# 1. Generate drop table migration
pnpm run db:generate:named "remove_invoices_table"

# 2. Manually edit migration to drop tables
# In src/drizzle/XXXX_remove_invoices_table.sql:
# DROP TABLE IF EXISTS invoices;

# 3. Apply locally
pnpm run db:migrate:local

# Or reset entirely:
pnpm run db:reset:local
```

---

## Type Safety

### Automatic Type Generation

Database types are automatically generated from schemas:

```typescript
// src/modules/todos/schemas/todo.schema.ts
export const insertTodoSchema = createInsertSchema(todos);
export const selectTodoSchema = createSelectSchema(todos);

// Usage in actions:
import { insertTodoSchema } from "../schemas/todo.schema";

export async function createTodo(data: z.infer<typeof insertTodoSchema>) {
    // Type-safe input
}
```

### Cloudflare Bindings

After any `wrangler.jsonc` changes:
```bash
pnpm run cf-typegen
```

This generates types for:
- D1 database bindings
- R2 bucket bindings
- KV namespace bindings
- Workers AI bindings

---

## Testing a Module

### Manual Testing Checklist

When creating a new module, test:

- [ ] **Server Actions work**
  - Can create/read/update/delete items
  - Authentication is enforced
  - Error handling works

- [ ] **UI renders correctly**
  - Components display data
  - Forms submit properly
  - Loading states work

- [ ] **Database integration**
  - Migrations applied successfully
  - Queries return expected data
  - User isolation works (users see only their data)

- [ ] **Type safety**
  - No TypeScript errors
  - Form validation works
  - Zod schemas validate input

### Example Test Flow (Invoices Module)

```bash
# 1. Start dev servers
pnpm run wrangler:dev  # Terminal 1
pnpm run dev           # Terminal 2

# 2. Login at http://localhost:3000
# 3. Navigate to /dashboard/invoices
# 4. Create an invoice
# 5. Verify it appears in the list
# 6. Edit the invoice
# 7. Delete the invoice

# 8. Check database
pnpm run db:studio:local
# Verify invoice was created/updated/deleted
```

---

## Reusing Modules Across Projects

### Option 1: Fork This Repository

**Best for:** Starting new projects from scratch

```bash
# 1. Fork this repo
git clone https://github.com/your-username/fullstack-next-cloudflare.git my-new-app
cd my-new-app

# 2. Remove unwanted modules (e.g., todos)
rm -rf src/modules/todos
# Edit src/db/schema.ts to remove todo exports
# Delete src/app/dashboard/todos/

# 3. Add your own modules
mkdir -p src/modules/invoices
# Follow "How to Add a New Module" guide

# 4. Build your app!
```

---

### Option 2: Copy Module to Existing Project

**Best for:** Adding a feature to an existing Next.js + Cloudflare app

```bash
# 1. Copy module folder
cp -r /path/to/this-repo/src/modules/todos /path/to/your-project/src/modules/

# 2. Copy schema
# From: src/modules/todos/schemas/*.schema.ts
# To: your-project/src/modules/todos/schemas/

# 3. Export schema in your src/db/schema.ts
export { todos } from "@/modules/todos/schemas/todo.schema";
export { categories } from "@/modules/todos/schemas/category.schema";

# 4. Generate migration
cd /path/to/your-project
pnpm run db:generate:named "add_todos"
pnpm run db:migrate:local

# 5. Copy routes
cp -r /path/to/this-repo/src/app/dashboard/todos /path/to/your-project/src/app/dashboard/

# 6. Test
pnpm run dev
```

---

## Common Issues & Solutions

### Issue: "Module not found" errors

**Cause:** TypeScript can't resolve module imports

**Solution:**
```bash
# Rebuild the app
rm -rf .next
pnpm run build:cf
```

---

### Issue: Database table doesn't exist

**Cause:** Migrations weren't applied

**Solution:**
```bash
# Check migration status
pnpm run db:inspect:local

# Apply migrations
pnpm run db:migrate:local

# If stuck, reset:
pnpm run db:reset:local
```

---

### Issue: "User is not authenticated" errors

**Cause:** Session not passed to server action

**Solution:**
- Ensure you're calling `auth()` in server actions
- Check that Better Auth is configured correctly
- Verify session cookies in DevTools

---

### Issue: Type errors after removing a module

**Cause:** Stale imports referencing deleted module

**Solution:**
```bash
# Search for remaining imports
grep -r "from.*todos" src/

# Remove all references to the deleted module
# Rebuild
pnpm run build:cf
```

---

## Architecture Comparison

### This Approach (Feature Modules)

```
✅ Simple to understand
✅ Easy to copy/paste modules
✅ Low maintenance overhead
✅ Works for small-medium apps
✅ No special tooling required
```

### Plugin System Approach

```
❌ 50-100+ hours to build
❌ High maintenance burden
❌ Overkill for most projects
✅ Good for CMSes or marketplaces
✅ Dynamic loading at runtime
```

**Recommendation:** Stick with feature modules unless you're building a CMS or marketplace platform.

---

## Examples from Other Projects

**Similar architecture in production:**

- **T3 Stack** - Feature-based modules, fork-and-customize
- **Next.js Boilerplate** - Module organization, delete what you don't need
- **Supermemory.ai** - This template's inspiration, modular Cloudflare stack

---

## Module Template

See `MODULE_TEMPLATE.md` for a complete step-by-step guide to creating a new module from scratch.

---

## Questions or Issues?

If you have questions about the module system or run into issues:

1. Check this guide for common solutions
2. Review the `todos` module as a reference implementation
3. See `MODULE_TEMPLATE.md` for detailed examples
4. Open an issue in the GitHub repository

---

**Happy building!** 🚀
