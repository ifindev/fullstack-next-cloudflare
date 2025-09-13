import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllTodos } from "@/server/todos.server";
import { TodoCard } from "./_components/todo-card";

export const dynamic = "force-dynamic";

export default async function TodosPage() {
    const todos = await getAllTodos();

    return (
        <div className="max-w-md mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Todos</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your tasks and stay organized
                    </p>
                </div>
                <Link href="/todos/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Todo
                    </Button>
                </Link>
            </div>

            {todos.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No todos yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Create your first todo to get started
                    </p>
                    <Link href="/todos/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Todo
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {todos.map((todo) => (
                        <TodoCard key={todo.id} todo={todo} />
                    ))}
                </div>
            )}
        </div>
    );
}
