import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { blogPosts, blogCategories, user } from "@/db/schema";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { eq, sql } from "drizzle-orm";

/**
 * GET /api/blog/posts/[slug]
 * Get a single blog post by slug
 * Also increments view count
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const db = await getDb();

        // Find post by slug
        const [post] = await db
            .select({
                id: blogPosts.id,
                title: blogPosts.title,
                slug: blogPosts.slug,
                content: blogPosts.content,
                excerpt: blogPosts.excerpt,
                featuredImage: blogPosts.featuredImage,
                category: {
                    id: blogCategories.id,
                    name: blogCategories.name,
                    slug: blogCategories.slug,
                },
                tags: blogPosts.tags,
                author: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                },
                publishedAt: blogPosts.publishedAt,
                viewCount: blogPosts.viewCount,
                metaDescription: blogPosts.metaDescription,
                metaKeywords: blogPosts.metaKeywords,
            })
            .from(blogPosts)
            .leftJoin(
                blogCategories,
                eq(blogPosts.categoryId, blogCategories.id),
            )
            .leftJoin(user, eq(blogPosts.authorId, user.id))
            .where(eq(blogPosts.slug, slug))
            .limit(1);

        if (!post) {
            return apiError("Blog post not found", "NOT_FOUND", 404);
        }

        // Only return published posts
        if (!post.id) {
            return apiError("Blog post not found", "NOT_FOUND", 404);
        }

        // Increment view count
        await db
            .update(blogPosts)
            .set({
                viewCount: sql`${blogPosts.viewCount} + 1`,
            })
            .where(eq(blogPosts.id, post.id));

        // Parse tags
        const postWithParsedTags = {
            ...post,
            tags: post.tags ? JSON.parse(post.tags) : [],
        };

        return apiSuccess(postWithParsedTags);
    } catch (error) {
        return handleApiError(error);
    }
}
