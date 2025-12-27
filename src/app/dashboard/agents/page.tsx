"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Agent {
    id: string;
    name: string;
    status: string;
    total_messages: number;
    created_at: string;
    updated_at: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAgentName, setNewAgentName] = useState("");
    const [creating, setCreating] = useState(false);
    const supabase = createClient();

    const loadAgents = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("chatbots")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            setAgents(data || []);
        } catch (error) {
            console.error("Error loading agents:", error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadAgents();
    }, [loadAgents]);

    const createAgent = async () => {
        if (!newAgentName.trim()) return;
        setCreating(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: chatbot, error } = await supabase
                .from("chatbots")
                .insert({
                    user_id: user.id,
                    name: newAgentName,
                    status: "active",
                })
                .select()
                .single();

            if (error) throw error;

            // Create default widget settings
            if (chatbot) {
                await supabase.from("widget_settings").insert({
                    chatbot_id: chatbot.id,
                });

                // Create default LLM config
                await supabase.from("llm_configs").insert({
                    chatbot_id: chatbot.id,
                    provider: "openai",
                    model: "gpt-4o",
                    temperature: 0.7,
                    max_tokens: 1024,
                });
            }

            setNewAgentName("");
            setShowCreateModal(false);
            loadAgents();
        } catch (error) {
            console.error("Error creating agent:", error);
        } finally {
            setCreating(false);
        }
    };

    const deleteAgent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this agent?")) return;

        try {
            await supabase.from("chatbots").delete().eq("id", id);
            loadAgents();
        } catch (error) {
            console.error("Error deleting agent:", error);
        }
    };

    const getRandomGradient = (index: number) => {
        const gradients = [
            "from-red-400 to-pink-500",
            "from-blue-400 to-indigo-500",
            "from-green-400 to-emerald-500",
            "from-purple-400 to-violet-500",
            "from-orange-400 to-amber-500",
            "from-cyan-400 to-teal-500",
        ];
        return gradients[index % gradients.length];
    };

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
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Agents</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New AI agent
                </button>
            </div>

            {/* Agents Grid */}
            {agents.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <div className="text-5xl mb-4">🤖</div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                        No agents yet
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Create your first AI agent to get started
                    </p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium"
                    >
                        Create your first agent
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent, index) => (
                        <div
                            key={agent.id}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Full Card Link */}
                            <Link
                                href={`/dashboard/agents/${agent.id}`}
                                className="block"
                            >
                                {/* Gradient Preview */}
                                <div className={`h-40 bg-gradient-to-br ${getRandomGradient(index)} relative`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-white/40"></div>
                                                <span className="text-white font-medium text-sm">{agent.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 left-3 flex items-center gap-2 text-white text-sm">
                                        <div className="w-5 h-5 rounded bg-white/30 flex items-center justify-center">
                                            🤖
                                        </div>
                                        <span className="font-medium">{agent.name}</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                        {agent.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Last trained {new Date(agent.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>

                            {/* Delete Button - Outside Link to prevent navigation */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAgent(agent.id);
                                }}
                                className="absolute top-3 right-3 p-2 rounded-lg bg-black/20 hover:bg-red-500 text-white transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete agent"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                            Create new agent
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Agent name
                            </label>
                            <input
                                type="text"
                                value={newAgentName}
                                onChange={(e) => setNewAgentName(e.target.value)}
                                placeholder="My AI Agent"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createAgent}
                                disabled={!newAgentName.trim() || creating}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50"
                            >
                                {creating ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
