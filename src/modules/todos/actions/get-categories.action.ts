"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
    type Category,
    categories,
} from "@/modules/todos/schemas/category.schema";

export async function getAllCategories(userId: string): Promise<Category[]> {
    try {
        const db = await getDb();
        return await db
            .select()
            .from(categories)
            .where(eq(categories.userId, userId))
            .orderBy(categories.createdAt);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
