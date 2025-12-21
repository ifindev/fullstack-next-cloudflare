import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categories } from "@/modules/categories/schemas/category.schema";
import { user } from "@/modules/auth/schemas/auth.schema";

/**
 * Tools Table
 * Stores all published tools in the directory
 */
export const tools = sqliteTable("tools", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description").notNull(),
    logoUrl: text("logo_url"),

    // Organization
    categoryId: text("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "restrict" }),

    // Publishing status
    isPublished: integer("is_published", { mode: "boolean" })
        .notNull()
        .default(true),
    isFeatured: integer("is_featured", { mode: "boolean" })
        .notNull()
        .default(false),
    
    // Pricing
    pricing: text("pricing", { enum: ["Free", "Freemium", "Paid"] })
        .notNull()
        .default("Free"),

    // Submission tracking
    submissionId: text("submission_id").unique(),
    submittedBy: text("submitted_by").references(() => user.id, {
        onDelete: "set null",
    }),

    // Metrics
    viewCount: integer("view_count").default(0),
    clickCount: integer("click_count").default(0),

    // SEO
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),

    // Soft delete
    deletedAt: integer("deleted_at", { mode: "timestamp" }),

    // Timestamps
    createdAt: integer("created_at", { mode: "timestamp" })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;
