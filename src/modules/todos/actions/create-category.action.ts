"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import {
    type Category,
    categories,
    insertCategorySchema,
} from "@/modules/todos/schemas/category.schema";
import todosRoutes from "../todos.route";

export async function createCategory(data: unknown): Promise<{
    success: boolean;
    data?: Category;
    error?: string;
}> {
    try {
        const user = await requireAuth();
        const validatedData = insertCategorySchema.parse({
            ...(data as object),
            userId: user.id,
        });

        const db = await getDb();
        const result = await db
            .insert(categories)
            .values({
                ...validatedData,
                userId: user.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .returning();

        if (!result[0]) {
            return {
                success: false,
                error: "Failed to create category",
            };
        }

        // Revalidate pages that might show categories
        revalidatePath(todosRoutes.list);
        revalidatePath(todosRoutes.new);

        return {
            success: true,
            data: result[0],
        };
    } catch (error) {
        console.error("Error creating category:", error);

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
                    : "Failed to create category",
        };
    }
}
