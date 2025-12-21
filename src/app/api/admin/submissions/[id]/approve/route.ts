import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { toolSubmissions, tools } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { sendApprovalEmail } from "@/lib/email";
import { approveSubmissionSchema } from "@/lib/validations/submission.schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * POST /api/admin/submissions/[id]/approve
 * Approve a submission and create the tool (Admin only)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await requireAdmin(request);
        const { id } = await params;
        const db = await getDb();

        // Validate request body
        const validation = await validateRequest(
            request,
            approveSubmissionSchema,
        );
        if (!validation.success) {
            return validation.error;
        }

        const { isFeatured, isPublished } = validation.data as any;

        // Get submission
        const [submission] = await db
            .select()
            .from(toolSubmissions)
            .where(eq(toolSubmissions.id, id))
            .limit(1);

        if (!submission) {
            return apiError("Submission not found", "NOT_FOUND", 404);
        }

        if (submission.status !== "pending") {
            return apiError("Submission already reviewed", "CONFLICT", 409, {
                currentStatus: submission.status,
            });
        }

        // Create tool from submission
        const toolId = nanoid();
        const [tool] = await db
            .insert(tools)
            .values({
                id: toolId,
                name: submission.name,
                url: submission.url,
                description: submission.description,
                logoUrl: submission.logoUrl,
                categoryId: submission.categoryId,
                isFeatured: isFeatured || false,
                isPublished: isPublished ?? true,
                submissionId: submission.id,
                submittedBy: submission.submittedBy,
                viewCount: 0,
                clickCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        // Update submission status
        await db
            .update(toolSubmissions)
            .set({
                status: "approved",
                toolId: tool.id,
                reviewedAt: new Date(),
                reviewedBy: session.user.id,
                updatedAt: new Date(),
            })
            .where(eq(toolSubmissions.id, id));

        // Send approval email to submitter
        if (submission.email) {
            // Construct tool URL (assuming /tools/[id] or /tools/[slug])
            // Since we don't have slug yet, using ID or just base URL
            const toolUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tools/${tool.id}`;
            await sendApprovalEmail(submission.email, submission.name, toolUrl);
        }

        return apiSuccess({
            tool,
            submission: {
                id: submission.id,
                status: "approved",
                reviewedAt: new Date(),
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}
