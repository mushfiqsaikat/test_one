export default function AnalyticsPage() {
    const stats = [
        { label: "Total Messages", value: "0", change: "+0%", icon: "💬" },
        { label: "Conversations", value: "0", change: "+0%", icon: "📊" },
        { label: "Avg. Response Time", value: "0s", change: "0%", icon: "⚡" },
        { label: "Satisfaction", value: "N/A", change: "N/A", icon: "😊" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Analytics</h1>
                <p className="text-slate-600 dark:text-slate-400">Track your chatbot performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Messages Over Time</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-slate-400">No data to display</p>
                    </div>
                </div>
                <div className="card p-6">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Top Questions</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-slate-400">No data to display</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
