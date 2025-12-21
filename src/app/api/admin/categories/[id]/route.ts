import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { categories, tools } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { updateCategorySchema } from "@/lib/validations/category.schema";
import { eq, sql } from "drizzle-orm";

/**
 * PUT /api/admin/categories/[id]
 * Update a category (Admin only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin(request);
        const { id } = await params;
        const db = await getDb();

        // Validate request body
        const validation = await validateRequest(request, updateCategorySchema);
        if (!validation.success) {
            return validation.error;
        }

        const data = validation.data as any;

        // Check category exists
        const [existing] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1);

        if (!existing) {
            return apiError("Category not found", "NOT_FOUND", 404);
        }

        // Update category
        const [updated] = await db
            .update(categories)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(categories.id, id))
            .returning();

        return apiSuccess(updated);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete a category (Admin only)
 * Only if it has no tools and no subcategories
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin(request);
        const { id } = await params;
        const db = await getDb();

        // Check category exists
        const [existing] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1);

        if (!existing) {
            return apiError("Category not found", "NOT_FOUND", 404);
        }

        // Check if category has tools
        const [{ count: toolCount }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(tools)
            .where(eq(tools.categoryId, id));

        if (toolCount > 0) {
            return apiError(
                "Cannot delete category with existing tools",
                "CONFLICT",
                409,
                { toolCount },
            );
        }

        // Check if category has subcategories
        const [{ count: subCount }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(categories)
            .where(eq(categories.parentId, id));

        if (subCount > 0) {
            return apiError(
                "Cannot delete category with subcategories",
                "CONFLICT",
                409,
                { subcategoryCount: subCount },
            );
        }

        // Soft delete
        await db
            .update(categories)
            .set({
                deletedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(categories.id, id));

        return apiSuccess({ id, deleted: true });
    } catch (error) {
        return handleApiError(error);
    }
}
