
import { NextRequest, NextResponse } from "next/server";
import {
    apiSuccess,
    apiError,
    validateRequest,
    handleApiError,
} from "@/lib/api-utils";
import { createSubmissionSchema } from "@/lib/validations/submission.schema";
import { getSession } from "@/lib/auth-helpers";
import { sendVerificationEmail } from "@/lib/email";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { toolSubmissions, verificationTokens } from "@/db/schema";
import { z } from "zod";

/**
 * Tool Submission API
 * POST /api/submissions
 * Handles guest and user tool submissions
 */

const submissionSchema = z.object({
    toolName: z.string().min(2).max(100),
    toolUrl: z.string().url(),
    logoUrl: z.string().url().optional(),
    description: z.string().min(20).max(200),
    categoryId: z.string(),
    pricing: z.enum(["Free", "Freemium", "Paid"]),
    submitterEmail: z.string().email(),
    verificationCode: z.string().min(6),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = submissionSchema.parse(body) as any;

        // Get D1 database
        const { env } = await getCloudflareContext();
        const db = drizzle(env.next_cf_app);

        // Verify the verification code (simplified for demo)
        // In production, check against verification_tokens table

        // Create submission
        const submissionId = nanoid();
        await db.insert(toolSubmissions).values({
            id: submissionId,
            name: validatedData.toolName,
            url: validatedData.toolUrl,
            logoUrl: validatedData.logoUrl || null,
            description: validatedData.description,
            categoryId: validatedData.categoryId,
            email: validatedData.submitterEmail,
            submittedBy: null, // Guest submission
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(
            {
                success: true,
                submissionId,
                message:
                    "Tool submitted successfully. We will review it within 48 hours.",
            },
            { status: 201 },
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: (error as any).errors },
                { status: 400 },
            );
        }

        console.error("Submission API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

/**
 * Send Verification Code
 * POST /api/submissions/verify
 * Sends verification code to email
 */
export async function PUT(request: NextRequest) {
    try {
        const { email } = (await request.json()) as any;

        if (!email || !z.string().email().safeParse(email).success) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 },
            );
        }

        // Get D1 database
        const { env } = await getCloudflareContext();
        const db = drizzle(env.next_cf_app);

        // Generate verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenId = nanoid();

        // Store verification token
        await db.insert(verificationTokens).values({
            id: tokenId,
            token: code,
            submissionId: "", // This should be set when submission is created
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            createdAt: new Date(),
        });

        // In production, send email with code using email service
        console.log(`Verification code for ${email}: ${code}`);
        await sendVerificationEmail(email, code);


        return NextResponse.json({
            success: true,
            message: "Verification code sent to your email",
        });
    } catch (error) {
        console.error("Verification API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
