import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { categories, tools, user } from "@/db/schema";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { sql, isNull, eq, desc } from "drizzle-orm";

/**
 * GET /api/stats/homepage
 * 获取首页展示所需的统计数据
 * - 顶级分类及每个分类的工具数
 * - 平台总体统计数据
 * - 精选工具列表
 */
export async function GET(request: NextRequest) {
    try {
        const db = await getDb();

        // 1. 获取顶级分类（parentId为null）
        const topLevelCategories = await db
            .select({
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                icon: categories.icon,
                description: categories.description,
                displayOrder: categories.displayOrder,
            })
            .from(categories)
            .where(isNull(categories.parentId))
            .orderBy(categories.displayOrder);

        // 2. 为每个顶级分类统计工具数量
        // 需要统计该分类下所有子分类的工具总数
        const categoriesWithCount = await Promise.all(
            topLevelCategories.map(async (category) => {
                // 获取该分类的所有子分类ID
                const subcats = await db
                    .select({ id: categories.id })
                    .from(categories)
                    .where(eq(categories.parentId, category.id));

                const subcatIds = subcats.map((sc) => sc.id);

                // 统计工具数：包括直接属于该分类的 + 属于子分类的
                let toolCount = 0;

                if (subcatIds.length > 0) {
                    // 有子分类：统计所有子分类的工具
                    const [result] = await db
                        .select({ count: sql<number>`count(*)` })
                        .from(tools)
                        .where(
                            sql`${tools.categoryId} IN (${sql.join(subcatIds.map(id => sql`${id}`), sql`, `)})`
                        );
                    toolCount = result?.count || 0;
                } else {
                    // 无子分类：统计直接属于该分类的工具
                    const [result] = await db
                        .select({ count: sql<number>`count(*)` })
                        .from(tools)
                        .where(eq(tools.categoryId, category.id));
                    toolCount = result?.count || 0;
                }

                return {
                    ...category,
                    toolCount,
                };
            })
        );

        // 3. 平台统计数据
        const [{ totalTools }] = await db
            .select({ totalTools: sql<number>`count(*)` })
            .from(tools)
            .where(eq(tools.isPublished, true));

        const [{ totalCategories }] = await db
            .select({ totalCategories: sql<number>`count(*)` })
            .from(categories)
            .where(isNull(categories.parentId));

        const [{ totalUsers }] = await db
            .select({ totalUsers: sql<number>`count(*)` })
            .from(user);

        // 4. 精选工具（取6个）
        const featuredTools = await db
            .select({
                id: tools.id,
                name: tools.name,
                description: tools.description,
                url: tools.url,
                logoUrl: tools.logoUrl,
                categoryId: tools.categoryId,
                isFeatured: tools.isFeatured,
                viewCount: tools.viewCount,
            })
            .from(tools)
            .where(eq(tools.isFeatured, true))
            .orderBy(desc(tools.viewCount))
            .limit(6);

        // 为每个工具获取分类信息
        const toolsWithCategory = await Promise.all(
            featuredTools.map(async (tool) => {
                const [category] = await db
                    .select({
                        id: categories.id,
                        name: categories.name,
                    })
                    .from(categories)
                    .where(eq(categories.id, tool.categoryId))
                    .limit(1);

                return {
                    ...tool,
                    category,
                };
            })
        );

        return apiSuccess({
            categories: categoriesWithCount,
            stats: {
                totalTools,
                totalCategories,
                totalUsers,
            },
            featuredTools: toolsWithCategory,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
