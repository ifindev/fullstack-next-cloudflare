import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { tools, categories } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    parsePagination,
    createPaginationMeta,
    handleApiError,
} from "@/lib/api-utils";
import { getCached, setCache } from "@/lib/cache";
import { toolQuerySchema } from "@/lib/validations/tool.schema";
import { eq, and, or, like, desc, sql } from "drizzle-orm";

/**
 * GET /api/tools
 * List all published tools with filtering and pagination
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Check cache
        const cacheKey = `tools:${request.url}`;
        const cachedResult = getCached<{ data: any; meta: any }>(cacheKey);
        if (cachedResult) {
            return apiSuccess(cachedResult.data, cachedResult.meta);
        }

        const db = await getDb();

        // Parse and validate query parameters
        const queryResult = toolQuerySchema.safeParse({
            category: searchParams.get("category"),
            search: searchParams.get("search"),
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
            sort: searchParams.get("sort"),
            featured: searchParams.get("featured"),
        });

        if (!queryResult.success) {
            return apiError(
                "Invalid query parameters",
                "VALIDATION_ERROR",
                400,
                queryResult.error.flatten().fieldErrors,
            );
        }

        const { category, search, sort, featured } = queryResult.data;
        const { page, limit, offset } = parsePagination(searchParams);

        // Build query conditions
        const conditions = [];

        // Only published tools for public API
        conditions.push(eq(tools.isPublished, true));

        // Filter by category
        if (category) {
            // Find category by slug
            const [cat] = await db
                .select()
                .from(categories)
                .where(eq(categories.slug, category))
                .limit(1);

            if (cat) {
                conditions.push(eq(tools.categoryId, cat.id));
            } else {
                // Category not found - return empty results
                return apiSuccess([], createPaginationMeta(page, limit, 0));
            }
        }

        // Search in name and description
        if (search) {
            conditions.push(
                or(
                    like(tools.name, `%${search}%`),
                    like(tools.description, `%${search}%`),
                ),
            );
        }

        // Featured filter
        if (featured !== undefined) {
            conditions.push(eq(tools.isFeatured, featured));
        }

        // Get total count
        const [{ count: total }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(tools)
            .where(and(...conditions));

        // Get tools with category info
        const results = await db
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
                createdAt: tools.createdAt,
            })
            .from(tools)
            .leftJoin(categories, eq(tools.categoryId, categories.id))
            .where(and(...conditions))
            .orderBy(
                sort === "featured"
                    ? desc(tools.isFeatured)
                    : sort === "newest"
                      ? desc(tools.createdAt)
                      : desc(tools.viewCount),
            )
            .limit(limit)
            .offset(offset);

        const responseData = results;
        const responseMeta = createPaginationMeta(page, limit, total);

        // Set cache (1 minute)
        setCache(cacheKey, { data: responseData, meta: responseMeta }, 60 * 1000);

        return apiSuccess(responseData, responseMeta);
    } catch (error) {
        return handleApiError(error);
    }
}
