import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getContactsAction } from "@/modules/contacts/actions/get-contacts.action";
import { ContactCard } from "@/modules/contacts/components/contact-card";
import contactsRoutes from "@/modules/contacts/contacts.route";

export default async function ContactsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; tag?: string }>;
}) {
    const params = await searchParams;
    const contacts = await getContactsAction(
        params.search,
        params.tag ? Number.parseInt(params.tag) : undefined,
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Contacts</h1>
                    <p className="text-muted-foreground">
                        Manage your CRM contacts
                    </p>
                </div>
                <Button asChild>
                    <Link href={contactsRoutes.new}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Contact
                    </Link>
                </Button>
            </div>

            <div className="flex gap-4">
                <form className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="search"
                            placeholder="Search contacts by name, email, or company..."
                            className="pl-10"
                            defaultValue={params.search}
                        />
                    </div>
                </form>
            </div>

            {contacts.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                        No contacts found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {params.search
                            ? "Try adjusting your search query"
                            : "Get started by creating your first contact"}
                    </p>
                    {!params.search && (
                        <Button asChild>
                            <Link href={contactsRoutes.new}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Contact
                            </Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))}
                </div>
            )}

            <div className="text-sm text-muted-foreground text-center">
                Showing {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
