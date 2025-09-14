import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import {
    deleteCategory,
    getCategoryById,
    updateCategory,
} from "@/server/categories.server";

type Params = {
    params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const { id } = await params;
        const categoryId = parseInt(id, 10);

        if (Number.isNaN(categoryId)) {
            return NextResponse.json(
                { success: false, error: "Invalid category ID" },
                { status: 400 },
            );
        }

        const category = await getCategoryById(categoryId, user.id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: "Category not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
            message: "Category fetched successfully",
        });
    } catch (error: any) {
        console.error("Error fetching category:", error);

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
            { success: false, error: "Failed to fetch category" },
            { status: 500 },
        );
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const { id } = await params;
        const categoryId = parseInt(id, 10);

        if (Number.isNaN(categoryId)) {
            return NextResponse.json(
                { success: false, error: "Invalid category ID" },
                { status: 400 },
            );
        }

        const body = await request.json();
        const category = await updateCategory(categoryId, body, user.id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: "Category not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
            message: "Category updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating category:", error);

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
            { success: false, error: "Failed to update category" },
            { status: 500 },
        );
    }
}

export async function DELETE(_: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const { id } = await params;
        const categoryId = parseInt(id, 10);

        if (Number.isNaN(categoryId)) {
            return NextResponse.json(
                { success: false, error: "Invalid category ID" },
                { status: 400 },
            );
        }

        const deleted = await deleteCategory(categoryId, user.id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: "Category not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting category:", error);

        if (error.message === "Authentication required") {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to delete category" },
            { status: 500 },
        );
    }
}
