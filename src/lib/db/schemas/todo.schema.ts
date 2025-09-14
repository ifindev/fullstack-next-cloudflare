import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { TODO_VALIDATION_MESSAGES } from "../../constants/validation.constant";
import {
    TodoPriority,
    type TodoPriorityType,
    TodoStatus,
    type TodoStatusType,
} from "../../enums/todo.enum";
import { user } from "./auth.schema";
import { categories } from "./category.schema";

export const todos = sqliteTable("todos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    categoryId: integer("category_id").references(() => categories.id),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    status: text("status")
        .$type<TodoStatusType>()
        .notNull()
        .default(TodoStatus.PENDING),
    priority: text("priority")
        .$type<TodoPriorityType>()
        .notNull()
        .default(TodoPriority.MEDIUM),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    completed: integer("completed", { mode: "boolean" })
        .notNull()
        .default(false),
    dueDate: text("due_date"), // ISO string
    createdAt: text("created_at")
        .notNull()
        .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
        .notNull()
        .$defaultFn(() => new Date().toISOString()),
});

// Zod schemas for validation
export const insertTodoSchema = createInsertSchema(todos, {
    title: z
        .string()
        .min(3, TODO_VALIDATION_MESSAGES.TITLE_REQUIRED)
        .max(255, TODO_VALIDATION_MESSAGES.TITLE_TOO_LONG),
    description: z
        .string()
        .max(1000, TODO_VALIDATION_MESSAGES.DESCRIPTION_TOO_LONG)
        .optional(),
    categoryId: z.number().optional(),
    userId: z.string().min(1, "User ID is required"),
    status: z
        .enum(Object.values(TodoStatus) as [string, ...string[]])
        .optional(),
    priority: z
        .enum(Object.values(TodoPriority) as [string, ...string[]])
        .optional(),
    imageUrl: z
        .string()
        .url(TODO_VALIDATION_MESSAGES.INVALID_IMAGE_URL)
        .optional()
        .or(z.literal("")),
    imageAlt: z.string().optional().or(z.literal("")),
    completed: z.boolean().optional(),
    dueDate: z.string().optional().or(z.literal("")),
});

export const selectTodoSchema = createSelectSchema(todos);

export const updateTodoSchema = insertTodoSchema.partial().omit({
    id: true,
    userId: true,
    createdAt: true,
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
