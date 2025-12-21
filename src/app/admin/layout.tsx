import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import AdminSidebar from "./_components/admin-sidebar";
import AdminHeader from "./_components/admin-header";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 检查用户权限
    const auth = await getAuth();
    const session = await auth.api.getSession({
        headers: new Headers(),
    });

    // 未登录或非管理员，重定向到登录页
    if (!session || (session.user as any).role !== "admin") {
        redirect("/auth/login");
    }

    return (
        <div className="flex h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary">
            {/* 侧边栏 */}
            <AdminSidebar />

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* 顶部导航栏 */}
                <AdminHeader user={session.user} />

                {/* 主内容（可滚动） */}
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
