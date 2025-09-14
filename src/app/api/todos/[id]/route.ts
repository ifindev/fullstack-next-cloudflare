import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { deleteTodo, getTodoById, updateTodo } from "@/server/todos.server";

type Params = {
    params: Promise<{ id: string }>;
};

// GET /api/todos/[id] - Get specific todo
export async function GET(_: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const { id } = await params;
        const todoId = parseInt(id, 10);

        if (Number.isNaN(todoId)) {
            return NextResponse.json(
                { success: false, error: "Invalid todo ID" },
                { status: 400 },
            );
        }

        const todo = await getTodoById(todoId, user.id);

        if (!todo) {
            return NextResponse.json(
                { success: false, error: "Todo not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: todo,
            message: "Todo fetched successfully",
        });
    } catch (error: any) {
        console.error("Error fetching todo:", error);

        if (error.message === "Authentication required") {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch todo" },
            { status: 500 },
        );
    }
}

// PUT /api/todos/[id] - Update specific todo
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const todoId = parseInt(id, 10);

        if (Number.isNaN(todoId)) {
            return NextResponse.json(
                { success: false, error: "Invalid todo ID" },
                { status: 400 },
            );
        }

        const contentType = request.headers.get("content-type");
        let todoData: any;
        let imageFile: File | undefined;

        if (contentType?.includes("multipart/form-data")) {
            // Handle FormData (with file upload)
            const formData = await request.formData();

            // Extract file if present
            const file = formData.get("image") as File | null;
            if (file && file.size > 0) {
                imageFile = file;
            }

            // Extract other form fields and build todo data
            todoData = {};
            for (const [key, value] of formData.entries()) {
                if (key !== "image") {
                    // Handle boolean fields
                    if (key === "completed") {
                        todoData[key] = value === "true";
                    }
                    // Handle numeric fields
                    else if (key === "categoryId") {
                        const numValue = parseInt(value as string, 10);
                        if (!Number.isNaN(numValue)) {
                            todoData[key] = numValue;
                        }
                    }
                    // Handle string fields
                    else if (value && value !== "") {
                        todoData[key] = value;
                    }
                }
            }
        } else {
            // Handle JSON (without file upload)
            todoData = await request.json();
        }

        const user = await requireAuth();
        const todo = await updateTodo(todoId, todoData, user.id, imageFile);

        if (!todo) {
            return NextResponse.json(
                { success: false, error: "Todo not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: todo,
            message: "Todo updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating todo:", error);

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
            { success: false, error: "Failed to update todo" },
            { status: 500 },
        );
    }
}

// DELETE /api/todos/[id] - Delete specific todo
export async function DELETE(_: NextRequest, { params }: Params) {
    try {
        const user = await requireAuth();
        const { id } = await params;
        const todoId = parseInt(id, 10);

        if (Number.isNaN(todoId)) {
            return NextResponse.json(
                { success: false, error: "Invalid todo ID" },
                { status: 400 },
            );
        }

        const deleted = await deleteTodo(todoId, user.id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: "Todo not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Todo deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting todo:", error);

        if (error.message === "Authentication required") {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to delete todo" },
            { status: 500 },
        );
    }
}
