import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getSession } from "@/lib/auth-utils";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />

            <div className="w-full md:w-xl mx-auto py-8 px-4">{children}</div>
        </div>
    );
}
