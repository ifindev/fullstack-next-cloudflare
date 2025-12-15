"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { deals } from "@/modules/deals/schemas/deal.schema";
import dealsRoutes from "../deals.route";

export async function deleteDealAction(id: number): Promise<boolean> {
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

        // Delete deal
        await db.delete(deals).where(eq(deals.id, id));

        revalidatePath(dealsRoutes.board);
        return true;
    } catch (error) {
        console.error("Error deleting deal:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to delete deal",
        );
    }
}
