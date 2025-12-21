import ToolForm from "../../_components/tool-form";

// Mock 数据 - 后续从 API 获取
const mockTool = {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    logoUrl: "https://via.placeholder.com/48",
    description: "AI 对话助手，支持自然语言处理...",
    categoryId: "ai-writing",
    pricing: "Freemium" as const,
    pricingDetails: "Free: 基础功能\nPro: $20/月，完整功能",
    isFeatured: true,
    isPublished: true,
};

import { use } from "react";

export default function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return <ToolForm mode="edit" toolId={id} initialData={mockTool} />;
}
