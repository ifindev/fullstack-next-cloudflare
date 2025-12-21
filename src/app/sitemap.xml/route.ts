import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { tools as toolsTable, blogPosts, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /sitemap.xml
 * 动态生成 XML Sitemap
 * 包含：首页、工具页、博客页、静态页面
 */
export async function GET(request: NextRequest) {
    try {
        const baseUrl = "https://next-cf-app.lindalu125.workers.dev";
        const db = await getDb();

        // 获取所有已发布的工具
        const tools = await db
            .select({
                id: toolsTable.id,
                updatedAt: toolsTable.updatedAt
            })
            .from(toolsTable)
            .where(eq(toolsTable.isPublished, true));

        // 获取所有已发布的博客文章
        const posts = await db
            .select({
                slug: blogPosts.slug,
                updatedAt: blogPosts.updatedAt
            })
            .from(blogPosts)
            .where(eq(blogPosts.isPublished, true));

        // 获取所有分类
        const cats = await db
            .select({
                slug: categories.slug
            })
            .from(categories);

        // 构建 sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- 首页 -->
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    
    <!-- AI Tools 页 -->
    <url>
        <loc>${baseUrl}/ai-tools</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    
    <!-- Digital Tools 页 -->
    <url>
        <loc>${baseUrl}/digital-tools</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    
    <!-- 工具详情页 -->
    ${tools.map(tool => `    <url>
        <loc>${baseUrl}/tools/${tool.id}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        <lastmod>${new Date(tool.updatedAt).toISOString()}</lastmod>
    </url>`).join('\n')}
    
    <!-- 博客列表页 -->
    <url>
        <loc>${baseUrl}/blog</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    
    <!-- 博客文章页 -->
    ${posts.map(post => `    <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
        <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    </url>`).join('\n')}
    
    <!-- 搜索页 -->
    <url>
        <loc>${baseUrl}/search</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>
    
    <!-- 提交页面 -->
    <url>
        <loc>${baseUrl}/submit</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- About 页 -->
    <url>
        <loc>${baseUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    
    <!-- Privacy 页 -->
    <url>
        <loc>${baseUrl}/privacy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    
    <!-- Terms 页 -->
    <url>
        <loc>${baseUrl}/terms</loc>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
</urlset>`;

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=7200' // 缓存 1-2 小时
            }
        });

    } catch (error) {
        console.error('Sitemap generation error:', error);
        
        // 返回基本 sitemap
        const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://next-cf-app.lindalu125.workers.dev/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;
        
        return new Response(basicSitemap, {
            headers: {
                'Content-Type': 'application/xml'
            }
        });
    }
}
