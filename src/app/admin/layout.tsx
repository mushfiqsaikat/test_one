import { redirect } from "next/navigation";
import { isOwner } from "@/lib/admin";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if user is owner
    const owner = await isOwner();

    if (!owner) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
