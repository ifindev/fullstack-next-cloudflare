import { and, eq } from "drizzle-orm";
import { categories, getDb } from "@/lib/db";
import {
    insertTodoSchema,
    type Todo,
    todos,
    updateTodoSchema,
} from "@/lib/db/schemas/todo.schema";
import { type UploadResult, uploadToR2 } from "@/lib/r2";

export async function getAllTodos(userId: string): Promise<Todo[]> {
    const db = await getDb();
    return await db
        .select({
            id: todos.id,
            title: todos.title,
            description: todos.description,
            completed: todos.completed,
            categoryId: todos.categoryId,
            categoryName: categories.name,
            dueDate: todos.dueDate,
            imageUrl: todos.imageUrl,
            imageAlt: todos.imageAlt,
            status: todos.status,
            priority: todos.priority,
            userId: todos.userId,
            createdAt: todos.createdAt,
            updatedAt: todos.updatedAt,
        })
        .from(todos)
        .leftJoin(
            categories,
            and(
                eq(todos.categoryId, categories.id),
                eq(categories.userId, userId),
            ),
        )
        .where(eq(todos.userId, userId))
        .orderBy(todos.createdAt);
}

export async function getTodoById(
    id: number,
    userId: string,
): Promise<Todo | null> {
    const db = await getDb();
    const result = await db
        .select({
            id: todos.id,
            title: todos.title,
            description: todos.description,
            completed: todos.completed,
            categoryId: todos.categoryId,
            categoryName: categories.name,
            dueDate: todos.dueDate,
            imageUrl: todos.imageUrl,
            imageAlt: todos.imageAlt,
            status: todos.status,
            priority: todos.priority,
            userId: todos.userId,
            createdAt: todos.createdAt,
            updatedAt: todos.updatedAt,
        })
        .from(todos)
        .leftJoin(
            categories,
            and(
                eq(todos.categoryId, categories.id),
                eq(categories.userId, userId),
            ),
        )
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .orderBy(todos.createdAt)
        .limit(1);
    return result[0] || null;
}

export async function createTodo(
    data: unknown,
    userId: string,
    imageFile?: File,
): Promise<Todo> {
    const validatedData = insertTodoSchema.parse({
        ...(data as object),
        userId,
    });

    // Handle optional image upload
    let imageUrl: string | undefined;
    let imageAlt: string | undefined;

    if (imageFile) {
        const uploadResult: UploadResult = await uploadToR2(
            imageFile,
            "todo-images",
        );

        if (uploadResult.success && uploadResult.url) {
            imageUrl = uploadResult.url;
            imageAlt = validatedData.imageAlt || imageFile.name;
        } else {
            // Log error but don't fail the todo creation
            console.error("Image upload failed:", uploadResult.error);
        }
    }

    const db = await getDb();
    const result = await db
        .insert(todos)
        .values({
            ...validatedData,
            userId,
            imageUrl: imageUrl || validatedData.imageUrl,
            imageAlt: imageAlt || validatedData.imageAlt,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .returning();

    return result[0];
}

export async function updateTodo(
    id: number,
    data: unknown,
    userId: string,
    imageFile?: File,
): Promise<Todo | null> {
    const validatedData = updateTodoSchema.parse(data);

    // Handle optional image upload
    let imageUrl: string | undefined;
    let imageAlt: string | undefined;

    if (imageFile) {
        const uploadResult: UploadResult = await uploadToR2(
            imageFile,
            "todo-images",
        );

        if (uploadResult.success && uploadResult.url) {
            imageUrl = uploadResult.url;
            imageAlt = validatedData.imageAlt || imageFile.name;
        } else {
            // Log error but don't fail the todo update
            console.error("Image upload failed:", uploadResult.error);
        }
    }

    const db = await getDb();
    const result = await db
        .update(todos)
        .set({
            ...validatedData,
            // Only update image fields if we have new values
            ...(imageUrl && { imageUrl }),
            ...(imageAlt && { imageAlt }),
            updatedAt: new Date().toISOString(),
        })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)))
        .returning();

    return result[0] || null;
}

export async function deleteTodo(id: number, userId: string): Promise<boolean> {
    const db = await getDb();

    // Check if todo exists and belongs to user first
    const existingTodo = await getTodoById(id, userId);
    if (!existingTodo) {
        return false;
    }

    // Delete the todo
    await db
        .delete(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)));
    return true;
}
