import EditTodoPage from "@/modules/todos/edit-todo.page";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <EditTodoPage id={id} />;
}
