"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertCategorySchema } from "@/lib/db/schemas/category.schema";

// Create a client-side schema without userId (will be added server-side)
const addCategorySchema = insertCategorySchema.omit({ userId: true });
type AddCategoryFormData = z.infer<typeof addCategorySchema>;

interface AddCategoryProps {
    onCategoryAdded: (category: {
        id: number;
        name: string;
        color: string | null;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }) => void;
}

export function AddCategory({ onCategoryAdded }: AddCategoryProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<AddCategoryFormData>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: {
            name: "",
            color: "#6366f1",
            description: "",
        },
    });

    const onSubmit = (data: AddCategoryFormData) => {
        startTransition(async () => {
            try {
                const response = await fetch("/api/categories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = (await response.json()) as {
                        error?: string;
                    };
                    throw new Error(
                        errorData.error || "Failed to create category",
                    );
                }

                const result = (await response.json()) as {
                    data: {
                        id: number;
                        name: string;
                        color: string | null;
                        description: string | null;
                        createdAt: string;
                        updatedAt: string;
                    };
                };

                // Call the callback to update the parent component
                onCategoryAdded(result.data);

                // Reset form and close dialog
                form.reset();
                setOpen(false);
            } catch (error) {
                console.error("Error creating category:", error);
                // You might want to show a toast notification here
                alert(
                    `Error creating category: ${error instanceof Error ? error.message : "Unknown error"}`,
                );
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-2 py-1.5 h-auto font-normal"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add new category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Create a new category to organize your todos.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit(onSubmit)(e);
                        }}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter category name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="color"
                                                className="w-16 h-10 p-1 rounded cursor-pointer"
                                                {...field}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="#6366f1"
                                                className="flex-1"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Choose a color to identify this category
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter category description..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Optional description for this category
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create Category"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
