import { Building2, Edit, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ContactWithTags } from "../actions/get-contacts.action";
import contactsRoutes from "../contacts.route";
import { DeleteContact } from "./delete-contact";

interface ContactCardProps {
    contact: ContactWithTags;
}

export function ContactCard({ contact }: ContactCardProps) {
    const fullName = [contact.firstName, contact.lastName]
        .filter(Boolean)
        .join(" ");

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold text-lg leading-tight">
                                {fullName || "No name"}
                            </h3>
                        </div>
                        {contact.jobTitle && (
                            <p className="text-sm text-muted-foreground">
                                {contact.jobTitle}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={contactsRoutes.edit(contact.id)}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <DeleteContact contactId={contact.id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {contact.company && (
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.company}</span>
                    </div>
                )}

                {contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                            href={`mailto:${contact.email}`}
                            className="text-primary hover:underline"
                        >
                            {contact.email}
                        </a>
                    </div>
                )}

                {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                            href={`tel:${contact.phone}`}
                            className="text-primary hover:underline"
                        >
                            {contact.phone}
                        </a>
                    </div>
                )}

                {contact.notes && (
                    <p className="text-sm text-muted-foreground border-t pt-3 mt-3">
                        {contact.notes}
                    </p>
                )}

                {contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {contact.tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                style={{
                                    backgroundColor: `${tag.color}20`,
                                    color: tag.color,
                                    borderColor: tag.color,
                                }}
                                className="border"
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
