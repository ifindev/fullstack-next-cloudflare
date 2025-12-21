import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { tools, categories } from "@/db/schema";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { getCached, setCache } from "@/lib/cache";
import { eq, or, sql } from "drizzle-orm";

/**
 * GET /api/tools/[id]
 * Get a single tool by ID or slug
 * Also increments view count
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const db = await getDb();

        // Check cache for tool data
        const cacheKey = `tool:${id}`;
        let tool = getCached<any>(cacheKey);

        if (!tool) {
            // Try to find by ID or slug
            const [foundTool] = await db
                .select({
                id: tools.id,
                name: tools.name,
                url: tools.url,
                description: tools.description,
                logoUrl: tools.logoUrl,
                category: {
                    id: categories.id,
                    name: categories.name,
                    slug: categories.slug,
                },
                isFeatured: tools.isFeatured,
                viewCount: tools.viewCount,
                metaDescription: tools.metaDescription,
                metaKeywords: tools.metaKeywords,
                createdAt: tools.createdAt,
                updatedAt: tools.updatedAt,
            })
            .from(tools)
            .leftJoin(categories, eq(tools.categoryId, categories.id))
            .where(
                or(
                    eq(tools.id, id),
                    // Assuming tools table might have a slug field in future
                    // For now just use ID
                    eq(tools.id, id),
                ),
            )
            .limit(1);

            tool = foundTool;

            if (tool) {
                setCache(cacheKey, tool, 60 * 1000);
            }
        }

        if (!tool) {
            return apiError("Tool not found", "NOT_FOUND", 404);
        }

        // Increment view count
        await db
            .update(tools)
            .set({
                viewCount: sql`${tools.viewCount} + 1`,
            })
            .where(eq(tools.id, tool.id));

        return apiSuccess(tool);
    } catch (error) {
        return handleApiError(error);
    }
}
