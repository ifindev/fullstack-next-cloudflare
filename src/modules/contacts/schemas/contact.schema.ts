import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "@/modules/auth/schemas/auth.schema";

// Contacts table
export const contacts = sqliteTable("contacts", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    jobTitle: text("job_title"),
    notes: text("notes"),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "number" })
        .notNull()
        .$defaultFn(() => Date.now()),
    updatedAt: integer("updated_at", { mode: "number" })
        .notNull()
        .$defaultFn(() => Date.now()),
});

// Contact tags table
export const contactTags = sqliteTable("contact_tags", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "number" })
        .notNull()
        .$defaultFn(() => Date.now()),
});

// Junction table for contacts to tags (many-to-many)
export const contactsToTags = sqliteTable(
    "contacts_to_tags",
    {
        contactId: integer("contact_id")
            .notNull()
            .references(() => contacts.id, { onDelete: "cascade" }),
        tagId: integer("tag_id")
            .notNull()
            .references(() => contactTags.id, { onDelete: "cascade" }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.contactId, table.tagId] }),
    })
);

// Zod schemas for validation
export const insertContactSchema = createInsertSchema(contacts, {
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z
        .string()
        .email("Invalid email format")
        .optional()
        .or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    company: z.string().optional().or(z.literal("")),
    jobTitle: z.string().optional().or(z.literal("")),
    notes: z.string().max(5000, "Notes too long").optional().or(z.literal("")),
    userId: z.number().min(1, "User ID is required"),
}).refine(
    (data) => data.firstName || data.lastName,
    {
        message: "At least one of firstName or lastName is required",
        path: ["firstName"],
    }
);

export const selectContactSchema = createSelectSchema(contacts);

export const updateContactSchema = insertContactSchema.partial().omit({
    id: true,
    userId: true,
    createdAt: true,
});

export const insertContactTagSchema = createInsertSchema(contactTags, {
    name: z.string().min(1, "Tag name is required").max(50, "Tag name too long"),
    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code (e.g., #3B82F6)"),
    userId: z.number().min(1, "User ID is required"),
});

export const selectContactTagSchema = createSelectSchema(contactTags);

export const updateContactTagSchema = insertContactTagSchema.partial().omit({
    id: true,
    userId: true,
    createdAt: true,
});

export const insertContactToTagSchema = createInsertSchema(contactsToTags, {
    contactId: z.number().min(1, "Contact ID is required"),
    tagId: z.number().min(1, "Tag ID is required"),
});

// Type exports
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type ContactTag = typeof contactTags.$inferSelect;
export type NewContactTag = typeof contactTags.$inferInsert;
export type ContactToTag = typeof contactsToTags.$inferSelect;
export type NewContactToTag = typeof contactsToTags.$inferInsert;
