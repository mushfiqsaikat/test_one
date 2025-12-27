"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface AgentUsage {
    id: string;
    name: string;
    messages: number;
}

export default function UsagePage() {
    const [creditsUsed, setCreditsUsed] = useState(0);
    const [creditsLimit] = useState(50);
    const [agentsCount, setAgentsCount] = useState(0);
    const [agentsLimit] = useState(1);
    const [perAgentUsage, setPerAgentUsage] = useState<AgentUsage[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange] = useState("Dec 01, 2025 - Dec 27, 2025");
    const supabase = createClient();

    const loadUsage = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get agents
            const { data: agents } = await supabase
                .from("chatbots")
                .select("id, name, total_messages")
                .eq("user_id", user.id);

            if (agents) {
                setAgentsCount(agents.length);

                // Calculate total messages
                const totalMessages = agents.reduce((sum, a) => sum + (a.total_messages || 0), 0);
                setCreditsUsed(totalMessages);

                // Per agent usage
                setPerAgentUsage(
                    agents.map((a) => ({
                        id: a.id,
                        name: a.name,
                        messages: a.total_messages || 0,
                    }))
                );
            }
        } catch (error) {
            console.error("Error loading usage:", error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadUsage();
    }, [loadUsage]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Usage</h1>
                <div className="flex items-center gap-4">
                    <select className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm">
                        <option>All agents</option>
                        {perAgentUsage.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dateRange}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Credits Used */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-slate-100 dark:text-slate-700"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${(creditsUsed / creditsLimit) * 176} 176`}
                                    className="text-slate-400"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                    {creditsUsed}
                                </span>
                                <span className="text-slate-400">/ {creditsLimit} ⓘ</span>
                            </div>
                            <p className="text-slate-500">Credits used</p>
                        </div>
                    </div>
                </div>

                {/* Agents Used */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-slate-100 dark:text-slate-700"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${(agentsCount / agentsLimit) * 176} 176`}
                                    className="text-blue-500"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                    {agentsCount}
                                </span>
                                <span className="text-slate-400">/ {agentsLimit}</span>
                            </div>
                            <p className="text-slate-500">Agents used</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Usage History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Usage history
                </h2>
                <div className="h-48 flex items-end justify-between gap-1">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-slate-100 dark:bg-slate-700 rounded-t"
                                style={{ height: `${Math.random() * 100}%`, minHeight: "4px" }}
                            />
                            <span className="text-xs text-slate-400">
                                Dec {i + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Credits per Agent */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Credits used per agent
                </h2>
                {perAgentUsage.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">
                        No usage data yet. Start using your agents to see usage breakdown.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {perAgentUsage.map((agent) => (
                            <div key={agent.id} className="flex items-center justify-between">
                                <span className="text-slate-700 dark:text-slate-300">{agent.name}</span>
                                <span className="font-medium text-slate-800 dark:text-white">
                                    {agent.messages} credits
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
