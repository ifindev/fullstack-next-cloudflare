/**
 * Tools Import Script
 * 从 Excel 文件导入工具数据到 D1 数据库
 * 
 * 使用方法:
 * 1. 本地: pnpm tsx scripts/import-tools.ts
 * 2. 生产: 通过 API 端点 /api/dev/import-tools
 */

import * as XLSX from 'xlsx';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// 类型定义
// ============================================================

interface RawToolData {
    name: string;
    description: string;
    url: string;
    featured: number;
    category: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    icon: string;
    description: string;
}

interface Tool {
    id: string;
    name: string;
    description: string;
    url: string;
    logoUrl: string;
    categoryId: string;
    isFeatured: boolean;
    isPublished: boolean;
    pricing: 'Free' | 'Freemium' | 'Paid';
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// 分类映射 - 优化后的子分类结构
// ============================================================

// AI Tools 主分类
const AI_PARENT_CATEGORY: Category = {
    id: 'cat-ai-tools',
    name: 'AI Tools',
    slug: 'ai-tools',
    parentId: null,
    icon: 'Sparkles',
    description: 'Artificial Intelligence powered tools for productivity, creativity, and automation'
};

// Digital Tools 主分类
const DIGI_PARENT_CATEGORY: Category = {
    id: 'cat-digital-tools',
    name: 'Digital Tools',
    slug: 'digital-tools',
    parentId: null,
    icon: 'Wrench',
    description: 'Essential digital marketing, SEO, and web development tools'
};

// AI Tools 子分类映射
const AI_CATEGORY_MAP: Record<string, Category> = {
    'AI Bot': {
        id: 'cat-ai-chatbot',
        name: 'AI Chatbots',
        slug: 'ai-chatbots',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'MessageSquare',
        description: 'AI-powered conversational assistants and chatbots like ChatGPT, Claude, and Bard'
    },
    'AI Coding': {
        id: 'cat-ai-coding',
        name: 'AI Coding',
        slug: 'ai-coding',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Code',
        description: 'AI tools for code generation, debugging, and development assistance'
    },
    'AI Design': {
        id: 'cat-ai-design',
        name: 'AI Image Generation',
        slug: 'ai-image-generation',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Image',
        description: 'AI-powered image creation, editing, and enhancement tools'
    },
    'AI image': {
        id: 'cat-ai-design', // 合并到 AI Design
        name: 'AI Image Generation',
        slug: 'ai-image-generation',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Image',
        description: 'AI-powered image creation, editing, and enhancement tools'
    },
    'AI Video': {
        id: 'cat-ai-video',
        name: 'AI Video',
        slug: 'ai-video',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Video',
        description: 'AI tools for video generation, editing, and enhancement'
    },
    'AI Copywriting': {
        id: 'cat-ai-writing',
        name: 'AI Writing',
        slug: 'ai-writing',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'PenTool',
        description: 'AI-powered content writing, copywriting, and text generation tools'
    },
    'Content Detector & Paraphrasing': {
        id: 'cat-ai-detector',
        name: 'AI Detection & Paraphrasing',
        slug: 'ai-detection',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Search',
        description: 'Tools to detect AI-generated content and paraphrase text'
    },
    'Content Detector &amp; Paraphrasing': {
        id: 'cat-ai-detector',
        name: 'AI Detection & Paraphrasing',
        slug: 'ai-detection',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Search',
        description: 'Tools to detect AI-generated content and paraphrase text'
    },
    'Prompt': {
        id: 'cat-ai-prompt',
        name: 'AI Prompts',
        slug: 'ai-prompts',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Terminal',
        description: 'Prompt libraries, optimizers, and marketplaces for AI tools'
    },
    'AI Model': {
        id: 'cat-ai-model',
        name: 'AI Models',
        slug: 'ai-models',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Cpu',
        description: 'Open-source AI models, Stable Diffusion, and model hubs'
    },
    'Productivity': {
        id: 'cat-ai-productivity',
        name: 'AI Productivity',
        slug: 'ai-productivity',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Zap',
        description: 'AI tools for productivity enhancement and workflow automation'
    },
    'AI Chrome Extension': {
        id: 'cat-ai-extension',
        name: 'AI Browser Extensions',
        slug: 'ai-extensions',
        parentId: AI_PARENT_CATEGORY.id,
        icon: 'Puzzle',
        description: 'AI-powered browser extensions and add-ons'
    }
};

// Digital Tools 子分类映射
const DIGI_CATEGORY_MAP: Record<string, Category> = {
    'SEO': {
        id: 'cat-digi-seo',
        name: 'SEO Tools',
        slug: 'seo-tools',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Search',
        description: 'Search engine optimization tools for website ranking and analysis'
    },
    'Keyword Research': {
        id: 'cat-digi-keyword',
        name: 'Keyword Research',
        slug: 'keyword-research',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Key',
        description: 'Tools for finding and analyzing keywords for SEO and PPC'
    },
    'Backlink': {
        id: 'cat-digi-backlink',
        name: 'Backlink Tools',
        slug: 'backlink-tools',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Link',
        description: 'Backlink analysis, building, and monitoring tools'
    },
    'Chrome Plugin': {
        id: 'cat-digi-chrome',
        name: 'Browser Extensions',
        slug: 'browser-extensions',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Puzzle',
        description: 'Useful browser extensions for marketers and developers'
    },
    'Emails & SMS': {
        id: 'cat-digi-email',
        name: 'Email & SMS Marketing',
        slug: 'email-sms-marketing',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Mail',
        description: 'Email marketing, SMS campaigns, and automation tools'
    },
    'Emails &amp; SMS': {
        id: 'cat-digi-email',
        name: 'Email & SMS Marketing',
        slug: 'email-sms-marketing',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Mail',
        description: 'Email marketing, SMS campaigns, and automation tools'
    },
    'Social Media': {
        id: 'cat-digi-social',
        name: 'Social Media',
        slug: 'social-media',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Share2',
        description: 'Social media management, scheduling, and analytics tools'
    },
    'Copywriting': {
        id: 'cat-digi-copywriting',
        name: 'Copywriting',
        slug: 'copywriting',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Edit',
        description: 'Copywriting resources, templates, and headline generators'
    },
    'Images & Icons': {
        id: 'cat-digi-design',
        name: 'Design Resources',
        slug: 'design-resources',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Image',
        description: 'Stock images, icons, graphic design tools, and resources'
    },
    'Images &amp; Icons': {
        id: 'cat-digi-design',
        name: 'Design Resources',
        slug: 'design-resources',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Image',
        description: 'Stock images, icons, graphic design tools, and resources'
    },
    'Website Building': {
        id: 'cat-digi-webdev',
        name: 'Website Building',
        slug: 'website-building',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Layout',
        description: 'Website builders, hosting, domains, and web development tools'
    },
    'Wordpress Plugin': {
        id: 'cat-digi-wordpress',
        name: 'WordPress',
        slug: 'wordpress',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Globe',
        description: 'WordPress plugins, themes, and development tools'
    },
    'Learning Base': {
        id: 'cat-digi-learning',
        name: 'Learning Resources',
        slug: 'learning-resources',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'BookOpen',
        description: 'SEO courses, tutorials, and educational resources'
    },
    'Affiliate Marketing': {
        id: 'cat-digi-affiliate',
        name: 'Affiliate Marketing',
        slug: 'affiliate-marketing',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'DollarSign',
        description: 'Affiliate networks, tracking, and marketing tools'
    },
    'Ecommerce': {
        id: 'cat-digi-ecommerce',
        name: 'E-commerce',
        slug: 'ecommerce',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'ShoppingCart',
        description: 'E-commerce platforms, tools, and resources'
    },
    'Freelance Platform': {
        id: 'cat-digi-freelance',
        name: 'Freelance Platforms',
        slug: 'freelance-platforms',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'Users',
        description: 'Platforms to hire freelancers or offer services'
    },
    'Others': {
        id: 'cat-digi-other',
        name: 'Other Tools',
        slug: 'other-tools',
        parentId: DIGI_PARENT_CATEGORY.id,
        icon: 'MoreHorizontal',
        description: 'Miscellaneous digital tools and utilities'
    }
};

// ============================================================
// 工具函数
// ============================================================

/**
 * 从 URL 获取域名
 */
function getDomain(url: string): string {
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        return parsed.hostname;
    } catch {
        return '';
    }
}

/**
 * 生成 Logo URL (使用 Google Favicon API)
 */
function generateLogoUrl(url: string): string {
    const domain = getDomain(url);
    if (!domain) return '';
    // Google Favicon API - 128px 高清质量
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

/**
 * 清理和优化描述
 */
function cleanDescription(desc: string): string {
    if (!desc || typeof desc !== 'string') return '';
    // 移除 HTML 实体
    return desc
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
}

/**
 * 根据描述和名称推断定价模型
 */
function inferPricing(name: string, desc: string): 'Free' | 'Freemium' | 'Paid' {
    const lowerDesc = (desc + ' ' + name).toLowerCase();
    if (lowerDesc.includes('free') && lowerDesc.includes('paid')) return 'Freemium';
    if (lowerDesc.includes('free')) return 'Free';
    if (lowerDesc.includes('paid') || lowerDesc.includes('premium') || lowerDesc.includes('expensive')) return 'Paid';
    return 'Freemium'; // 默认
}

/**
 * 清理 URL
 */
function cleanUrl(url: string): string {
    if (!url) return '';
    let cleaned = url.trim();
    // 修复常见的 URL 问题
    if (cleaned.startsWith('https//')) {
        cleaned = 'https://' + cleaned.slice(7);
    }
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
        cleaned = 'https://' + cleaned;
    }
    return cleaned;
}

/**
 * 处理包含多个分类的情况 (如 "AI Design|Prompt")
 */
function getCategory(categoryStr: string, isAI: boolean): Category | null {
    if (!categoryStr) return null;
    
    // 处理多分类，取第一个
    const mainCategory = categoryStr.split('|')[0].trim();
    
    const categoryMap = isAI ? AI_CATEGORY_MAP : DIGI_CATEGORY_MAP;
    return categoryMap[mainCategory] || null;
}

// ============================================================
// 主导入函数
// ============================================================

export function parseExcelData(): { categories: Category[]; tools: Tool[] } {
    const aiFilePath = path.join(process.cwd(), 'docs', 'Ai Tools.xlsx');
    const digiFilePath = path.join(process.cwd(), 'docs', 'Digi Tools.xlsx');

    // 读取 Excel 文件
    const aiWorkbook = XLSX.readFile(aiFilePath);
    const digiWorkbook = XLSX.readFile(digiFilePath);

    const aiSheet = aiWorkbook.Sheets[aiWorkbook.SheetNames[0]];
    const digiSheet = digiWorkbook.Sheets[digiWorkbook.SheetNames[0]];

    const aiData: any[] = XLSX.utils.sheet_to_json(aiSheet);
    const digiData: any[] = XLSX.utils.sheet_to_json(digiSheet);

    // 收集所有分类
    const categoriesMap = new Map<string, Category>();
    
    // 添加父分类
    categoriesMap.set(AI_PARENT_CATEGORY.id, AI_PARENT_CATEGORY);
    categoriesMap.set(DIGI_PARENT_CATEGORY.id, DIGI_PARENT_CATEGORY);

    const tools: Tool[] = [];
    const now = new Date().toISOString();

    // 处理 AI Tools
    console.log(`Processing ${aiData.length} AI Tools...`);
    for (const row of aiData) {
        const name = row['name']?.trim();
        const url = cleanUrl(row['url']);
        const description = cleanDescription(row['description']);
        const featured = row['Featured'] === 1;
        const categoryStr = row['AI Tools Categories'];

        if (!name || !url) continue;

        const category = getCategory(categoryStr, true);
        if (category) {
            categoriesMap.set(category.id, category);
        }

        tools.push({
            id: nanoid(),
            name,
            description,
            url,
            logoUrl: generateLogoUrl(url),
            categoryId: category?.id || 'cat-ai-productivity',
            isFeatured: featured,
            isPublished: true,
            pricing: inferPricing(name, description),
            viewCount: Math.floor(Math.random() * 1000),
            createdAt: now,
            updatedAt: now
        });
    }

    // 处理 Digital Tools
    console.log(`Processing ${digiData.length} Digital Tools...`);
    for (const row of digiData) {
        const name = row['name']?.trim();
        const url = cleanUrl(row['url']);
        const description = cleanDescription(row['description']);
        const featured = row['Featured'] === 1;
        const categoryStr = row['Digi Tools Categories'];

        if (!name || !url) continue;

        const category = getCategory(categoryStr, false);
        if (category) {
            categoriesMap.set(category.id, category);
        }

        tools.push({
            id: nanoid(),
            name,
            description,
            url,
            logoUrl: generateLogoUrl(url),
            categoryId: category?.id || 'cat-digi-other',
            isFeatured: featured,
            isPublished: true,
            pricing: inferPricing(name, description),
            viewCount: Math.floor(Math.random() * 1000),
            createdAt: now,
            updatedAt: now
        });
    }

    const categories = Array.from(categoriesMap.values());

    console.log(`\nParsed ${categories.length} categories and ${tools.length} tools`);

    return { categories, tools };
}

/**
 * 生成 SQL 语句
 */
export function generateSQL(): string {
    const { categories, tools } = parseExcelData();

    let sql = '-- Generated import script for Tools and Categories\n\n';

    // 清空现有数据 (可选)
    sql += '-- Clear existing data (uncomment if needed)\n';
    sql += '-- DELETE FROM tools;\n';
    sql += '-- DELETE FROM categories;\n\n';

    // 插入分类
    sql += '-- Insert Categories\n';
    for (const cat of categories) {
        sql += `INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.slug}', ${cat.parentId ? `'${cat.parentId}'` : 'NULL'}, '${cat.icon}', '${cat.description.replace(/'/g, "''")}', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
`;
    }

    sql += '\n-- Insert Tools\n';
    for (const tool of tools) {
        sql += `INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('${tool.id}', '${tool.name.replace(/'/g, "''")}', '${tool.description.replace(/'/g, "''")}', '${tool.url}', '${tool.logoUrl}', '${tool.categoryId}', ${tool.isFeatured ? 1 : 0}, ${tool.isPublished ? 1 : 0}, '${tool.pricing}', ${tool.viewCount}, '${tool.createdAt}', '${tool.updatedAt}');
`;
    }

    return sql;
}

/**
 * 生成 JSON 数据 (用于 API 导入)
 */
export function generateJSON(): string {
    const { categories, tools } = parseExcelData();
    return JSON.stringify({ categories, tools }, null, 2);
}

// 如果直接运行脚本
if (require.main === module) {
    console.log('=== Tools Import Script ===\n');
    
    const { categories, tools } = parseExcelData();
    
    console.log('\n--- Categories ---');
    for (const cat of categories) {
        console.log(`  ${cat.parentId ? '  └─' : '•'} ${cat.name} (${cat.slug})`);
    }
    
    console.log('\n--- Tools Summary ---');
    const categoryCount: Record<string, number> = {};
    for (const tool of tools) {
        categoryCount[tool.categoryId] = (categoryCount[tool.categoryId] || 0) + 1;
    }
    for (const [catId, count] of Object.entries(categoryCount)) {
        const cat = categories.find(c => c.id === catId);
        console.log(`  ${cat?.name || catId}: ${count} tools`);
    }
    
    // 保存 SQL 文件
    const sqlPath = path.join(process.cwd(), 'scripts', 'import-tools.sql');
    fs.writeFileSync(sqlPath, generateSQL());
    console.log(`\n✅ SQL file saved to: ${sqlPath}`);
    
    // 保存 JSON 文件
    const jsonPath = path.join(process.cwd(), 'scripts', 'import-tools.json');
    fs.writeFileSync(jsonPath, generateJSON());
    console.log(`✅ JSON file saved to: ${jsonPath}`);
}
