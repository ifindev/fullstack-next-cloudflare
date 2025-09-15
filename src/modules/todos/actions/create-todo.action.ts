"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { insertTodoSchema, todos } from "@/lib/db/schemas/todo.schema";
import { TodoPriority, TodoStatus } from "@/lib/enums/todo.enum";
import { type UploadResult, uploadToR2 } from "@/lib/r2";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import todosRoutes from "../todos.route";

export async function createTodoAction(formData: FormData) {
    try {
        const user = await requireAuth();

        const imageFile = formData.get("image") as File | null;
        const file = imageFile && imageFile.size > 0 ? imageFile : undefined;

        // Extract other form fields and build todo data
        const todoData: Record<string, string | number | boolean> = {};
        for (const [key, value] of formData.entries()) {
            if (key !== "image") {
                // Handle boolean fields
                if (key === "completed") {
                    todoData[key] = value === "true";
                }
                // Handle numeric fields
                else if (key === "categoryId") {
                    const numValue = parseInt(value as string, 10);
                    if (!Number.isNaN(numValue)) {
                        todoData[key] = numValue;
                    }
                }
                // Handle string fields
                else if (value && value !== "" && typeof value === "string") {
                    todoData[key] = value;
                }
            }
        }

        // Validate the data
        const validatedData = insertTodoSchema.parse({
            ...todoData,
            userId: user.id,
        });

        // Handle optional image upload
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
                // Log error but don't fail the todo creation
                console.error("Image upload failed:", uploadResult.error);
            }
        }

        const db = await getDb();
        await db.insert(todos).values({
            ...validatedData,
            userId: user.id,
            status:
                (validatedData.status as (typeof TodoStatus)[keyof typeof TodoStatus]) ||
                TodoStatus.PENDING,
            priority:
                (validatedData.priority as (typeof TodoPriority)[keyof typeof TodoPriority]) ||
                TodoPriority.MEDIUM,
            imageUrl: imageUrl || validatedData.imageUrl,
            imageAlt: imageAlt || validatedData.imageAlt,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        revalidatePath(todosRoutes.list);
        redirect(todosRoutes.list);
    } catch (error) {
        console.error("Error creating todo:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to create todo",
        );
    }
}
