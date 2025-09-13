import { Calendar, Edit, Image as ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TodoPriority, TodoStatus } from "@/lib/enums/todo.enum";
import { DeleteTodo } from "./delete-todo";
import { ToggleComplete } from "./toggle-complete";

interface TodoCardProps {
    todo: {
        id: number;
        title: string;
        description: string | null;
        completed: boolean;
        categoryId: number | null;
        categoryName?: string | null;
        dueDate: string | null;
        imageUrl: string | null;
        imageAlt: string | null;
        status: string;
        priority: string;
        createdAt: string;
        updatedAt: string;
    };
}

const priorityColors = {
    [TodoPriority.LOW]: "bg-green-100 text-green-800 border-green-200",
    [TodoPriority.MEDIUM]: "bg-yellow-100 text-yellow-800 border-yellow-200",
    [TodoPriority.HIGH]: "bg-orange-100 text-orange-800 border-orange-200",
    [TodoPriority.URGENT]: "bg-red-100 text-red-800 border-red-200",
};

const statusColors = {
    [TodoStatus.PENDING]: "bg-gray-100 text-gray-800 border-gray-200",
    [TodoStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200",
    [TodoStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
    [TodoStatus.ARCHIVED]: "bg-purple-100 text-purple-800 border-purple-200",
};

export function TodoCard({ todo }: TodoCardProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isOverdue =
        todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    return (
        <Card
            className={`transition-all hover:shadow-md ${todo.completed ? "opacity-75" : ""}`}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        <div className="pt-1">
                            <ToggleComplete
                                todoId={todo.id}
                                completed={todo.completed}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3
                                className={`font-semibold text-lg leading-tight ${todo.completed ? "line-through text-gray-500" : ""}`}
                            >
                                {todo.title}
                            </h3>
                            {todo.description && (
                                <p
                                    className={`text-sm mt-1 ${todo.completed ? "text-gray-400" : "text-gray-600"}`}
                                >
                                    {todo.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/todos/${todo.id}/edit`}>
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <DeleteTodo todoId={todo.id} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge
                        variant="outline"
                        className={
                            priorityColors[
                                todo.priority as keyof typeof priorityColors
                            ]
                        }
                    >
                        {todo.priority.charAt(0).toUpperCase() +
                            todo.priority.slice(1)}
                    </Badge>
                    <Badge
                        variant="outline"
                        className={
                            statusColors[
                                todo.status as keyof typeof statusColors
                            ]
                        }
                    >
                        {todo.status
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                    {todo.categoryName && (
                        <Badge variant="secondary">{todo.categoryName}</Badge>
                    )}
                    {todo.imageUrl && (
                        <Badge variant="outline" className="text-blue-600">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                        </Badge>
                    )}
                </div>

                {todo.dueDate && (
                    <div
                        className={`flex items-center text-sm ${isOverdue ? "text-red-600" : "text-gray-500"}`}
                    >
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {formatDate(todo.dueDate)}
                        {isOverdue && (
                            <span className="ml-2 text-red-600 font-semibold">
                                (Overdue)
                            </span>
                        )}
                    </div>
                )}

                {todo.imageUrl && (
                    <div className="mt-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={todo.imageUrl}
                            alt={todo.imageAlt || "Todo image"}
                            className="max-w-full h-auto rounded-md max-h-48 object-cover"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
