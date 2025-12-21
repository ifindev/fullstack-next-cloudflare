import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { createBlogPostSchema } from "@/lib/validations/blog.schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * POST /api/admin/blog/posts
 * Create a new blog post (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireAdmin(request);
        const db = await getDb();

        // Validate request body
        const validation = await validateRequest(request, createBlogPostSchema);
        if (!validation.success) {
            return validation.error;
        }

        const data = validation.data as any;

        // Check if slug already exists
        const [existing] = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.slug, data.slug))
            .limit(1);

        if (existing) {
            return apiError(
                "A blog post with this slug already exists",
                "CONFLICT",
                409,
            );
        }

        // Create blog post
        const postId = nanoid();
        const [post] = await db
            .insert(blogPosts)
            .values({
                id: postId,
                title: data.title,
                slug: data.slug,
                content: data.content,
                excerpt: data.excerpt,
                featuredImage: data.featuredImage,
                categoryId: data.categoryId || null,
                tags: data.tags ? JSON.stringify(data.tags) : null,
                authorId: session.user.id,
                status: data.status || "draft",
                isPublished: data.isPublished || false,
                publishedAt: data.publishedAt
                    ? new Date(data.publishedAt)
                    : null,
                metaDescription: data.metaDescription,
                metaKeywords: data.metaKeywords,
                viewCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        return apiSuccess(
            {
                ...post,
                tags: post.tags ? JSON.parse(post.tags) : [],
            },
            undefined,
            201,
        );
    } catch (error) {
        return handleApiError(error);
    }
}
