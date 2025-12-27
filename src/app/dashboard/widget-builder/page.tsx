"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// Theme presets
const themePresets = [
    {
        id: "default",
        name: "Default Purple",
        colors: {
            primary: "#7c3aed",
            secondary: "#6366f1",
            background: "#ffffff",
            text: "#1e293b",
            userBubble: "#7c3aed",
            botBubble: "#f1f5f9",
        },
    },
    {
        id: "dark",
        name: "Dark Mode",
        colors: {
            primary: "#8b5cf6",
            secondary: "#7c3aed",
            background: "#1e1e2e",
            text: "#e2e8f0",
            userBubble: "#8b5cf6",
            botBubble: "#2a2a3e",
        },
    },
    {
        id: "ocean",
        name: "Ocean Blue",
        colors: {
            primary: "#0ea5e9",
            secondary: "#06b6d4",
            background: "#f0f9ff",
            text: "#0c4a6e",
            userBubble: "#0ea5e9",
            botBubble: "#e0f2fe",
        },
    },
    {
        id: "forest",
        name: "Forest Green",
        colors: {
            primary: "#10b981",
            secondary: "#059669",
            background: "#f0fdf4",
            text: "#14532d",
            userBubble: "#10b981",
            botBubble: "#dcfce7",
        },
    },
    {
        id: "sunset",
        name: "Sunset Orange",
        colors: {
            primary: "#f97316",
            secondary: "#fb923c",
            background: "#fffbeb",
            text: "#78350f",
            userBubble: "#f97316",
            botBubble: "#fed7aa",
        },
    },
    {
        id: "rose",
        name: "Rose Pink",
        colors: {
            primary: "#ec4899",
            secondary: "#f472b6",
            background: "#fdf2f8",
            text: "#831843",
            userBubble: "#ec4899",
            botBubble: "#fce7f3",
        },
    },
];

interface WidgetSettings {
    // Appearance
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    userBubbleColor: string;
    botBubbleColor: string;
    themePreset: string;

    // Layout
    position: "bottom-right" | "bottom-left";
    bubbleSize: "small" | "medium" | "large";
    chatWidth: number;
    chatHeight: number;

    // Branding
    botName: string;
    botAvatarUrl: string;
    welcomeMessage: string;
    placeholderText: string;
    showBranding: boolean;

    // Behavior
    autoOpen: boolean;
    autoOpenDelay: number;
    showTypingIndicator: boolean;
    enableSounds: boolean;

    // Advanced
    customCss: string;
    allowedDomains: string[];
}

const defaultSettings: WidgetSettings = {
    primaryColor: "#7c3aed",
    secondaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    userBubbleColor: "#7c3aed",
    botBubbleColor: "#f1f5f9",
    themePreset: "default",
    position: "bottom-right",
    bubbleSize: "medium",
    chatWidth: 380,
    chatHeight: 600,
    botName: "AI Assistant",
    botAvatarUrl: "",
    welcomeMessage: "Hi there! 👋 How can I help you today?",
    placeholderText: "Type your message...",
    showBranding: true,
    autoOpen: false,
    autoOpenDelay: 3,
    showTypingIndicator: true,
    enableSounds: false,
    customCss: "",
    allowedDomains: [],
};

type TabType = "appearance" | "branding" | "behavior" | "advanced";

export default function WidgetBuilderPage() {
    const [activeTab, setActiveTab] = useState<TabType>("appearance");
    const [settings, setSettings] = useState<WidgetSettings>(defaultSettings);
    const [chatbotId, setChatbotId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [previewOpen, setPreviewOpen] = useState(true);

    const supabase = createClient();

    // Load settings
    const loadSettings = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: chatbots } = await supabase
                .from("chatbots")
                .select("id, widget_settings(*)")
                .eq("user_id", user.id)
                .limit(1);

            if (chatbots && chatbots[0]) {
                setChatbotId(chatbots[0].id);
                // widget_settings comes back as array from join, take first item
                const wsArray = chatbots[0].widget_settings as unknown as Array<Record<string, unknown>>;
                const ws = wsArray && wsArray.length > 0 ? wsArray[0] : null;
                if (ws) {
                    setSettings({
                        primaryColor: (ws.primary_color as string) || defaultSettings.primaryColor,
                        secondaryColor: (ws.secondary_color as string) || defaultSettings.secondaryColor,
                        backgroundColor: (ws.background_color as string) || defaultSettings.backgroundColor,
                        textColor: (ws.text_color as string) || defaultSettings.textColor,
                        userBubbleColor: (ws.user_bubble_color as string) || defaultSettings.userBubbleColor,
                        botBubbleColor: (ws.bot_bubble_color as string) || defaultSettings.botBubbleColor,
                        themePreset: (ws.theme_preset as string) || defaultSettings.themePreset,
                        position: (ws.position as "bottom-right" | "bottom-left") || defaultSettings.position,
                        bubbleSize: (ws.bubble_size as "small" | "medium" | "large") || defaultSettings.bubbleSize,
                        chatWidth: (ws.chat_width as number) || defaultSettings.chatWidth,
                        chatHeight: (ws.chat_height as number) || defaultSettings.chatHeight,
                        botName: (ws.bot_name as string) || defaultSettings.botName,
                        botAvatarUrl: (ws.bot_avatar_url as string) || defaultSettings.botAvatarUrl,
                        welcomeMessage: (ws.welcome_message as string) || defaultSettings.welcomeMessage,
                        placeholderText: (ws.placeholder_text as string) || defaultSettings.placeholderText,
                        showBranding: (ws.show_branding as boolean) ?? defaultSettings.showBranding,
                        autoOpen: (ws.auto_open as boolean) ?? defaultSettings.autoOpen,
                        autoOpenDelay: (ws.auto_open_delay as number) ?? defaultSettings.autoOpenDelay,
                        showTypingIndicator: (ws.show_typing_indicator as boolean) ?? defaultSettings.showTypingIndicator,
                        enableSounds: (ws.enable_sounds as boolean) ?? defaultSettings.enableSounds,
                        customCss: (ws.custom_css as string) || defaultSettings.customCss,
                        allowedDomains: (ws.allowed_domains as string[]) || defaultSettings.allowedDomains,
                    });
                }
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const saveSettings = async () => {
        if (!chatbotId) return;
        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from("widget_settings")
                .update({
                    primary_color: settings.primaryColor,
                    secondary_color: settings.secondaryColor,
                    background_color: settings.backgroundColor,
                    text_color: settings.textColor,
                    user_bubble_color: settings.userBubbleColor,
                    bot_bubble_color: settings.botBubbleColor,
                    theme_preset: settings.themePreset,
                    position: settings.position,
                    bubble_size: settings.bubbleSize,
                    chat_width: settings.chatWidth,
                    chat_height: settings.chatHeight,
                    bot_name: settings.botName,
                    bot_avatar_url: settings.botAvatarUrl || null,
                    welcome_message: settings.welcomeMessage,
                    placeholder_text: settings.placeholderText,
                    show_branding: settings.showBranding,
                    auto_open: settings.autoOpen,
                    auto_open_delay: settings.autoOpenDelay,
                    show_typing_indicator: settings.showTypingIndicator,
                    enable_sounds: settings.enableSounds,
                    custom_css: settings.customCss || null,
                    allowed_domains: settings.allowedDomains,
                })
                .eq("chatbot_id", chatbotId);

            if (error) throw error;

            setMessage({ type: "success", text: "Widget settings saved!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error saving:", error);
            setMessage({ type: "error", text: "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    const applyTheme = (themeId: string) => {
        const theme = themePresets.find((t) => t.id === themeId);
        if (theme) {
            setSettings({
                ...settings,
                themePreset: themeId,
                primaryColor: theme.colors.primary,
                secondaryColor: theme.colors.secondary,
                backgroundColor: theme.colors.background,
                textColor: theme.colors.text,
                userBubbleColor: theme.colors.userBubble,
                botBubbleColor: theme.colors.botBubble,
            });
        }
    };

    const tabs = [
        { id: "appearance", label: "Appearance", icon: "🎨" },
        { id: "branding", label: "Branding", icon: "✨" },
        { id: "behavior", label: "Behavior", icon: "⚡" },
        { id: "advanced", label: "Advanced", icon: "🔧" },
    ];

    const bubbleSizes = {
        small: { button: 48, icon: 24 },
        medium: { button: 60, icon: 28 },
        large: { button: 72, icon: 32 },
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-120px)] flex gap-6">
            {/* Settings Panel */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Widget Builder</h1>
                        <p className="text-slate-600 dark:text-slate-400">Customize your chat widget appearance</p>
                    </div>
                    <button
                        onClick={saveSettings}
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
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
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
                <div className="card p-6 flex-1 overflow-y-auto">
                    {/* Appearance Tab */}
                    {activeTab === "appearance" && (
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
                                                {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                                                        style={{ backgroundColor: color }}
                                                    />
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
                                                    value={settings[key as keyof WidgetSettings] as string}
                                                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value, themePreset: "custom" })}
                                                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                                                />
                                                <input
                                                    type="text"
                                                    value={settings[key as keyof WidgetSettings] as string}
                                                    onChange={(e) => setSettings({ ...settings, [key]: e.target.value, themePreset: "custom" })}
                                                    className="input flex-1 font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Position & Size */}
                            <div>
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Position & Size</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-2">Widget Position</label>
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

                                    <div>
                                        <label className="block text-xs text-slate-500 mb-2">Button Size</label>
                                        <div className="flex gap-3">
                                            {(["small", "medium", "large"] as const).map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSettings({ ...settings, bubbleSize: size })}
                                                    className={`flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-all capitalize ${settings.bubbleSize === size
                                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600"
                                                        : "border-slate-200 dark:border-slate-700 text-slate-600"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Chat Width (px)</label>
                                            <input
                                                type="number"
                                                value={settings.chatWidth}
                                                onChange={(e) => setSettings({ ...settings, chatWidth: parseInt(e.target.value) || 380 })}
                                                className="input"
                                                min={300}
                                                max={500}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Chat Height (px)</label>
                                            <input
                                                type="number"
                                                value={settings.chatHeight}
                                                onChange={(e) => setSettings({ ...settings, chatHeight: parseInt(e.target.value) || 600 })}
                                                className="input"
                                                min={400}
                                                max={800}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Branding Tab */}
                    {activeTab === "branding" && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Bot Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.botName}
                                    onChange={(e) => setSettings({ ...settings, botName: e.target.value })}
                                    className="input"
                                    placeholder="AI Assistant"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Bot Avatar URL
                                </label>
                                <input
                                    type="url"
                                    value={settings.botAvatarUrl}
                                    onChange={(e) => setSettings({ ...settings, botAvatarUrl: e.target.value })}
                                    className="input"
                                    placeholder="https://example.com/avatar.png"
                                />
                                <p className="text-xs text-slate-500 mt-1">Leave empty to use the default bot icon</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Welcome Message
                                </label>
                                <textarea
                                    value={settings.welcomeMessage}
                                    onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                                    className="input min-h-[100px]"
                                    placeholder="Hi there! How can I help you today?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Input Placeholder
                                </label>
                                <input
                                    type="text"
                                    value={settings.placeholderText}
                                    onChange={(e) => setSettings({ ...settings, placeholderText: e.target.value })}
                                    className="input"
                                    placeholder="Type your message..."
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Show Branding</p>
                                    <p className="text-sm text-slate-500">Display &quot;Powered by AutoMax AI&quot;</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, showBranding: !settings.showBranding })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showBranding ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showBranding ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Behavior Tab */}
                    {activeTab === "behavior" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Auto-Open Chat</p>
                                    <p className="text-sm text-slate-500">Automatically open chat after a delay</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, autoOpen: !settings.autoOpen })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoOpen ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoOpen ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {settings.autoOpen && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Auto-Open Delay (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.autoOpenDelay}
                                        onChange={(e) => setSettings({ ...settings, autoOpenDelay: parseInt(e.target.value) || 3 })}
                                        className="input"
                                        min={1}
                                        max={60}
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Typing Indicator</p>
                                    <p className="text-sm text-slate-500">Show animation while bot is responding</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, showTypingIndicator: !settings.showTypingIndicator })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showTypingIndicator ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showTypingIndicator ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">Sound Effects</p>
                                    <p className="text-sm text-slate-500">Play sounds on new messages</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, enableSounds: !settings.enableSounds })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableSounds ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableSounds ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Advanced Tab */}
                    {activeTab === "advanced" && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Custom CSS
                                </label>
                                <textarea
                                    value={settings.customCss}
                                    onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
                                    className="input min-h-[200px] font-mono text-sm"
                                    placeholder={`/* Custom styles for the widget */\n.widget-container {\n  /* your styles here */\n}`}
                                />
                                <p className="text-xs text-slate-500 mt-1">Add custom CSS to override widget styles</p>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                <h3 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Domain Whitelist (Pro Feature)
                                </h3>
                                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                    Restrict which domains can embed your chatbot. Available on Pro plans.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Live Preview */}
            <div className="w-[420px] flex-shrink-0">
                <div className="sticky top-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Live Preview</h2>
                        <button
                            onClick={() => setPreviewOpen(!previewOpen)}
                            className="text-sm text-primary-600 hover:underline"
                        >
                            {previewOpen ? "Close Preview" : "Open Preview"}
                        </button>
                    </div>

                    {/* Preview Container */}
                    <div
                        className="relative rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                            backgroundColor: "#f1f5f9",
                            height: "600px",
                        }}
                    >
                        {/* Website Background */}
                        <div className="absolute inset-0 p-4">
                            <div className="h-4 w-32 bg-slate-300 rounded mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-slate-200 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                            </div>
                        </div>

                        {/* Chat Widget */}
                        {previewOpen && (
                            <div
                                className="absolute shadow-2xl rounded-2xl overflow-hidden flex flex-col"
                                style={{
                                    width: `${Math.min(settings.chatWidth, 380)}px`,
                                    height: `${Math.min(settings.chatHeight, 520)}px`,
                                    backgroundColor: settings.backgroundColor,
                                    [settings.position === "bottom-right" ? "right" : "left"]: "16px",
                                    bottom: "80px",
                                }}
                            >
                                {/* Header */}
                                <div
                                    className="p-4 flex items-center gap-3"
                                    style={{ backgroundColor: settings.primaryColor }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        {settings.botAvatarUrl ? (
                                            <img src={settings.botAvatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white">{settings.botName}</p>
                                        <p className="text-xs text-white/70">Online</p>
                                    </div>
                                    <button className="text-white/70 hover:text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ color: settings.textColor }}>
                                    {/* Bot Welcome */}
                                    <div className="flex gap-2">
                                        <div
                                            className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2"
                                            style={{ backgroundColor: settings.botBubbleColor }}
                                        >
                                            <p className="text-sm">{settings.welcomeMessage}</p>
                                        </div>
                                    </div>

                                    {/* User Message */}
                                    <div className="flex justify-end">
                                        <div
                                            className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2 text-white"
                                            style={{ backgroundColor: settings.userBubbleColor }}
                                        >
                                            <p className="text-sm">Hi! I have a question</p>
                                        </div>
                                    </div>

                                    {/* Bot Response */}
                                    <div className="flex gap-2">
                                        <div
                                            className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2"
                                            style={{ backgroundColor: settings.botBubbleColor }}
                                        >
                                            <p className="text-sm">Of course! I&apos;d be happy to help. What would you like to know?</p>
                                        </div>
                                    </div>

                                    {/* Typing Indicator */}
                                    {settings.showTypingIndicator && (
                                        <div className="flex gap-2">
                                            <div
                                                className="rounded-2xl rounded-bl-md px-4 py-3"
                                                style={{ backgroundColor: settings.botBubbleColor }}
                                            >
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t" style={{ borderColor: settings.botBubbleColor }}>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={settings.placeholderText}
                                            className="flex-1 px-4 py-2 rounded-full border text-sm bg-transparent"
                                            style={{ borderColor: settings.botBubbleColor, color: settings.textColor }}
                                            readOnly
                                        />
                                        <button
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: settings.primaryColor }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Branding */}
                                    {settings.showBranding && (
                                        <p className="text-center text-xs text-slate-400 mt-2">
                                            Powered by AutoMax AI
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Chat Button */}
                        <button
                            onClick={() => setPreviewOpen(!previewOpen)}
                            className="absolute flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
                            style={{
                                backgroundColor: settings.primaryColor,
                                width: `${bubbleSizes[settings.bubbleSize].button}px`,
                                height: `${bubbleSizes[settings.bubbleSize].button}px`,
                                borderRadius: "50%",
                                [settings.position === "bottom-right" ? "right" : "left"]: "16px",
                                bottom: "16px",
                            }}
                        >
                            {previewOpen ? (
                                <svg
                                    className="transition-transform"
                                    style={{ width: `${bubbleSizes[settings.bubbleSize].icon}px`, height: `${bubbleSizes[settings.bubbleSize].icon}px` }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg
                                    style={{ width: `${bubbleSizes[settings.bubbleSize].icon}px`, height: `${bubbleSizes[settings.bubbleSize].icon}px` }}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11ZM16 11C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13C15.45 13 15 12.55 15 12C15 11.45 15.45 11 16 11ZM12 18C9.24 18 6.86 16.41 5.73 14H18.27C17.14 16.41 14.76 18 12 18Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Message */}
            {message && (
                <div
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg font-medium z-50 ${message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}
