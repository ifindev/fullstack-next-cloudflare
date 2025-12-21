import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// R2 Public Development URL for serving images
const R2_PUBLIC_URL = "https://pub-031ab1389d194ced9673ef1acc65cf12.r2.dev";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
    try {
        // Get Cloudflare context to access R2 binding
        const { env } = await getCloudflareContext();
        
        // Check if R2 bucket is available
        if (!env.ASSETS_BUCKET) {
            console.error("R2 bucket binding not found");
            return NextResponse.json(
                { error: "Storage not configured" },
                { status: 500 }
            );
        }

        // Parse form data
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split(".").pop() || "jpg";
        const filename = `blog/${timestamp}-${randomString}.${extension}`;

        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Upload to R2
        await env.ASSETS_BUCKET.put(filename, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
        });

        // Return the public URL
        const publicUrl = `${R2_PUBLIC_URL}/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

// Handle GET request to check if upload endpoint is available
export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Upload endpoint is ready",
        maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
        allowedTypes: ALLOWED_TYPES,
    });
}
