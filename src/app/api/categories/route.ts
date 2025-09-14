import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import {
    createCategory,
    getAllCategories,
} from "@/modules/todos/server/categories.server";

export async function GET() {
    try {
        const user = await requireAuth();
        const categories = await getAllCategories(user.id);
        return NextResponse.json({
            success: true,
            data: categories,
            message: "Categories fetched successfully",
        });
    } catch (error: any) {
        console.error("Error fetching categories:", error);

        if (error.message === "Authentication required") {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch categories" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();
        const body = await request.json();
        const category = await createCategory(body, user.id);
        return NextResponse.json({
            success: true,
            data: category,
            message: "Category created successfully",
        });
    } catch (error: any) {
        console.error("Error creating category:", error);

        if (error.message === "Authentication required") {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 },
            );
        }

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
