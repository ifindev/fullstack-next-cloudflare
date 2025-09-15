// Route builders with dynamic parameters
const todosRoutes = {
    list: "/dashboard/todos",
    new: "/dashboard/todos/new",
    edit: (id: string | number) => `/dashboard/todos/${id}/edit`,
} as const;

export default todosRoutes;
