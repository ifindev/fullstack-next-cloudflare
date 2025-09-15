"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { todos, updateTodoSchema } from "@/lib/db/schemas/todo.schema";
import { type TodoPriority, TodoStatus } from "@/lib/enums/todo.enum";
import { type UploadResult, uploadToR2 } from "@/lib/r2";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import todosRoutes from "../todos.route";

export async function updateTodoAction(todoId: number, formData: FormData) {
    try {
        const user = await requireAuth();

        const imageFile = formData.get("image") as File | null;
        const file = imageFile && imageFile.size > 0 ? imageFile : undefined;

        const todoData: Record<string, string | number | boolean> = {};
        for (const [key, value] of formData.entries()) {
            if (key !== "image") {
                if (key === "completed") {
                    todoData[key] = value === "true";
                } else if (key === "categoryId") {
                    const numValue = parseInt(value as string, 10);
                    if (!Number.isNaN(numValue)) {
                        todoData[key] = numValue;
                    }
                } else if (value && value !== "" && typeof value === "string") {
                    todoData[key] = value;
                }
            }
        }

        const validatedData = updateTodoSchema.parse(todoData);

        let imageUrl: string | undefined;
        let imageAlt: string | undefined;

        if (file) {
            const uploadResult: UploadResult = await uploadToR2(
                file,
                "todo-images",
            );

            if (uploadResult.success && uploadResult.url) {
                imageUrl = uploadResult.url;
                imageAlt = validatedData.imageAlt || file.name;
            } else {
                console.error("Image upload failed:", uploadResult.error);
            }
        }

        const db = await getDb();

        const { status, priority, ...restValidatedData } = validatedData;

        const result = await db
            .update(todos)
            .set({
                ...restValidatedData,
                // Ensure proper typing for enum fields
                ...(status && {
                    status: status as (typeof TodoStatus)[keyof typeof TodoStatus],
                }),
                ...(priority && {
                    priority:
                        priority as (typeof TodoPriority)[keyof typeof TodoPriority],
                }),
                // Only update image fields if we have new values
                ...(imageUrl && { imageUrl }),
                ...(imageAlt && { imageAlt }),
                updatedAt: new Date().toISOString(),
            })
            .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))
            .returning();

        if (!result.length) {
            throw new Error("Todo not found or unauthorized");
        }

        revalidatePath(todosRoutes.list);
        redirect(todosRoutes.list);
    } catch (error) {
        console.error("Error updating todo:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to update todo",
        );
    }
}

export async function updateTodoFieldAction(
    todoId: number,
    data: { completed?: boolean },
) {
    try {
        const user = await requireAuth();
        const db = await getDb();

        const result = await db
            .update(todos)
            .set({
                ...data,
                ...(data.completed !== undefined && {
                    status: data.completed
                        ? TodoStatus.COMPLETED
                        : TodoStatus.PENDING,
                }),
                updatedAt: new Date().toISOString(),
            })
            .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))
            .returning();

        if (!result.length) {
            return {
                success: false,
                error: "Todo not found or unauthorized",
            };
        }

        revalidatePath(todosRoutes.list);

        return {
            success: true,
            data: result[0],
        };
    } catch (error) {
        console.error("Error updating todo field:", error);

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
                    : "Failed to update todo",
        };
    }
}
