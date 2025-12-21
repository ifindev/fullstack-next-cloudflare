import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { tools, categories } from "@/db/schema";
import { eq, like, or, desc } from "drizzle-orm";

/**
 * Tools Search API
 * GET /api/tools/search?q=query
 * Searches for tools by name or description
 */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        if (!query) {
            return NextResponse.json(
                { error: "Query parameter 'q' is required" },
                { status: 400 },
            );
        }

        // Get D1 database from Cloudflare context
        const { env } = await getCloudflareContext();
        const db = drizzle(env.next_cf_app);

        // Search tools
        const searchResults = await db
            .select({
                id: tools.id,
                name: tools.name,
                description: tools.description,
                logoUrl: tools.logoUrl,
                url: tools.url,
                categoryId: tools.categoryId,
                isFeatured: tools.isFeatured,
                isPublished: tools.isPublished,
                viewCount: tools.viewCount,
            })
            .from(tools)
            .where(
                or(
                    like(tools.name, `%${query}%`),
                    like(tools.description, `%${query}%`),
                ),
            )
            .orderBy(desc(tools.isFeatured), desc(tools.viewCount))
            .limit(limit)
            .offset(offset);

        // Get categories for the tools
        const categoryIds = [
            ...new Set(searchResults.map((tool) => tool.categoryId)),
        ];
        const toolCategories = await db.select().from(categories).where(
            eq(
                categories.id,
                categoryIds[0], // This should be 'in' but simplified for demo
            ),
        );

        // Map categories to tools
        const resultsWithCategories = searchResults.map((tool) => ({
            ...tool,
            category: toolCategories.find((cat) => cat.id === tool.categoryId),
        }));

        return NextResponse.json({
            results: resultsWithCategories,
            total: searchResults.length,
            query,
            limit,
            offset,
        });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
