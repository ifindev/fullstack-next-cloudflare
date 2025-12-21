"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
    className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [toc, setToc] = useState<TocItem[]>([]);

    useEffect(() => {
        // Extract headings
        const headings: TocItem[] = [];
        const lines = content.split("\n");
        
        lines.forEach((line) => {
            const match = line.match(/^(#{2,3})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                // Should match rehype-slug generation
                const id = text
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "");
                
                heading_id_map.set(text, id);
                headings.push({ id, text, level });
            }
        });
        
        setToc(headings);
    }, [content]);

    // Track active heading
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0% 0% -80% 0%" }
        );

        const headingElements = document.querySelectorAll("h2, h3");
        headingElements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [toc]);

    // Helper to map text to id if needed, for now using simple generation
    // rehype-slug might handle duplicates differently (appending -1, -2), 
    // but for simple cases this suffices.
    const heading_id_map = new Map<string, string>();


    if (toc.length === 0) return null;

    return (
        <nav className={cn("space-y-4", className)}>
            <h4 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                On This Page
            </h4>
            <ul className="space-y-2 text-sm border-l-2 border-light-border dark:border-dark-border pl-4">
                {toc.map((item) => (
                    <li key={item.id} className={cn("transition-colors", {
                        "pl-0": item.level === 2,
                        "pl-2": item.level === 3,
                    })}>
                        <a
                            href={`#${item.id}`}
                            className={cn(
                                "block hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors py-1",
                                activeId === item.id
                                    ? "text-light-text-primary dark:text-dark-text-primary font-medium -ml-[18px] border-l-2 border-light-text-primary dark:border-dark-text-primary pl-4"
                                    : "text-light-text-tertiary dark:text-dark-text-tertiary"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
