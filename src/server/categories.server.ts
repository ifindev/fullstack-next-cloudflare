import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
    type Category,
    categories,
    insertCategorySchema,
    updateCategorySchema,
} from "@/lib/db/schemas/category.schema";

export async function getAllCategories(): Promise<Category[]> {
    const db = await getDb();
    return await db.select().from(categories);
}

export async function getCategoryById(id: number): Promise<Category | null> {
    const db = await getDb();
    const result = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .limit(1);
    return result[0] || null;
}

export async function createCategory(data: unknown): Promise<Category> {
    const validatedData = insertCategorySchema.parse(data);

    const db = await getDb();
    const result = await db
        .insert(categories)
        .values({
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .returning();

    return result[0];
}

export async function updateCategory(
    id: number,
    data: unknown,
): Promise<Category | null> {
    const validatedData = updateCategorySchema.parse(data);

    const db = await getDb();
    const result = await db
        .update(categories)
        .set({ ...validatedData, updatedAt: new Date().toISOString() })
        .where(eq(categories.id, id))
        .returning();

    return result[0] || null;
}
