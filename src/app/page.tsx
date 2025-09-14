import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";

export default async function HomePage() {
    const session = await getSession();
    redirect(session ? "/dashboard" : "/login");
}
