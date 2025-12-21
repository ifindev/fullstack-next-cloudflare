"use client";

import { useState } from "react";
import { BlogCard, BlogCardSkeleton } from "@/components/blog-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock data
const mockBlogPosts = [
    {
        id: "1",
        title: "Getting Started with AI Writing Tools",
        slug: "getting-started-ai-writing",
        excerpt:
            "Learn how to leverage AI writing tools to boost your productivity and create better content faster.",
        featuredImage: null,
        category: { id: "tutorials", name: "Tutorials" },
        publishedAt: new Date("2025-01-15"),
        readingTime: "5 min",
        tags: ["AI", "Writing", "Productivity"],
    },
    {
        id: "2",
        title: "Figma vs Adobe XD: Complete Comparison",
        slug: "figma-vs-adobe-xd",
        excerpt:
            "Comprehensive comparison of two leading design tools. Find out which one is right for your team.",
        featuredImage: null,
        category: { id: "reviews", name: "Reviews" },
        publishedAt: new Date("2025-01-10"),
        readingTime: "8 min",
        tags: ["Design", "Tools", "Comparison"],
    },
    {
        id: "3",
        title: "Top 10 AI Tools for Developers in 2025",
        slug: "top-ai-tools-developers-2025",
        excerpt:
            "Discover the best AI tools that can help developers code faster and more efficiently.",
        featuredImage: null,
        category: { id: "lists", name: "Top Lists" },
        publishedAt: new Date("2025-01-05"),
        readingTime: "10 min",
        tags: ["AI", "Development", "Tools"],
    },
    {
        id: "4",
        title: "How to Choose the Right Project Management Tool",
        slug: "choose-project-management-tool",
        excerpt:
            "A guide to selecting the perfect project management tool for your team's needs.",
        featuredImage: null,
        category: { id: "guides", name: "Guides" },
        publishedAt: new Date("2025-01-01"),
        readingTime: "6 min",
        tags: ["Productivity", "Management"],
    },
    {
        id: "5",
        title: "Notion Tips and Tricks for Power Users",
        slug: "notion-tips-tricks",
        excerpt:
            "Advanced Notion techniques to supercharge your productivity and organization.",
        featuredImage: null,
        category: { id: "tutorials", name: "Tutorials" },
        publishedAt: new Date("2024-12-28"),
        readingTime: "7 min",
        tags: ["Notion", "Productivity", "Tips"],
    },
    {
        id: "6",
        title: "The Future of AI in Content Creation",
        slug: "future-ai-content-creation",
        excerpt:
            "Exploring how AI is transforming the content creation landscape and what it means for creators.",
        featuredImage: null,
        category: { id: "insights", name: "Insights" },
        publishedAt: new Date("2024-12-25"),
        readingTime: "9 min",
        tags: ["AI", "Content", "Future"],
    },
];

const categories = [
    { id: "all", name: "All", slug: "all" },
    { id: "tutorials", name: "Tutorials", slug: "tutorials" },
    { id: "reviews", name: "Reviews", slug: "reviews" },
    { id: "lists", name: "Top Lists", slug: "lists" },
    { id: "guides", name: "Guides", slug: "guides" },
];

/**
 * Blog List Page
 * Displays all blog posts with pagination
 * Route: /blog
 * Based on DESIGN_LAYOUT.md Section 4
 */
export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    // Filter by category
    const filteredPosts =
        activeCategory === "all"
            ? mockBlogPosts
            : mockBlogPosts.filter(
                  (post) => post.category.id === activeCategory,
              );

    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = filteredPosts.slice(
        startIndex,
        startIndex + postsPerPage,
    );

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-light-bg-secondary dark:from-dark-bg-secondary to-light-bg-primary dark:to-dark-bg-primary py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-light-text-primary dark:text-dark-text-primary mb-4">
                            Blog
                        </h1>
                        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                            Insights, tutorials, and reviews about the latest
                            tools and technologies
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="border-b border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-3 overflow-x-auto py-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveCategory(category.id);
                                    setCurrentPage(1);
                                }}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeCategory === category.id
                                        ? "bg-light-text-primary dark:bg-dark-text-primary text-white"
                                        : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-12 bg-light-bg-primary dark:bg-dark-bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {currentPosts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {currentPosts.map((post) => (
                                    <BlogCard key={post.id} {...post} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.max(1, p - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === page
                                                    ? "bg-light-text-primary dark:bg-dark-text-primary text-white"
                                                    : "bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg">
                                No blog posts found in this category.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
