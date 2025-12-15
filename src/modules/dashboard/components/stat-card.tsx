import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
}: StatCardProps) {
    const getTrendIcon = () => {
        switch (trend) {
            case "up":
                return <ArrowUp className="h-4 w-4" />;
            case "down":
                return <ArrowDown className="h-4 w-4" />;
            case "neutral":
                return <Minus className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case "up":
                return "text-green-600 dark:text-green-400";
            case "down":
                return "text-red-600 dark:text-red-400";
            case "neutral":
                return "text-muted-foreground";
            default:
                return "";
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                {description && (
                    <div
                        className={cn(
                            "text-sm flex items-center gap-1 mt-1",
                            trend ? getTrendColor() : "text-muted-foreground",
                        )}
                    >
                        {getTrendIcon()}
                        <span>{description}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
