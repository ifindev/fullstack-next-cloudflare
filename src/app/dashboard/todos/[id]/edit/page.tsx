import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/server/categories.server";
import { getTodoById } from "@/server/todos.server";
import { TodoForm } from "../../_components/todo-form";

export const dynamic = "force-dynamic";

interface EditTodoPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTodoPage({ params }: EditTodoPageProps) {
    const { id } = await params;
    const todoId = parseInt(id, 10);

    if (Number.isNaN(todoId)) {
        notFound();
    }

    const [todo, categories] = await Promise.all([
        getTodoById(todoId),
        getAllCategories(),
    ]);

    if (!todo) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <div className="mb-8">
                <Link href="/todos">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Todos
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Todo</h1>
                <p className="text-gray-600 mt-1">Update your task details</p>
            </div>

            <TodoForm categories={categories} initialData={todo} />
        </div>
    );
}
