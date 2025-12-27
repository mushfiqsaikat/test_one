"use client";

import { useState } from "react";

export default function PlansPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const plans = [
        {
            name: "Hobby",
            icon: "⭐",
            price: billingCycle === "monthly" ? 40 : 400,
            features: [
                "Access to advanced models",
                "1,500 message credits/month",
                "1 AI agent",
                "5 AI Actions per AI agent",
                "20 MB per AI agent",
            ],
            highlight: false,
        },
        {
            name: "Standard",
            icon: "✨",
            price: billingCycle === "monthly" ? 150 : 1500,
            features: [
                "Everything in Hobby +",
                "10,000 message credits/month",
                "10 AI Actions per AI agent",
                "40 MB per AI agent",
                "Auto retrain agents",
            ],
            highlight: true,
        },
        {
            name: "Pro",
            icon: "💎",
            price: billingCycle === "monthly" ? 500 : 5000,
            features: [
                "Everything in Standard +",
                "40,000 message credits/month",
                "15 AI Actions per AI agent",
                "60 MB per AI agent",
                "Advanced analytics",
            ],
            highlight: false,
        },
    ];

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Plans</h1>

                {/* Billing Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === "monthly"
                                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === "yearly"
                                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative bg-white dark:bg-slate-800 rounded-2xl p-6 border ${plan.highlight
                                ? "border-orange-400"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-4 py-1 bg-orange-400 text-white text-xs font-medium rounded-full">
                                    Popular
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">{plan.icon}</span>
                            <h3 className="font-semibold text-slate-800 dark:text-white">
                                {plan.name}
                            </h3>
                        </div>

                        <div className="mb-6">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                ${plan.price}
                            </span>
                            <span className="text-slate-500">
                                {" "}per {billingCycle === "monthly" ? "month" : "year"}
                            </span>
                        </div>

                        <button className="w-full px-4 py-2.5 mb-6 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Upgrade
                        </button>

                        <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                                >
                                    <svg
                                        className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Contact */}
            <div className="mt-8 text-center">
                <p className="text-slate-500">
                    Need more? <a href="#" className="text-primary-600 hover:underline">Contact us</a> for Enterprise pricing.
                </p>
            </div>
        </div>
    );
}
