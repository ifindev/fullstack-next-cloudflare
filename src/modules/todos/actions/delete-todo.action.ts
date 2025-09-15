"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { todos } from "@/modules/todos/schemas/todo.schema";
import todosRoutes from "../todos.route";

export async function deleteTodoAction(todoId: number) {
    try {
        const user = await requireAuth();
        const db = await getDb();

        const existingTodo = await db
            .select({ id: todos.id })
            .from(todos)
            .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))
            .limit(1);

        if (!existingTodo.length) {
            return {
                success: false,
                error: "Todo not found or unauthorized",
            };
        }

        await db
            .delete(todos)
            .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)));

        revalidatePath(todosRoutes.list);

        return {
            success: true,
            message: "Todo deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting todo:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            return {
                success: false,
                error: "Authentication required",
            };
        }

        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to delete todo",
        };
    }
}
