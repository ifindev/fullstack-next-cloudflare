"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTodoFieldAction } from "../actions/update-todo.action";

interface ToggleCompleteProps {
    todoId: number;
    completed: boolean;
}

export function ToggleComplete({ todoId, completed }: ToggleCompleteProps) {
    const [isCompleted, setIsCompleted] = useState(completed);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (checked: boolean) => {
        setIsCompleted(checked);

        startTransition(async () => {
            try {
                const result = await updateTodoFieldAction(todoId, {
                    completed: checked,
                });

                if (!result.success) {
                    throw new Error(result.error || "Failed to update todo");
                }

                // No need to refresh - server action handles revalidation
            } catch (error) {
                console.error("Error updating todo:", error);
                // Revert the optimistic update
                setIsCompleted(!checked);
                alert(
                    `Error updating todo: ${error instanceof Error ? error.message : "Unknown error"}`,
                );
            }
        });
    };

    return (
        <Checkbox
            checked={isCompleted}
            onCheckedChange={handleToggle}
            disabled={isPending}
            className="h-5 w-5"
        />
    );
}
