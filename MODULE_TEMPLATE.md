# Module Template Guide

**Version:** 1.0.0
**Purpose:** Step-by-step guide for creating a new feature module

---

## Overview

This guide walks you through creating a complete feature module from scratch using the established patterns in this project.

**Example:** We'll build an "Invoices" module to demonstrate all the concepts.

**Time estimate:** 30-60 minutes for your first module, 15-30 minutes once familiar

---

## Before You Start

**Prerequisites:**
- ✅ Project is set up and running locally
- ✅ You understand the basics of Next.js App Router
- ✅ You've reviewed the `todos` module as a reference
- ✅ Database migrations are working

**Recommended:** Review [MODULES.md](./MODULES.md) first for architecture overview.

---

## Step 1: Plan Your Module

### Define the Module

Before writing code, answer these questions:

**What is the feature?**
- Example: "Invoice management system"

**What data does it store?**
- Example: Invoice with amount, status, due date, customer info

**What actions can users take?**
- Example: Create invoice, view invoices, update invoice, delete invoice, send invoice

**Does it depend on other modules?**
- Almost always depends on: `auth` (for user context)
- Avoid depending on: other feature modules

**What routes does it need?**
- Example:
  - `/dashboard/invoices` - List all invoices
  - `/dashboard/invoices/new` - Create new invoice
  - `/dashboard/invoices/[id]` - View/edit invoice

---

## Step 2: Create Module Structure

### Create Folders

```bash
# Create the module directory structure
mkdir -p src/modules/invoices/{actions,components,models,schemas,utils}
```

**Result:**
```
src/modules/invoices/
├── actions/       ← Server actions (create, read, update, delete)
├── components/    ← React components
├── models/        ← Database query helpers (optional)
├── schemas/       ← Zod schemas and database tables
└── utils/         ← Helper functions (optional)
```

---

## Step 3: Define Database Schema

### Create Schema File

Create `src/modules/invoices/schemas/invoice.schema.ts`:

```typescript
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Invoice table schema
 */
export const invoices = sqliteTable("invoices", {
    // Primary key
    id: text("id").primaryKey(),

    // Foreign key to user
    userId: text("user_id").notNull(),

    // Invoice data
    invoiceNumber: text("invoice_number").notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email"),
    amount: integer("amount").notNull(), // Amount in cents
    status: text("status").notNull(), // 'draft', 'sent', 'paid', 'overdue'
    dueDate: text("due_date").notNull(),

    // Metadata
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
});

/**
 * Zod schemas for validation
 */
export const insertInvoiceSchema = createInsertSchema(invoices, {
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Invalid email").optional(),
    amount: z.number().positive("Amount must be positive"),
    status: z.enum(["draft", "sent", "paid", "overdue"]),
    dueDate: z.string().min(1, "Due date is required"),
});

export const selectInvoiceSchema = createSelectSchema(invoices);

/**
 * TypeScript types
 */
export type Invoice = z.infer<typeof selectInvoiceSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
```

**Key points:**
- Use `text()` for strings and IDs (D1 is SQLite)
- Use `integer()` for numbers (store money in cents to avoid floating point issues)
- Add `.notNull()` for required fields
- Create Zod schemas with `createInsertSchema` and `createSelectSchema`
- Add custom validation in Zod schema if needed

---

### Export Schema Centrally

Edit `src/db/schema.ts` and add:

```typescript
export { invoices } from "@/modules/invoices/schemas/invoice.schema";
```

**Full file should look like:**
```typescript
export {
    account,
    session,
    user,
    verification,
} from "@/modules/auth/schemas/auth.schema";
export { categories } from "@/modules/todos/schemas/category.schema";
export { todos } from "@/modules/todos/schemas/todo.schema";
export { invoices } from "@/modules/invoices/schemas/invoice.schema"; // ← Add this
```

---

### Generate and Apply Migration

```bash
# Generate migration from schema changes
pnpm run db:generate:named "add_invoices_table"

# Apply migration to local database
pnpm run db:migrate:local

# Verify table was created
pnpm run db:inspect:local
# Should show "invoices" in the table list
```

---

## Step 4: Create Server Actions

### Action 1: Get All Invoices

Create `src/modules/invoices/actions/get-invoices.action.ts`:

```typescript
"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { auth } from "@/modules/auth/utils/auth-utils";
import { desc, eq } from "drizzle-orm";

export async function getInvoices() {
    // 1. Check authentication
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Unauthorized", data: null };
    }

    try {
        // 2. Query database (filtered by user ID)
        const userInvoices = await db
            .select()
            .from(invoices)
            .where(eq(invoices.userId, session.user.id))
            .orderBy(desc(invoices.createdAt));

        // 3. Return success response
        return { success: true, data: userInvoices, error: null };
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return { success: false, error: "Failed to fetch invoices", data: null };
    }
}
```

---

### Action 2: Create Invoice

Create `src/modules/invoices/actions/create-invoice.action.ts`:

```typescript
"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { auth } from "@/modules/auth/utils/auth-utils";
import { insertInvoiceSchema } from "../schemas/invoice.schema";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: unknown) {
    // 1. Check authentication
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Unauthorized", data: null };
    }

    try {
        // 2. Validate input
        const validatedData = insertInvoiceSchema.parse(data);

        // 3. Generate ID and timestamps
        const now = new Date().toISOString();
        const invoice = {
            ...validatedData,
            id: crypto.randomUUID(),
            userId: session.user.id,
            createdAt: now,
            updatedAt: now,
        };

        // 4. Insert into database
        await db.insert(invoices).values(invoice);

        // 5. Revalidate the invoices page
        revalidatePath("/dashboard/invoices");

        // 6. Return success
        return { success: true, data: invoice, error: null };
    } catch (error) {
        console.error("Error creating invoice:", error);

        // Handle Zod validation errors
        if (error instanceof Error && error.name === "ZodError") {
            return { success: false, error: "Invalid invoice data", data: null };
        }

        return { success: false, error: "Failed to create invoice", data: null };
    }
}
```

---

### Action 3: Update Invoice

Create `src/modules/invoices/actions/update-invoice.action.ts`:

```typescript
"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { auth } from "@/modules/auth/utils/auth-utils";
import { and, eq } from "drizzle-orm";
import { insertInvoiceSchema } from "../schemas/invoice.schema";
import { revalidatePath } from "next/cache";

export async function updateInvoice(id: string, data: unknown) {
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Unauthorized", data: null };
    }

    try {
        // Validate input
        const validatedData = insertInvoiceSchema.partial().parse(data);

        // Update only if invoice belongs to user
        await db
            .update(invoices)
            .set({
                ...validatedData,
                updatedAt: new Date().toISOString(),
            })
            .where(
                and(
                    eq(invoices.id, id),
                    eq(invoices.userId, session.user.id)
                )
            );

        revalidatePath("/dashboard/invoices");
        revalidatePath(`/dashboard/invoices/${id}`);

        return { success: true, data: { id }, error: null };
    } catch (error) {
        console.error("Error updating invoice:", error);
        return { success: false, error: "Failed to update invoice", data: null };
    }
}
```

---

### Action 4: Delete Invoice

Create `src/modules/invoices/actions/delete-invoice.action.ts`:

```typescript
"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { auth } from "@/modules/auth/utils/auth-utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteInvoice(id: string) {
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Delete only if invoice belongs to user
        await db
            .delete(invoices)
            .where(
                and(
                    eq(invoices.id, id),
                    eq(invoices.userId, session.user.id)
                )
            );

        revalidatePath("/dashboard/invoices");

        return { success: true, error: null };
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return { success: false, error: "Failed to delete invoice" };
    }
}
```

---

### Action 5: Get Single Invoice

Create `src/modules/invoices/actions/get-invoice-by-id.action.ts`:

```typescript
"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { auth } from "@/modules/auth/utils/auth-utils";
import { and, eq } from "drizzle-orm";

export async function getInvoiceById(id: string) {
    const session = await auth();

    if (!session?.user) {
        return { success: false, error: "Unauthorized", data: null };
    }

    try {
        const invoice = await db
            .select()
            .from(invoices)
            .where(
                and(
                    eq(invoices.id, id),
                    eq(invoices.userId, session.user.id)
                )
            )
            .limit(1);

        if (!invoice || invoice.length === 0) {
            return { success: false, error: "Invoice not found", data: null };
        }

        return { success: true, data: invoice[0], error: null };
    } catch (error) {
        console.error("Error fetching invoice:", error);
        return { success: false, error: "Failed to fetch invoice", data: null };
    }
}
```

---

## Step 5: Create Components

### Component 1: Invoice List

Create `src/modules/invoices/components/invoice-list.tsx`:

```typescript
import { getInvoices } from "../actions/get-invoices.action";
import { InvoiceCard } from "./invoice-card";

export async function InvoiceList() {
    const { data: invoices, error } = await getInvoices();

    if (error) {
        return (
            <div className="text-destructive">
                Error loading invoices: {error}
            </div>
        );
    }

    if (!invoices || invoices.length === 0) {
        return (
            <div className="text-muted-foreground text-center py-8">
                No invoices yet. Create your first invoice!
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {invoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
        </div>
    );
}
```

---

### Component 2: Invoice Card

Create `src/modules/invoices/components/invoice-card.tsx`:

```typescript
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Invoice } from "../schemas/invoice.schema";
import { DeleteInvoice } from "./delete-invoice";

interface InvoiceCardProps {
    invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
    const statusColors = {
        draft: "bg-secondary",
        sent: "bg-blue-500",
        paid: "bg-green-500",
        overdue: "bg-destructive",
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                            Invoice #{invoice.invoiceNumber}
                        </h3>
                        <Badge className={statusColors[invoice.status]}>
                            {invoice.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {invoice.customerName}
                    </p>
                    <p className="text-lg font-bold">
                        ${(invoice.amount / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </Link>
                    <DeleteInvoice invoiceId={invoice.id} />
                </div>
            </div>
        </Card>
    );
}
```

---

### Component 3: Invoice Form

Create `src/modules/invoices/components/invoice-form.tsx`:

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createInvoice } from "../actions/create-invoice.action";
import { updateInvoice } from "../actions/update-invoice.action";
import { insertInvoiceSchema, type Invoice } from "../schemas/invoice.schema";

interface InvoiceFormProps {
    invoice?: Invoice;
    mode: "create" | "edit";
}

export function InvoiceForm({ invoice, mode }: InvoiceFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm({
        resolver: zodResolver(insertInvoiceSchema),
        defaultValues: {
            invoiceNumber: invoice?.invoiceNumber || "",
            customerName: invoice?.customerName || "",
            customerEmail: invoice?.customerEmail || "",
            amount: invoice?.amount || 0,
            status: invoice?.status || "draft",
            dueDate: invoice?.dueDate || "",
        },
    });

    const onSubmit = (data: any) => {
        startTransition(async () => {
            const result =
                mode === "create"
                    ? await createInvoice(data)
                    : await updateInvoice(invoice!.id, data);

            if (!result.success) {
                toast.error(result.error || "Operation failed");
                return;
            }

            toast.success(
                mode === "create"
                    ? "Invoice created!"
                    : "Invoice updated!"
            );
            router.push("/dashboard/invoices");
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Invoice Number</FormLabel>
                            <FormControl>
                                <Input placeholder="INV-001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer Email (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount (cents)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="10000"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="overdue">
                                        Overdue
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending
                            ? mode === "create"
                                ? "Creating..."
                                : "Updating..."
                            : mode === "create"
                              ? "Create Invoice"
                              : "Update Invoice"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
```

---

### Component 4: Delete Invoice Button

Create `src/modules/invoices/components/delete-invoice.tsx`:

```typescript
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteInvoice } from "../actions/delete-invoice.action";

interface DeleteInvoiceProps {
    invoiceId: string;
}

export function DeleteInvoice({ invoiceId }: DeleteInvoiceProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteInvoice(invoiceId);

            if (!result.success) {
                toast.error(result.error || "Failed to delete invoice");
                return;
            }

            toast.success("Invoice deleted");
            setOpen(false);
            router.refresh();
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
```

---

## Step 6: Create Routes

### Route 1: Invoice List Page

Create `src/app/dashboard/invoices/page.tsx`:

```typescript
import { Button } from "@/components/ui/button";
import { InvoiceList } from "@/modules/invoices/components/invoice-list";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function InvoicesPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Invoices</h1>
                <Link href="/dashboard/invoices/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Invoice
                    </Button>
                </Link>
            </div>

            <InvoiceList />
        </div>
    );
}
```

---

### Route 2: Create Invoice Page

Create `src/app/dashboard/invoices/new/page.tsx`:

```typescript
import { InvoiceForm } from "@/modules/invoices/components/invoice-form";

export default function NewInvoicePage() {
    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
            <InvoiceForm mode="create" />
        </div>
    );
}
```

---

### Route 3: Edit Invoice Page

Create `src/app/dashboard/invoices/[id]/page.tsx`:

```typescript
import { notFound } from "next/navigation";
import { getInvoiceById } from "@/modules/invoices/actions/get-invoice-by-id.action";
import { InvoiceForm } from "@/modules/invoices/components/invoice-form";

interface EditInvoicePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
    const { id } = await params;
    const { data: invoice, error } = await getInvoiceById(id);

    if (error || !invoice) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Edit Invoice</h1>
            <InvoiceForm invoice={invoice} mode="edit" />
        </div>
    );
}
```

---

## Step 7: Test Your Module

### Start Dev Servers

```bash
# Terminal 1
pnpm run wrangler:dev

# Terminal 2
pnpm run dev
```

### Manual Testing Checklist

- [ ] Visit `http://localhost:3000/dashboard/invoices`
- [ ] Click "New Invoice" button
- [ ] Fill out the form and create an invoice
- [ ] Verify invoice appears in the list
- [ ] Click "Edit" on an invoice
- [ ] Update the invoice details
- [ ] Verify changes are saved
- [ ] Click delete button
- [ ] Confirm deletion works
- [ ] Check database: `pnpm run db:studio:local`
- [ ] Verify data isolation (create second user, ensure they see only their invoices)

---

## Common Patterns

### Pattern: Optimistic UI Updates

For better UX, you can update the UI before the server responds:

```typescript
"use client";

import { useOptimistic } from "react";

export function InvoiceList({ initialInvoices }) {
    const [optimisticInvoices, addOptimisticInvoice] = useOptimistic(
        initialInvoices,
        (state, newInvoice) => [...state, newInvoice]
    );

    // Use optimisticInvoices in your JSX
}
```

---

### Pattern: Loading States

Show skeletons while data loads:

```typescript
import { Suspense } from "react";
import { InvoiceListSkeleton } from "./invoice-list-skeleton";

export default function InvoicesPage() {
    return (
        <Suspense fallback={<InvoiceListSkeleton />}>
            <InvoiceList />
        </Suspense>
    );
}
```

---

### Pattern: Error Boundaries

Catch errors gracefully:

Create `src/app/dashboard/invoices/error.tsx`:

```typescript
"use client";

import { Button } from "@/components/ui/button";

export default function InvoicesError({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={reset}>Try Again</Button>
        </div>
    );
}
```

---

## Deployment Checklist

Before deploying your new module:

- [ ] All server actions have authentication checks
- [ ] Database queries filter by `userId`
- [ ] Migrations have been tested locally
- [ ] Forms have proper validation
- [ ] Error handling is in place
- [ ] Loading states exist
- [ ] Delete actions have confirmation dialogs
- [ ] No sensitive data exposed in client components
- [ ] TypeScript has no errors (`pnpm run build`)

---

## Next Steps

**You now have a complete CRUD module!**

**Optional enhancements:**
- Add search/filter functionality
- Implement pagination
- Add sorting options
- Create export to PDF feature
- Add email notifications
- Implement recurring invoices

**Copy this pattern for other modules:**
- Projects
- Clients
- Products
- Orders
- etc.

---

## Reference

**See existing modules for examples:**
- `src/modules/todos` - Full CRUD example
- `src/modules/auth` - Authentication patterns
- `src/modules/dashboard` - Layout patterns

**Documentation:**
- [MODULES.md](./MODULES.md) - Module system overview
- [README.md](./README.md) - Project setup
- [Next.js Docs](https://nextjs.org/docs) - Framework reference
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) - Database patterns

---

**You're all set!** Follow this template for any new feature module you want to add. 🚀
