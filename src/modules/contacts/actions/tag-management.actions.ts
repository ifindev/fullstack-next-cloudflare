"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import {
    type ContactTag,
    contactTags,
    contactsToTags,
    insertContactTagSchema,
    insertContactToTagSchema,
} from "@/modules/contacts/schemas/contact.schema";

/**
 * Create a new contact tag
 */
export async function createTagAction(data: {
    name: string;
    color: string;
}): Promise<ContactTag> {
    try {
        const user = await requireAuth();

        const validatedData = insertContactTagSchema.parse({
            ...data,
            userId: Number.parseInt(user.id),
        });

        const db = await getDb();
        const result = await db
            .insert(contactTags)
            .values({
                ...validatedData,
                userId: Number.parseInt(user.id),
                createdAt: Date.now(),
            })
            .returning();

        revalidatePath("/dashboard/contacts");
        return result[0];
    } catch (error) {
        console.error("Error creating tag:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to create tag",
        );
    }
}

/**
 * Get all tags for the current user
 */
export async function getTagsAction(): Promise<ContactTag[]> {
    try {
        const user = await requireAuth();
        const db = await getDb();

        const tags = await db
            .select()
            .from(contactTags)
            .where(eq(contactTags.userId, Number.parseInt(user.id)))
            .orderBy(contactTags.name);

        return tags;
    } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
    }
}

/**
 * Assign a tag to a contact
 */
export async function assignTagToContactAction(
    contactId: number,
    tagId: number,
): Promise<boolean> {
    try {
        const user = await requireAuth();
        const db = await getDb();

        // Verify user owns the contact
        const contact = await db.query.contacts.findFirst({
            where: eq(contactTags.id, contactId),
        });

        if (!contact || contact.userId !== Number.parseInt(user.id)) {
            throw new Error("Forbidden: Contact not found or not owned by user");
        }

        // Verify user owns the tag
        const tag = await db.query.contactTags.findFirst({
            where: eq(contactTags.id, tagId),
        });

        if (!tag || tag.userId !== Number.parseInt(user.id)) {
            throw new Error("Forbidden: Tag not found or not owned by user");
        }

        const validatedData = insertContactToTagSchema.parse({
            contactId,
            tagId,
        });

        // Check if assignment already exists
        const existing = await db.query.contactsToTags.findFirst({
            where: and(
                eq(contactsToTags.contactId, validatedData.contactId),
                eq(contactsToTags.tagId, validatedData.tagId),
            ),
        });

        if (existing) {
            return true; // Already assigned
        }

        await db.insert(contactsToTags).values(validatedData);

        revalidatePath("/dashboard/contacts");
        return true;
    } catch (error) {
        console.error("Error assigning tag:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to assign tag",
        );
    }
}

/**
 * Remove a tag from a contact
 */
export async function removeTagFromContactAction(
    contactId: number,
    tagId: number,
): Promise<boolean> {
    try {
        const user = await requireAuth();
        const db = await getDb();

        // Verify user owns the contact
        const contact = await db.query.contacts.findFirst({
            where: eq(contactTags.id, contactId),
        });

        if (!contact || contact.userId !== Number.parseInt(user.id)) {
            throw new Error("Forbidden: Contact not found or not owned by user");
        }

        await db
            .delete(contactsToTags)
            .where(
                and(
                    eq(contactsToTags.contactId, contactId),
                    eq(contactsToTags.tagId, tagId),
                ),
            );

        revalidatePath("/dashboard/contacts");
        return true;
    } catch (error) {
        console.error("Error removing tag:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to remove tag",
        );
    }
}

/**
 * Delete a tag (will cascade delete all assignments)
 */
export async function deleteTagAction(tagId: number): Promise<boolean> {
    try {
        const user = await requireAuth();
        const db = await getDb();

        // Verify ownership
        const existingTag = await db.query.contactTags.findFirst({
            where: eq(contactTags.id, tagId),
        });

        if (!existingTag) {
            throw new Error("Tag not found");
        }

        if (existingTag.userId !== Number.parseInt(user.id)) {
            throw new Error("Forbidden: You do not own this tag");
        }

        await db.delete(contactTags).where(eq(contactTags.id, tagId));

        revalidatePath("/dashboard/contacts");
        return true;
    } catch (error) {
        console.error("Error deleting tag:", error);
        throw new Error(
            error instanceof Error ? error.message : "Failed to delete tag",
        );
    }
}
