import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/modules/auth/utils/auth-utils";
import { getAllCategories } from "@/modules/todos/server/categories.server";
import { getTodoById } from "@/modules/todos/server/todos.server";
import { TodoForm } from "../../_components/todo-form";

export const dynamic = "force-dynamic";

interface EditTodoPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTodoPage({ params }: EditTodoPageProps) {
    const user = await requireAuth();
    const { id } = await params;
    const todoId = parseInt(id, 10);

    if (Number.isNaN(todoId)) {
        notFound();
    }

    const [todo, categories] = await Promise.all([
        getTodoById(todoId, user.id),
        getAllCategories(user.id),
    ]);

    if (!todo) {
        notFound();
    }

    return (
        <>
            <div className="mb-8">
                <Link href="/dashboard/todos">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Todos
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Todo</h1>
                <p className="text-gray-600 mt-1">Update your task details</p>
            </div>

            <TodoForm user={user} categories={categories} initialData={todo} />
        </>
    );
}
