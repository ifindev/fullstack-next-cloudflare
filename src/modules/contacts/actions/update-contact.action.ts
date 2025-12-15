"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import {
    contacts,
    updateContactSchema,
} from "@/modules/contacts/schemas/contact.schema";
import contactsRoutes from "../contacts.route";

export async function updateContactAction(id: number, formData: FormData) {
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

        // Extract form fields
        const contactData: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
            if (typeof value === "string") {
                contactData[key] = value;
            }
        }

        // Validate the data
        const validatedData = updateContactSchema.parse(contactData);

        // Update contact
        await db
            .update(contacts)
            .set({
                ...validatedData,
                updatedAt: Date.now(),
            })
            .where(eq(contacts.id, id));

        revalidatePath(contactsRoutes.list);
        redirect(contactsRoutes.list);
    } catch (error) {
        // Handle Next.js redirect errors - these are not actual errors
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Re-throw redirect errors as-is
        }

        console.error("Error updating contact:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to update contact",
        );
    }
}
