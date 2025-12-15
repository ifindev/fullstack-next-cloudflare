import { ContactForm } from "@/modules/contacts/components/contact-form";

export default function NewContactPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">New Contact</h1>
                <p className="text-muted-foreground">
                    Add a new contact to your CRM
                </p>
            </div>

            <ContactForm />
        </div>
    );
}
