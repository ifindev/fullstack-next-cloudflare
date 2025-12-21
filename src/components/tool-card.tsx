import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

/**
 * Pricing Badge Component
 * Displays tool pricing type (Free, Freemium, Paid)
 */
export function PricingBadge({
    pricing,
    size = "sm",
}: {
    pricing: "Free" | "Freemium" | "Paid" | string;
    size?: "sm" | "md";
}) {
    // Display pricing as-is in English
    const displayLabel = pricing || "Free";

    // Apple-style: No colors, only black/white/gray with border
    const borderStyle =
        "border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary";

    return (
        <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${borderStyle} ${size === "md" ? "text-sm px-3 py-1.5" : ""}`}
        >
            {displayLabel}
        </span>
    );
}

/**
 * Category Badge Component
 * Displays tool category
 */
export function CategoryBadge({
    category,
    size = "sm",
}: {
    category: string;
    size?: "sm" | "md";
}) {
    return (
        <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary ${size === "md" ? "text-sm px-3 py-1.5" : ""}`}
        >
            {category}
        </span>
    );
}

/**
 * Tool Card Component
 * Displays individual tool information in a card format
 * Based on COMPONENT_INVENTORY.md specification
 */
export function ToolCard({
    id,
    name,
    logo,
    description,
    category,
    pricing = "Free",
    isFeatured = false,
    url,
}: {
    id: string;
    name: string;
    logo?: string | null;
    description: string;
    category: {
        id: string;
        name: string;
    };
    pricing?: "Free" | "Freemium" | "Paid";
    isFeatured?: boolean;
    url: string;
}) {
    return (
        <Link href={`/tools/${id}`}>
            <div className="group h-full bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary hover:scale-[1.02]">
                <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        {logo ? (
                            <Image
                                src={logo}
                                alt={name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-md bg-light-text-primary dark:bg-dark-text-primary flex items-center justify-center text-light-bg-primary dark:text-dark-bg-primary font-bold text-xl">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Title and Featured Badge */}
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary truncate transition-colors">
                                {name}
                            </h3>
                            {isFeatured && (
                                <Star
                                    className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary fill-light-text-primary dark:fill-dark-text-primary flex-shrink-0"
                                    aria-label="Featured"
                                />
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-3">
                            {description}
                        </p>

                        {/* Category and Pricing */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <CategoryBadge category={category.name} />
                            <PricingBadge pricing={pricing} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

/**
 * Tool Card Skeleton
 * Loading placeholder for tool cards
 */
export function ToolCardSkeleton() {
    return (
        <div className="h-full bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6 shadow-sm border border-light-border dark:border-dark-border animate-pulse">
            <div className="flex items-start gap-4">
                {/* Logo skeleton */}
                <div className="w-16 h-16 rounded-md bg-light-bg-tertiary dark:bg-dark-bg-tertiary" />

                {/* Content skeleton */}
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-3/4" />
                    <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-full" />
                    <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-5/6" />
                    <div className="flex gap-2">
                        <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-20" />
                        <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}
