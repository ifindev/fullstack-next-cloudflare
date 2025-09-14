import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { createTodo, getAllTodos } from "@/modules/todos/server/todos.server";

export async function GET() {
    try {
        const user = await requireAuth();
        const allTodos = await getAllTodos(user.id);
        return NextResponse.json({
            success: true,
            data: allTodos,
            message: "Todos fetched successfully",
        });
    } catch (error: any) {
        console.error("Error fetching todos:", error);

        if (error.message === "Authentication required") {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch todos" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();
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

        const todo = await createTodo(todoData, user.id, imageFile);

        return NextResponse.json(
            {
                success: true,
                data: todo,
                message: "Todo created successfully",
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error("Error creating todo:", error);

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
            { success: false, error: "Failed to create todo" },
            { status: 500 },
        );
    }
}
