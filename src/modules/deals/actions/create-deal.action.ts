"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { deals, insertDealSchema } from "@/modules/deals/schemas/deal.schema";
import dealsRoutes from "../deals.route";

export async function createDealAction(formData: FormData) {
    try {
        const user = await requireAuth();

        // Extract form fields
        const dealData: Record<string, string | number> = {};
        for (const [key, value] of formData.entries()) {
            if (value && value !== "" && typeof value === "string") {
                // Handle numeric fields
                if (key === "value") {
                    dealData[key] = Number.parseFloat(value);
                } else if (key === "contactId") {
                    const numValue = Number.parseInt(value);
                    if (!Number.isNaN(numValue)) {
                        dealData[key] = numValue;
                    }
                } else if (key === "expectedCloseDate") {
                    // Convert YYYY-MM-DD to unix timestamp
                    dealData[key] = new Date(value).getTime();
                } else {
                    dealData[key] = value;
                }
            }
        }

        // Validate the data
        const validatedData = insertDealSchema.parse({
            ...dealData,
            userId: Number.parseInt(user.id),
        });

        const db = await getDb();
        await db.insert(deals).values({
            ...validatedData,
            userId: Number.parseInt(user.id),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        revalidatePath(dealsRoutes.board);
        redirect(dealsRoutes.board);
    } catch (error) {
        // Handle Next.js redirect errors - these are not actual errors
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Re-throw redirect errors as-is
        }

        console.error("Error creating deal:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to create deal",
        );
    }
}
