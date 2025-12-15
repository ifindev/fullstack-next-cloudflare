"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { deals, updateDealSchema } from "@/modules/deals/schemas/deal.schema";
import dealsRoutes from "../deals.route";

export async function updateDealAction(id: number, formData: FormData) {
    try {
        const user = await requireAuth();
        const db = await getDb();

        // Verify ownership
        const existingDeal = await db.query.deals.findFirst({
            where: eq(deals.id, id),
        });

        if (!existingDeal) {
            throw new Error("Deal not found");
        }

        if (existingDeal.userId !== Number.parseInt(user.id)) {
            throw new Error("Forbidden: You do not own this deal");
        }

        // Extract form fields
        const dealData: Record<string, string | number | null> = {};
        for (const [key, value] of formData.entries()) {
            if (typeof value === "string") {
                // Handle numeric fields
                if (key === "value") {
                    dealData[key] = Number.parseFloat(value);
                } else if (key === "contactId") {
                    const numValue = Number.parseInt(value);
                    dealData[key] = Number.isNaN(numValue) ? null : numValue;
                } else if (key === "expectedCloseDate") {
                    // Convert YYYY-MM-DD to unix timestamp
                    dealData[key] = value ? new Date(value).getTime() : null;
                } else {
                    dealData[key] = value;
                }
            }
        }

        // Validate the data
        const validatedData = updateDealSchema.parse(dealData);

        // Update deal
        await db
            .update(deals)
            .set({
                ...validatedData,
                updatedAt: Date.now(),
            })
            .where(eq(deals.id, id));

        revalidatePath(dealsRoutes.board);
        redirect(dealsRoutes.board);
    } catch (error) {
        // Handle Next.js redirect errors - these are not actual errors
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Re-throw redirect errors as-is
        }

        console.error("Error updating deal:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to update deal",
        );
    }
}
