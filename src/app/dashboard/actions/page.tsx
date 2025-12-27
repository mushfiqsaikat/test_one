export default function ActionsPage() {
    const actionTypes = [
        { id: "lead", name: "Collect Lead", description: "Capture email or phone from users", icon: "📧" },
        { id: "webhook", name: "Webhook", description: "Send data to external services", icon: "🔗" },
        { id: "email", name: "Send Email", description: "Notify team via email", icon: "📬" },
        { id: "calendar", name: "Book Meeting", description: "Schedule appointments", icon: "📅" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Actions</h1>
                    <p className="text-slate-600 dark:text-slate-400">Automate tasks when users interact with your chatbot</p>
                </div>
                <button className="btn-primary">+ New Action</button>
            </div>

            {/* Action Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actionTypes.map((action) => (
                    <div key={action.id} className="card p-4 hover:border-primary-500 cursor-pointer transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                                {action.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">{action.name}</h3>
                                <p className="text-sm text-slate-500">{action.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Actions */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Active Actions</h3>
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                    <p className="text-slate-500">No actions configured yet</p>
                    <p className="text-sm text-slate-400 mt-1">Create an action to automate your chatbot</p>
                </div>
            </div>
        </div>
    );
}
