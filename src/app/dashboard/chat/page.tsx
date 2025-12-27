"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// Demo responses (no AI backend)
const demoResponses = {
    services: `We offer a comprehensive suite of AI-powered customer support solutions:

🤖 **AI Chat Assistant** - 24/7 automated customer support
📊 **Analytics Dashboard** - Real-time insights and reporting
🔗 **API Integration** - Seamless connection with your existing tools
🎯 **Custom Training** - Tailored AI models for your business

Would you like more details about any of these services?`,

    support: `I'm here to provide you with excellent support! Here's how you can reach us:

📧 **Email**: support@automax.ai
💬 **Live Chat**: You're already chatting with me!
📞 **Phone**: 1-800-AUTOMAX
📚 **Help Center**: docs.automax.ai

What specific issue can I help you with today?`,

    pricing: `We offer flexible pricing plans to fit your needs:

🚀 **Starter** - $29/month
• Up to 1,000 conversations
• Basic analytics
• Email support

💼 **Professional** - $99/month
• Up to 10,000 conversations
• Advanced analytics
• Priority support

🏢 **Enterprise** - Custom pricing
• Unlimited conversations
• Custom integrations
• Dedicated account manager

Would you like to start a free trial?`,

    default: [
        "I understand you're looking for help! Let me assist you with that.",
        "That's a great question! Here's what I can tell you...",
        "Thanks for reaching out! I'm here to help you.",
        "I'd be happy to help with that. Let me provide some information.",
    ],
};

function getResponse(message: string): string {
    const lower = message.toLowerCase();
    if (lower.includes("service") || lower.includes("offer")) return demoResponses.services;
    if (lower.includes("support") || lower.includes("help") || lower.includes("contact")) return demoResponses.support;
    if (lower.includes("price") || lower.includes("pricing") || lower.includes("cost") || lower.includes("plan")) return demoResponses.pricing;
    const defaults = demoResponses.default;
    return defaults[Math.floor(Math.random() * defaults.length)];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "👋 Hello! I'm your AutoMax AI assistant. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response = getResponse(content);
        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const quickActions = [
        { label: "Our Services", message: "What services do you offer?" },
        { label: "Get Support", message: "How can I get support?" },
        { label: "Pricing", message: "What are your pricing plans?" },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="card flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="font-semibold text-slate-800 dark:text-white">AutoMax Assistant</h2>
                        <span className="text-sm text-green-500 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                        </span>
                    </div>
                    <button
                        onClick={() => setMessages([{
                            id: "1",
                            role: "assistant",
                            content: "👋 Hello! I'm your AutoMax AI assistant. How can I help you today?",
                            timestamp: new Date(),
                        }])}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Clear chat"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 message-in ${message.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${message.role === "assistant"
                                ? "bg-gradient-to-br from-primary-600 to-primary-400"
                                : "bg-slate-200 dark:bg-slate-700"
                                }`}>
                                {message.role === "assistant" ? (
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                )}
                            </div>

                            <div className={`max-w-[70%] ${message.role === "user" ? "text-right" : ""}`}>
                                <div className={`px-4 py-3 rounded-2xl ${message.role === "assistant"
                                    ? "bg-slate-100 dark:bg-slate-800 rounded-tl-md"
                                    : "bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-tr-md"
                                    }`}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <span className="text-xs text-slate-400 mt-1 block">
                                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex gap-3 message-in">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                </svg>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-md">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick actions after first message */}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 ml-11">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => sendMessage(action.message)}
                                    className="px-4 py-2 rounded-full border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 input"
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
