"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ToolCardGrid } from "@/components/tool-card-grid";
import { Search, X } from "lucide-react";

// Mock data - will be replaced with real API
const mockSearchResults = [
    {
        id: "chatgpt",
        name: "ChatGPT",
        logo: "https://chat.openai.com/favicon.ico",
        description:
            "AI chatbot by OpenAI for conversations, writing, and problem-solving",
        category: { id: "ai-writing", name: "AI Writing" },
        pricing: "Freemium" as const,
        isFeatured: true,
        url: "https://chat.openai.com",
    },
    {
        id: "github-copilot",
        name: "GitHub Copilot",
        logo: "https://github.githubassets.com/favicons/favicon.svg",
        description: "AI pair programmer that helps you write code faster",
        category: { id: "ai-coding", name: "AI Coding" },
        pricing: "Paid" as const,
        isFeatured: true,
        url: "https://github.com/features/copilot",
    },
    {
        id: "claude",
        name: "Claude",
        logo: null,
        description:
            "Anthropic's AI assistant for safe and helpful conversations",
        category: { id: "ai-writing", name: "AI Writing" },
        pricing: "Freemium" as const,
        isFeatured: false,
        url: "https://claude.ai",
    },
    {
        id: "gemini",
        name: "Gemini",
        logo: null,
        description: "Google's multimodal AI model for various tasks",
        category: { id: "ai-multimodal", name: "AI Multimodal" },
        pricing: "Free" as const,
        isFeatured: false,
        url: "https://gemini.google.com",
    },
];

const popularTools = [
    {
        id: "chatgpt",
        name: "ChatGPT",
        logo: "https://chat.openai.com/favicon.ico",
        description: "AI chatbot for conversations",
        category: { id: "ai-writing", name: "AI Writing" },
        pricing: "Freemium" as const,
        url: "https://chat.openai.com",
    },
    {
        id: "midjourney",
        name: "Midjourney",
        logo: "https://www.midjourney.com/favicon.ico",
        description: "AI art generator",
        category: { id: "ai-design", name: "AI Design" },
        pricing: "Paid" as const,
        url: "https://www.midjourney.com",
    },
    {
        id: "notion",
        name: "Notion",
        logo: "https://www.notion.so/favicon.ico",
        description: "All-in-one workspace",
        category: { id: "productivity", name: "Productivity" },
        pricing: "Freemium" as const,
        url: "https://www.notion.so",
    },
    {
        id: "figma",
        name: "Figma",
        logo: "https://www.figma.com/favicon.ico",
        description: "Collaborative design tool",
        category: { id: "design-tools", name: "Design Tools" },
        pricing: "Freemium" as const,
        url: "https://www.figma.com",
    },
];

/**
 * Search Results Page
 * Displays search results with query highlighting
 * Route: /search
 * Based on DESIGN_LAYOUT.md Section 6
 */
export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(false);

    // Simulate search with mock data
    const searchResults = searchQuery
        ? mockSearchResults.filter(
              (tool) =>
                  tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tool.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
          )
        : [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // In real implementation, trigger API call here
        window.history.pushState(
            {},
            "",
            `/search?q=${encodeURIComponent(searchQuery)}`,
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="w-full">
            {/* Search Header */}
            <section className="bg-light-bg-primary dark:bg-dark-bg-primary border-b border-light-border dark:border-dark-border py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                            Search Tools
                        </h1>

                        {/* Search Form */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Search for tools..."
                                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary focus:border-transparent text-base"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition-colors"
                                    >
                                        <X className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Search Results */}
            <section className="py-12 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {searchQuery && searchResults.length > 0 && (
                        <>
                            <div className="mb-6">
                                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                    Found {searchResults.length} results for "
                                    <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                                        {searchQuery}
                                    </span>
                                    "
                                </p>
                            </div>
                            <ToolCardGrid
                                tools={searchResults}
                                isLoading={isSearching}
                                hasMore={false}
                            />
                        </>
                    )}

                    {/* No Results */}
                    {searchQuery && searchResults.length === 0 && (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                                    No tools found
                                </h2>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
                                    We couldn't find any tools matching "
                                    <span className="font-semibold">
                                        {searchQuery}
                                    </span>
                                    ". Try searching with different keywords.
                                </p>

                                {/* Popular Tools */}
                                <div className="mt-12">
                                    <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
                                        Popular Tools
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {popularTools.map((tool) => (
                                            <a
                                                key={tool.id}
                                                href={`/tools/${tool.id}`}
                                                className="p-4 bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary transition-colors text-left"
                                            >
                                                <div className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
                                                    {tool.name}
                                                </div>
                                                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                                    {tool.category.name}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State - No Search Query */}
                    {!searchQuery && (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <Search className="w-16 h-16 text-light-text-tertiary dark:text-dark-text-tertiary mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
                                    Start searching
                                </h2>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8">
                                    Enter a keyword to find the perfect tool for
                                    your needs
                                </p>

                                {/* Popular Searches */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {[
                                        "AI",
                                        "Design",
                                        "Productivity",
                                        "Code",
                                        "Writing",
                                    ].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setSearchQuery(term)}
                                            className="px-4 py-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors text-sm"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
