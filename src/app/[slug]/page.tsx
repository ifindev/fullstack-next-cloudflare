import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { categories, tools } from "@/db/schema";
import { eq, desc, isNull } from "drizzle-orm";
import { ToolCard } from "@/components/tool-card";
import { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const db = await getDb();
    
    const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

    if (!category) {
        return {};
    }

    return {
        title: `${category.name} - Toolsail`,
        description: category.description || `Best ${category.name} tools and resources.`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const db = await getDb();

    // 1. Fetch Current Category
    const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

    if (!category) {
        notFound();
    }

    // 2. Fetch All Top-Level Categories for Filter Buttons
    const allCategories = await db
        .select()
        .from(categories)
        .where(isNull(categories.parentId))
        .orderBy(categories.displayOrder);

    // 3. Fetch Subcategories under Current Category (if it's a parent category)
    const subcategories = await db
        .select()
        .from(categories)
        .where(eq(categories.parentId, category.id))
        .orderBy(categories.displayOrder);

    // 4. Fetch Tools - Group by subcategory if subcategories exist
    let toolsByCategory: Array<{
        category: typeof categories.$inferSelect;
        tools: Array<typeof tools.$inferSelect>;
    }> = [];

    if (subcategories.length > 0) {
        // Has subcategories - group tools by subcategory
        for (const subcat of subcategories) {
            const subcatTools = await db
                .select()
                .from(tools)
                .where(eq(tools.categoryId, subcat.id))
                .orderBy(desc(tools.isFeatured), desc(tools.viewCount));

            if (subcatTools.length > 0) {
                toolsByCategory.push({
                    category: subcat,
                    tools: subcatTools,
                });
            }
        }
    } else {
        // No subcategories - just get tools directly under this category
        const categoryTools = await db
            .select()
            .from(tools)
            .where(eq(tools.categoryId, category.id))
            .orderBy(desc(tools.isFeatured), desc(tools.viewCount));

        if (categoryTools.length > 0) {
            toolsByCategory.push({
                category: category,
                tools: categoryTools,
            });
        }
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-light-bg-primary dark:bg-dark-bg-primary py-12 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="text-lg md:text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8">
                                {category.description}
                            </p>
                        )}

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <input
                                    type="text"
                                    placeholder="Search tools..."
                                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary focus:border-transparent text-base"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter Buttons - Show Subcategories */}
            <section className="border-b border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {subcategories.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-3 overflow-x-auto">
                            {subcategories.map((subcat) => (
                                <Link
                                    key={subcat.id}
                                    href={`#${subcat.slug}`}
                                    className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary whitespace-nowrap"
                                >
                                    {subcat.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Tools Grid - Grouped by Subcategory */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {toolsByCategory.length > 0 ? (
                        <div className="space-y-12">
                            {toolsByCategory.map(({ category: subcat, tools: subcatTools }) => (
                                <div key={subcat.id}>
                                    {/* Subcategory Title */}
                                    <div className="mb-6">
                                        <h2 className="text-2xl md:text-3xl font-bold text-light-text-primary dark:text-dark-text-primary flex items-center gap-3">
                                            {subcat.name}
                                        </h2>
                                        {subcat.description && (
                                            <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
                                                {subcat.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tools Grid for this Subcategory */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {subcatTools.map((tool) => (
                                            <ToolCard
                                                key={tool.id}
                                                id={tool.id}
                                                name={tool.name}
                                                logo={tool.logoUrl}
                                                description={tool.description}
                                                category={{
                                                    id: subcat.id,
                                                    name: subcat.name,
                                                }}
                                                url={tool.url}
                                                isFeatured={tool.isFeatured}
                                                pricing={tool.pricing as "Free" | "Freemium" | "Paid"}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary mb-4">
                                <Search className="w-8 h-8 text-light-text-tertiary dark:text-dark-text-tertiary" />
                            </div>
                            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                                No tools found
                            </h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary max-w-md mx-auto">
                                We haven't added any tools to this category yet. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
