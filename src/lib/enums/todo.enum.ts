export const TodoStatus = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    ARCHIVED: "archived",
} as const;

export const TodoPriority = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "urgent",
} as const;

export const TodoStatusLabels = {
    [TodoStatus.PENDING]: "Pending",
    [TodoStatus.IN_PROGRESS]: "In Progress",
    [TodoStatus.COMPLETED]: "Completed",
    [TodoStatus.ARCHIVED]: "Archived",
};

export type TodoStatusType = (typeof TodoStatus)[keyof typeof TodoStatus];
export type TodoPriorityType = (typeof TodoPriority)[keyof typeof TodoPriority];
