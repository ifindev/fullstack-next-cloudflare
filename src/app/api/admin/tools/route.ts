import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { tools, categories } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { createToolSchema } from "@/lib/validations/tool.schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * POST /api/admin/tools
 * Create a new tool (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireAdmin(request);
        const db = await getDb();

        // Validate request body
        const validation = await validateRequest(request, createToolSchema);
        if (!validation.success) {
            return validation.error;
        }

        const data = validation.data as any;

        // Check if URL already exists
        const [existing] = await db
            .select()
            .from(tools)
            .where(eq(tools.url, data.url))
            .limit(1);

        if (existing) {
            return apiError(
                "A tool with this URL already exists",
                "CONFLICT",
                409,
            );
        }

        // Check category exists
        const [categoryExists] = await db
            .select()
            .from(categories)
            .where(eq(categories.id, data.categoryId))
            .limit(1);

        if (!categoryExists) {
            return apiError("Invalid category", "VALIDATION_ERROR", 400);
        }

        // Create tool
        const toolId = nanoid();
        const [tool] = await db
            .insert(tools)
            .values({
                id: toolId,
                name: data.name,
                url: data.url,
                description: data.description,
                logoUrl: data.logoUrl,
                categoryId: data.categoryId,
                isFeatured: data.isFeatured || false,
                isPublished: data.isPublished ?? true,
                metaDescription: data.metaDescription,
                metaKeywords: data.metaKeywords,
                viewCount: 0,
                clickCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return apiSuccess(tool, undefined, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
