"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AuthUser } from "@/lib/auth-utils";
import { insertTodoSchema } from "@/lib/db/schemas/todo.schema";
import {
    TodoPriority,
    type TodoPriorityType,
    TodoStatus,
    type TodoStatusType,
} from "@/lib/enums/todo.enum";
import { AddCategory } from "./add-category";

type Category = {
    id: number;
    name: string;
    color: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
};

interface TodoFormProps {
    categories: Category[];
    initialData?: {
        id: number;
        title: string;
        description: string | null;
        completed: boolean;
        categoryId: number | null;
        dueDate: string | null;
        imageUrl: string | null;
        imageAlt: string | null;
        status: TodoStatusType;
        priority: TodoPriorityType;
    };
    user: AuthUser;
}

type FormData = z.infer<typeof insertTodoSchema>;

export function TodoForm({
    user,
    categories: initialCategories,
    initialData,
}: TodoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialData?.imageUrl || null,
    );
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const form = useForm<FormData>({
        resolver: zodResolver(insertTodoSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            categoryId: initialData?.categoryId
                ? initialData.categoryId
                : undefined,
            status: initialData?.status || TodoStatus.PENDING,
            priority: initialData?.priority || TodoPriority.MEDIUM,
            imageUrl: initialData?.imageUrl || "",
            imageAlt: initialData?.imageAlt || "",
            completed: initialData?.completed || false,
            dueDate: initialData?.dueDate
                ? new Date(initialData.dueDate).toISOString().split("T")[0]
                : "",
            userId: user.id,
        },
    });

    const handleCategoryAdded = (newCategory: Category) => {
        setCategories((prev) => [...prev, newCategory]);
        // Automatically select the newly created category
        form.setValue("categoryId", newCategory.id);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        form.setValue("imageUrl", "");
        form.setValue("imageAlt", "");
    };

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            try {
                const formData = new FormData();

                // Add all form fields
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        if (key === "categoryId") {
                            // Handle "none" value for categoryId
                            if (value === "none") {
                                // Don't append categoryId if "none" is selected
                                return;
                            }
                            if (typeof value === "number") {
                                formData.append(key, value.toString());
                            } else if (
                                typeof value === "string" &&
                                value !== "none"
                            ) {
                                formData.append(key, value);
                            }
                        } else if (
                            key === "completed" &&
                            typeof value === "boolean"
                        ) {
                            formData.append(key, value.toString());
                        } else {
                            formData.append(key, value as string);
                        }
                    }
                });

                // Add image file if present
                if (imageFile) {
                    formData.append("image", imageFile);
                }

                const url = initialData
                    ? `/api/todos/${initialData.id}`
                    : "/api/todos";

                const method = initialData ? "PUT" : "POST";

                const response = await fetch(url, {
                    method,
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to save todo");
                }

                router.push("/dashboard/todos");
            } catch (error) {
                console.error("Error saving todo:", error);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {initialData ? "Edit Todo" : "Create New Todo"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            form.handleSubmit(onSubmit)(e);
                        }}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter todo title..."
                                            {...field}
                                        />
                                    </FormControl>
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
                                            placeholder="Enter todo description..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                if (value === "none") {
                                                    field.onChange(undefined);
                                                } else {
                                                    field.onChange(
                                                        parseInt(value),
                                                    );
                                                }
                                            }}
                                            value={
                                                field.value?.toString() ||
                                                "none"
                                            }
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    No category
                                                </SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                    >
                                                        <div className="flex items-center">
                                                            {category.color && (
                                                                <div
                                                                    className="w-3 h-3 rounded-full mr-2"
                                                                    style={{
                                                                        backgroundColor:
                                                                            category.color,
                                                                    }}
                                                                />
                                                            )}
                                                            {category.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                <div className="border-t pt-1 mt-1">
                                                    <AddCategory
                                                        onCategoryAdded={
                                                            handleCategoryAdded
                                                        }
                                                    />
                                                </div>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value={TodoPriority.LOW}
                                                >
                                                    Low
                                                </SelectItem>
                                                <SelectItem
                                                    value={TodoPriority.MEDIUM}
                                                >
                                                    Medium
                                                </SelectItem>
                                                <SelectItem
                                                    value={TodoPriority.HIGH}
                                                >
                                                    High
                                                </SelectItem>
                                                <SelectItem
                                                    value={TodoPriority.URGENT}
                                                >
                                                    Urgent
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value={TodoStatus.PENDING}
                                                >
                                                    Pending
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        TodoStatus.IN_PROGRESS
                                                    }
                                                >
                                                    In Progress
                                                </SelectItem>
                                                <SelectItem
                                                    value={TodoStatus.COMPLETED}
                                                >
                                                    Completed
                                                </SelectItem>
                                                <SelectItem
                                                    value={TodoStatus.ARCHIVED}
                                                >
                                                    Archived
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="completed"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Mark as completed</FormLabel>
                                        <FormDescription>
                                            Check this if the todo is already
                                            completed
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div>
                                <FormLabel>Image</FormLabel>
                                <div className="mt-2">
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                width={400}
                                                height={200}
                                                className="max-w-full h-auto rounded-md max-h-48 object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-2">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="cursor-pointer text-blue-600 hover:text-blue-500"
                                                >
                                                    Upload an image
                                                </label>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG up to 5MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {imagePreview && (
                                <FormField
                                    control={form.control}
                                    name="imageAlt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Image Alt Text
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Describe the image..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Describe the image for
                                                accessibility
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/dashboard/todos")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? initialData
                                        ? "Updating..."
                                        : "Creating..."
                                    : initialData
                                      ? "Update Todo"
                                      : "Create Todo"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
