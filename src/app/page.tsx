import Link from "next/link";
import { ArrowRight, Search, Sparkles, Wrench, Users, FolderTree } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { StatCard } from "@/components/stat-card";
import { FAQItem } from "@/components/faq-item";
import { JsonLd, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo-utils";
import { getDb } from "@/db";
import { categories as categoriesTable, tools, user } from "@/db/schema";
import { sql, isNull, eq, desc } from "drizzle-orm";

/**
 * Home Page
 * 首页 - 包含Hero、统计数据、精选工具、分类浏览、使用流程和FAQ
 */
export default async function HomePage() {
    // 直接从数据库获取首页数据（避免 fetch 在 Cloudflare Workers 中的问题）
    let categories: any[] = [];
    let stats = {
        totalTools: 0,
        totalCategories: 0,
        totalUsers: 0,
    };
    let featuredTools: any[] = [];

    try {
        const db = await getDb();

        // 1. 获取顶级分类
        const topLevelCategories = await db
            .select({
                id: categoriesTable.id,
                name: categoriesTable.name,
                slug: categoriesTable.slug,
                icon: categoriesTable.icon,
                description: categoriesTable.description,
            })
            .from(categoriesTable)
            .where(isNull(categoriesTable.parentId))
            .orderBy(categoriesTable.displayOrder);

        // 2. 为每个分类统计工具数
        categories = await Promise.all(
            topLevelCategories.map(async (category) => {
                const subcats = await db
                    .select({ id: categoriesTable.id })
                    .from(categoriesTable)
                    .where(eq(categoriesTable.parentId, category.id));

                const subcatIds = subcats.map((sc) => sc.id);
                let toolCount = 0;

                if (subcatIds.length > 0) {
                    const [result] = await db
                        .select({ count: sql<number>`count(*)` })
                        .from(tools)
                        .where(
                            sql`${tools.categoryId} IN (${sql.join(subcatIds.map(id => sql`${id}`), sql`, `)})`
                        );
                    toolCount = result?.count || 0;
                } else {
                    const [result] = await db
                        .select({ count: sql<number>`count(*)` })
                        .from(tools)
                        .where(eq(tools.categoryId, category.id));
                    toolCount = result?.count || 0;
                }

                return { ...category, toolCount };
            })
        );

        // 3. 统计数据
        const [{ totalTools: toolsCount }] = await db
            .select({ totalTools: sql<number>`count(*)` })
            .from(tools)
            .where(eq(tools.isPublished, true));

        const [{ totalCategories: catsCount }] = await db
            .select({ totalCategories: sql<number>`count(*)` })
            .from(categoriesTable)
            .where(isNull(categoriesTable.parentId));

        const [{ totalUsers: usersCount }] = await db
            .select({ totalUsers: sql<number>`count(*)` })
            .from(user);

        stats = {
            totalTools: toolsCount || 0,
            totalCategories: catsCount || 0,
            totalUsers: usersCount || 0,
        };

        // 4. 精选工具
        const featuredToolsRaw = await db
            .select({
                id: tools.id,
                name: tools.name,
                description: tools.description,
                url: tools.url,
                logoUrl: tools.logoUrl,
                categoryId: tools.categoryId,
                isFeatured: tools.isFeatured,
                viewCount: tools.viewCount,
            })
            .from(tools)
            .where(eq(tools.isFeatured, true))
            .orderBy(desc(tools.viewCount))
            .limit(6);

        featuredTools = await Promise.all(
            featuredToolsRaw.map(async (tool) => {
                const [category] = await db
                    .select({
                        id: categoriesTable.id,
                        name: categoriesTable.name,
                    })
                    .from(categoriesTable)
                    .where(eq(categoriesTable.id, tool.categoryId))
                    .limit(1);

                return { ...tool, category };
            })
        );
    } catch (error) {
        console.error("Failed to fetch homepage data:", error);
        // 使用默认数据继续渲染
    }

    // How It Works 步骤
    const howItWorksSteps = [
        {
            icon: "🔍",
            title: "Browse & Discover",
            description: "探索我们精心策划的工具目录，找到最适合您需求的工具",
        },
        {
            icon: "📝",
            title: "Submit Your Tool",
            description: "提交您的优质工具，获得曝光机会，触达数千位潜在用户",
        },
        {
            icon: "🤝",
            title: "Share & Grow",
            description: "发现和分享优质工具，与社区一起成长进步",
        },
    ];

    // FAQ 数据（包含SEO/AEO相关问题）
    const faqs = [
        {
            question: "What is Toolsail?",
            answer: "Toolsail is a curated directory of AI and digital tools designed to help you discover the best solutions for productivity, creativity, and innovation. We carefully review and categorize tools to make your search easier.",
        },
        {
            question: "How do I submit a tool?",
            answer: 'Click the "Submit Tool" button in the header or footer, fill out the submission form with details about your tool, and our team will review it. Approved tools will be published in the directory.',
        },
        {
            question: "Is Toolsail free to use?",
            answer: "Yes! Browsing and discovering tools on Toolsail is completely free. We may offer premium features in the future for enhanced visibility and analytics.",
        },
        {
            question: "How are tools reviewed and approved?",
            answer: "Our team manually reviews each submission to ensure quality, relevance, and accuracy. We check the tool's functionality, description, and overall value to the community before approval.",
        },
        {
            question: "Does Toolsail help with SEO and AEO?",
            answer: "Yes! All tools listed on Toolsail benefit from structured data, rich snippets, and optimized metadata. We implement SEO best practices and Answer Engine Optimization (AEO) to ensure your tool is discoverable on search engines and AI assistants like ChatGPT, Perplexity, and Gemini.",
        },
        {
            question: "How can my tool rank better on Toolsail?",
            answer: "Tool rankings are based on quality, user engagement (views and clicks), and whether it's featured. Provide a detailed description, high-quality logo, and accurate information to improve visibility. Featured tools get prioritized placement.",
        },
        {
            question: "Can I suggest new features or categories?",
            answer: "Absolutely! We value community feedback. Contact us through our support channels with your suggestions, and we'll consider them for future updates.",
        },
        {
            question: "How often is the directory updated?",
            answer: "The directory is updated continuously as new tools are submitted and approved. We also regularly review existing tools to ensure accuracy and remove outdated entries.",
        },
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-light-bg-primary dark:bg-dark-bg-primary py-20 sm:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>{stats.totalTools || 1000}+ Curated Tools</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-light-text-primary dark:text-dark-text-primary mb-6">
                            Discover the Best{" "}
                            <span className="text-light-text-primary dark:text-dark-text-primary">
                                AI & Digital Tools
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-light-text-secondary dark:text-dark-text-secondary mb-10 max-w-2xl mx-auto">
                            A curated directory of premium tools to boost your
                            productivity, creativity, and innovation.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <input
                                    type="text"
                                    placeholder="Search for tools..."
                                    className="w-full pl-12 pr-4 py-4 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary focus:border-transparent text-lg"
                                />
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/ai-tools"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Explore AI Tools
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                href="/submit"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-light-text-primary dark:text-dark-text-primary bg-transparent border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                            >
                                Submit Your Tool
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Bar */}
            <section className="border-y border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
                        <StatCard
                            value={`${stats.totalTools || 0}+`}
                            label="Curated Tools"
                            icon={<Wrench className="w-8 h-8" />}
                        />
                        <StatCard
                            value={`${stats.totalCategories || 0}+`}
                            label="Categories"
                            icon={<FolderTree className="w-8 h-8" />}
                        />
                        <StatCard
                            value={`${stats.totalUsers || 0}+`}
                            label="Community Members"
                            icon={<Users className="w-8 h-8" />}
                        />
                    </div>
                </div>
            </section>

            {/* Featured Tools */}
            {featuredTools.length > 0 && (
                <section className="py-16 bg-light-bg-primary dark:bg-dark-bg-primary">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                                Featured Tools
                            </h2>
                            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                                Handpicked tools that stand out from the crowd
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredTools.map((tool: any) => (
                                <ToolCard
                                    key={tool.id}
                                    id={tool.id}
                                    name={tool.name}
                                    description={tool.description}
                                    url={tool.url}
                                    logo={tool.logoUrl}
                                    category={{ id: tool.category?.id || "", name: tool.category?.name || "" }}
                                    isFeatured={tool.isFeatured}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories Grid */}
            <section className="py-16 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                            Find the perfect tool for your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category: any) => {
                            return (
                                <Link
                                    key={category.slug}
                                    href={`/${category.slug}`}
                                    className="group p-6 rounded-lg border border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary transition-all hover:shadow-md bg-light-bg-primary dark:bg-dark-bg-primary hover:scale-[1.02]"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="px-3 py-1 text-sm font-medium border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary rounded-full">
                                            {category.toolCount} tools
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center text-light-text-primary dark:text-dark-text-primary font-medium group-hover:translate-x-1 transition-transform">
                                        Explore
                                        <ArrowRight className="ml-1 w-4 h-4" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-light-bg-primary dark:bg-dark-bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {howItWorksSteps.map((step, index) => (
                            <div
                                key={index}
                                className="text-center p-6 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary"
                            >
                                <div className="text-6xl mb-4">{step.icon}</div>
                                <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                                    {index + 1}. {step.title}
                                </h3>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                                Everything you need to know about Toolsail
                            </p>
                        </div>

                        <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6">
                            {faqs.map((faq, index) => (
                                <FAQItem
                                    key={index}
                                    question={faq.question}
                                    answer={faq.answer}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-light-text-primary dark:bg-dark-text-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-light-bg-primary dark:text-dark-bg-primary mb-4">
                        Have a Tool to Share?
                    </h2>
                    <p className="text-xl text-light-text-tertiary dark:text-dark-text-tertiary mb-8 max-w-2xl mx-auto">
                        Submit your tool to Toolsail and reach thousands of
                        users looking for great solutions.
                    </p>
                    <Link
                        href="/submit"
                        className="inline-flex items-center px-8 py-3 text-base font-semibold text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        Submit Your Tool
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>
            
            {/* JSON-LD Structured Data for SEO */}
            <JsonLd data={generateOrganizationSchema()} />
            <JsonLd data={generateWebsiteSchema()} />
        </div>
    );
}
