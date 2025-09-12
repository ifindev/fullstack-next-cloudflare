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
import { categories } from "./category.schema";

export const todos = sqliteTable("todos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    categoryId: integer("category_id").references(() => categories.id),
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
    status: z.enum(TodoStatus).optional(),
    priority: z.enum(TodoPriority).optional(),
    imageUrl: z
        .string()
        .url(TODO_VALIDATION_MESSAGES.INVALID_IMAGE_URL)
        .optional()
        .or(z.literal("")),
    imageAlt: z.string().optional().or(z.literal("")),
    completed: z.boolean().optional(),
});

export const selectTodoSchema = createSelectSchema(todos);

export const updateTodoSchema = insertTodoSchema.partial().omit({
    id: true,
    createdAt: true,
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
