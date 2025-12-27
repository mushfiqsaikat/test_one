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

// Theme presets
const themePresets = [
    { id: "default", name: "Purple", colors: { primary: "#7c3aed", background: "#ffffff", userBubble: "#7c3aed", botBubble: "#f1f5f9" } },
    { id: "dark", name: "Dark", colors: { primary: "#8b5cf6", background: "#1e1e2e", userBubble: "#8b5cf6", botBubble: "#2a2a3e" } },
    { id: "ocean", name: "Ocean", colors: { primary: "#0ea5e9", background: "#f0f9ff", userBubble: "#0ea5e9", botBubble: "#e0f2fe" } },
    { id: "forest", name: "Forest", colors: { primary: "#10b981", background: "#f0fdf4", userBubble: "#10b981", botBubble: "#dcfce7" } },
    { id: "sunset", name: "Sunset", colors: { primary: "#f97316", background: "#fffbeb", userBubble: "#f97316", botBubble: "#fed7aa" } },
    { id: "rose", name: "Rose", colors: { primary: "#ec4899", background: "#fdf2f8", userBubble: "#ec4899", botBubble: "#fce7f3" } },
];

function WidgetBuilder({ agentId, agentName }: { agentId: string; agentName: string }) {
    const [widgetTab, setWidgetTab] = useState<"appearance" | "branding" | "behavior" | "advanced">("appearance");
    const [settings, setSettings] = useState({
        primaryColor: "#7c3aed",
        backgroundColor: "#ffffff",
        userBubbleColor: "#7c3aed",
        botBubbleColor: "#f1f5f9",
        themePreset: "default",
        position: "bottom-right" as "bottom-right" | "bottom-left",
        bubbleSize: "medium" as "small" | "medium" | "large",
        botName: agentName,
        welcomeMessage: "Hi there! 👋 How can I help you today?",
        placeholderText: "Type your message...",
        showBranding: true,
        autoOpen: false,
        autoOpenDelay: 3,
        showTypingIndicator: true,
    });

    const applyTheme = (themeId: string) => {
        const theme = themePresets.find((t) => t.id === themeId);
        if (theme) {
            setSettings({
                ...settings,
                themePreset: themeId,
                primaryColor: theme.colors.primary,
                backgroundColor: theme.colors.background,
                userBubbleColor: theme.colors.userBubble,
                botBubbleColor: theme.colors.botBubble,
            });
        }
    };

    const widgetTabs = [
        { id: "appearance", label: "Appearance", icon: "🎨" },
        { id: "branding", label: "Branding", icon: "✨" },
        { id: "behavior", label: "Behavior", icon: "⚡" },
        { id: "advanced", label: "Advanced", icon: "🔧" },
    ];

    return (
        <div className="flex gap-6">
            {/* Settings Panel */}
            <div className="flex-1 min-w-0">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                    {widgetTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setWidgetTab(tab.id as typeof widgetTab)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${widgetTab === tab.id
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    {widgetTab === "appearance" && (
                        <div className="space-y-6">
                            {/* Theme Presets */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme Presets</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {themePresets.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => applyTheme(theme.id)}
                                            className={`p-3 rounded-xl border-2 transition-all text-left ${settings.themePreset === theme.id
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                                }`}
                                        >
                                            <div className="flex gap-1 mb-2">
                                                {Object.values(theme.colors).map((color, i) => (
                                                    <div key={i} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
                                                ))}
                                            </div>
                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{theme.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Colors */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Custom Colors</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: "primaryColor", label: "Primary" },
                                        { key: "backgroundColor", label: "Background" },
                                        { key: "userBubbleColor", label: "User Bubble" },
                                        { key: "botBubbleColor", label: "Bot Bubble" },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="block text-xs text-slate-500 mb-1">{label}</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={settings[key as keyof typeof settings] as string}
                                                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value, themePreset: "custom" })}
                                                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                                                />
                                                <input
                                                    type="text"
                                                    value={settings[key as keyof typeof settings] as string}
                                                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value, themePreset: "custom" })}
                                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Position */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Position</h3>
                                <div className="flex gap-3">
                                    {(["bottom-right", "bottom-left"] as const).map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setSettings({ ...settings, position: pos })}
                                            className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all ${settings.position === pos
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                                : "border-slate-200 dark:border-slate-700 text-slate-600"
                                                }`}
                                        >
                                            {pos === "bottom-right" ? "↘️ Bottom Right" : "↙️ Bottom Left"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {widgetTab === "branding" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bot Name</label>
                                <input
                                    type="text"
                                    value={settings.botName}
                                    onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Welcome Message</label>
                                <textarea
                                    value={settings.welcomeMessage}
                                    onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 min-h-[100px]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Input Placeholder</label>
                                <input
                                    type="text"
                                    value={settings.placeholderText}
                                    onChange={(e) => setSettings({ ...settings, placeholderText: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Show Branding</p>
                                    <p className="text-sm text-slate-500">Display &quot;Powered by AutoMax AI&quot;</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, showBranding: !settings.showBranding })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showBranding ? "bg-primary-600" : "bg-slate-300"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showBranding ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {widgetTab === "behavior" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Auto-Open Chat</p>
                                    <p className="text-sm text-slate-500">Automatically open after a delay</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, autoOpen: !settings.autoOpen })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoOpen ? "bg-primary-600" : "bg-slate-300"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoOpen ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Typing Indicator</p>
                                    <p className="text-sm text-slate-500">Show animation while bot responds</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, showTypingIndicator: !settings.showTypingIndicator })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showTypingIndicator ? "bg-primary-600" : "bg-slate-300"}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showTypingIndicator ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {widgetTab === "advanced" && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <h3 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                                    ⚠️ Domain Whitelist (Pro Feature)
                                </h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                    Restrict which domains can embed your chatbot. Available on Pro plans.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Custom CSS</label>
                                <textarea
                                    placeholder="/* Add custom styles */"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm min-h-[150px]"
                                />
                            </div>
                        </div>
                    )}

                    <button className="w-full mt-6 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Live Preview */}
            <div className="w-[380px] flex-shrink-0">
                <div className="sticky top-0">
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">Live Preview</h3>
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 min-h-[500px] relative flex items-end" style={{ justifyContent: settings.position === "bottom-right" ? "flex-end" : "flex-start" }}>
                        {/* Chat Widget */}
                        <div className="w-full max-w-[320px] rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: settings.backgroundColor }}>
                            <div className="p-4 flex items-center gap-3" style={{ backgroundColor: settings.primaryColor }}>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">🤖</div>
                                <div>
                                    <p className="font-semibold text-white">{settings.botName}</p>
                                    <p className="text-xs text-white/70">Online</p>
                                </div>
                            </div>
                            <div className="p-4 space-y-3 h-48">
                                <div className="rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%]" style={{ backgroundColor: settings.botBubbleColor }}>
                                    <p className="text-sm">{settings.welcomeMessage}</p>
                                </div>
                                <div className="flex justify-end">
                                    <div className="rounded-2xl rounded-br-md px-4 py-2 text-white max-w-[80%]" style={{ backgroundColor: settings.userBubbleColor }}>
                                        <p className="text-sm">Hi! I have a question</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t" style={{ borderColor: settings.botBubbleColor }}>
                                <div className="flex gap-2">
                                    <input type="text" placeholder={settings.placeholderText} className="flex-1 px-4 py-2 rounded-full border text-sm" style={{ borderColor: settings.botBubbleColor }} disabled />
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: settings.primaryColor }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                                {settings.showBranding && <p className="text-center text-xs text-slate-400 mt-2">Powered by AutoMax AI</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Settings Panel Component with Sub-tabs
function SettingsPanel({ agent, agentId }: { agent: Agent; agentId: string }) {
    const [settingsTab, setSettingsTab] = useState<"general" | "model" | "deploy">("general");
    const [modelSettings, setModelSettings] = useState({
        provider: "openai",
        model: "gpt-4o-mini",
        customApiKey: "",
        customApiUrl: "",
        systemPrompt: agent.system_prompt || "You are a helpful AI assistant.",
        temperature: 0.7,
    });

    const llmProviders = [
        { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"] },
        { id: "anthropic", name: "Anthropic", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"] },
        { id: "google", name: "Google AI", models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash"] },
        { id: "custom", name: "Custom API", models: [] },
    ];

    const settingsTabs = [
        { id: "general", label: "General", icon: "⚙️" },
        { id: "model", label: "Model", icon: "🤖" },
        { id: "deploy", label: "Deploy", icon: "🚀" },
    ];

    const selectedProvider = llmProviders.find(p => p.id === modelSettings.provider);

    return (
        <div className="space-y-6">
            {/* Sub-tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                {settingsTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSettingsTab(tab.id as typeof settingsTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${settingsTab === tab.id
                            ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {settingsTab === "general" && (
                <div className="space-y-6">
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
                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-800 p-6">
                        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                        <p className="text-slate-500 mb-4">Once you delete this agent, there is no going back.</p>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">
                            Delete Agent
                        </button>
                    </div>
                </div>
            )}

            {/* Model Tab */}
            {settingsTab === "model" && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">AI Model Configuration</h2>

                        <div className="space-y-6">
                            {/* Provider Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                    LLM Provider
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {llmProviders.map((provider) => (
                                        <button
                                            key={provider.id}
                                            onClick={() => setModelSettings({ ...modelSettings, provider: provider.id, model: provider.models[0] || "" })}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${modelSettings.provider === provider.id
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                                }`}
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">{provider.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {provider.id === "custom" ? "Your own API" : `${provider.models.length} models`}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Model Selection */}
                            {modelSettings.provider !== "custom" && selectedProvider && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Model
                                    </label>
                                    <select
                                        value={modelSettings.model}
                                        onChange={(e) => setModelSettings({ ...modelSettings, model: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                                    >
                                        {selectedProvider.models.map((model) => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Custom API Settings */}
                            {modelSettings.provider === "custom" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            API Endpoint URL
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="https://api.example.com/v1/chat/completions"
                                            value={modelSettings.customApiUrl}
                                            onChange={(e) => setModelSettings({ ...modelSettings, customApiUrl: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            API Key
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="sk-..."
                                            value={modelSettings.customApiKey}
                                            onChange={(e) => setModelSettings({ ...modelSettings, customApiKey: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                                        />
                                    </div>
                                </>
                            )}

                            {/* System Prompt */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    System Prompt
                                </label>
                                <textarea
                                    rows={4}
                                    value={modelSettings.systemPrompt}
                                    onChange={(e) => setModelSettings({ ...modelSettings, systemPrompt: e.target.value })}
                                    placeholder="You are a helpful AI assistant..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Temperature */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Temperature: {modelSettings.temperature}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={modelSettings.temperature}
                                    onChange={(e) => setModelSettings({ ...modelSettings, temperature: parseFloat(e.target.value) })}
                                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>More Focused (0)</span>
                                    <span>More Creative (2)</span>
                                </div>
                            </div>

                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                                Save Model Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deploy Tab */}
            {settingsTab === "deploy" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Embed on Your Website</h2>
                    <p className="text-slate-500 mb-6">Add this code snippet to your website to embed the chatbot.</p>

                    <div className="bg-slate-900 rounded-xl p-4 mb-4">
                        <pre className="text-green-400 text-sm overflow-x-auto">
                            {`<script src="${typeof window !== "undefined" ? window.location.origin : ""}/widget.js"
  data-chatbot-id="${agentId}">
</script>`}
                        </pre>
                    </div>

                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
                        Copy Code
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "sources";
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
                <WidgetBuilder agentId={id} agentName={agent.name} />
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
                <SettingsPanel agent={agent} agentId={id} />
            )}
        </div>
    );
}
