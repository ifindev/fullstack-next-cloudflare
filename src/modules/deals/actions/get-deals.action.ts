"use server";

import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { contacts } from "@/modules/contacts/schemas/contact.schema";
import { type Deal, deals } from "@/modules/deals/schemas/deal.schema";
import type { DealStageType } from "../models/deal.enum";

export type DealWithContact = Deal & {
    contactName: string | null;
    contactEmail: string | null;
};

export async function getDealsAction(
    stage?: DealStageType,
    contactId?: number,
): Promise<DealWithContact[]> {
    try {
        const user = await requireAuth();
        const db = await getDb();

        // Build the where clause
        const conditions = [eq(deals.userId, Number.parseInt(user.id))];

        // Add stage filter if provided
        if (stage) {
            conditions.push(eq(deals.stage, stage));
        }

        // Add contact filter if provided
        if (contactId) {
            conditions.push(eq(deals.contactId, contactId));
        }

        // Fetch deals with contact info using LEFT JOIN
        const results = await db
            .select({
                id: deals.id,
                title: deals.title,
                contactId: deals.contactId,
                value: deals.value,
                currency: deals.currency,
                stage: deals.stage,
                expectedCloseDate: deals.expectedCloseDate,
                description: deals.description,
                userId: deals.userId,
                createdAt: deals.createdAt,
                updatedAt: deals.updatedAt,
                contactName: sql<string | null>`${contacts.firstName} || ' ' || ${contacts.lastName}`,
                contactEmail: contacts.email,
            })
            .from(deals)
            .leftJoin(contacts, eq(deals.contactId, contacts.id))
            .where(and(...conditions))
            .orderBy(deals.createdAt);

        return results;
    } catch (error) {
        console.error("Error fetching deals:", error);
        return [];
    }
}
