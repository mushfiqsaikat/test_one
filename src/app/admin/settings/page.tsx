"use client";

import { useState } from "react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        // Platform Settings
        platformName: "AutoMax AI",
        supportEmail: "support@automax.ai",

        // Default LLM Settings
        defaultProvider: "openai",
        defaultModel: "gpt-4o",
        defaultTemperature: 0.7,
        maxTokensLimit: 4096,

        // Rate Limits
        freeMessagesPerMonth: 100,
        starterMessagesPerMonth: 1000,
        proMessagesPerMonth: 10000,

        // Features
        allowCustomApiKeys: true,
        enableAnalytics: true,
        enableWebhooks: false,
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMessage("Settings saved successfully!");
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Platform configuration and defaults
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {message && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-green-700 dark:text-green-300">
                    {message}
                </div>
            )}

            {/* Platform Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Platform Settings
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Platform Name
                        </label>
                        <input
                            type="text"
                            value={settings.platformName}
                            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Support Email
                        </label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Default LLM Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Default LLM Settings
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Default Provider
                        </label>
                        <select
                            value={settings.defaultProvider}
                            onChange={(e) => setSettings({ ...settings, defaultProvider: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        >
                            <option value="openai">OpenAI</option>
                            <option value="anthropic">Anthropic</option>
                            <option value="google">Google AI</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Default Model
                        </label>
                        <input
                            type="text"
                            value={settings.defaultModel}
                            onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Default Temperature
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="2"
                            step="0.1"
                            value={settings.defaultTemperature}
                            onChange={(e) => setSettings({ ...settings, defaultTemperature: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Max Tokens Limit
                        </label>
                        <input
                            type="number"
                            value={settings.maxTokensLimit}
                            onChange={(e) => setSettings({ ...settings, maxTokensLimit: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Rate Limits */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Message Limits (per month)
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Free Plan
                        </label>
                        <input
                            type="number"
                            value={settings.freeMessagesPerMonth}
                            onChange={(e) => setSettings({ ...settings, freeMessagesPerMonth: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Starter Plan
                        </label>
                        <input
                            type="number"
                            value={settings.starterMessagesPerMonth}
                            onChange={(e) => setSettings({ ...settings, starterMessagesPerMonth: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Pro Plan
                        </label>
                        <input
                            type="number"
                            value={settings.proMessagesPerMonth}
                            onChange={(e) => setSettings({ ...settings, proMessagesPerMonth: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Feature Toggles
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white">Allow Custom API Keys</p>
                            <p className="text-sm text-slate-500">Let users bring their own LLM API keys</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, allowCustomApiKeys: !settings.allowCustomApiKeys })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allowCustomApiKeys ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowCustomApiKeys ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white">Enable Analytics</p>
                            <p className="text-sm text-slate-500">Track usage statistics and metrics</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, enableAnalytics: !settings.enableAnalytics })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableAnalytics ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableAnalytics ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                        <div>
                            <p className="font-medium text-slate-800 dark:text-white">Enable Webhooks</p>
                            <p className="text-sm text-slate-500">Allow webhook integrations for events</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, enableWebhooks: !settings.enableWebhooks })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableWebhooks ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableWebhooks ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
