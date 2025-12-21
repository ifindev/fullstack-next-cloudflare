/**
 * SEO Utilities
 * 生成结构化数据 (JSON-LD) 和 Meta Tags
 */

// Organization Schema (首页)
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Toolsail",
        "url": "https://next-cf-app.lindalu125.workers.dev",
        "logo": "https://next-cf-app.lindalu125.workers.dev/logo.png",
        "description": "Curated directory of premium AI and digital tools for productivity, creativity, and innovation",
        "sameAs": [
            "https://twitter.com/toolsail",
            "https://github.com/toolsail"
        ]
    };
}

// WebSite Schema with SearchAction (首页)
export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Toolsail",
        "url": "https://next-cf-app.lindalu125.workers.dev",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://next-cf-app.lindalu125.workers.dev/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };
}

// Product/SoftwareApplication Schema (工具详情页)
export function generateProductSchema(tool: {
    name: string;
    description: string;
    url: string;
    logoUrl: string | null;
    viewCount: number;
    category?: { name: string };
}) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": tool.name,
        "description": tool.description,
        "url": tool.url,
        "image": tool.logoUrl || "https://next-cf-app.lindalu125.workers.dev/default-logo.png",
        "applicationCategory": tool.category?.name || "ProductivityApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "ratingCount": Math.max(tool.viewCount, 1)
        }
    };
}

// BreadcrumbList Schema (工具详情页)
export function generateBreadcrumbSchema(items: { name: string; url?: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            ...(item.url ? { "item": item.url } : {})
        }))
    };
}

// Article Schema (博客页面)
export function generateArticleSchema(article: {
    title: string;
    excerpt: string;
    coverImage?: string;
    author: string;
    publishedAt: Date | string;
    updatedAt: Date | string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.coverImage || "https://next-cf-app.lindalu125.workers.dev/default-og.png",
        "author": {
            "@type": "Person",
            "name": article.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Toolsail",
            "logo": {
                "@type": "ImageObject",
                "url": "https://next-cf-app.lindalu125.workers.dev/logo.png"
            }
        },
        "datePublished": new Date(article.publishedAt).toISOString(),
        "dateModified": new Date(article.updatedAt).toISOString()
    };
}

// 生成 JSON-LD Script Tag
export function JsonLd({ data }: { data: Record<string, any> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
