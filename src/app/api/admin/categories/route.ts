import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { createCategorySchema } from "@/lib/validations/category.schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * POST /api/admin/categories
 * Create a new category (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        await requireAdmin(request);
        const db = await getDb();

        // Validate request body
        const validation = await validateRequest(request, createCategorySchema);
        if (!validation.success) {
            return validation.error;
        }

        const data = validation.data as any;

        // Check if slug already exists
        const [existing] = await db
            .select()
            .from(categories)
            .where(eq(categories.slug, data.slug))
            .limit(1);

        if (existing) {
            return apiError(
                "A category with this slug already exists",
                "CONFLICT",
                409,
            );
        }

        // If parentId provided, check it exists
        if (data.parentId) {
            const [parent] = await db
                .select()
                .from(categories)
                .where(eq(categories.id, data.parentId))
                .limit(1);

            if (!parent) {
                return apiError(
                    "Parent category not found",
                    "VALIDATION_ERROR",
                    400,
                );
            }
        }

        // Create category
        const categoryId = nanoid();
        const [category] = await db
            .insert(categories)
            .values({
                id: categoryId,
                name: data.name,
                slug: data.slug,
                icon: data.icon,
                description: data.description,
                parentId: data.parentId || null,
                displayOrder: data.displayOrder || 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return apiSuccess(category, undefined, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
