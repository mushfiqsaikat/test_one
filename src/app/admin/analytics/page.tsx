import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // Get message stats by date (last 7 days)
    const { count: totalMessages } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

    const { count: totalConversations } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true });

    const { count: totalChatbots } = await supabase
        .from("chatbots")
        .select("*", { count: "exact", head: true });

    const { count: totalSources } = await supabase
        .from("sources")
        .select("*", { count: "exact", head: true });

    const stats = [
        { name: "Total Messages", value: totalMessages || 0, change: "+0%", icon: "💬" },
        { name: "Conversations", value: totalConversations || 0, change: "+0%", icon: "🗣️" },
        { name: "Active Chatbots", value: totalChatbots || 0, change: "+0%", icon: "🤖" },
        { name: "Knowledge Sources", value: totalSources || 0, change: "+0%", icon: "📚" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Analytics</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Platform usage and performance metrics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{stat.icon}</span>
                            <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                            {stat.value.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Messages Over Time */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        Messages Over Time
                    </h2>
                    <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <div className="text-center">
                            <span className="text-4xl">📈</span>
                            <p className="text-slate-500 mt-2">Chart coming soon</p>
                        </div>
                    </div>
                </div>

                {/* LLM Usage by Provider */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                        LLM Usage by Provider
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <span className="text-xl">🟢</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-slate-800 dark:text-white">OpenAI</span>
                                    <span className="text-sm text-slate-500">0 requests</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <span className="text-xl">🟠</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-slate-800 dark:text-white">Anthropic</span>
                                    <span className="text-sm text-slate-500">0 requests</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "0%" }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="text-xl">🔵</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-slate-800 dark:text-white">Google AI</span>
                                    <span className="text-sm text-slate-500">0 requests</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "0%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Usage Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Top Chatbots by Usage
                </h2>
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 text-center py-8">
                        Usage data will appear here once chatbots start receiving messages.
                    </p>
                </div>
            </div>
        </div>
    );
}
