"use server";

import { and, eq, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import {
    type Contact,
    contactTags,
    contacts,
    contactsToTags,
} from "@/modules/contacts/schemas/contact.schema";

export type ContactWithTags = Contact & {
    tags: Array<{ id: number; name: string; color: string }>;
};

export async function getContactsAction(
    searchQuery?: string,
    tagId?: number,
): Promise<ContactWithTags[]> {
    try {
        const user = await requireAuth();
        const db = await getDb();

        // Build the where clause
        const conditions = [eq(contacts.userId, Number.parseInt(user.id))];

        // Add search filter if provided
        if (searchQuery && searchQuery.trim() !== "") {
            const searchPattern = `%${searchQuery}%`;
            conditions.push(
                or(
                    sql`${contacts.firstName} LIKE ${searchPattern} COLLATE NOCASE`,
                    sql`${contacts.lastName} LIKE ${searchPattern} COLLATE NOCASE`,
                    sql`${contacts.email} LIKE ${searchPattern} COLLATE NOCASE`,
                    sql`${contacts.company} LIKE ${searchPattern} COLLATE NOCASE`,
                )!,
            );
        }

        // Fetch contacts with tags using LEFT JOIN
        const results = await db
            .select({
                id: contacts.id,
                firstName: contacts.firstName,
                lastName: contacts.lastName,
                email: contacts.email,
                phone: contacts.phone,
                company: contacts.company,
                jobTitle: contacts.jobTitle,
                notes: contacts.notes,
                userId: contacts.userId,
                createdAt: contacts.createdAt,
                updatedAt: contacts.updatedAt,
                tagId: contactTags.id,
                tagName: contactTags.name,
                tagColor: contactTags.color,
            })
            .from(contacts)
            .leftJoin(contactsToTags, eq(contacts.id, contactsToTags.contactId))
            .leftJoin(contactTags, eq(contactsToTags.tagId, contactTags.id))
            .where(and(...conditions))
            .orderBy(contacts.createdAt);

        // Group contacts with their tags
        const contactsMap = new Map<number, ContactWithTags>();

        for (const row of results) {
            if (!contactsMap.has(row.id)) {
                contactsMap.set(row.id, {
                    id: row.id,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email,
                    phone: row.phone,
                    company: row.company,
                    jobTitle: row.jobTitle,
                    notes: row.notes,
                    userId: row.userId,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    tags: [],
                });
            }

            // Add tag if exists
            if (row.tagId && row.tagName && row.tagColor) {
                const contact = contactsMap.get(row.id)!;
                contact.tags.push({
                    id: row.tagId,
                    name: row.tagName,
                    color: row.tagColor,
                });
            }
        }

        // Convert map to array
        let contactsArray = Array.from(contactsMap.values());

        // Filter by tag if specified
        if (tagId) {
            contactsArray = contactsArray.filter((contact) =>
                contact.tags.some((tag) => tag.id === tagId),
            );
        }

        return contactsArray;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}
