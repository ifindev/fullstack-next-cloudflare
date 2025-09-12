"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
                const response = await fetch(`/api/todos/${todoId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        completed: checked,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to update todo");
                }

                // Refresh the page to show updated data
                window.location.reload();
            } catch (error) {
                console.error("Error updating todo:", error);
                // Revert the optimistic update
                setIsCompleted(!checked);
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
