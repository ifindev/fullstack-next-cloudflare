const contactsRoutes = {
    list: "/dashboard/contacts",
    new: "/dashboard/contacts/new",
    edit: (id: number) => `/dashboard/contacts/${id}/edit`,
} as const;

export default contactsRoutes;
