import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { categories, tools } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    parsePagination,
    createPaginationMeta,
    handleApiError,
} from "@/lib/api-utils";
import { eq, desc, sql } from "drizzle-orm";

/**
 * GET /api/categories/[slug]/tools
 * Get category details and its tools
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const db = await getDb();

        // Find category
        const [category] = await db
            .select()
            .from(categories)
            .where(eq(categories.slug, slug))
            .limit(1);

        if (!category) {
            return apiError("Category not found", "NOT_FOUND", 404);
        }

        // Parse pagination
        const { page, limit, offset } = parsePagination(searchParams);
        const sort = searchParams.get("sort") || "featured";

        // Get total tools count
        const [{ count: total }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(tools)
            .where(eq(tools.categoryId, category.id));

        // Get tools
        const toolsList = await db
            .select({
                id: tools.id,
                name: tools.name,
                url: tools.url,
                description: tools.description,
                logoUrl: tools.logoUrl,
                isFeatured: tools.isFeatured,
                viewCount: tools.viewCount,
            })
            .from(tools)
            .where(eq(tools.categoryId, category.id))
            .orderBy(
                sort === "featured"
                    ? desc(tools.isFeatured)
                    : sort === "newest"
                      ? desc(tools.createdAt)
                      : desc(tools.viewCount),
            )
            .limit(limit)
            .offset(offset);

        return apiSuccess(
            {
                category: {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    icon: category.icon,
                    description: category.description,
                },
                tools: toolsList,
            },
            createPaginationMeta(page, limit, total),
        );
    } catch (error) {
        return handleApiError(error);
    }
}
