"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import {
    contacts,
    insertContactSchema,
} from "@/modules/contacts/schemas/contact.schema";
import contactsRoutes from "../contacts.route";

export async function createContactAction(formData: FormData) {
    try {
        const user = await requireAuth();

        // Extract form fields
        const contactData: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
            if (value && value !== "" && typeof value === "string") {
                contactData[key] = value;
            }
        }

        // Validate the data
        const validatedData = insertContactSchema.parse({
            ...contactData,
            userId: Number.parseInt(user.id),
        });

        const db = await getDb();
        await db.insert(contacts).values({
            ...validatedData,
            userId: Number.parseInt(user.id),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        revalidatePath(contactsRoutes.list);
        redirect(contactsRoutes.list);
    } catch (error) {
        // Handle Next.js redirect errors - these are not actual errors
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // Re-throw redirect errors as-is
        }

        console.error("Error creating contact:", error);

        if (
            error instanceof Error &&
            error.message === "Authentication required"
        ) {
            throw new Error("Authentication required");
        }

        throw new Error(
            error instanceof Error ? error.message : "Failed to create contact",
        );
    }
}
