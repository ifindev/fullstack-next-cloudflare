import BlogForm from "../../_components/blog-form";

// Mock 数据
const mockPost = {
    title: "AI工具评测：ChatGPT vs Claude",
    slug: "chatgpt-vs-claude",
    excerpt: "详细对比两款顶级AI对话工具的优缺点...",
    content: `# ChatGPT vs Claude

## 介绍

本文将详细对比两款顶级AI对话工具...

## 功能对比

**ChatGPT**:
- 优点1
- 优点2

**Claude**:
- 优点1
- 优点2
`,
    categoryId: "ai-review",
    coverImage: "https://via.placeholder.com/1200x630",
    tags: ["AI", "ChatGPT", "Claude"],
    isPublished: true,
};

import { use } from "react";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return <BlogForm mode="edit" postId={id} initialData={mockPost} />;
}
