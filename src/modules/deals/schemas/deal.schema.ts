import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "@/modules/auth/schemas/auth.schema";
import { contacts } from "@/modules/contacts/schemas/contact.schema";
import {
    DealStage,
    type DealStageType,
    dealStageEnum,
} from "@/modules/deals/models/deal.enum";

// Deals table
export const deals = sqliteTable("deals", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    contactId: integer("contact_id").references(() => contacts.id, {
        onDelete: "set null",
    }),
    value: real("value").notNull(),
    currency: text("currency").notNull().default("AUD"),
    stage: text("stage")
        .$type<DealStageType>()
        .notNull()
        .default(DealStage.PROSPECTING),
    expectedCloseDate: integer("expected_close_date", { mode: "number" }),
    description: text("description"),
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

// Zod schemas for validation
export const insertDealSchema = createInsertSchema(deals, {
    title: z
        .string()
        .min(1, "Deal title is required")
        .max(255, "Title too long"),
    contactId: z.number().optional(),
    value: z
        .number()
        .min(0, "Value must be positive")
        .refine((val) => !Number.isNaN(val), "Value must be a valid number"),
    currency: z.string().length(3, "Currency must be a 3-letter ISO code").optional(),
    stage: z.enum(dealStageEnum).optional(),
    expectedCloseDate: z.number().optional(),
    description: z
        .string()
        .max(5000, "Description too long")
        .optional()
        .or(z.literal("")),
    userId: z.number().min(1, "User ID is required"),
});

export const selectDealSchema = createSelectSchema(deals);

export const updateDealSchema = insertDealSchema.partial().omit({
    id: true,
    userId: true,
    createdAt: true,
});

// Type exports
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
