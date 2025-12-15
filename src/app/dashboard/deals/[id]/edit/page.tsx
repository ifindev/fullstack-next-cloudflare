import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { contacts } from "@/modules/contacts/schemas/contact.schema";
import { DealForm } from "@/modules/deals/components/deal-form";
import { deals } from "@/modules/deals/schemas/deal.schema";

export default async function EditDealPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await requireAuth();
    const db = await getDb();

    // Fetch the deal with contact info
    const deal = await db.query.deals.findFirst({
        where: eq(deals.id, Number.parseInt(id)),
    });

    if (!deal) {
        notFound();
    }

    // Verify ownership
    if (deal.userId !== Number.parseInt(user.id)) {
        redirect("/dashboard/deals");
    }

    // Fetch user's contacts for the dropdown
    const userContacts = await db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, Number.parseInt(user.id)))
        .orderBy(contacts.firstName);

    // Convert to DealWithContact type
    const dealWithContact = {
        ...deal,
        contactName: null,
        contactEmail: null,
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Deal</h1>
                <p className="text-muted-foreground">Update deal information</p>
            </div>

            <DealForm initialData={dealWithContact} contacts={userContacts} />
        </div>
    );
}
