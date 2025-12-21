import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { toolSubmissions } from "@/db/schema";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { requireAdmin } from "@/lib/auth-helpers";
import { sendRejectionEmail } from "@/lib/email";
import { rejectSubmissionSchema } from "@/lib/validations/submission.schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/admin/submissions/[id]/reject
 * Reject a submission (Admin only)
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
            rejectSubmissionSchema,
        );
        if (!validation.success) {
            return validation.error;
        }

        const { reason } = validation.data as any;

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

        // Update submission status
        await db
            .update(toolSubmissions)
            .set({
                status: "rejected",
                rejectionReason: reason,
                rejectedAt: new Date(),
                rejectedBy: session.user.id,
                reviewedAt: new Date(),
                reviewedBy: session.user.id,
                updatedAt: new Date(),
            })
            .where(eq(toolSubmissions.id, id));

        // Send rejection email with reason to submitter
        if (submission.email) {
            await sendRejectionEmail(submission.email, submission.name, reason);
        }

        return apiSuccess({
            id: submission.id,
            status: "rejected",
            rejectionReason: reason,
            reviewedAt: new Date(),
        });
    } catch (error) {
        return handleApiError(error);
    }
}
