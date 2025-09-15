"use server";

import { and, eq } from "drizzle-orm";
import { categories, getDb } from "@/lib/db";
import { type Todo, todos } from "@/lib/db/schemas/todo.schema";
import { requireAuth } from "@/modules/auth/utils/auth-utils";

export async function getTodoById(id: number): Promise<Todo | null> {
    try {
        const user = await requireAuth();

        const db = await getDb();
        const result = await db
            .select({
                id: todos.id,
                title: todos.title,
                description: todos.description,
                completed: todos.completed,
                categoryId: todos.categoryId,
                categoryName: categories.name,
                dueDate: todos.dueDate,
                imageUrl: todos.imageUrl,
                imageAlt: todos.imageAlt,
                status: todos.status,
                priority: todos.priority,
                userId: todos.userId,
                createdAt: todos.createdAt,
                updatedAt: todos.updatedAt,
            })
            .from(todos)
            .leftJoin(
                categories,
                and(
                    eq(todos.categoryId, categories.id),
                    eq(categories.userId, user.id),
                ),
            )
            .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
            .orderBy(todos.createdAt)
            .limit(1);

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching todo by id:", error);
        return null;
    }
}
