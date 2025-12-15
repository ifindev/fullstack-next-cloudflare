"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { contacts } from "@/modules/contacts/schemas/contact.schema";

export async function deleteContactAction(id: number): Promise<boolean> {
    try {
        const user = await requireAuth();
        const db = await getDb();

        // Verify ownership
        const existingContact = await db.query.contacts.findFirst({
            where: eq(contacts.id, id),
        });

        if (!existingContact) {
            throw new Error("Contact not found");
        }

        if (existingContact.userId !== Number.parseInt(user.id)) {
            throw new Error("Forbidden: You do not own this contact");
        }

        // Delete contact (tags will be cascade deleted)
        await db.delete(contacts).where(eq(contacts.id, id));

        revalidatePath("/dashboard/contacts");
        return true;
    } catch (error) {
        console.error("Error deleting contact:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to delete contact",
        );
    }
}
