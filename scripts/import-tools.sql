-- Generated import script for Tools and Categories

-- Clear existing data (uncomment if needed)
-- DELETE FROM tools;
-- DELETE FROM categories;

-- Insert Categories
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-tools', 'AI Tools', 'ai-tools', NULL, 'Sparkles', 'Artificial Intelligence powered tools for productivity, creativity, and automation', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digital-tools', 'Digital Tools', 'digital-tools', NULL, 'Wrench', 'Essential digital marketing, SEO, and web development tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-coding', 'AI Coding', 'ai-coding', 'cat-ai-tools', 'Code', 'AI tools for code generation, debugging, and development assistance', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-productivity', 'AI Productivity', 'ai-productivity', 'cat-ai-tools', 'Zap', 'AI tools for productivity enhancement and workflow automation', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-chatbot', 'AI Chatbots', 'ai-chatbots', 'cat-ai-tools', 'MessageSquare', 'AI-powered conversational assistants and chatbots like ChatGPT, Claude, and Bard', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-design', 'AI Image Generation', 'ai-image-generation', 'cat-ai-tools', 'Image', 'AI-powered image creation, editing, and enhancement tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-writing', 'AI Writing', 'ai-writing', 'cat-ai-tools', 'PenTool', 'AI-powered content writing, copywriting, and text generation tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-model', 'AI Models', 'ai-models', 'cat-ai-tools', 'Cpu', 'Open-source AI models, Stable Diffusion, and model hubs', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-detector', 'AI Detection & Paraphrasing', 'ai-detection', 'cat-ai-tools', 'Search', 'Tools to detect AI-generated content and paraphrase text', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-prompt', 'AI Prompts', 'ai-prompts', 'cat-ai-tools', 'Terminal', 'Prompt libraries, optimizers, and marketplaces for AI tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-extension', 'AI Browser Extensions', 'ai-extensions', 'cat-ai-tools', 'Puzzle', 'AI-powered browser extensions and add-ons', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-ai-video', 'AI Video', 'ai-video', 'cat-ai-tools', 'Video', 'AI tools for video generation, editing, and enhancement', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-chrome', 'Browser Extensions', 'browser-extensions', 'cat-digital-tools', 'Puzzle', 'Useful browser extensions for marketers and developers', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-email', 'Email & SMS Marketing', 'email-sms-marketing', 'cat-digital-tools', 'Mail', 'Email marketing, SMS campaigns, and automation tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-keyword', 'Keyword Research', 'keyword-research', 'cat-digital-tools', 'Key', 'Tools for finding and analyzing keywords for SEO and PPC', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-learning', 'Learning Resources', 'learning-resources', 'cat-digital-tools', 'BookOpen', 'SEO courses, tutorials, and educational resources', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-copywriting', 'Copywriting', 'copywriting', 'cat-digital-tools', 'Edit', 'Copywriting resources, templates, and headline generators', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-webdev', 'Website Building', 'website-building', 'cat-digital-tools', 'Layout', 'Website builders, hosting, domains, and web development tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-seo', 'SEO Tools', 'seo-tools', 'cat-digital-tools', 'Search', 'Search engine optimization tools for website ranking and analysis', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-design', 'Design Resources', 'design-resources', 'cat-digital-tools', 'Image', 'Stock images, icons, graphic design tools, and resources', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-backlink', 'Backlink Tools', 'backlink-tools', 'cat-digital-tools', 'Link', 'Backlink analysis, building, and monitoring tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-other', 'Other Tools', 'other-tools', 'cat-digital-tools', 'MoreHorizontal', 'Miscellaneous digital tools and utilities', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-social', 'Social Media', 'social-media', 'cat-digital-tools', 'Share2', 'Social media management, scheduling, and analytics tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-wordpress', 'WordPress', 'wordpress', 'cat-digital-tools', 'Globe', 'WordPress plugins, themes, and development tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-freelance', 'Freelance Platforms', 'freelance-platforms', 'cat-digital-tools', 'Users', 'Platforms to hire freelancers or offer services', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-affiliate', 'Affiliate Marketing', 'affiliate-marketing', 'cat-digital-tools', 'DollarSign', 'Affiliate networks, tracking, and marketing tools', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;
INSERT INTO categories (id, name, slug, parent_id, icon, description, created_at, updated_at) 
VALUES ('cat-digi-ecommerce', 'E-commerce', 'ecommerce', 'cat-digital-tools', 'ShoppingCart', 'E-commerce platforms, tools, and resources', datetime('now'), datetime('now'))
ON CONFLICT(id) DO UPDATE SET name = excluded.name, slug = excluded.slug, icon = excluded.icon, description = excluded.description;

-- Insert Tools
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('OXHbv8k_64ydZ8hiFmwMH', '.bubble', 'Build any web app without code', 'https://bubble.io/', 'https://www.google.com/s2/favicons?domain=bubble.io&sz=128', 'cat-ai-coding', 1, 1, 'Freemium', 388, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('AQG01fBfX9id3sksnI7z7', 'Synthflow', 'Build AI voice assistant', 'https://synthflow.ai/', 'https://www.google.com/s2/favicons?domain=synthflow.ai&sz=128', 'cat-ai-productivity', 0, 1, 'Freemium', 473, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('aQWWmkyNEIzzWUZNvricy', 'Chatgpt', 'Best AI chatbot by openai', 'https://chat.openai.com/auth/login', 'https://www.google.com/s2/favicons?domain=chat.openai.com&sz=128', 'cat-ai-chatbot', 1, 1, 'Freemium', 745, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ofr5KguuOhS9FSuSBKbzw', 'AirCode', 'Node.Js serverless stack for API development', 'https://aircode.io', 'https://www.google.com/s2/favicons?domain=aircode.io&sz=128', 'cat-ai-coding', 0, 1, 'Freemium', 539, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('5sv-WUosxVveKNRC7f156', 'Google Bard', 'Google Ai Chatbot', 'https://bard.google.com/chat', 'https://www.google.com/s2/favicons?domain=bard.google.com&sz=128', 'cat-ai-chatbot', 1, 1, 'Freemium', 863, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('F7I4bX-tedLMlBrh3xPXt', 'Claude', 'AI chatbot by claude', 'https://claude.ai/', 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128', 'cat-ai-chatbot', 0, 1, 'Freemium', 530, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('gAHAcPwhQIv2hl9TpTaMN', 'Claude 2 AI', 'Claude 2 chatbot, can be used by non-US residents', 'https://chat.finechat.ai/chats', 'https://www.google.com/s2/favicons?domain=chat.finechat.ai&sz=128', 'cat-ai-chatbot', 0, 1, 'Freemium', 569, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('PW6WrCO9ujPQmvPinIfJv', 'Microsoft Copilot', 'Bing chat with AI & Chatgpt-4', 'https://copilot.microsoft.com/', 'https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128', 'cat-ai-chatbot', 1, 1, 'Freemium', 651, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('S98byISLloSaWqbP0v15x', 'Midjourney', 'Powerful AI images & videos generator by prompts', 'https://www.midjourney.com', 'https://www.google.com/s2/favicons?domain=www.midjourney.com&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 932, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('GV38YtZITj8dHJQ7u5gB8', 'Leonardo.ai/', 'Create art & image, an alternative to Midjourney', 'https://leonardo.ai/', 'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 385, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('05CZs1LObtyxYetk8CR9p', 'Ideogram', 'Text-infused AI image generator by prompts', 'https://ideogram.ai/login', 'https://www.google.com/s2/favicons?domain=ideogram.ai&sz=128', 'cat-ai-design', 0, 1, 'Freemium', 846, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('oKH3Pw0b9-V0OgjD-HNMb', 'Playground', 'AI image creator', 'https://playground.com/login?redirect=/create?#', 'https://www.google.com/s2/favicons?domain=playground.com&sz=128', 'cat-ai-design', 0, 1, 'Freemium', 263, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('9DFh43VepEnyVQFyD09R1', 'Vectorizer.Ai', 'Convert JPEG and PNG to SVG in full color', 'https://vectorizer.ai/', 'https://www.google.com/s2/favicons?domain=vectorizer.ai&sz=128', 'cat-ai-design', 0, 1, 'Freemium', 756, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('QikZc_BW5uqIQXOnwq27P', 'Clipdrop', 'Remove background, cleanup pictures, upscaling, Stable diffusion and more…', 'https://clipdrop.co/', 'https://www.google.com/s2/favicons?domain=clipdrop.co&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 902, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('jJX0XNtNI2CbhPcxq7kmF', 'Imagica', 'Build a no-code Ai app', 'https://get.imagica.ai/', 'https://www.google.com/s2/favicons?domain=get.imagica.ai&sz=128', 'cat-ai-coding', 0, 1, 'Freemium', 481, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('EU_YnwnNNbWBDr_kbgyR5', 'Nightcafé', 'Create AI art & NFT', 'https://creator.nightcafe.studio/', 'https://www.google.com/s2/favicons?domain=creator.nightcafe.studio&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 909, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('zi4Y0zL-H5TmCV-HrD5pv', 'Getimg.ai', 'AI create,expand,edit images', 'https://getimg.ai/', 'https://www.google.com/s2/favicons?domain=getimg.ai&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 477, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('XPWWfjEv1Gb1C58XZbJ_H', 'Notion Ai', 'Ai content writer', 'https://www.notion.so/', 'https://www.google.com/s2/favicons?domain=www.notion.so&sz=128', 'cat-ai-writing', 0, 1, 'Freemium', 850, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('c9q7WEDr2FAKvchrNfzUP', 'Jasper', 'Enterprise-grade AI marketing content writer', 'https://www.jasper.ai/', 'https://www.google.com/s2/favicons?domain=www.jasper.ai&sz=128', 'cat-ai-writing', 1, 1, 'Freemium', 980, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('_qc0o4cwzr3AWKbn0Deye', 'Stable Diffusion', 'Ai art generator & text-to-image model', 'https://stablediffusionweb.com/', 'https://www.google.com/s2/favicons?domain=stablediffusionweb.com&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 555, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('zXVSKJ5OhOg4XmXgIPAbn', 'Stability.ai', 'Stable diffusion model', 'https://stability.ai/', 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128', 'cat-ai-model', 0, 1, 'Freemium', 360, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('3CesrN2CpBBFB2_62F1Lv', 'Hugging Face', 'A community for open-source generative AI models', 'https://huggingface.co/', 'https://www.google.com/s2/favicons?domain=huggingface.co&sz=128', 'cat-ai-model', 1, 1, 'Freemium', 423, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('D6o3UsWdnwaAGNktX5ty0', 'QuillBot', 'Best paraphraser, grammar & plagiarism checker', 'https://quillbot.com/', 'https://www.google.com/s2/favicons?domain=quillbot.com&sz=128', 'cat-ai-detector', 1, 1, 'Freemium', 334, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('OKjuYRQpYTSzUCSBGktee', 'Originality.ai', 'A paid AI text detector with 76% accuracy', 'https://originality.ai/', 'https://www.google.com/s2/favicons?domain=originality.ai&sz=128', 'cat-ai-detector', 1, 1, 'Paid', 583, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Wi3eSCWZGDXhvyZtSPr0H', 'Winston ai', 'The best accurate paid AI content detector with 84% accuracy', 'https://gowinston.ai/', 'https://www.google.com/s2/favicons?domain=gowinston.ai&sz=128', 'cat-ai-detector', 1, 1, 'Paid', 398, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('kxtnVrGCob0q0H7LEpWpG', 'Copy scape', 'Free online plagiarism checker for articles', 'https://www.copyscape.com/', 'https://www.google.com/s2/favicons?domain=www.copyscape.com&sz=128', 'cat-ai-detector', 1, 1, 'Free', 427, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('kR8YURkTlCzTHV_H87j62', 'PromptBase', 'Prompt marketplace for Midjourney, ChatGPT, DALL·E, Stable Diffusion & more', 'https://promptbase.com/', 'https://www.google.com/s2/favicons?domain=promptbase.com&sz=128', 'cat-ai-prompt', 1, 1, 'Freemium', 238, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Ka3sRs1njbbxFfeiYpIia', 'Lexica', 'Ai art generator & art prompt library', 'https://lexica.art/', 'https://www.google.com/s2/favicons?domain=lexica.art&sz=128', 'cat-ai-design', 0, 1, 'Freemium', 447, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ULbVMyxP1wbGWsJSGaNTU', 'Monica', 'Chatgpt ai assistant', 'https://chrome.google.com/webstore/detail/monica-your-ai-copilot-po/ofpnmcalabcbjgholdjcjblkibolbppb?utm_source=index_page', 'https://www.google.com/s2/favicons?domain=chrome.google.com&sz=128', 'cat-ai-extension', 1, 1, 'Freemium', 759, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('WId20wvb_W7ANs14McorW', 'Geniea', 'Midjourney prompt optimizer', 'https://geniea.com/', 'https://www.google.com/s2/favicons?domain=geniea.com&sz=128', 'cat-ai-prompt', 1, 1, 'Freemium', 52, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('tO8d_BhBIfdPM1yjKSn9q', 'PromptHero', 'Prompts library for Midjourney, ChatGPT & Stable diffusion etc', 'https://prompthero.com/', 'https://www.google.com/s2/favicons?domain=prompthero.com&sz=128', 'cat-ai-prompt', 1, 1, 'Freemium', 827, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('dzrSWH1xYDFd5SEIbP2f2', 'Character.ai', 'Chat with user-created AI characters', 'https://beta.character.ai/', 'https://www.google.com/s2/favicons?domain=beta.character.ai&sz=128', 'cat-ai-chatbot', 0, 1, 'Freemium', 649, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('_qD6QZdfQVlOGbIXBDx71', 'Coze', '', 'https://www.coze.com/', 'https://www.google.com/s2/favicons?domain=www.coze.com&sz=128', 'cat-ai-chatbot', 0, 1, 'Freemium', 112, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('1GqWAZxleSYboHorjG-kT', 'YouTube Transcript', 'Create YouTube video transcript with video url', 'https://youtubetranscript.com', 'https://www.google.com/s2/favicons?domain=youtubetranscript.com&sz=128', 'cat-ai-productivity', 1, 1, 'Freemium', 398, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('wR1iIuPPWQVmqDpgY105l', 'Topaz Labs', 'Best paid enhancing & upscaling photo & video quality', 'https://www.topazlabs.com/', 'https://www.google.com/s2/favicons?domain=www.topazlabs.com&sz=128', 'cat-ai-design', 1, 1, 'Paid', 527, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('lYS5_GVx5F5xjUHfM3xRi', 'Upscayl', 'Useful free Upscaling photo & video software', 'https://www.upscayl.org/', 'https://www.google.com/s2/favicons?domain=www.upscayl.org&sz=128', 'cat-ai-design', 1, 1, 'Free', 460, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('r20uJJoicpg_8ZrNmy5Nd', 'EQMJ', 'Midjourney’s simple alternative from China', 'http://www.eqmj.cc/enter', 'https://www.google.com/s2/favicons?domain=www.eqmj.cc&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 145, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('aHe4nwS9uFnn4enT9bCbp', 'Magnific', 'Photo & video enhancer & upscaler online', 'https://magnific.ai/', 'https://www.google.com/s2/favicons?domain=magnific.ai&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 222, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('IyitEZEWEhvhTPgL78BIb', 'Civitai', 'A hub for high-quality stable diffusion models', 'https://civitai.com/', 'https://www.google.com/s2/favicons?domain=civitai.com&sz=128', 'cat-ai-model', 1, 1, 'Freemium', 672, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('64H7kVColyKlf6YjwA-oj', 'LiblibAi', 'A collection of stable diffusion models', 'https://www.liblib.ai', 'https://www.google.com/s2/favicons?domain=www.liblib.ai&sz=128', 'cat-ai-model', 1, 1, 'Freemium', 4, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('wpWY9Lxz3bnXJlsLt026d', 'OpenArt', 'Create Ai art & Ai models offered', 'https://openart.ai/', 'https://www.google.com/s2/favicons?domain=openart.ai&sz=128', 'cat-ai-design', 1, 1, 'Freemium', 185, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7bjOtFVJQLw9h8y6kYYLi', 'Arthub.ai', 'More Prompts in styles of ACGN & Asian elements', 'https://arthub.ai/', 'https://www.google.com/s2/favicons?domain=arthub.ai&sz=128', 'cat-ai-prompt', 1, 1, 'Freemium', 553, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('mWwwltpA2F7JJ-1kRMgD6', 'Moonvy Ops', 'Mj & Sd prompts helper', 'https://moonvy.com/apps/ops/', 'https://www.google.com/s2/favicons?domain=moonvy.com&sz=128', 'cat-ai-prompt', 1, 1, 'Freemium', 383, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('zIf1oAYN_TOR7IXI4Q4yG', 'Geniea', 'MJ prompt optimizer', 'https://geniea.com/', 'https://www.google.com/s2/favicons?domain=geniea.com&sz=128', 'cat-ai-prompt', 1, 1, 'Freemium', 620, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('kEIHcOkng1UmJBzbCKYHb', 'llElevenLabs', 'Best Ai voice generator', 'https://elevenlabs.io/', 'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128', 'cat-ai-video', 1, 1, 'Freemium', 703, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('NCyRX8QgzblJi6ZvsTBb0', 'Modelscope', 'Ai models from alibaba', 'https://modelscope.cn/home', 'https://www.google.com/s2/favicons?domain=modelscope.cn&sz=128', 'cat-ai-model', 0, 1, 'Freemium', 800, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('bJdXvTZK710Dj2cW99YD5', 'PromptFolder', 'Good free Mj prompt helper', 'https://promptfolder.com/midjourney-prompt-helper/', 'https://www.google.com/s2/favicons?domain=promptfolder.com&sz=128', 'cat-ai-prompt', 1, 1, 'Free', 44, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('6U2V2d1kOT27PGsidzFWo', 'Aigallery', 'Best free Mj & SD prompt helper & prompt library', 'https://www.aigallery.top/', 'https://www.google.com/s2/favicons?domain=www.aigallery.top&sz=128', 'cat-ai-prompt', 1, 1, 'Free', 997, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('TfvSNrn3c7_vLZ-cHXqso', 'Keywords Everywhere', 'Useful cheap keyword research plugin', 'https://keywordseverywhere.com/', 'https://www.google.com/s2/favicons?domain=keywordseverywhere.com&sz=128', 'cat-digi-chrome', 1, 1, 'Freemium', 984, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('-bdpdWCaMhWcx3Xe5sQvi', 'SEOquake', 'Power SEO toolbox plugin', 'https://www.seoquake.com', 'https://www.google.com/s2/favicons?domain=www.seoquake.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 450, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('IgZSyNcvya1nHXxpg4Ww_', 'Mailchimp', 'Most used EDM tools', 'https://mailchimp.com/', 'https://www.google.com/s2/favicons?domain=mailchimp.com&sz=128', 'cat-digi-email', 0, 1, 'Freemium', 732, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('dtUJhVI-5j530mDeNCZVK', 'Ahrefs', 'Best keyword search & Backlinks tool', 'https://ahrefs.com', 'https://www.google.com/s2/favicons?domain=ahrefs.com&sz=128', 'cat-digi-keyword', 1, 1, 'Freemium', 335, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('76k3fdpCK7tJuOZwGU0oU', 'Backlinko', 'Seo and backlinko guide', 'https://backlinko.com/', 'https://www.google.com/s2/favicons?domain=backlinko.com&sz=128', 'cat-digi-learning', 0, 1, 'Freemium', 764, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('eo1TwsSiipGwfEa6pti_r', 'Conductor', 'Free SEO training & SEO courses', 'https://www.conductor.com/academy/', 'https://www.google.com/s2/favicons?domain=www.conductor.com&sz=128', 'cat-digi-learning', 0, 1, 'Free', 761, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Yrgyr2V9reWSHYDf_nKdg', 'Lawsofux', 'UX design laws', 'https://lawsofux.com/', 'https://www.google.com/s2/favicons?domain=lawsofux.com&sz=128', 'cat-digi-learning', 0, 1, 'Freemium', 475, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('fokUBYgyoHJOUx-ykbkWY', 'Exploding Topics', 'Discover exploding topics', 'https://explodingtopics.com/', 'https://www.google.com/s2/favicons?domain=explodingtopics.com&sz=128', 'cat-digi-copywriting', 1, 1, 'Freemium', 349, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('3_q34cA_vLCTvS8kyKKRR', 'Bricks Builder', 'Fast-loading, clean code wordpress visual page builder', 'https://bricksbuilder.io/', 'https://www.google.com/s2/favicons?domain=bricksbuilder.io&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 702, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('kvEYTPwaOQMXtTfc0lnSP', 'LearningSEO', 'A roadmap to learn SEO', 'https://learningseo.io/', 'https://www.google.com/s2/favicons?domain=learningseo.io&sz=128', 'cat-digi-learning', 1, 1, 'Freemium', 756, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('R1Q4ccEvGez2yTNn9Ln45', 'Marketing Examples', 'Copywriting examples', 'https://marketingexamples.com/', 'https://www.google.com/s2/favicons?domain=marketingexamples.com&sz=128', 'cat-digi-learning', 1, 1, 'Freemium', 16, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('41bR14M5ioitGDiTZ2uGS', 'Income School', 'Build an affiliate site course', 'https://incomeschool.com/', 'https://www.google.com/s2/favicons?domain=incomeschool.com&sz=128', 'cat-digi-learning', 0, 1, 'Freemium', 994, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Enk6lgv9aEoR2VYlpV-F5', 'Authority Hacker', 'Authority site course', 'https://www.authorityhacker.com/', 'https://www.google.com/s2/favicons?domain=www.authorityhacker.com&sz=128', 'cat-digi-learning', 0, 1, 'Freemium', 298, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('UDAUI-J692t4_cZpFeU1I', 'Namesilo', 'Buy cheap domain so easy', 'https://www.namesilo.com/', 'https://www.google.com/s2/favicons?domain=www.namesilo.com&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 774, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('59jiYvvxpIm0O1boemlDo', 'Hostinger', 'The most economic shared hosting choice', 'https://www.hostinger.com/', 'https://www.google.com/s2/favicons?domain=www.hostinger.com&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 929, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('h0_7chm-8XE6GSPbm-JVM', 'Wpengine', 'Managed hosting fast speed but expensive', 'https://wpengine.com/', 'https://www.google.com/s2/favicons?domain=wpengine.com&sz=128', 'cat-digi-webdev', 0, 1, 'Paid', 944, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('OvLuWMGKm4Zih_sfT7AaD', 'Cloudways', 'Managed dedicated hosting fast speed but less expensive', 'https://www.cloudways.com/en/', 'https://www.google.com/s2/favicons?domain=www.cloudways.com&sz=128', 'cat-digi-webdev', 0, 1, 'Paid', 934, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('bKRPj18iw_GS84BdM9h4P', 'Runcloud', 'Fast & economic control web server management panel', 'https://runcloud.io', 'https://www.google.com/s2/favicons?domain=runcloud.io&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 184, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('gPAvyT2D9jOZrtzal6hD1', 'Themeforest', 'Sell web themes & templates', 'https://themeforest.net/', 'https://www.google.com/s2/favicons?domain=themeforest.net&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 188, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('qZ8k8F9Jy3R8h7F3Gga33', 'SEMRUSH', 'check competitors'' free & paid traffic and keywords', 'https://www.semrush.com/', 'https://www.google.com/s2/favicons?domain=www.semrush.com&sz=128', 'cat-digi-keyword', 0, 1, 'Freemium', 880, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('VnkWgs13f9PmBsre5QzpV', 'AnswerThePublic', 'Free longtail keywords search tool', 'https://answerthepublic.com/?via=pew', 'https://www.google.com/s2/favicons?domain=answerthepublic.com&sz=128', 'cat-digi-seo', 0, 1, 'Free', 747, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('IOlYPDwUNPd1c4yvi754Z', 'Google Keyword Planner', 'Best free accurate keyword tool', 'https://ads.google.com/home/tools/keyword-planner/', 'https://www.google.com/s2/favicons?domain=ads.google.com&sz=128', 'cat-digi-keyword', 1, 1, 'Free', 922, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('P91BBepwCs4phNPl2VXQV', 'KWFinder', 'Cost-effective paid keywords tool', 'https://mangools.com/kwfinder/', 'https://www.google.com/s2/favicons?domain=mangools.com&sz=128', 'cat-digi-keyword', 0, 1, 'Paid', 678, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ktvORPRX0M6LapgBrP4WJ', 'Coverview', 'Free online create cover images for blogs', 'https://coverview.vercel.app/', 'https://www.google.com/s2/favicons?domain=coverview.vercel.app&sz=128', 'cat-digi-design', 0, 1, 'Free', 560, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('8RJlCN6SikSs6OvR8JUhZ', 'SeedKeywords', 'Find new keywords idea', 'https://www.seedkeywords.com/', 'https://www.google.com/s2/favicons?domain=www.seedkeywords.com&sz=128', 'cat-digi-keyword', 0, 1, 'Freemium', 101, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('sUvDbhdrW1VpNZUbsttEj', 'SpyFu', 'Check competitors'' online marketing channels', 'https://www.spyfu.com/', 'https://www.google.com/s2/favicons?domain=www.spyfu.com&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 158, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7y71GaCFaaGz2cB3LOxjT', 'AlsoAsked', 'Find questions people asked in different countries', 'https://alsoasked.com/', 'https://www.google.com/s2/favicons?domain=alsoasked.com&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 938, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7nQMDNVHv6DgMzAbfsdsF', 'Lsigraph', 'LSI keyword tool', 'https://lsigraph.com/', 'https://www.google.com/s2/favicons?domain=lsigraph.com&sz=128', 'cat-digi-keyword', 0, 1, 'Freemium', 99, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ZgBib8sBNRMCGfvqivIUl', 'Rich Snippets', 'Check whether the content can be marked with schema on a webpage be recognized by Google', 'https://search.google.com/test/rich-results', 'https://www.google.com/s2/favicons?domain=search.google.com&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 740, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('H1_7shMqaeqDLtoCWajck', 'Portent', 'Content idea & headline generator', 'https://www.portent.com/tools/title-maker/?new=true', 'https://www.google.com/s2/favicons?domain=www.portent.com&sz=128', 'cat-digi-copywriting', 0, 1, 'Freemium', 139, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('gIov8BCAzK6pF4kcYAZ94', 'Content Row', 'High quality headline generator', 'https://www.contentrow.com/tools/headline-generator', 'https://www.google.com/s2/favicons?domain=www.contentrow.com&sz=128', 'cat-digi-copywriting', 0, 1, 'Freemium', 157, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('G0s0vSK585bOR6pGetVVI', 'QuestionDB', 'Free keyword questions tool', 'https://questiondb.io/', 'https://www.google.com/s2/favicons?domain=questiondb.io&sz=128', 'cat-digi-seo', 0, 1, 'Free', 715, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('YJGZQJjA-da4q9rPnBUQs', 'Copy scape', 'Free online plagiarism checker for articles', 'https://Https://www.copyscape.com', 'https://www.google.com/s2/favicons?domain=https&sz=128', 'cat-digi-copywriting', 0, 1, 'Free', 424, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('bg-dt25QILmZDBTdydj9T', 'Winston ai', 'The best accurate paid AI content detector with 84% accuracy', 'https://gowinston.ai/', 'https://www.google.com/s2/favicons?domain=gowinston.ai&sz=128', 'cat-digi-copywriting', 0, 1, 'Paid', 215, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('394I1CSNEo5Md_TyXa9zS', 'Originality.ai', 'A paid AI text detector with 76% accuracy', 'https://originality.ai/', 'https://www.google.com/s2/favicons?domain=originality.ai&sz=128', 'cat-digi-copywriting', 1, 1, 'Paid', 33, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('iaklDHRiwWSxeqr8WhnbF', 'Sapling', 'Free paid AI text detector with 68% accuracy', 'https://sapling.ai/ai-content-detector', 'https://www.google.com/s2/favicons?domain=sapling.ai&sz=128', 'cat-digi-copywriting', 1, 1, 'Freemium', 836, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('9VIu8Kk9YC59kDU7OX9om', 'Ahrefs', 'The best and most powerful backlink checker', 'https://ahrefs.com/', 'https://www.google.com/s2/favicons?domain=ahrefs.com&sz=128', 'cat-digi-backlink', 0, 1, 'Freemium', 727, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('f7weZ7Xwp7IAXjnH9qjpX', 'HARO', 'Get backlinks from top media', 'https://www.helpareporter.com/', 'https://www.google.com/s2/favicons?domain=www.helpareporter.com&sz=128', 'cat-digi-backlink', 0, 1, 'Freemium', 654, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('8sttCKydyznYWLc-B9oOz', 'BuzzStream', 'Best influencer outreach tool', 'https://www.buzzstream.com/link-building', 'https://www.google.com/s2/favicons?domain=www.buzzstream.com&sz=128', 'cat-digi-backlink', 0, 1, 'Freemium', 915, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('FUozZjqZgZqhjBMtUCIvf', 'SEO Review Tools', 'Free backlink checker', 'https://www.seoreviewtools.com/valuable-backlinks-checker/', 'https://www.google.com/s2/favicons?domain=www.seoreviewtools.com&sz=128', 'cat-digi-backlink', 0, 1, 'Free', 216, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('JWdPRYhaAFaPiSrqB55a9', 'Search Volume', 'Free keyword search volume tool', 'https://searchvolume.io/', 'https://www.google.com/s2/favicons?domain=searchvolume.io&sz=128', 'cat-digi-keyword', 0, 1, 'Free', 722, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('FxJgbtIDHj9_4gVpt5lm6', 'Similarweb', 'Best check and analyze tool for big traffic website', 'https://www.similarweb.com/', 'https://www.google.com/s2/favicons?domain=www.similarweb.com&sz=128', 'cat-digi-seo', 1, 1, 'Freemium', 187, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('jwdj65T1Tqz-_2-cGU9hA', 'Easy Counter', 'Website analysiez tool for small traffic website', 'https://www.easycounter.com/', 'https://www.google.com/s2/favicons?domain=www.easycounter.com&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 547, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('O552R8Mi2RvZ8vlzmLfpy', 'Microsoft Clarity', 'Free heatmap recorder', 'https://clarity.microsoft.com/', 'https://www.google.com/s2/favicons?domain=clarity.microsoft.com&sz=128', 'cat-digi-seo', 0, 1, 'Free', 945, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('geUN8k8RmxTec9qotzC-5', 'TechnicalSeo', 'Schema markup generator', 'https://technicalseo.com/tools/schema-markup-generator/', 'https://www.google.com/s2/favicons?domain=technicalseo.com&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 844, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('LGIIHoDKOYM2rpYQcAfqF', 'SmallSEOTools', 'Free kinds of SEO tools', 'https://smallseotools.com/', 'https://www.google.com/s2/favicons?domain=smallseotools.com&sz=128', 'cat-digi-seo', 0, 1, 'Free', 670, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('RTJbZx86tmh1bkcbbqnlr', 'Gtmetrix', 'Website performance testing and monitoring', 'https://gtmetrix.com/', 'https://www.google.com/s2/favicons?domain=gtmetrix.com&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 373, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('_Y1aa-qhT6uo9iObOcgQj', 'Apify', 'Web scraping and automation platform', 'https://apify.com/', 'https://www.google.com/s2/favicons?domain=apify.com&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 682, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('8D_Gc6XyhhsrKMndAixv0', 'Wayback Machine', 'Website archive', 'https://web.archive.org/', 'https://www.google.com/s2/favicons?domain=web.archive.org&sz=128', 'cat-digi-seo', 1, 1, 'Freemium', 814, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('yHG9T_LuuTW7GnJElNjnn', 'Ryte', 'Robots txt generator', 'https://en.ryte.com/free-tools/robots-txt-generator/', 'https://www.google.com/s2/favicons?domain=en.ryte.com&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 926, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('WUuIJUROlP9fG1gfaNwmW', 'DNS Checker', 'DNS checker', 'https://dnschecker.org/', 'https://www.google.com/s2/favicons?domain=dnschecker.org&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 659, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('UuDyT5xazBwBixEjqtQ-y', 'Siteliner', 'Free and fast analysis of your entire website', 'https://www.siteliner.com/', 'https://www.google.com/s2/favicons?domain=www.siteliner.com&sz=128', 'cat-digi-seo', 0, 1, 'Free', 547, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('nkLGYXqyxdmdjwRRBzTXC', 'Hootsuite', 'Powerful social media scheduling tool for large enterprises', 'https://www.hootsuite.com/', 'https://www.google.com/s2/favicons?domain=www.hootsuite.com&sz=128', 'cat-digi-social', 0, 1, 'Freemium', 270, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('lYOBlPsyZwq822Ubcmp85', 'Buffer', 'Economic social media scheduling tool for small & medium enterprises', 'https://buffer.com/', 'https://www.google.com/s2/favicons?domain=buffer.com&sz=128', 'cat-digi-social', 1, 1, 'Freemium', 317, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('6_KDLZdNHBvLbDrUDOSKy', 'Tubebuddy', 'YouTube optimization and channel management tool', 'https://www.tubebuddy.com/', 'https://www.google.com/s2/favicons?domain=www.tubebuddy.com&sz=128', 'cat-digi-chrome', 1, 1, 'Freemium', 851, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ZN-AEkA5nJiA3fyliqbJ6', 'Social Blade', 'Social media analytics tool', 'https://socialblade.com/', 'https://www.google.com/s2/favicons?domain=socialblade.com&sz=128', 'cat-digi-social', 1, 1, 'Freemium', 120, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('tdb-sdHbhqJG9--MlyWSn', 'Milled', 'Brand email newsletters templates', 'https://milled.com/', 'https://www.google.com/s2/favicons?domain=milled.com&sz=128', 'cat-digi-email', 0, 1, 'Freemium', 375, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('9KphVZ9Ous_0jx9vmDbGr', 'Goodsalesemails', 'Good sales emails templates', 'https://goodsalesemails.com/', 'https://www.google.com/s2/favicons?domain=goodsalesemails.com&sz=128', 'cat-digi-email', 0, 1, 'Freemium', 34, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('jssK-wM28gqvgPvGr-Ah8', 'Textmagic', 'Best SMS marketing tool', 'https://www.textmagic.com/', 'https://www.google.com/s2/favicons?domain=www.textmagic.com&sz=128', 'cat-digi-email', 0, 1, 'Freemium', 628, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('3rtrv24LKMgwAQIVsj-ZB', 'Smsarchives', 'Brands SMS templates', 'https://smsarchives.com/', 'https://www.google.com/s2/favicons?domain=smsarchives.com&sz=128', 'cat-digi-email', 0, 1, 'Freemium', 466, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('yh_lUmUWN6YCqr132KQqQ', 'Brevo', 'Email & sms marketing automation tool', 'https://www.brevo.com/', 'https://www.google.com/s2/favicons?domain=www.brevo.com&sz=128', 'cat-digi-email', 0, 1, 'Freemium', 719, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('mw7GAXLfd7Gc697XkjkS3', 'Mailerlite', 'Simple easy cheap email marketing tool', 'https://www.mailerlite.com/', 'https://www.google.com/s2/favicons?domain=www.mailerlite.com&sz=128', 'cat-digi-email', 1, 1, 'Freemium', 536, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ecFSYo02T-QXRS7QY9zXi', 'Omnisend', 'Ecommerce email marketing tool', 'https://www.omnisend.com/', 'https://www.google.com/s2/favicons?domain=www.omnisend.com&sz=128', 'cat-digi-email', 1, 1, 'Freemium', 626, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('NN-zM2SM5tAST2kXypp_w', 'ActiveCampaign', 'Powerful b2b email marketing & CRM tool', 'https://www.activecampaign.com/', 'https://www.google.com/s2/favicons?domain=www.activecampaign.com&sz=128', 'cat-digi-email', 1, 1, 'Freemium', 347, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('bJpT8dl8Fdl_sR9OrGf_k', 'Mailshake', 'Automated cold email outreach', 'https://mailshake.com/', 'https://www.google.com/s2/favicons?domain=mailshake.com&sz=128', 'cat-digi-email', 0, 1, 'Freemium', 510, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('v2YgXCBIe6qH0qEXXnck9', 'Laifaxin', 'Email hunter and cold email automated reach tool', 'https://web.laifaxin.com/regist/z7qr4c', 'https://www.google.com/s2/favicons?domain=web.laifaxin.com&sz=128', 'cat-digi-email', 1, 1, 'Freemium', 636, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('g_e7FEX2tKtctTRhbuCUZ', 'Nightwatch', 'Simulate search engine queries from any location on Google', 'https://chrome.google.com/webstore/detail/seo-search-simulator-by-n/edfjfgjklednkencfhnokmkajbgfhpon', 'https://www.google.com/s2/favicons?domain=chrome.google.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 236, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('SlKGBzUaxHOwvH2ZYb9FW', 'Printfriendly', 'Print and PDF Web Pages removing ads & navigation', 'https://www.printfriendly.com/', 'https://www.google.com/s2/favicons?domain=www.printfriendly.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 711, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('kcLa4KVdt1JL25Np0lv39', 'Instant Data Scraper', 'Extracts data from web pages', 'https://webrobots.io/instantdata/', 'https://www.google.com/s2/favicons?domain=webrobots.io&sz=128', 'cat-digi-chrome', 1, 1, 'Freemium', 980, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('wtc4GkP8dHeUhnsD_FvMT', 'SERPTrends', 'Shows dynamics on Google, Yahoo and Bing SERPs', 'http://www.serptrends.com/', 'https://www.google.com/s2/favicons?domain=www.serptrends.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 333, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('tZnGC643_uBRBLTaWzClb', 'Glimpse', 'Discover trends in any category', 'https://meetglimpse.com/', 'https://www.google.com/s2/favicons?domain=meetglimpse.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 346, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('j6X-MlkpMGk5EqSuyrlbZ', 'AIX Downloader', 'Batch download image/video/music on the webpage', 'https://aixdownloader.com/', 'https://www.google.com/s2/favicons?domain=aixdownloader.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 245, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('8g44PRp3iGB1xhnv7d9bJ', 'SimilarTech Prospecting', 'Website profiler tool', 'https://www.similartech.com/', 'https://www.google.com/s2/favicons?domain=www.similartech.com&sz=128', 'cat-digi-chrome', 1, 1, 'Freemium', 184, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('SosYV7GGwK88qVfBwO_kV', 'BuiltWith', 'Website technology profiler tool', 'https://builtwith.com/', 'https://www.google.com/s2/favicons?domain=builtwith.com&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 674, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Ni4gcjC6hATP66YnZGdBv', 'Brightlocal', 'Local SEO research', 'https://www.brightlocal.com/research/', 'https://www.google.com/s2/favicons?domain=www.brightlocal.com&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 136, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7z13UM2JqUxaG3Ll6ZuNo', 'Similar Sites', 'Find similar websites', 'https://www.similarsites.com/', 'https://www.google.com/s2/favicons?domain=www.similarsites.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 516, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('e6nkKGe-4x5UlEvz8Aafb', 'Sitelike.org', 'Similar websites search', 'https://www.sitelike.org/', 'https://www.google.com/s2/favicons?domain=www.sitelike.org&sz=128', 'cat-digi-seo', 1, 1, 'Freemium', 25, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('aiJeod0Ftb3mjf8t1mc4-', 'Similar Site Search', 'Find similar websites', 'https://similars.net/', 'https://www.google.com/s2/favicons?domain=similars.net&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 643, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('SULAB4HXTVpyxsGldeVbB', 'Siteprice.org', 'Website value,similar websites,traffic checker', 'https://www.siteprice.org/', 'https://www.google.com/s2/favicons?domain=www.siteprice.org&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 638, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('bzmCODdFQdXm63PyV7Jtq', 'Sitesimilar', 'Search similar sites', 'https://www.sitesimilar.net/', 'https://www.google.com/s2/favicons?domain=www.sitesimilar.net&sz=128', 'cat-digi-seo', 0, 1, 'Freemium', 989, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('CqhfWL-3XKKmVqeQXZpgy', 'Icon Horse', 'Get any site''s favicon', 'https://icon.horse/', 'https://www.google.com/s2/favicons?domain=icon.horse&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 351, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('_-Hjo5lXObRbrE5nGYKSW', 'The Favicon Finder', 'Find any site’s favicon', 'https://besticon-demo.herokuapp.com/', 'https://www.google.com/s2/favicons?domain=besticon-demo.herokuapp.com&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 842, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('eHe8uyOestiu-mvlfIK51', 'FireShot', 'Take webpage screenshots', 'https://getfireshot.com/', 'https://www.google.com/s2/favicons?domain=getfireshot.com&sz=128', 'cat-digi-chrome', 0, 1, 'Freemium', 819, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('V39C1D8NFO0CnhvGGgX7m', 'SMSreceivefree', 'Receive SMS free online', 'https://smsreceivefree.com/', 'https://www.google.com/s2/favicons?domain=smsreceivefree.com&sz=128', 'cat-digi-other', 0, 1, 'Free', 139, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('uk3izMruaKBZYdS3vpdB3', 'SMS activate', 'Receive paid SMS', 'https://sms-activate.org/en', 'https://www.google.com/s2/favicons?domain=sms-activate.org&sz=128', 'cat-digi-other', 0, 1, 'Paid', 727, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('c6_A4CSqe7TM6YqDmpESU', 'NamesoGen', 'Generate credit card number', 'https://namso-gen.com/', 'https://www.google.com/s2/favicons?domain=namso-gen.com&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 465, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('1vf5CaOGSnIlMKVIx1LV2', 'Mr-checker', 'Credit card checker', 'https://www.mrchecker.net/card-checker/', 'https://www.google.com/s2/favicons?domain=www.mrchecker.net&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 837, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('WX-0L6X14Fe_mV_wCd7Sr', 'Canva', 'Easy graphic design tool', 'https://www.canva.com/', 'https://www.google.com/s2/favicons?domain=www.canva.com&sz=128', 'cat-digi-design', 1, 1, 'Freemium', 810, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('uhFJah0MUohBxoGvjZe3p', 'StockSnap.io', 'Free stock photos & images', 'https://stocksnap.io/', 'https://www.google.com/s2/favicons?domain=stocksnap.io&sz=128', 'cat-digi-design', 0, 1, 'Free', 527, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('z17HsCbTQtcBfPc4vOouW', 'Infogram', 'Good free infographic design too.', 'https://infogram.com/', 'https://www.google.com/s2/favicons?domain=infogram.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 991, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('hFH1RYMZo4c_YwViAN9mN', 'Pictochart', 'Free infographic maker', 'https://piktochart.com/', 'https://www.google.com/s2/favicons?domain=piktochart.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 472, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('HPYvwBz_tUPQ0kbu_KfL5', 'Freeimages', 'Free stock photos', 'https://www.freeimages.com/', 'https://www.google.com/s2/favicons?domain=www.freeimages.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 114, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7omTG60s4nwSA8cXMDilj', 'FreeLogoDesign', 'Free logo maker', 'https://www.freelogodesign.org/', 'https://www.google.com/s2/favicons?domain=www.freelogodesign.org&sz=128', 'cat-digi-design', 0, 1, 'Free', 449, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('DnKXzGFzxHzHy8yvaV2L5', 'SVGRepo', 'Free SVG & icons', 'https://www.svgrepo.com/', 'https://www.google.com/s2/favicons?domain=www.svgrepo.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 249, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ikAF52xvUixM3s4mh7eCL', 'TinEye', 'Reverse image search', 'https://tineye.com/', 'https://www.google.com/s2/favicons?domain=tineye.com&sz=128', 'cat-digi-design', 1, 1, 'Freemium', 40, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7GvBTvZwa_LI8_IWOwxdd', 'Unsplash', 'Good free HD images', 'https://unsplash.com/', 'https://www.google.com/s2/favicons?domain=unsplash.com&sz=128', 'cat-digi-design', 1, 1, 'Free', 950, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('h-fLnVuuVdDQEVJzrSLUW', 'Picjumbo', 'Free stock photos', 'https://picjumbo.com/', 'https://www.google.com/s2/favicons?domain=picjumbo.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 556, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('pQm97KHNHqd_8F-MWYXj4', 'Icons8', 'Free icons', 'https://icons8.com/', 'https://www.google.com/s2/favicons?domain=icons8.com&sz=128', 'cat-digi-design', 1, 1, 'Free', 33, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('bqOLrsoa828eZowZhdg4c', 'Pexels', 'Free stock photos', 'https://www.pexels.com/', 'https://www.google.com/s2/favicons?domain=www.pexels.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 976, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7er2l3ie6dq6H7fNER1D4', 'Pixabay', 'Free stock images', 'https://pixabay.com/', 'https://www.google.com/s2/favicons?domain=pixabay.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 597, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('VN_u6-4IM8R6KBdRyNT8D', 'Removebg', 'Remove background from image free', 'https://www.remove.bg/', 'https://www.google.com/s2/favicons?domain=www.remove.bg&sz=128', 'cat-digi-design', 1, 1, 'Free', 321, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('QE5hwLtMgCCayGe8tPSF4', 'TinyPNG', 'Compress image size', 'https://tinypng.com/', 'https://www.google.com/s2/favicons?domain=tinypng.com&sz=128', 'cat-digi-design', 1, 1, 'Freemium', 692, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ln6SnIk3k5wONPd3rLA19', 'Squoosh', 'Free image optimizer', 'https://squoosh.app/', 'https://www.google.com/s2/favicons?domain=squoosh.app&sz=128', 'cat-digi-design', 1, 1, 'Free', 68, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('V41Sid2RQNK7YioamBWXl', 'Iconfont', 'Free icons', 'https://www.iconfont.cn/', 'https://www.google.com/s2/favicons?domain=www.iconfont.cn&sz=128', 'cat-digi-design', 1, 1, 'Free', 473, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('FMZYpfAcOKBsCLP0t7OzR', 'Website Informer', 'Website Whois lookup', 'https://website.informer.com/', 'https://www.google.com/s2/favicons?domain=website.informer.com&sz=128', 'cat-digi-seo', 1, 1, 'Freemium', 460, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('tra-BKbpqDei1Hge4JHvs', 'Uncanny Automator', 'No code automation for wordpress', 'https://automatorplugin.com/', 'https://www.google.com/s2/favicons?domain=automatorplugin.com&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 420, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('pwTr5RB81I7L2rFAJx3fy', 'Fiverr', 'Offer economic freelance service', 'https://pro.fiverr.com/', 'https://www.google.com/s2/favicons?domain=pro.fiverr.com&sz=128', 'cat-digi-freelance', 1, 1, 'Free', 212, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('B1an3GscSCFJ3xJa3ngoQ', 'Upwork', 'Offer premier freelance service', 'https://www.upwork.com/', 'https://www.google.com/s2/favicons?domain=www.upwork.com&sz=128', 'cat-digi-freelance', 0, 1, 'Free', 721, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('3fY83HhKUVyvALxGrRBiB', 'Adheart.me', 'Facebook ads spy tool', 'https://adheart.me/en', 'https://www.google.com/s2/favicons?domain=adheart.me&sz=128', 'cat-digi-social', 1, 1, 'Freemium', 576, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('ztblY3XzZw2TPoJCMfesS', 'Sharesale', 'Affiliate marketing network for products & services', 'https://www.shareasale.com/info/', 'https://www.google.com/s2/favicons?domain=www.shareasale.com&sz=128', 'cat-digi-affiliate', 0, 1, 'Freemium', 268, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('FFsTeNmCD1ru7Tw_MwQTT', 'CJ', 'Affiliate marketing network for diverse products', 'https://www.cj.com/', 'https://www.google.com/s2/favicons?domain=www.cj.com&sz=128', 'cat-digi-affiliate', 0, 1, 'Freemium', 45, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('9vRkDx-15a-E5H8qz-SDX', 'Rakuten Advertising', '', 'https://rakutenadvertising.com/', 'https://www.google.com/s2/favicons?domain=rakutenadvertising.com&sz=128', 'cat-digi-affiliate', 0, 1, 'Freemium', 24, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('BuRxe9qcKKlyUuiLm_c1U', 'Admitad', '', 'https://www.admitad.com/', 'https://www.google.com/s2/favicons?domain=www.admitad.com&sz=128', 'cat-digi-affiliate', 0, 1, 'Freemium', 717, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('WuQgvex0JIx4QhDi8qGEf', 'Seowl', 'Free Google Title Rewrite Checker', 'https://www.seowl.co/title-rewrite-checker/', 'https://www.google.com/s2/favicons?domain=www.seowl.co&sz=128', 'cat-digi-seo', 0, 1, 'Free', 941, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('E_TnIYYMgUiYX3uO71B6N', 'Otter.ai', 'Free transcribe voice to text tool', 'https://get.otter.ai/', 'https://www.google.com/s2/favicons?domain=get.otter.ai&sz=128', 'cat-digi-other', 0, 1, 'Free', 222, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('W-plqiTBKUZjP2gMHE0dn', 'Generated Photos', 'Generate faces tool', 'https://generated.photos/faces', 'https://www.google.com/s2/favicons?domain=generated.photos&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 239, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('KcGuXE232xrqp4QR2yAkq', 'Responsively', 'Website responsive testing tool', 'https://responsively.app/', 'https://www.google.com/s2/favicons?domain=responsively.app&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 447, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('dU2ExSiiA_huwjVcnk-bk', 'WSform', 'Powerful wp form plugin', 'https://wsform.com/', 'https://www.google.com/s2/favicons?domain=wsform.com&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 622, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('bXBXT7wvTEWsyDeKbjFhc', 'Meta Box', 'WP Custom meta boxes & custom fields plugin', 'https://metabox.io/', 'https://www.google.com/s2/favicons?domain=metabox.io&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 71, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('LR69hWHzKdvB6T_RHomyB', 'WPCodeBox', 'Powerful wp code snippets plugin', 'https://wpcodebox.com/', 'https://www.google.com/s2/favicons?domain=wpcodebox.com&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 35, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Zm1UM9PvwNi_nkoJKSatu', 'HappyFiles', 'Organize wp media library,post types & plugins', 'https://happyfiles.io/', 'https://www.google.com/s2/favicons?domain=happyfiles.io&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 14, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Nd2uiahyKfA0TIm7J7AR1', 'Frames', 'Modular bricks builder templates & components', 'https://getframes.io/', 'https://www.google.com/s2/favicons?domain=getframes.io&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 923, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('hSB_SA7K2xy8UtOHUCA07', 'Automatic.css', 'CSS framework for bricks&oxygen builder', 'https://automaticcss.com/', 'https://www.google.com/s2/favicons?domain=automaticcss.com&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 70, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('GRFz2Ohx-tYzuo7uPYwXH', 'POST SMTP Mailer', 'Good mail SMTP plugin for wordpress', 'https://wordpress.org/plugins/post-smtp/', 'https://www.google.com/s2/favicons?domain=wordpress.org&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 214, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('roC2W_TW1nJ3ooxx7dRvI', 'WPML', 'Good wp multilingual plugin', 'https://wpml.org/', 'https://www.google.com/s2/favicons?domain=wpml.org&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 732, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('07hZeI5FvPmGlJYXLJLU6', 'Rankmath', 'Good wp seo plugin', 'https://rankmath.com/offer/', 'https://www.google.com/s2/favicons?domain=rankmath.com&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 259, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('EpUzWg0w83o5IY3d1Ez8v', 'Fluid-responsive property calculator', 'Generate fluid-reponsive values for embedding directly into stylesheet', 'https://websemantics.uk/tools/fluid-responsive-property-calculator/', 'https://www.google.com/s2/favicons?domain=websemantics.uk&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 845, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('FlxyAvTNZ_qp6HLUokWbk', 'Figma', 'Design and prototyping tool for digital projects', 'https://www.figma.com/', 'https://www.google.com/s2/favicons?domain=www.figma.com&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 679, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Z4zEdhgQ3ODYvmHIQcMj7', 'Wappalyzer', 'Website technology lookups', 'https://www.wappalyzer.com/', 'https://www.google.com/s2/favicons?domain=www.wappalyzer.com&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 998, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('RZZ42zpAb11eYnOgcrlxj', 'https://ionic.io/ionicons', 'Premium designed SVG icons for use in web, iOS, Android, and desktop apps. Completely open source', 'https://ionic.io/ionicons', 'https://www.google.com/s2/favicons?domain=ionic.io&sz=128', 'cat-digi-design', 1, 1, 'Paid', 421, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Gv2lSKFtyCfGfVwmcriux', 'Fontawesome', 'Free & paid icons library', 'https://fontawesome.com/', 'https://www.google.com/s2/favicons?domain=fontawesome.com&sz=128', 'cat-digi-design', 0, 1, 'Freemium', 131, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('soS3X7jkyb7IYh3VFzfL3', 'Shopify', 'SaaS ecommerce platform to build online stores', 'https://www.shopify.com/', 'https://www.google.com/s2/favicons?domain=www.shopify.com&sz=128', 'cat-digi-ecommerce', 1, 1, 'Freemium', 648, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7Kebi_GD1fvjrF4lAFl00', 'Incogniton', 'Anti-detect browser for multi-account management', 'https://incogniton.com/', 'https://www.google.com/s2/favicons?domain=incogniton.com&sz=128', 'cat-digi-ecommerce', 1, 1, 'Freemium', 886, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('jm7gbwg35to5xZt0HSjj5', 'AdsPower', 'Anti-detect browser', 'https://www.adspower.net/', 'https://www.google.com/s2/favicons?domain=www.adspower.net&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 313, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('kfcmtgbOJ-cIKrJ6z50Zq', 'WP Applaud', 'Add applause on wp blog post', 'https://wordpress.org/plugins/wp-applaud/', 'https://www.google.com/s2/favicons?domain=wordpress.org&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 757, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('M8ViMB_su0l730jp_UwQv', 'Post Views Counter', 'Display total views on wp posts', 'https://wordpress.org/plugins/post-views-counter/', 'https://www.google.com/s2/favicons?domain=wordpress.org&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 939, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('S-2hPECnstbT-1c89P10W', 'WP Word Count', 'Display counting words & reading time on wp post', 'https://wordpress.org/plugins/wp-word-count/', 'https://www.google.com/s2/favicons?domain=wordpress.org&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 249, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('X267TVVK6-jcVKGC83X8d', 'My Private Proxy', 'Private proxies', 'https://www.myprivateproxy.net/private-proxies/', 'https://www.google.com/s2/favicons?domain=www.myprivateproxy.net&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 193, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('NzB34Hnr3eg__cqbYaFjV', 'HighProxies', 'US private proxies', 'https://highproxies.com/', 'https://www.google.com/s2/favicons?domain=highproxies.com&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 35, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('IIHHzHgum4GzmIKdMuap4', 'ProxySeller', 'Private S5 & https proxies', 'https://proxy-seller.com/', 'https://www.google.com/s2/favicons?domain=proxy-seller.com&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 569, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('QtiVf5LqHbOEI2VId61lb', 'Uxwing', 'Free icons for commercial use', 'https://uxwing.com/', 'https://www.google.com/s2/favicons?domain=uxwing.com&sz=128', 'cat-digi-design', 0, 1, 'Free', 24, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('qnmD7b4ryDNMwupCj3ISL', 'Font Space', 'Free fonts', 'https://www.fontspace.com/category/futuristic', 'https://www.google.com/s2/favicons?domain=www.fontspace.com&sz=128', 'cat-digi-webdev', 1, 1, 'Free', 633, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('XspHNn3wfyvJ2cLnqj0LD', 'Rapid API', 'API hub', 'https://rapidapi.com/', 'https://www.google.com/s2/favicons?domain=rapidapi.com&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 926, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('0fePhc09E4bpUTdm86suT', 'Favicon.io', 'Favicon converter from image', 'https://favicon.io/favicon-converter/', 'https://www.google.com/s2/favicons?domain=favicon.io&sz=128', 'cat-digi-webdev', 0, 1, 'Freemium', 900, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7EpXVSkch6KuLS-8KEfTU', 'Bitbrowser', 'Anti-association multi-account fingerprint browser', 'https://www.bitbrowser.net', 'https://www.google.com/s2/favicons?domain=www.bitbrowser.net&sz=128', 'cat-digi-ecommerce', 0, 1, 'Freemium', 471, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('gMTHFC5v943tlHBJJM0nT', 'Hubstudio', 'Fingerprint browser', 'https://www.hubstudio.cn/', 'https://www.google.com/s2/favicons?domain=www.hubstudio.cn&sz=128', 'cat-digi-ecommerce', 0, 1, 'Freemium', 956, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('sIACg3ZIPYjdSfbteY06f', 'Meta Seo Inspector', 'Easily inspect the meta data found inside web pages, find issues and get advices to fix them.', 'https://chrome.google.com/webstore/detail/meta-seo-inspector/ibkclpciafdglkjkcibmohobjkcfkaef', 'https://www.google.com/s2/favicons?domain=chrome.google.com&sz=128', 'cat-digi-seo', 1, 1, 'Freemium', 712, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('BbdN96Ulvb2cD52Ym6G2e', 'Scre.io', 'Screen & camera recorder', 'https://scre.io/', 'https://www.google.com/s2/favicons?domain=scre.io&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 702, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('Ii6e3GkudALdZ7viIW0l0', 'Loom', 'Free screen recorder', 'https://www.loom.com/', 'https://www.google.com/s2/favicons?domain=www.loom.com&sz=128', 'cat-digi-other', 1, 1, 'Free', 997, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('LrNVw2m042Z6tvZPwKSoD', 'CSS Scan', '57 CSS shapes examples', 'https://getcssscan.com/css-shapes', 'https://www.google.com/s2/favicons?domain=getcssscan.com&sz=128', 'cat-digi-webdev', 1, 1, 'Freemium', 553, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('7gxvFjKe34K4vIErY9FOB', 'Font Space', 'Free fonts downloaded', 'https://www.fontspace.com/category/futuristic', 'https://www.google.com/s2/favicons?domain=www.fontspace.com&sz=128', 'cat-digi-webdev', 0, 1, 'Free', 161, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('crYn0rvR26Py-rtR5nhjU', 'FluentSnippets', 'Wordpress code snippets manager', 'https://fluentsnippets.com/', 'https://www.google.com/s2/favicons?domain=fluentsnippets.com&sz=128', 'cat-digi-wordpress', 0, 1, 'Freemium', 48, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
INSERT INTO tools (id, name, description, url, logo_url, category_id, is_featured, is_published, pricing, view_count, created_at, updated_at)
VALUES ('4AKCUwbTQvz_T_BbeK0_p', 'Firstbase', 'Offering all services in US: registering company, applying bank account etc.', 'https://www.firstbase.io/', 'https://www.google.com/s2/favicons?domain=www.firstbase.io&sz=128', 'cat-digi-other', 0, 1, 'Freemium', 548, '2025-12-19T10:09:49.638Z', '2025-12-19T10:09:49.638Z');
