import { z } from "zod/v4";

export const summarizerConfigSchema = z.object({
    maxLength: z.number().int().min(50).max(1000).optional().default(200),
    style: z
        .enum(["concise", "detailed", "bullet-points"])
        .optional()
        .default("concise"),
    language: z.string().min(1).max(50).optional().default("English"),
});

export const summarizeRequestSchema = z.object({
    text: z
        .string()
        .trim()
        .min(50, "Text too short to summarize (minimum 50 characters)")
        .max(50000, "Text too long (maximum 50,000 characters)"),
    config: summarizerConfigSchema.optional(),
});

type SummaryStyles = z.infer<typeof summarizerConfigSchema>["style"];
export type SummarizeRequest = z.infer<typeof summarizeRequestSchema>;
export type SummarizerConfig = z.infer<typeof summarizerConfigSchema>;
export type SummaryResult = {
    summary: string;
    originalLength: number;
    summaryLength: number;
    tokensUsed: {
        input: number;
        output: number;
    };
};

export class SummarizerService {
    constructor(private readonly ai: Ai) {}

    async summarize(
        text: string,
        config?: SummarizerConfig,
    ): Promise<SummaryResult> {
        const {
            maxLength = 200,
            style = "concise",
            language = "English",
        } = config || {};

        const systemPrompt = this.buildSystemPrompt(maxLength, style, language);

        // Estimate tokens (rough calculation: 1 token ≈ 4 characters)
        const inputTokens = Math.ceil((systemPrompt.length + text.length) / 4);

        const response = await this.ai.run("@cf/meta/llama-3.2-1b-instruct", {
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `Please summarize the following text: ${text}`,
                },
            ],
        });

        const summary = response.response?.trim() ?? "";
        const outputTokens = Math.ceil(summary.length / 4);

        return {
            summary,
            originalLength: text.length,
            summaryLength: summary.length,
            tokensUsed: {
                input: inputTokens,
                output: outputTokens,
            },
        };
    }

    private buildSystemPrompt(
        maxLength: number,
        style: string,
        language: string,
    ): string {
        const styleInstructions: Record<SummaryStyles, string> = {
            concise:
                "Create a brief, concise summary focusing on the main points.",
            detailed:
                "Create a comprehensive summary that covers key details and context.",
            "bullet-points":
                "Create a summary using bullet points to highlight key information.",
        };

        return `You are a professional text summarizer. ${styleInstructions[style as keyof typeof styleInstructions]}
        
                Instructions:
                    - Summarize in ${language}
                    - Keep the summary under ${maxLength} words
                    - Focus on the most important information
                    - Maintain the original meaning and context
                    - Use clear, readable language
                    - Do not add your own opinions or interpretations
                    - DO NOT START THE SUMMARY WITH the following phrases:
                        - "Here is a summary of the text"
                        - "Here is a summary of the text:"
                        - "Here is a summary of the text in bullet points"
                        - "Here is the summary:"
                        - "Here is the summary in bullet points:"
                        - "Here is the summary in ${language}:"
                        - "Here is the summary in ${language} in bullet points:"

                Output only the summary, nothing else.`;
    }
}
