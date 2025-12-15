"use server";

import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { contacts } from "@/modules/contacts/schemas/contact.schema";
import { deals } from "@/modules/deals/schemas/deal.schema";

export interface DashboardMetrics {
    totalContacts: number;
    newContactsThisMonth: number;
    activeDeals: number;
    pipelineValue: number;
    dealsWonThisMonth: number;
    winRate: number;
}

export async function getDashboardMetricsAction(): Promise<DashboardMetrics> {
    try {
        const user = await requireAuth();
        const db = await getDb();
        const userId = Number.parseInt(user.id);

        // Calculate first day of current month
        const now = new Date();
        const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
            0,
            0,
            0,
            0,
        );
        const firstDayTimestamp = firstDayOfMonth.getTime();

        // Query 1: Total contacts
        const totalContactsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(contacts)
            .where(eq(contacts.userId, userId));

        const totalContacts = totalContactsResult[0]?.count || 0;

        // Query 2: New contacts this month
        const newContactsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(contacts)
            .where(
                and(
                    eq(contacts.userId, userId),
                    sql`${contacts.createdAt} >= ${firstDayTimestamp}`,
                ),
            );

        const newContactsThisMonth = newContactsResult[0]?.count || 0;

        // Query 3: Active deals (not closed)
        const activeDealsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(deals)
            .where(
                and(
                    eq(deals.userId, userId),
                    sql`${deals.stage} NOT IN ('Closed Won', 'Closed Lost')`,
                ),
            );

        const activeDeals = activeDealsResult[0]?.count || 0;

        // Query 4: Pipeline value (sum of active deal values)
        const pipelineValueResult = await db
            .select({
                total: sql<number>`COALESCE(SUM(${deals.value}), 0)`,
            })
            .from(deals)
            .where(
                and(
                    eq(deals.userId, userId),
                    sql`${deals.stage} NOT IN ('Closed Won', 'Closed Lost')`,
                ),
            );

        const pipelineValue = pipelineValueResult[0]?.total || 0;

        // Query 5: Deals won this month
        const dealsWonResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(deals)
            .where(
                and(
                    eq(deals.userId, userId),
                    eq(deals.stage, "Closed Won"),
                    sql`${deals.updatedAt} >= ${firstDayTimestamp}`,
                ),
            );

        const dealsWonThisMonth = dealsWonResult[0]?.count || 0;

        // Query 6: Win rate (percentage of closed deals that are won)
        const closedDealsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(deals)
            .where(
                and(
                    eq(deals.userId, userId),
                    sql`${deals.stage} IN ('Closed Won', 'Closed Lost')`,
                ),
            );

        const closedDeals = closedDealsResult[0]?.count || 0;

        const wonDealsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(deals)
            .where(
                and(eq(deals.userId, userId), eq(deals.stage, "Closed Won")),
            );

        const wonDeals = wonDealsResult[0]?.count || 0;

        // Calculate win rate (handle division by zero)
        const winRate = closedDeals > 0 ? (wonDeals / closedDeals) * 100 : 0;

        return {
            totalContacts,
            newContactsThisMonth,
            activeDeals,
            pipelineValue,
            dealsWonThisMonth,
            winRate,
        };
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        // Return zero values on error for graceful degradation
        return {
            totalContacts: 0,
            newContactsThisMonth: 0,
            activeDeals: 0,
            pipelineValue: 0,
            dealsWonThisMonth: 0,
            winRate: 0,
        };
    }
}
