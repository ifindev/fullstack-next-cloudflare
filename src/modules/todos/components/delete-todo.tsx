"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteTodoAction } from "../actions/delete-todo.action";

interface DeleteTodoProps {
    todoId: number;
}

export function DeleteTodo({ todoId }: DeleteTodoProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result = await deleteTodoAction(todoId);

                if (!result.success) {
                    throw new Error(result.error || "Failed to delete todo");
                }

                // Close dialog - no need to refresh since server action handles revalidation
                setIsOpen(false);
            } catch (error) {
                console.error("Error deleting todo:", error);
                alert(
                    `Error deleting todo: ${error instanceof Error ? error.message : "Unknown error"}`,
                );
            }
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this todo.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
