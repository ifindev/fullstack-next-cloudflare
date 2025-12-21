import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { categories, tools } from "@/db/schema";
import { nanoid } from "nanoid";

// 导入数据 - 由 import-tools.ts 脚本生成
import importData from "@/data/import-tools.json";

/**
 * Import Tools API
 * POST /api/dev/import-tools
 * 将 Excel 数据导入到 D1 数据库
 * 
 * 注意：此端点仅用于开发/初始化数据库
 */
export async function POST(request: Request) {
    try {
        // 简单的安全检查
        const { searchParams } = new URL(request.url);
        const confirmKey = searchParams.get("confirm");
        
        if (confirmKey !== "yes-import-all") {
            return NextResponse.json({
                error: "Safety check failed",
                message: "Add ?confirm=yes-import-all to confirm import",
                preview: {
                    categories: (importData as any).categories.length,
                    tools: (importData as any).tools.length
                }
            }, { status: 400 });
        }

        const { env } = await getCloudflareContext();
        const db = drizzle(env.next_cf_app);

        const data = importData as any;
        const results = {
            categoriesInserted: 0,
            categoriesUpdated: 0,
            toolsInserted: 0,
            errors: [] as string[]
        };

        // 1. 插入分类 (先插入父分类，再插入子分类)
        console.log(`Importing ${data.categories.length} categories...`);
        
        // 先排序：父分类在前
        const sortedCategories = [...data.categories].sort((a: any, b: any) => {
            if (a.parentId === null && b.parentId !== null) return -1;
            if (a.parentId !== null && b.parentId === null) return 1;
            return 0;
        });

        for (const cat of sortedCategories) {
            try {
                await db.insert(categories).values({
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    parentId: cat.parentId,
                    icon: cat.icon,
                    description: cat.description,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }).onConflictDoUpdate({
                    target: categories.id,
                    set: {
                        name: cat.name,
                        slug: cat.slug,
                        icon: cat.icon,
                        description: cat.description,
                        updatedAt: new Date()
                    }
                });
                results.categoriesInserted++;
            } catch (error: any) {
                results.errors.push(`Category ${cat.name}: ${error.message}`);
            }
        }

        // 2. 插入工具
        console.log(`Importing ${data.tools.length} tools...`);
        
        for (const tool of data.tools) {
            try {
                await db.insert(tools).values({
                    id: tool.id,
                    name: tool.name,
                    description: tool.description,
                    url: tool.url,
                    logoUrl: tool.logoUrl,
                    categoryId: tool.categoryId,
                    isFeatured: tool.isFeatured,
                    isPublished: tool.isPublished,
                    viewCount: tool.viewCount,
                    createdAt: new Date(tool.createdAt),
                    updatedAt: new Date(tool.updatedAt)
                });
                results.toolsInserted++;
            } catch (error: any) {
                // 如果是主键冲突，跳过
                if (error.message?.includes("UNIQUE constraint")) {
                    results.errors.push(`Tool ${tool.name}: Already exists (skipped)`);
                } else {
                    results.errors.push(`Tool ${tool.name}: ${error.message}`);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Import completed",
            results
        });

    } catch (error: any) {
        console.error("Import error:", error);
        return NextResponse.json({
            error: "Import failed",
            message: error.message
        }, { status: 500 });
    }
}

/**
 * GET /api/dev/import-tools
 * 预览将要导入的数据
 */
export async function GET() {
    const data = importData as any;
    
    return NextResponse.json({
        message: "Import preview - use POST with ?confirm=yes-import-all to execute",
        statistics: {
            totalCategories: data.categories.length,
            parentCategories: data.categories.filter((c: any) => c.parentId === null).length,
            subCategories: data.categories.filter((c: any) => c.parentId !== null).length,
            totalTools: data.tools.length,
            featuredTools: data.tools.filter((t: any) => t.isFeatured).length
        },
        categories: data.categories.map((c: any) => ({
            name: c.name,
            slug: c.slug,
            isParent: c.parentId === null
        })),
        sampleTools: data.tools.slice(0, 10).map((t: any) => ({
            name: t.name,
            url: t.url,
            logoUrl: t.logoUrl,
            isFeatured: t.isFeatured
        }))
    });
}
