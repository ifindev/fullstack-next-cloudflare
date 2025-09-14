import { CheckSquare, List, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to TodoApp
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A simple and elegant todo application built with Next.js 15,
                    TailwindCSS, and shadcn/ui components.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <List className="mr-2 h-5 w-5" />
                            View Todos
                        </CardTitle>
                        <CardDescription>
                            Browse and manage all your todos in one place
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/todos">
                            <Button className="w-full">
                                <CheckSquare className="mr-2 h-4 w-4" />
                                Go to Todos
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Plus className="mr-2 h-5 w-5" />
                            Create Todo
                        </CardTitle>
                        <CardDescription>
                            Add a new task to your todo list
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/todos/new">
                            <Button className="w-full" variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Todo
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-16 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Features
                </h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="text-center">
                        <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <CheckSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Task Management</h3>
                        <p className="text-gray-600 text-sm">
                            Create, edit, and delete todos with ease
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <List className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Categories</h3>
                        <p className="text-gray-600 text-sm">
                            Organize your todos with custom categories
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <Plus className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Rich Features</h3>
                        <p className="text-gray-600 text-sm">
                            Priorities, due dates, images, and more
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
