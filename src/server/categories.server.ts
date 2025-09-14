import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
    type Category,
    categories,
    insertCategorySchema,
    updateCategorySchema,
} from "@/lib/db/schemas/category.schema";

export async function getAllCategories(userId: string): Promise<Category[]> {
    const db = await getDb();
    return await db
        .select()
        .from(categories)
        .where(eq(categories.userId, userId))
        .orderBy(categories.createdAt);
}

export async function getCategoryById(
    id: number,
    userId: string,
): Promise<Category | null> {
    const db = await getDb();
    const result = await db
        .select()
        .from(categories)
        .where(and(eq(categories.id, id), eq(categories.userId, userId)))
        .limit(1);
    return result[0] || null;
}

export async function createCategory(
    data: unknown,
    userId: string,
): Promise<Category> {
    const validatedData = insertCategorySchema.parse({
        ...(data as object),
        userId,
    });

    const db = await getDb();
    const result = await db
        .insert(categories)
        .values({
            ...validatedData,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .returning();

    return result[0];
}

export async function updateCategory(
    id: number,
    data: unknown,
    userId: string,
): Promise<Category | null> {
    const validatedData = updateCategorySchema.parse(data);

    const db = await getDb();
    const result = await db
        .update(categories)
        .set({ ...validatedData, updatedAt: new Date().toISOString() })
        .where(and(eq(categories.id, id), eq(categories.userId, userId)))
        .returning();

    return result[0] || null;
}

export async function deleteCategory(
    id: number,
    userId: string,
): Promise<boolean> {
    const db = await getDb();

    // Check if category exists and belongs to user first
    const existingCategory = await getCategoryById(id, userId);
    if (!existingCategory) {
        return false;
    }

    // Delete the category
    await db
        .delete(categories)
        .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    return true;
}
