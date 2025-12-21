import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { updateBlogPostSchema } from "@/lib/validations/blog.schema";
import { eq } from "drizzle-orm";

/**
 * PUT /api/admin/blog/posts/[id]
 * Update a blog post (Admin only)
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
        const validation = await validateRequest(request, updateBlogPostSchema);
        if (!validation.success) {
            return validation.error;
        }

        const data = validation.data as any;

        // Check post exists
        const [existing] = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.id, id))
            .limit(1);

        if (!existing) {
            return apiError("Blog post not found", "NOT_FOUND", 404);
        }

        // Prepare update data
        const updateData: any = {
            ...(data as any),
            updatedAt: new Date(),
        };

        // Convert tags array to JSON string if provided
        if (data.tags) {
            updateData.tags = JSON.stringify(data.tags);
        }

        // Convert publishedAt string to Date if provided
        if (data.publishedAt) {
            updateData.publishedAt = new Date(data.publishedAt);
        }

        // Update post
        const [updated] = await db
            .update(blogPosts)
            .set(updateData)
            .where(eq(blogPosts.id, id))
            .returning();

        return apiSuccess({
            ...updated,
            tags: updated.tags ? JSON.parse(updated.tags) : [],
        });
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/admin/blog/posts/[id]
 * Delete a blog post (Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin(request);
        const { id } = await params;
        const db = await getDb();

        // Check post exists
        const [existing] = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.id, id))
            .limit(1);

        if (!existing) {
            return apiError("Blog post not found", "NOT_FOUND", 404);
        }

        // Soft delete
        await db
            .update(blogPosts)
            .set({
                deletedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(blogPosts.id, id));

        return apiSuccess({ id, deleted: true });
    } catch (error) {
        return handleApiError(error);
    }
}
