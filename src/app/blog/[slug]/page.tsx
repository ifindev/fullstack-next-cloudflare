"use client";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import { TableOfContents } from "@/components/table-of-contents";

// Mock data for the blog post (will be replaced with real data later)
const mockPost = {
    id: "1",
    slug: "getting-started-ai-writing",
    title: "Getting Started with AI Writing Tools",
    excerpt:
        "AI writing tools have revolutionized content creation. Here's everything you need to know to get started.",
    content: `
## What are AI Writing Tools?

AI writing tools use machine learning to help you create content faster and more efficiently. They can:

- Generate ideas and outlines
- Write full articles and blog posts
- Create marketing copy
- Improve existing content

## Top Tools to Try

### 1. ChatGPT

ChatGPT is great for conversations and brainstorming. It's versatile and can help with various writing tasks.

### 2. Jasper

Perfect for marketing copy and professional content creation.

### 3. Copy.ai

Ideal for social media content and short-form copy.

## Tips for Success

> Always review and edit AI-generated content. Use AI as a tool, not a replacement for human creativity.

**Key Points:**

- Be specific with your prompts
- Provide context and examples
- Iterate and refine the output
- Add your personal touch

## Conclusion

AI writing tools are powerful assistants that can significantly boost your productivity. Start experimenting today!
    `,
    coverImage: "/placeholder-blog.jpg",
    publishedAt: new Date("2024-01-15"),
    readTime: "5 min read",
    readingTime: "5 min",
    author: {
        name: "John Doe",
        role: "Content Strategist",
        avatar: "/placeholder-avatar.jpg",
    },
    category: {
        id: "1",
        name: "AI Tools",
        slug: "ai-tools",
    },
    tags: ["AI", "Writing", "Productivity"],
};

// Related posts mock data
const relatedPosts = [
    {
        id: "2",
        slug: "ai-content-strategy",
        title: "Building an AI-Powered Content Strategy",
        excerpt: "Learn how to integrate AI tools into your content workflow.",
        content: "## AI Content Strategy\n\nThis is placeholder content for the AI Content Strategy article.",
        coverImage: "/placeholder-blog-2.jpg",
        publishedAt: new Date("2024-01-10"),
        readTime: "7 min read",
        author: {
            name: "Jane Smith",
            avatar: "/placeholder-avatar-2.jpg",
        },
        category: {
            id: "1",
            name: "Strategy",
            slug: "strategy",
        },
        tags: ["AI", "Strategy", "Content"],
    },
    {
        id: "3",
        slug: "prompt-engineering-guide",
        title: "The Complete Guide to Prompt Engineering",
        excerpt: "Master the art of writing effective prompts for AI tools.",
        content: "## Prompt Engineering\n\nThis is placeholder content for the Prompt Engineering guide.",
        coverImage: "/placeholder-blog-3.jpg",
        publishedAt: new Date("2024-01-05"),
        readTime: "10 min read",
        author: {
            name: "Mike Johnson",
            avatar: "/placeholder-avatar-3.jpg",
        },
        category: {
            id: "2",
            name: "Tutorial",
            slug: "tutorial",
        },
        tags: ["AI", "Prompts", "Tutorial"],
    },
];

const mockBlogPosts = [mockPost, ...relatedPosts];

/**
 * Blog Detail Page
 * Displays full blog post with Markdown rendering
 * Route: /blog/[slug]
 * Based on DESIGN_LAYOUT.md Section 5
 */
export default function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    // Find post by slug
    const post = mockBlogPosts.find((p) => p.slug === slug);

    if (!post) {
        return <div className="p-12 text-center">Post not found</div>;
    }

    return (
        <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
            {/* Back Button */}
            <section className="border-b bg-light-bg-primary dark:bg-dark-bg-primary border-light-border dark:border-dark-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                </div>
            </section>

            {/* Article Header */}
            <section className="py-12 bg-light-bg-primary dark:bg-dark-bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Category Badge */}
                        <div className="mb-4">
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                                {post.category.name}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-light-text-primary dark:text-dark-text-primary mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-light-text-secondary dark:text-dark-text-secondary mb-8 pb-8 border-b border-light-border dark:border-dark-border">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <time dateTime={post.publishedAt.toISOString()}>
                                    {format(post.publishedAt, "MMMM dd, yyyy")}
                                </time>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{post.readTime}</span>
                            </div>
                            <div>
                                <span>By {post.author.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content & TOC */}
            <section className="py-12 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* TOC - Desktop Sticky */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-24">
                                <TableOfContents content={post.content} />
                            </div>
                        </aside>

                        {/* Content */}
                        <div className="lg:col-span-9">
                            <div className="max-w-4xl mx-auto bg-light-bg-primary dark:bg-dark-bg-primary rounded-xl p-8 lg:p-12 shadow-sm border border-light-border dark:border-dark-border">
                                {/* Typography-enhanced article */}
                                <article className="prose prose-lg dark:prose-invert max-w-none 
                                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-light-text-primary dark:prose-headings:text-dark-text-primary 
                                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-light-border dark:prose-h2:border-dark-border
                                    prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                                    prose-p:text-lg prose-p:leading-8 prose-p:mb-6 prose-p:text-light-text-secondary dark:prose-p:text-dark-text-secondary
                                    prose-a:text-light-text-primary dark:prose-a:text-dark-text-primary prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-light-text-primary dark:prose-strong:text-dark-text-primary 
                                    prose-code:bg-light-bg-tertiary dark:prose-code:bg-dark-bg-tertiary prose-code:text-light-text-primary dark:prose-code:text-dark-text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                    prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:rounded-xl prose-pre:p-6
                                    prose-blockquote:border-l-4 prose-blockquote:border-light-text-primary dark:prose-blockquote:border-dark-text-primary prose-blockquote:bg-light-bg-tertiary dark:prose-blockquote:bg-dark-bg-tertiary prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-lg prose-blockquote:leading-relaxed prose-blockquote:text-light-text-secondary dark:prose-blockquote:text-dark-text-secondary
                                    prose-li:text-lg prose-li:leading-8 prose-li:mb-2 prose-li:text-light-text-secondary dark:prose-li:text-dark-text-secondary prose-li:marker:text-light-text-tertiary dark:prose-li:marker:text-dark-text-tertiary">
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {post.content}
                                    </ReactMarkdown>
                                </article>

                                {/* Tags */}
                                <div className="mt-12 pt-8 border-t border-light-border dark:border-dark-border">
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-text-primary hover:text-light-bg-primary dark:hover:bg-dark-text-primary dark:hover:text-dark-bg-primary transition-colors cursor-pointer"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Share Section */}
            <section className="py-8 bg-light-bg-primary dark:bg-dark-bg-primary border-y border-light-border dark:border-dark-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                                Share this article
                            </h3>
                            <div className="flex gap-3">
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:opacity-80 transition-opacity">
                                    <Share2 className="w-4 h-4" />
                                    Twitter
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:opacity-80 transition-opacity">
                                    LinkedIn
                                </button>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary rounded-lg hover:opacity-80 transition-opacity">
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            <section className="py-12 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <BlogCard
                                    key={relatedPost.id}
                                    {...relatedPost}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
