import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { tools } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { updateToolSchema } from "@/lib/validations/tool.schema";
import { eq } from "drizzle-orm";

/**
 * PUT /api/admin/tools/[id]
 * Update a tool (Admin only)
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
        const validation = await validateRequest(request, updateToolSchema);
        if (!validation.success) {
            return validation.error;
        }

        const data = validation.data as any;

        // Check tool exists
        const [existing] = await db
            .select()
            .from(tools)
            .where(eq(tools.id, id))
            .limit(1);

        if (!existing) {
            return apiError("Tool not found", "NOT_FOUND", 404);
        }

        // Update tool
        const [updated] = await db
            .update(tools)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(tools.id, id))
            .returning();

        return apiSuccess(updated);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * DELETE /api/admin/tools/[id]
 * Delete a tool (Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin(request);
        const { id } = await params;
        const db = await getDb();

        // Check tool exists
        const [existing] = await db
            .select()
            .from(tools)
            .where(eq(tools.id, id))
            .limit(1);

        if (!existing) {
            return apiError("Tool not found", "NOT_FOUND", 404);
        }

        // Soft delete by setting deletedAt
        await db
            .update(tools)
            .set({
                deletedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(tools.id, id));

        return apiSuccess({ id, deleted: true });
    } catch (error) {
        return handleApiError(error);
    }
}
