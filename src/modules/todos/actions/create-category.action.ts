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

export async function createCategory(data: unknown): Promise<Category> {
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
            throw new Error("Failed to create category");
        }

        // Revalidate pages that might show categories
        revalidatePath(todosRoutes.list);
        revalidatePath(todosRoutes.new);

        return result[0];
    } catch (error) {
        console.error("Error creating category:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to create category",
        );
    }
}
