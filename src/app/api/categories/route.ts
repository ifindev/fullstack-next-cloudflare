import { type NextRequest, NextResponse } from "next/server";
import { createCategory, getAllCategories } from "@/server/categories.server";

export async function GET() {
    try {
        const categories = await getAllCategories();
        return NextResponse.json({
            success: true,
            data: categories,
            message: "Categories fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch categories" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const category = await createCategory(body);
        return NextResponse.json({
            success: true,
            data: category,
            message: "Category created successfully",
        });
    } catch (error: any) {
        console.error("Error creating category:", error);

        if (error.name === "ZodError") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation error",
                    details: error.errors,
                },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to create category" },
            { status: 500 },
        );
    }
}
