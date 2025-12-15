const dealsRoutes = {
    board: "/dashboard/deals",
    new: "/dashboard/deals/new",
    edit: (id: number) => `/dashboard/deals/${id}/edit`,
} as const;

export default dealsRoutes;
