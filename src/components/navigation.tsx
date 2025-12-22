import { CheckSquare, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "../modules/auth/components/logout-button";
import dashboardRoutes from "@/modules/dashboard/dashboard.route";
import todosRoutes from "@/modules/todos/todos.route";

export function Navigation() {
    return (
        <nav className="border-b bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <Link
                            href={dashboardRoutes.dashboard}
                            className="text-xl font-bold"
                        >
                            TodoApp
                        </Link>
                        <div className="items-center space-x-4 hidden md:flex">
                            <Link href={dashboardRoutes.dashboard}>
                                <Button variant="ghost" size="sm">
                                    <Home className="mr-2 h-4 w-4" />
                                    Home
                                </Button>
                            </Link>
                            <Link href={todosRoutes.list}>
                                <Button variant="ghost" size="sm">
                                    <CheckSquare className="mr-2 h-4 w-4" />
                                    Todos
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
