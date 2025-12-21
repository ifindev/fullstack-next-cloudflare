import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { PricingBadge, CategoryBadge } from "@/components/tool-card";
import { ToolCard } from "@/components/tool-card";
import { ExternalLink, Share2, Star } from "lucide-react";
import { use } from "react";
import { JsonLd, generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";
import type { Metadata } from "next";

// Mock data - will be replaced with real database queries
const mockTool = {
    id: "chatgpt",
    name: "ChatGPT",
    logo: "https://chat.openai.com/favicon.ico",
    description: "AI chatbot by OpenAI for conversations and problem-solving",
    longDescription: `ChatGPT is a large language model developed by OpenAI that excels at natural language understanding and generation. It can assist with a wide variety of tasks including writing, coding, creative brainstorming, and much more.

## Main Features

- **Natural Language Understanding**: Understands context and nuance in conversations
- **Context Memory**: Remembers conversation history for coherent dialogue
- **Multi-language Support**: Supports dozens of languages
- **Code Generation**: Can write, debug, and explain code
- **Creative Writing**: Helps with stories, essays, and content creation

## Pricing Information

- **Free Version**: GPT-3.5 model with daily limits
- **ChatGPT Plus**: $20/month for unlimited access to GPT-4

## Use Cases

Perfect for writers, developers, students, and professionals looking to boost productivity with AI assistance.`,
    category: { id: "ai-writing", name: "AI Writing" },
    parentCategory: { id: "ai-tools", name: "AI Tools" },
    pricing: "Freemium" as const,
    isFeatured: true,
    url: "https://chat.openai.com",
    viewCount: 15234,
    createdAt: "2024-01-15",
};

const relatedTools = [
    {
        id: "jasper",
        name: "Jasper",
        logo: "https://www.jasper.ai/favicon.ico",
        description: "AI content platform for marketing copy",
        category: { id: "ai-writing", name: "AI Writing" },
        pricing: "Paid" as const,
        url: "https://www.jasper.ai",
    },
    {
        id: "copy-ai",
        name: "Copy.ai",
        logo: null,
        description: "AI-powered copywriting tool",
        category: { id: "ai-writing", name: "AI Writing" },
        pricing: "Freemium" as const,
        url: "https://www.copy.ai",
    },
    {
        id: "writesonic",
        name: "Writesonic",
        logo: null,
        description: "AI writer for blog posts and articles",
        category: { id: "ai-writing", name: "AI Writing" },
        pricing: "Freemium" as const,
        url: "https://writesonic.com",
    },
    {
        id: "sudowrite",
        name: "Sudowrite",
        logo: null,
        description: "AI writing assistant for creative writers",
        category: { id: "ai-writing", name: "AI Writing" },
        pricing: "Paid" as const,
        url: "https://www.sudowrite.com",
    },
];

/**
 * Generate dynamic metadata for tool detail pages
 * Provides SEO-optimized title, description, Open Graph, and Twitter Cards
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    // In a real app, fetch tool data based on ID
    const tool = mockTool; // Replace with: await getToolById(id)
    
    const baseUrl = "https://next-cf-app.lindalu125.workers.dev";
    const toolUrl = `${baseUrl}/tools/${id}`;
    
    return {
        title: `${tool.name} - ${tool.description}`,
        description: tool.description + (tool.longDescription ? " " + tool.longDescription.slice(0, 100) + "..." : ""),
        keywords: [tool.name, tool.category.name, tool.pricing, "AI tools", "productivity"],
        openGraph: {
            type: "website",
            url: toolUrl,
            title: tool.name,
            description: tool.description,
            images: [
                {
                    url: tool.logo || `${baseUrl}/default-og.png`,
                    width: 1200,
                    height: 630,
                    alt: tool.name
                }
            ],
            siteName: "Toolsail"
        },
        twitter: {
            card: "summary_large_image",
            title: tool.name,
            description: tool.description,
            images: [tool.logo || `${baseUrl}/default-og.png`]
        },
        alternates: {
            canonical: toolUrl
        }
    };
}

/**
 * Tool Detail Page
 * Displays complete information about a single tool
 * Route: /tools/[id]
 * Based on DESIGN_LAYOUT.md Section 3
 */
export default function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    // In a real app, fetch tool data based on ID
    // const tool = await getToolById(id);
    const tool = mockTool;

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        {
            label: tool.parentCategory.name,
            href: `/${tool.parentCategory.id}`,
        },
        { label: tool.category.name, href: "#" },
        { label: tool.name },
    ];

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <section className="border-b border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </section>

            {/* Tool Header */}
            <section className="py-12 bg-light-bg-primary dark:bg-dark-bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Logo */}
                        <div className="lg:col-span-2">
                            {tool.logo ? (
                                <Image
                                    src={tool.logo}
                                    alt={tool.name}
                                    width={128}
                                    height={128}
                                    className="rounded-lg shadow-md object-cover mx-auto lg:mx-0"
                                />
                            ) : (
                                <div className="w-32 h-32 mx-auto lg:mx-0 rounded-lg bg-light-text-primary dark:bg-dark-text-primary flex items-center justify-center text-light-bg-primary dark:text-dark-bg-primary font-bold text-4xl shadow-md">
                                    {tool.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Tool Info */}
                        <div className="lg:col-span-7">
                            {/* Title and Featured Badge */}
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-3xl sm:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                                    {tool.name}
                                </h1>
                                {tool.isFeatured && (
                                    <Star className="w-6 h-6 text-light-text-primary dark:text-dark-text-primary fill-light-text-primary dark:fill-dark-text-primary" />
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-4">
                                {tool.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <CategoryBadge
                                    category={tool.category.name}
                                    size="md"
                                />
                                <PricingBadge
                                    pricing={tool.pricing}
                                    size="md"
                                />
                                <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                                    {tool.viewCount.toLocaleString()} views
                                </span>
                            </div>

                            {/* Visit Website Button */}
                            <a
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Visit Website
                                <ExternalLink className="ml-2 w-5 h-5" />
                            </a>
                        </div>

                        {/* Share Buttons */}
                        <div className="lg:col-span-3">
                            <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-6 border border-light-border dark:border-dark-border">
                                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                                    Share this tool
                                </h3>
                                <div className="space-y-2">
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors">
                                        <Share2 className="w-4 h-4" />
                                        Copy Link
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors">
                                        Twitter
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors">
                                        Facebook
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Description */}
            <section className="py-12 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {tool.longDescription
                                .split("\n\n")
                                .map((paragraph, i) => (
                                    <div key={i} className="mb-4">
                                        {paragraph.startsWith("##") ? (
                                            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mt-8 mb-4">
                                                {paragraph.replace("## ", "")}
                                            </h2>
                                        ) : paragraph.startsWith("-") ? (
                                            <ul className="list-disc pl-6 space-y-2">
                                                {paragraph
                                                    .split("\n")
                                                    .map((item, j) => (
                                                        <li
                                                            key={j}
                                                            className="text-light-text-secondary dark:text-dark-text-secondary"
                                                        >
                                                            {item.replace(
                                                                /^- \*\*(.+?)\*\*:/,
                                                                "<strong>$1:</strong>",
                                                            )}
                                                        </li>
                                                    ))}
                                            </ul>
                                        ) : (
                                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                                {paragraph}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Tools */}
            <section className="py-12 bg-light-bg-primary dark:bg-dark-bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8">
                        Related {tool.category.name} Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedTools.map((relatedTool) => (
                            <ToolCard key={relatedTool.id} {...relatedTool} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* JSON-LD Structured Data for SEO */}
            <JsonLd data={generateProductSchema({
                name: tool.name,
                description: tool.description,
                url: tool.url,
                logoUrl: tool.logo,
                viewCount: tool.viewCount,
                category: tool.category
            })} />
            <JsonLd data={generateBreadcrumbSchema([
                { name: "Home", url: "https://next-cf-app.lindalu125.workers.dev" },
                { name: tool.parentCategory.name, url: `https://next-cf-app.lindalu125.workers.dev/${tool.parentCategory.id}` },
                { name: tool.category.name },
                { name: tool.name }
            ])} />
        </div>
    );
}
