import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getSession } from "@/modules/auth/utils/auth-utils";
import authRoutes from "../auth/auth.route";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect(authRoutes.login);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />

            <div className="w-full md:w-xl mx-auto py-8 px-4">{children}</div>
        </div>
    );
}
