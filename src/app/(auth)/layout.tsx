import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // If already logged in, redirect to dashboard
    if (session) {
        redirect("/dashboard");
    }

    return <div>{children}</div>;
}
