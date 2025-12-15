import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/db";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { ContactForm } from "@/modules/contacts/components/contact-form";
import { contacts } from "@/modules/contacts/schemas/contact.schema";

export default async function EditContactPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await requireAuth();
    const db = await getDb();

    const contact = await db.query.contacts.findFirst({
        where: eq(contacts.id, Number.parseInt(id)),
    });

    if (!contact) {
        notFound();
    }

    // Verify ownership
    if (contact.userId !== Number.parseInt(user.id)) {
        redirect("/dashboard/contacts");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Contact</h1>
                <p className="text-muted-foreground">
                    Update contact information
                </p>
            </div>

            <ContactForm initialData={contact} />
        </div>
    );
}
