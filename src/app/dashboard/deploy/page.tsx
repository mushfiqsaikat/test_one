"use client";

import { useState } from "react";

export default function DeployPage() {
    const [activeTab, setActiveTab] = useState<"embed" | "bubble" | "api">("embed");
    const [position, setPosition] = useState("right");
    const [primaryColor, setPrimaryColor] = useState("#7c3aed");

    const embedCode = `<script>
  window.autoMaxConfig = {
    chatbotId: "your-chatbot-id",
    position: "${position}",
    primaryColor: "${primaryColor}"
  };
</script>
<script src="https://cdn.automax.ai/widget.js" defer></script>`;

    const iframeCode = `<iframe
  src="https://automax.ai/embed/your-chatbot-id"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Deploy</h1>
                <p className="text-slate-600 dark:text-slate-400">Add your chatbot to your website in minutes</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
                {[
                    { id: "embed", label: "Embed Widget", icon: "🔗" },
                    { id: "bubble", label: "Chat Bubble", icon: "💬" },
                    { id: "api", label: "API", icon: "⚡" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
                                ? "border-primary-600 text-primary-600"
                                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left - Code & Settings */}
                <div className="space-y-6">
                    {activeTab === "embed" && (
                        <>
                            <div className="card p-4">
                                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Embed Code</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Copy and paste this code into your website&apos;s HTML, just before the closing <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">&lt;/body&gt;</code> tag.
                                </p>
                                <div className="relative">
                                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                        {embedCode}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(embedCode)}
                                        className="absolute top-3 right-3 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="card p-4">
                                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Widget Settings</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Position</label>
                                        <div className="flex gap-2">
                                            {["left", "right"].map((pos) => (
                                                <button
                                                    key={pos}
                                                    onClick={() => setPosition(pos)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${position === pos
                                                            ? "bg-primary-600 text-white"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                        }`}
                                                >
                                                    Bottom {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Primary Color</label>
                                        <div className="flex gap-3 items-center">
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                                            />
                                            <input
                                                type="text"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-0 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "bubble" && (
                        <div className="card p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Chat Bubble</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                A floating chat bubble that appears in the corner of your website.
                            </p>
                            <div className="relative">
                                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                    {embedCode}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(embedCode)}
                                    className="absolute top-3 right-3 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "api" && (
                        <div className="card p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">API Access</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Use our REST API to integrate the chatbot into your applications.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">API Endpoint</label>
                                    <div className="flex gap-2">
                                        <code className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                                            https://api.automax.ai/v1/chat
                                        </code>
                                        <button className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm">
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">API Key</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            value="am_live_xxxxxxxxxxxxxxxxxxxxx"
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-mono"
                                        />
                                        <button className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm">
                                            Show
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Example Request</label>
                                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                        {`curl -X POST https://api.automax.ai/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello!"}'`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Iframe option */}
                    {activeTab === "embed" && (
                        <div className="card p-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Or use Iframe</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Embed the chatbot as a full iframe on your page.
                            </p>
                            <div className="relative">
                                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                    {iframeCode}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(iframeCode)}
                                    className="absolute top-3 right-3 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right - Preview */}
                <div className="card p-4">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Preview</h3>
                    <div className="relative bg-slate-100 dark:bg-slate-800 rounded-xl h-[500px] overflow-hidden">
                        {/* Fake website background */}
                        <div className="absolute inset-0 p-4">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                            </div>
                            <div className="mt-8 h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>

                        {/* Chat bubble */}
                        <div className={`absolute bottom-4 ${position === "right" ? "right-4" : "left-4"}`}>
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
