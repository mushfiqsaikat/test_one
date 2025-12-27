import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Get platform stats
    const { count: totalUsers } = await supabase
        .from("chatbots")
        .select("user_id", { count: "exact", head: true });

    const { count: totalChatbots } = await supabase
        .from("chatbots")
        .select("*", { count: "exact", head: true });

    const { count: totalConversations } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true });

    const { count: totalMessages } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

    const stats = [
        { name: "Total Users", value: totalUsers || 0, icon: "👥", color: "bg-blue-500" },
        { name: "Chatbots", value: totalChatbots || 0, icon: "🤖", color: "bg-purple-500" },
        { name: "Conversations", value: totalConversations || 0, icon: "💬", color: "bg-green-500" },
        { name: "Messages", value: totalMessages || 0, icon: "📨", color: "bg-orange-500" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Platform overview and management
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {stat.name}
                                </p>
                                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                                    {stat.value.toLocaleString()}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        <a
                            href="/admin/users"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="text-xl">👥</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800 dark:text-white">Manage Users</p>
                                <p className="text-sm text-slate-500">View and manage user accounts</p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>

                        <a
                            href="/admin/support"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <span className="text-xl">🎫</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800 dark:text-white">Support Tickets</p>
                                <p className="text-sm text-slate-500">View and respond to support requests</p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>

                        <a
                            href="/admin/analytics"
                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-xl">📊</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800 dark:text-white">View Analytics</p>
                                <p className="text-sm text-slate-500">Platform usage and growth metrics</p>
                            </div>
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        System Status
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-green-700 dark:text-green-400">API Gateway</span>
                            </div>
                            <span className="text-sm text-green-600 dark:text-green-500">Operational</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-green-700 dark:text-green-400">Database</span>
                            </div>
                            <span className="text-sm text-green-600 dark:text-green-500">Operational</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-green-700 dark:text-green-400">LLM Providers</span>
                            </div>
                            <span className="text-sm text-green-600 dark:text-green-500">All Connected</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-green-700 dark:text-green-400">Widget CDN</span>
                            </div>
                            <span className="text-sm text-green-600 dark:text-green-500">Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
