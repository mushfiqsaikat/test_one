"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatbotConfig {
    id: string;
    name: string;
    provider: string;
    model: string;
    temperature: number;
    systemPrompt: string;
    hasApiKey: boolean;
}

export default function PlaygroundPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [configLoading, setConfigLoading] = useState(true);
    const [config, setConfig] = useState<ChatbotConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chatbot configuration
    const loadConfig = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: chatbots } = await supabase
                .from("chatbots")
                .select("*, llm_configs(*)")
                .eq("user_id", user.id)
                .limit(1);

            if (chatbots && chatbots[0]) {
                const bot = chatbots[0];
                const llmConfig = bot.llm_configs;

                setConfig({
                    id: bot.id,
                    name: bot.name,
                    provider: llmConfig?.provider || "openai",
                    model: llmConfig?.model || "gpt-4o",
                    temperature: llmConfig?.temperature || 0.7,
                    systemPrompt: llmConfig?.system_prompt || "",
                    hasApiKey: !!llmConfig?.api_key_encrypted,
                });
            }
        } catch (error) {
            console.error("Error loading config:", error);
        } finally {
            setConfigLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    const sendMessage = async () => {
        if (!input.trim() || loading || !config) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatbotId: config.id,
                    message: userMessage.content,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get response");
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            console.error("Chat error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    if (configLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-[500px] bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Playground</h1>
                    <p className="text-slate-600 dark:text-slate-400">Test your chatbot in real-time</p>
                </div>
                <button onClick={clearChat} className="btn-secondary">
                    Clear Chat
                </button>
            </div>

            {/* Config Info */}
            {config && (
                <div className="card p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800 dark:text-white">{config.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="capitalize">{config.provider}</span>
                                    <span>•</span>
                                    <span>{config.model}</span>
                                    <span>•</span>
                                    <span>Temp: {config.temperature}</span>
                                </div>
                            </div>
                        </div>

                        {!config.hasApiKey && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                    API key not configured
                                </span>
                                <a href="/dashboard/settings" className="text-sm text-primary-600 hover:underline ml-2">
                                    Add in Settings →
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Chat Container */}
            <div className="card overflow-hidden">
                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                                Test Your Chatbot
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                Send a message to see how your chatbot responds. Make sure you&apos;ve configured your API key in Settings.
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                                                ? "bg-primary-600 text-white"
                                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                        <p className={`text-xs mt-1 ${message.role === "user"
                                                ? "text-primary-200"
                                                : "text-slate-400"
                                            }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={config?.hasApiKey ? "Type a message..." : "Configure API key in Settings first..."}
                            disabled={loading || !config?.hasApiKey}
                            className="input flex-1 resize-none min-h-[48px] max-h-[120px]"
                            rows={1}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim() || !config?.hasApiKey}
                            className="btn-primary px-6 self-end"
                        >
                            {loading ? (
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        Press Enter to send, Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
}
