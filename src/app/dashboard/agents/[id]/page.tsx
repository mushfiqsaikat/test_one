"use client";

import { useState, useEffect, useCallback, use } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Agent {
    id: string;
    name: string;
    status: string;
    system_prompt: string;
    total_messages: number;
    created_at: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("playground");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const loadAgent = useCallback(async () => {
        try {
            const { data } = await supabase
                .from("chatbots")
                .select("*")
                .eq("id", id)
                .single();

            if (data) {
                setAgent(data);
            } else {
                router.push("/dashboard/agents");
            }
        } catch (error) {
            console.error("Error loading agent:", error);
            router.push("/dashboard/agents");
        } finally {
            setLoading(false);
        }
    }, [id, supabase, router]);

    useEffect(() => {
        loadAgent();
    }, [loadAgent]);

    const sendMessage = async () => {
        if (!input.trim() || sending) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setSending(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatbotId: id,
                    message: userMessage,
                    conversationHistory: messages,
                }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setSending(false);
        }
    };

    const tabs = [
        { id: "playground", label: "Playground", icon: "💬" },
        { id: "sources", label: "Sources", icon: "📚" },
        { id: "deploy", label: "Deploy", icon: "🚀" },
        { id: "settings", label: "Settings", icon: "⚙️" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!agent) {
        return null;
    }

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard/agents"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{agent.name}</h1>
                    <p className="text-sm text-slate-500">
                        Created {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "playground" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 h-[600px] flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <span className="text-4xl mb-4 block">💬</span>
                                <p>Start a conversation with {agent.name}</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.role === "user"
                                                ? "bg-primary-600 text-white"
                                                : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {sending && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={sending || !input.trim()}
                                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "sources" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Knowledge Sources</h2>
                    <p className="text-slate-500 mb-6">Add data sources to train your agent.</p>
                    <Link
                        href="/dashboard/sources"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
                    >
                        Manage Sources
                    </Link>
                </div>
            )}

            {activeTab === "deploy" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Deploy Your Agent</h2>
                    <p className="text-slate-500 mb-6">Get the embed code to add this agent to your website.</p>
                    <Link
                        href="/dashboard/deploy"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
                    >
                        View Embed Code
                    </Link>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Agent Settings</h2>
                    <p className="text-slate-500 mb-6">Configure your agent&apos;s behavior and appearance.</p>
                    <Link
                        href="/dashboard/settings"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
                    >
                        Open Settings
                    </Link>
                </div>
            )}
        </div>
    );
}
