import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const stats = [
        { name: "Total Conversations", value: "1,234", change: "+12%", icon: "💬" },
        { name: "Messages This Month", value: "8,567", change: "+24%", icon: "📨" },
        { name: "Avg Response Time", value: "0.8s", change: "-15%", icon: "⚡" },
        { name: "Customer Satisfaction", value: "96%", change: "+3%", icon: "⭐" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div className="card bg-gradient-to-br from-primary-600 to-primary-700 border-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome back, {user?.user_metadata?.full_name || "there"}! 👋
                        </h2>
                        <p className="text-primary-100">
                            Your AI assistant is ready to help your customers.
                        </p>
                    </div>
                    <Link href="/dashboard/chat" className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                        Open Chat
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="card">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/dashboard/chat" className="card card-hover flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">Start Chat</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Talk to your AI assistant</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/settings" className="card card-hover flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">Settings</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Configure your assistant</p>
                        </div>
                    </Link>

                    <a href="#" className="card card-hover flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 dark:text-white">Documentation</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Learn how to use</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Conversations</h3>
                <div className="card">
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        <p className="text-lg font-medium mb-2">No conversations yet</p>
                        <p className="text-sm">Start chatting with your AI assistant to see activity here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
