"use client";

import { useState, useEffect, useCallback, use } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "playground";
    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
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
            {/* Playground Tab */}
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

            {/* Activity Tab */}
            {activeTab === "activity" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Activity</h2>
                    <p className="text-slate-500">View conversation history and analytics for this agent.</p>
                    <div className="mt-6 text-center py-12 text-slate-400">
                        <span className="text-4xl block mb-4">📊</span>
                        <p>No activity yet</p>
                    </div>
                </div>
            )}

            {/* Sources Tab */}
            {activeTab === "sources" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Knowledge Sources</h2>
                    <p className="text-slate-500 mb-6">Add data sources to train your agent.</p>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center hover:border-primary-500 cursor-pointer transition-colors">
                            <span className="text-2xl block mb-2">📝</span>
                            <p className="font-medium text-slate-800 dark:text-white">Text</p>
                        </div>
                        <div className="p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center hover:border-primary-500 cursor-pointer transition-colors">
                            <span className="text-2xl block mb-2">📄</span>
                            <p className="font-medium text-slate-800 dark:text-white">Files</p>
                        </div>
                        <div className="p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center hover:border-primary-500 cursor-pointer transition-colors">
                            <span className="text-2xl block mb-2">🌐</span>
                            <p className="font-medium text-slate-800 dark:text-white">Website</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions Tab */}
            {activeTab === "actions" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">AI Actions</h2>
                    <p className="text-slate-500 mb-6">Configure actions your agent can perform.</p>
                    <div className="text-center py-12 text-slate-400">
                        <span className="text-4xl block mb-4">⚡</span>
                        <p>No actions configured</p>
                        <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
                            Add Action
                        </button>
                    </div>
                </div>
            )}

            {/* Deploy Tab */}
            {activeTab === "deploy" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Deploy Your Agent</h2>
                    <p className="text-slate-500 mb-6">Get the embed code to add this agent to your website.</p>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Embed Code
                            </label>
                            <pre className="text-sm text-slate-600 dark:text-slate-400 overflow-x-auto">
                                {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" 
  data-chatbot-id="${id}">
</script>`}
                            </pre>
                        </div>

                        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
                            Copy Code
                        </button>
                    </div>
                </div>
            )}

            {/* Widget Tab */}
            {activeTab === "widget" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Widget Builder</h2>
                    <p className="text-slate-500 mb-6">Customize the appearance of your chat widget.</p>

                    <Link
                        href="/dashboard/widget-builder"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
                    >
                        Open Widget Builder
                    </Link>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <div className="space-y-6">
                    {/* Agent Name */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Agent Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={agent.name}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    System Prompt
                                </label>
                                <textarea
                                    rows={4}
                                    defaultValue={agent.system_prompt || "You are a helpful AI assistant."}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                                />
                            </div>

                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-800 p-6">
                        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                        <p className="text-slate-500 mb-4">
                            Once you delete this agent, there is no going back.
                        </p>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">
                            Delete Agent
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
