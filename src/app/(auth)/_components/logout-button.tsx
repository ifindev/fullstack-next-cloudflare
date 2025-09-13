"use client";

import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
    const handleLogout = async () => {
        const { signOut } = await authClient();
        await signOut();
        redirect("/login");
    };

    return (
        <Button variant="outline" onClick={handleLogout}>
            Log Out <LogOut className="size-4" />
        </Button>
    );
}
