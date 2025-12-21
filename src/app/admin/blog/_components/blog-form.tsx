"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";

interface BlogFormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    categoryId: string;
    tags: string[];
    isPublished: boolean;
}

interface BlogFormProps {
    initialData?: Partial<BlogFormData>;
    mode: "create" | "edit";
    postId?: string;
}

export default function BlogForm({ initialData, mode, postId }: BlogFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<BlogFormData>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        coverImage: initialData?.coverImage || "",
        categoryId: initialData?.categoryId || "",
        tags: initialData?.tags || [],
        isPublished: initialData?.isPublished || false,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

    const handleChange = (field: keyof BlogFormData, value: any) => {
        setFormData({ ...formData, [field]: value });

        // 自动生成 slug
        if (field === "title") {
            const slug = value
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            setFormData({ ...formData, title: value, slug });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // TODO: API 调用
        console.log("Submit", formData);

        setTimeout(() => {
            setIsSaving(false);
            router.push("/admin/blog");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* 头部 */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/blog"
                    className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                        {mode === "create" ? "写新文章" : "编辑文章"}
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        使用 Markdown 编写博客内容
                    </p>
                </div>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本信息 */}
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                        基本信息
                    </h2>

                    {/* 标题 */}
                    <div>
                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                            文章标题{" "}
                            <span className="text-red-600 dark:text-red-400">
                                *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                            placeholder="例：2025年最佳AI工具推荐"
                            required
                            className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                            URL Slug{" "}
                            <span className="text-red-600 dark:text-red-400">
                                *
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) =>
                                handleChange("slug", e.target.value)
                            }
                            placeholder="best-ai-tools-2025"
                            required
                            className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                        />
                        <p className="mt-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            文章URL：/blog/{formData.slug || "your-slug"}
                        </p>
                    </div>

                    {/* 摘要 */}
                    <div>
                        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                            文章摘要{" "}
                            <span className="text-red-600 dark:text-red-400">
                                *
                            </span>
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) =>
                                handleChange("excerpt", e.target.value)
                            }
                            placeholder="简短描述文章内容，用于SEO和列表展示..."
                            required
                            rows={3}
                            maxLength={160}
                            className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none"
                        />
                        <p className="mt-1.5 text-xs text-light-text-tertiary dark:text-dark-text-tertiary text-right">
                            {formData.excerpt.length}/160
                        </p>
                    </div>

                    {/* 分类和封面 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                分类{" "}
                                <span className="text-red-600 dark:text-red-400">
                                    *
                                </span>
                            </label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) =>
                                    handleChange("categoryId", e.target.value)
                                }
                                required
                                className="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary"
                            >
                                <option value="">选择分类...</option>
                                <option value="ai-review">AI评测</option>
                                <option value="tools">工具推荐</option>
                                <option value="tutorial">教程</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1.5">
                                封面图片（可选）
                            </label>
                            <ImageUpload
                                value={formData.coverImage}
                                onChange={(url) => handleChange("coverImage", url)}
                            />
                        </div>
                    </div>
                </div>

                {/* 内容编辑 */}
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
                    {/* 编辑器头部 */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-light-border dark:border-dark-border">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab("edit")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    activeTab === "edit"
                                        ? "bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary"
                                        : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                                }`}
                            >
                                编辑
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("preview")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    activeTab === "preview"
                                        ? "bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary"
                                        : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                                }`}
                            >
                                预览
                            </button>
                        </div>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                            支持 Markdown 格式
                        </p>
                    </div>

                    {/* 编辑器内容 */}
                    <div className="p-6">
                        {activeTab === "edit" ? (
                            <textarea
                                value={formData.content}
                                onChange={(e) =>
                                    handleChange("content", e.target.value)
                                }
                                placeholder="在这里使用 Markdown 编写文章内容...

# 标题 1
## 标题 2

**粗体** *斜体*

- 列表项
- 列表项

[链接](https://example.com)
"
                                rows={20}
                                required
                                className="w-full px-4 py-3 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary resize-none font-mono text-sm"
                            />
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none min-h-[500px] p-4 border border-light-border dark:border-dark-border rounded-md">
                                {formData.content ? (
                                    <div className="text-light-text-primary dark:text-dark-text-primary whitespace-pre-wrap">
                                        {formData.content}
                                    </div>
                                ) : (
                                    <p className="text-light-text-tertiary dark:text-dark-text-tertiary">
                                        内容预览...
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 发布设置 */}
                <div className="bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg border border-light-border dark:border-dark-border p-6">
                    <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                        发布设置
                    </h2>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) =>
                                handleChange("isPublished", e.target.checked)
                            }
                            className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-light-text-primary dark:text-dark-text-primary">
                            立即发布（取消勾选保存为草稿）
                        </span>
                    </label>
                </div>

                {/* 底部操作按钮 */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/blog")}
                        className="px-4 py-2 text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary rounded-lg transition-colors"
                    >
                        取消
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 text-sm font-medium text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSaving
                            ? "保存中..."
                            : formData.isPublished
                              ? "发布"
                              : "保存草稿"}
                    </button>
                </div>
            </form>
        </div>
    );
}
