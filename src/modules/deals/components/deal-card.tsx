import { Calendar, Edit, Mail, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DealWithContact } from "../actions/get-deals.action";
import dealsRoutes from "../deals.route";
import { DeleteDeal } from "./delete-deal";

interface DealCardProps {
    deal: DealWithContact;
}

const stageColors: Record<string, string> = {
    Prospecting: "bg-blue-100 text-blue-800 border-blue-200",
    Qualification: "bg-purple-100 text-purple-800 border-purple-200",
    Proposal: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Negotiation: "bg-orange-100 text-orange-800 border-orange-200",
    "Closed Won": "bg-green-100 text-green-800 border-green-200",
    "Closed Lost": "bg-gray-100 text-gray-800 border-gray-200",
};

export function DealCard({ deal }: DealCardProps) {
    const formatCurrency = (value: number, currency: string) => {
        return new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: currency,
        }).format(value);
    };

    const formatDate = (timestamp: number | null) => {
        if (!timestamp) return null;
        return new Date(timestamp).toLocaleDateString("en-AU", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-tight mb-2">
                            {deal.title}
                        </h3>
                        <div className="text-2xl font-bold text-primary">
                            {formatCurrency(deal.value, deal.currency)}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={dealsRoutes.edit(deal.id)}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <DeleteDeal dealId={deal.id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {deal.contactName && (
                    <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{deal.contactName}</span>
                    </div>
                )}

                {deal.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                            href={`mailto:${deal.contactEmail}`}
                            className="text-primary hover:underline truncate"
                        >
                            {deal.contactEmail}
                        </a>
                    </div>
                )}

                {deal.expectedCloseDate && (
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(deal.expectedCloseDate)}</span>
                    </div>
                )}

                {deal.description && (
                    <p className="text-sm text-muted-foreground border-t pt-3 mt-3 line-clamp-2">
                        {deal.description}
                    </p>
                )}

                <div className="pt-2">
                    <Badge className={`border ${stageColors[deal.stage] || ""}`}>
                        {deal.stage}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
