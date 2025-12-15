import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface QuickActionCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
}

export function QuickActionCard({
    title,
    description,
    href,
    icon: Icon,
}: QuickActionCardProps) {
    return (
        <Link href={href} className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{title}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>{description}</CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
}
