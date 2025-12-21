import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { toolSubmissions, categories, user } from "@/db/schema";
import {
    apiSuccess,
    parsePagination,
    createPaginationMeta,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { eq, desc, and, sql } from "drizzle-orm";

/**
 * GET /api/admin/submissions
 * Get all tool submissions for review (Admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Require admin authentication
        await requireAdmin(request);

        const { searchParams } = new URL(request.url);
        const db = await getDb();

        const status = searchParams.get("status"); // 'pending' | 'approved' | 'rejected'
        const { page, limit, offset } = parsePagination(searchParams);

        // Build conditions
        const conditions = [];
        if (status) {
            conditions.push(eq(toolSubmissions.status, status as any));
        }

        // Get total count
        const [{ count: total }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(toolSubmissions)
            .where(conditions.length > 0 ? and(...conditions) : undefined);

        // Get submissions with related data
        const submissions = await db
            .select({
                id: toolSubmissions.id,
                name: toolSubmissions.name,
                url: toolSubmissions.url,
                description: toolSubmissions.description,
                logoUrl: toolSubmissions.logoUrl,
                category: {
                    id: categories.id,
                    name: categories.name,
                },
                status: toolSubmissions.status,
                emailVerified: toolSubmissions.emailVerified,
                submitter: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                email: toolSubmissions.email,
                createdAt: toolSubmissions.createdAt,
                reviewedAt: toolSubmissions.reviewedAt,
                rejectionReason: toolSubmissions.rejectionReason,
            })
            .from(toolSubmissions)
            .leftJoin(categories, eq(toolSubmissions.categoryId, categories.id))
            .leftJoin(user, eq(toolSubmissions.submittedBy, user.id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(toolSubmissions.createdAt))
            .limit(limit)
            .offset(offset);

        return apiSuccess(
            submissions,
            createPaginationMeta(page, limit, total),
        );
    } catch (error) {
        return handleApiError(error);
    }
}
