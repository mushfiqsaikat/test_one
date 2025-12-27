"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

// Demo responses
const demoResponses = {
    services: `We offer AI-powered customer support solutions:\n\n🤖 AI Chat Assistant\n📊 Analytics Dashboard\n🔗 API Integration`,
    support: `Contact us at:\n📧 support@automax.ai\n📞 1-800-AUTOMAX`,
    pricing: `Our plans:\n🚀 Starter - $29/mo\n💼 Pro - $99/mo\n🏢 Enterprise - Custom`,
    default: ["I'd be happy to help!", "Let me assist you with that.", "Great question!"],
};

function getResponse(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes("service")) return demoResponses.services;
    if (lower.includes("support") || lower.includes("help")) return demoResponses.support;
    if (lower.includes("price") || lower.includes("pricing")) return demoResponses.pricing;
    return demoResponses.default[Math.floor(Math.random() * demoResponses.default.length)];
}

export default function PlaygroundPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "👋 Hello! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [model, setModel] = useState("gpt-4o");
    const [temperature, setTemperature] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        await new Promise((r) => setTimeout(r, 1000));

        const response = getResponse(input);
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
        setIsTyping(false);
    };

    return (
        <div className="h-[calc(100vh-5rem)] flex gap-6">
            {/* Left Panel - Settings */}
            <div className="w-96 flex flex-col gap-4">
                <div className="card p-4">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Playground</h1>

                    {/* Training Status */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Trained
                        </span>
                        <span className="text-sm text-slate-500">Last trained 2 hours ago • 45 KB</span>
                    </div>

                    {/* Model Selector */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Model</label>
                            <button className="text-sm text-primary-600 hover:text-primary-500">Compare AI models</button>
                        </div>
                        <div className="relative">
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="gpt-4o">🤖 GPT-4o</option>
                                <option value="gpt-4">🤖 GPT-4</option>
                                <option value="gpt-3.5">🤖 GPT-3.5 Turbo</option>
                                <option value="claude-3">🧠 Claude 3</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-slate-500">Upgrade for more advanced models</span>
                            <button className="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-orange-400 rounded">
                                Upgrade
                            </button>
                        </div>
                    </div>

                    {/* Temperature Slider */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Temperature</label>
                            <span className="text-sm font-medium text-slate-800 dark:text-white">{temperature}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>Reserved</span>
                            <span>Creative</span>
                        </div>
                    </div>

                    {/* AI Actions */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">AI Actions</label>
                        <div className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-center">
                            <p className="text-sm text-slate-500">No actions found</p>
                            <button className="mt-2 text-sm text-primary-600 hover:text-primary-500 font-medium">
                                + Add action
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Chat Preview */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-800">
                    {/* Chat Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                </svg>
                            </div>
                            <span className="font-semibold">My First Chatbot</span>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                    {msg.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className={`px-4 py-2.5 rounded-2xl ${msg.role === "user"
                                            ? "bg-primary-600 text-white rounded-tr-md"
                                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-md"
                                        }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                    </svg>
                                </div>
                                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length === 1 && (
                        <div className="px-4 pb-2 bg-slate-50 dark:bg-slate-900">
                            <div className="flex flex-wrap gap-2">
                                {["What services do you offer?", "Pricing plans?", "Contact support"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => { setInput(q); }}
                                        className="px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Message..."
                                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-700 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                                </svg>
                            </button>
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isTyping}
                                className="p-2 text-slate-400 hover:text-primary-600 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-center text-slate-400 mt-2">Powered by AutoMax AI</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
