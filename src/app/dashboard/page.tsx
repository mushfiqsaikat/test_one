import Link from "next/link";

export default function DashboardPage() {
    const stats = [
        { label: "Total Conversations", value: "0", change: "+0%", icon: "💬" },
        { label: "Messages Today", value: "0", change: "+0%", icon: "📨" },
        { label: "Avg Response Time", value: "0s", change: "0%", icon: "⚡" },
        { label: "Satisfaction Rate", value: "N/A", change: "N/A", icon: "😊" },
    ];

    const quickLinks = [
        { name: "Test in Playground", href: "/dashboard/playground", icon: "▶️", description: "Chat with your bot" },
        { name: "Add Sources", href: "/dashboard/sources", icon: "📚", description: "Train your chatbot" },
        { name: "Deploy Widget", href: "/dashboard/deploy", icon: "🚀", description: "Add to your website" },
        { name: "View Analytics", href: "/dashboard/analytics", icon: "📊", description: "Track performance" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome */}
            <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-500">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome back! 👋</h1>
                <p className="text-primary-100">Your chatbot is ready. Start by testing it in the Playground.</p>
            </div>

            {/* Stats */}
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

            {/* Quick Links */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="card p-4 hover:border-primary-500 transition-colors group"
                        >
                            <div className="text-3xl mb-3">{link.icon}</div>
                            <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">
                                {link.name}
                            </h3>
                            <p className="text-sm text-slate-500">{link.description}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Getting Started */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Getting Started</h2>
                <div className="space-y-3">
                    {[
                        { step: 1, title: "Add your data sources", done: false },
                        { step: 2, title: "Configure your chatbot settings", done: false },
                        { step: 3, title: "Test in the Playground", done: false },
                        { step: 4, title: "Deploy to your website", done: false },
                    ].map((item) => (
                        <div key={item.step} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${item.done
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                }`}>
                                {item.done ? "✓" : item.step}
                            </div>
                            <span className={`text-sm ${item.done ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-300"}`}>
                                {item.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
