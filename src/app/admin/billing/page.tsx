export default function BillingPage() {
    const plans = [
        { name: "Free", users: 0, revenue: 0, color: "bg-slate-500" },
        { name: "Starter", users: 0, revenue: 0, color: "bg-blue-500" },
        { name: "Pro", users: 0, revenue: 0, color: "bg-purple-500" },
        { name: "Enterprise", users: 0, revenue: 0, color: "bg-orange-500" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Billing</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage subscriptions and revenue
                </p>
            </div>

            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">$0</p>
                    <p className="text-sm text-green-600 mt-1">+0% from last month</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">0</p>
                    <p className="text-sm text-slate-500 mt-1">Paid subscribers</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-500">MRR Growth</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">0%</p>
                    <p className="text-sm text-slate-500 mt-1">Month over month</p>
                </div>
            </div>

            {/* Plan Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Plan Distribution
                </h2>
                <div className="space-y-4">
                    {plans.map((plan) => (
                        <div key={plan.name} className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded ${plan.color}`}></div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-slate-800 dark:text-white">{plan.name}</span>
                                    <span className="text-sm text-slate-500">{plan.users} users</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${plan.color} rounded-full`}
                                        style={{ width: "0%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">🚧</div>
                    <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                            Billing Integration Coming Soon
                        </h3>
                        <p className="text-amber-700 dark:text-amber-300 mt-1">
                            Stripe integration for subscription management is planned for a future update.
                            This page will allow you to manage plans, view invoices, and track revenue.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
