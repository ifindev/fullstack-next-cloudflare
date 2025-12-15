import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { contacts } from "@/modules/contacts/schemas/contact.schema";
import { DealForm } from "@/modules/deals/components/deal-form";
import { eq } from "drizzle-orm";

export default async function NewDealPage() {
    const user = await requireAuth();
    const db = await getDb();

    // Fetch user's contacts for the dropdown
    const userContacts = await db
        .select()
        .from(contacts)
        .where(eq(contacts.userId, Number.parseInt(user.id)))
        .orderBy(contacts.firstName);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">New Deal</h1>
                <p className="text-muted-foreground">
                    Add a new deal to your pipeline
                </p>
            </div>

            <DealForm contacts={userContacts} />
        </div>
    );
}
