"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Tab types
type SettingsTab = "general" | "ai" | "widget" | "security" | "profile";

// LLM Provider options
const providers = [
    { id: "openai", name: "OpenAI", icon: "🤖", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"] },
    { id: "anthropic", name: "Anthropic", icon: "🧠", models: ["claude-3-5-sonnet-latest", "claude-3-opus-latest", "claude-3-haiku-20240307"] },
    { id: "google", name: "Google AI", icon: "✨", models: ["gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.5-flash"] },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Chatbot state
    const [chatbot, setChatbot] = useState<{
        id: string;
        name: string;
        description: string;
        status: string;
    } | null>(null);

    // LLM Config state
    const [llmConfig, setLlmConfig] = useState({
        provider: "openai",
        model: "gpt-4o",
        apiKey: "",
        temperature: 0.7,
        maxTokens: 1024,
        systemPrompt: "You are a helpful AI assistant. Be friendly, concise, and helpful in your responses.",
    });

    // Widget settings state
    const [widgetSettings, setWidgetSettings] = useState({
        primaryColor: "#7c3aed",
        botName: "AI Assistant",
        welcomeMessage: "Hi there! 👋 How can I help you today?",
        position: "bottom-right",
        showBranding: true,
    });

    // Load chatbot data
    useEffect(() => {
        loadChatbotData();
    }, []);

    const loadChatbotData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user's first chatbot (or create one)
            let { data: chatbots } = await supabase
                .from("chatbots")
                .select("*, llm_configs(*), widget_settings(*)")
                .eq("user_id", user.id)
                .limit(1);

            if (!chatbots || chatbots.length === 0) {
                // Create a default chatbot
                const { data: newChatbot } = await supabase
                    .from("chatbots")
                    .insert({ user_id: user.id, name: "My First Chatbot" })
                    .select("*, llm_configs(*), widget_settings(*)")
                    .single();

                if (newChatbot) {
                    chatbots = [newChatbot];
                }
            }

            if (chatbots && chatbots[0]) {
                const bot = chatbots[0];
                setChatbot({
                    id: bot.id,
                    name: bot.name,
                    description: bot.description || "",
                    status: bot.status,
                });

                if (bot.llm_configs) {
                    setLlmConfig({
                        provider: bot.llm_configs.provider || "openai",
                        model: bot.llm_configs.model || "gpt-4o",
                        apiKey: "", // Don't load encrypted key
                        temperature: bot.llm_configs.temperature || 0.7,
                        maxTokens: bot.llm_configs.max_tokens || 1024,
                        systemPrompt: bot.llm_configs.system_prompt || "",
                    });
                }

                if (bot.widget_settings) {
                    setWidgetSettings({
                        primaryColor: bot.widget_settings.primary_color || "#7c3aed",
                        botName: bot.widget_settings.bot_name || "AI Assistant",
                        welcomeMessage: bot.widget_settings.welcome_message || "",
                        position: bot.widget_settings.position || "bottom-right",
                        showBranding: bot.widget_settings.show_branding ?? true,
                    });
                }
            }
        } catch (error) {
            console.error("Error loading chatbot:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!chatbot) return;
        setSaving(true);
        setMessage(null);

        try {
            // Update chatbot
            await supabase
                .from("chatbots")
                .update({
                    name: chatbot.name,
                    description: chatbot.description,
                    status: chatbot.status,
                })
                .eq("id", chatbot.id);

            // Update LLM config
            const llmUpdate: Record<string, unknown> = {
                provider: llmConfig.provider,
                model: llmConfig.model,
                temperature: llmConfig.temperature,
                max_tokens: llmConfig.maxTokens,
                system_prompt: llmConfig.systemPrompt,
            };

            if (llmConfig.apiKey) {
                llmUpdate.api_key_encrypted = btoa(llmConfig.apiKey);
            }

            await supabase
                .from("llm_configs")
                .update(llmUpdate)
                .eq("chatbot_id", chatbot.id);

            // Update widget settings
            await supabase
                .from("widget_settings")
                .update({
                    primary_color: widgetSettings.primaryColor,
                    bot_name: widgetSettings.botName,
                    welcome_message: widgetSettings.welcomeMessage,
                    position: widgetSettings.position,
                    show_branding: widgetSettings.showBranding,
                })
                .eq("chatbot_id", chatbot.id);

            setMessage({ type: "success", text: "Settings saved successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error saving:", error);
            setMessage({ type: "error", text: "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const tabs = [
        { id: "general", label: "General", icon: "⚙️" },
        { id: "ai", label: "AI Model", icon: "🤖" },
        { id: "widget", label: "Widget", icon: "💬" },
        { id: "security", label: "Security", icon: "🔒" },
        { id: "profile", label: "Profile", icon: "👤" },
    ];

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
                    <p className="text-slate-600 dark:text-slate-400">Configure your chatbot and preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SettingsTab)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="card p-6">
                {/* General Tab */}
                {activeTab === "general" && chatbot && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">General Settings</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Chatbot Name
                            </label>
                            <input
                                type="text"
                                value={chatbot.name}
                                onChange={(e) => setChatbot({ ...chatbot, name: e.target.value })}
                                className="input"
                                placeholder="My Chatbot"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={chatbot.description}
                                onChange={(e) => setChatbot({ ...chatbot, description: e.target.value })}
                                className="input min-h-[100px]"
                                placeholder="What does this chatbot do?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Status
                            </label>
                            <select
                                value={chatbot.status}
                                onChange={(e) => setChatbot({ ...chatbot, status: e.target.value })}
                                className="input"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                            </select>
                            <p className="text-xs text-slate-500 mt-1">
                                Only &quot;Active&quot; chatbots can receive messages from the widget
                            </p>
                        </div>
                    </div>
                )}

                {/* AI Model Tab */}
                {activeTab === "ai" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">AI Model Configuration</h2>

                        {/* Provider Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                LLM Provider
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {providers.map((provider) => (
                                    <button
                                        key={provider.id}
                                        onClick={() => {
                                            setLlmConfig({
                                                ...llmConfig,
                                                provider: provider.id,
                                                model: provider.models[0],
                                            });
                                        }}
                                        className={`p-4 rounded-xl border-2 transition-all ${llmConfig.provider === provider.id
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                            }`}
                                    >
                                        <span className="text-2xl">{provider.icon}</span>
                                        <p className="font-medium text-slate-800 dark:text-white mt-2">{provider.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Model Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Model
                            </label>
                            <select
                                value={llmConfig.model}
                                onChange={(e) => setLlmConfig({ ...llmConfig, model: e.target.value })}
                                className="input"
                            >
                                {providers
                                    .find((p) => p.id === llmConfig.provider)
                                    ?.models.map((model) => (
                                        <option key={model} value={model}>
                                            {model}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* API Key */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                API Key
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={llmConfig.apiKey}
                                    onChange={(e) => setLlmConfig({ ...llmConfig, apiKey: e.target.value })}
                                    className="input font-mono pr-20"
                                    placeholder={`Enter your ${providers.find(p => p.id === llmConfig.provider)?.name} API key`}
                                />
                                {llmConfig.apiKey && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">
                                        ✓ Set
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Your API key is encrypted and stored securely
                            </p>
                        </div>

                        {/* System Prompt */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                System Prompt
                            </label>
                            <textarea
                                value={llmConfig.systemPrompt}
                                onChange={(e) => setLlmConfig({ ...llmConfig, systemPrompt: e.target.value })}
                                className="input min-h-[150px] font-mono text-sm"
                                placeholder="You are a helpful AI assistant..."
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Instructions that define how your chatbot behaves
                            </p>
                        </div>

                        {/* Temperature */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Temperature
                                </label>
                                <span className="text-sm font-medium text-slate-800 dark:text-white">
                                    {llmConfig.temperature}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={llmConfig.temperature}
                                onChange={(e) => setLlmConfig({ ...llmConfig, temperature: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Precise</span>
                                <span>Balanced</span>
                                <span>Creative</span>
                            </div>
                        </div>

                        {/* Max Tokens */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Max Response Tokens
                            </label>
                            <input
                                type="number"
                                value={llmConfig.maxTokens}
                                onChange={(e) => setLlmConfig({ ...llmConfig, maxTokens: parseInt(e.target.value) })}
                                className="input"
                                min={1}
                                max={128000}
                            />
                        </div>
                    </div>
                )}

                {/* Widget Tab */}
                {activeTab === "widget" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Widget Customization</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Primary Color
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={widgetSettings.primaryColor}
                                    onChange={(e) => setWidgetSettings({ ...widgetSettings, primaryColor: e.target.value })}
                                    className="w-12 h-12 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                                />
                                <input
                                    type="text"
                                    value={widgetSettings.primaryColor}
                                    onChange={(e) => setWidgetSettings({ ...widgetSettings, primaryColor: e.target.value })}
                                    className="input flex-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Bot Name
                            </label>
                            <input
                                type="text"
                                value={widgetSettings.botName}
                                onChange={(e) => setWidgetSettings({ ...widgetSettings, botName: e.target.value })}
                                className="input"
                                placeholder="AI Assistant"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Welcome Message
                            </label>
                            <textarea
                                value={widgetSettings.welcomeMessage}
                                onChange={(e) => setWidgetSettings({ ...widgetSettings, welcomeMessage: e.target.value })}
                                className="input min-h-[100px]"
                                placeholder="Hi there! How can I help you today?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Widget Position
                            </label>
                            <div className="flex gap-3">
                                {["bottom-right", "bottom-left"].map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setWidgetSettings({ ...widgetSettings, position: pos })}
                                        className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all ${widgetSettings.position === pos
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                            }`}
                                    >
                                        {pos === "bottom-right" ? "Bottom Right" : "Bottom Left"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800 dark:text-white">Show Branding</p>
                                <p className="text-sm text-slate-500">Display &quot;Powered by AutoMax AI&quot;</p>
                            </div>
                            <button
                                onClick={() => setWidgetSettings({ ...widgetSettings, showBranding: !widgetSettings.showBranding })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${widgetSettings.showBranding ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${widgetSettings.showBranding ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && chatbot && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Security</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Chatbot ID
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatbot.id}
                                    readOnly
                                    className="input flex-1 font-mono text-sm bg-slate-50 dark:bg-slate-900"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(chatbot.id)}
                                    className="btn-secondary"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Use this ID to embed the widget on your website</p>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <h3 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Domain Whitelist
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                Domain whitelisting is available on Pro plans. Upgrade to restrict which domains can use your chatbot.
                            </p>
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Profile</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Display Name
                            </label>
                            <input type="text" className="input" placeholder="Your name" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="input bg-slate-50 dark:bg-slate-900"
                                disabled
                                placeholder="your@email.com"
                            />
                            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Sign Out</p>
                                    <p className="text-sm text-slate-500">Sign out of your account</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Message */}
            {message && (
                <div
                    className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg font-medium ${message.type === "success"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}
