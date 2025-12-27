"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type SourceType = "text" | "file" | "website";

interface Source {
    id: string;
    type: SourceType;
    name: string;
    content?: string;
    website_url?: string;
    file_type?: string;
    file_size?: number;
    status: "pending" | "processing" | "trained" | "failed";
    char_count: number;
    created_at: string;
}

const typeIcons: Record<SourceType, string> = {
    text: "📝",
    file: "📄",
    website: "🌐",
};

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    trained: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function SourcesPage() {
    const [activeTab, setActiveTab] = useState<SourceType>("text");
    const [sources, setSources] = useState<Source[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [chatbotId, setChatbotId] = useState<string | null>(null);
    const supabase = createClient();

    // Form states
    const [textContent, setTextContent] = useState("");
    const [textName, setTextName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [websiteName, setWebsiteName] = useState("");

    // Load sources
    const loadSources = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user's chatbot
            const { data: chatbots } = await supabase
                .from("chatbots")
                .select("id")
                .eq("user_id", user.id)
                .limit(1);

            if (chatbots && chatbots[0]) {
                setChatbotId(chatbots[0].id);

                // Get sources
                const { data: sourcesData } = await supabase
                    .from("sources")
                    .select("*")
                    .eq("chatbot_id", chatbots[0].id)
                    .order("created_at", { ascending: false });

                if (sourcesData) {
                    setSources(sourcesData as Source[]);
                }
            }
        } catch (error) {
            console.error("Error loading sources:", error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadSources();
    }, [loadSources]);

    const addTextSource = async () => {
        if (!chatbotId || !textContent.trim()) return;
        setSaving(true);

        try {
            const { error } = await supabase.from("sources").insert({
                chatbot_id: chatbotId,
                type: "text",
                name: textName || `Text Source ${sources.filter(s => s.type === "text").length + 1}`,
                content: textContent,
                char_count: textContent.length,
                status: "trained",
            });

            if (!error) {
                setTextContent("");
                setTextName("");
                loadSources();
            }
        } catch (error) {
            console.error("Error adding text source:", error);
        } finally {
            setSaving(false);
        }
    };

    const addWebsiteSource = async () => {
        if (!chatbotId || !websiteUrl.trim()) return;
        setSaving(true);

        try {
            const { error } = await supabase.from("sources").insert({
                chatbot_id: chatbotId,
                type: "website",
                name: websiteName || new URL(websiteUrl).hostname,
                website_url: websiteUrl,
                status: "pending",
            });

            if (!error) {
                setWebsiteUrl("");
                setWebsiteName("");
                loadSources();
            }
        } catch (error) {
            console.error("Error adding website source:", error);
        } finally {
            setSaving(false);
        }
    };

    const deleteSource = async (id: string) => {
        if (!confirm("Are you sure you want to delete this source?")) return;

        try {
            await supabase.from("sources").delete().eq("id", id);
            loadSources();
        } catch (error) {
            console.error("Error deleting source:", error);
        }
    };

    const totalChars = sources.reduce((sum, s) => sum + s.char_count, 0);
    const trainedSources = sources.filter(s => s.status === "trained").length;

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
            {/* Header with Stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Knowledge Sources</h1>
                    <p className="text-slate-600 dark:text-slate-400">Train your chatbot with custom content</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                    <p className="text-3xl font-bold text-primary-600">{sources.length}</p>
                    <p className="text-sm text-slate-500">Total Sources</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{trainedSources}</p>
                    <p className="text-sm text-slate-500">Trained</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">
                        {totalChars > 1000 ? `${(totalChars / 1000).toFixed(1)}k` : totalChars}
                    </p>
                    <p className="text-sm text-slate-500">Characters</p>
                </div>
            </div>

            {/* Tab Selection */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {(["text", "file", "website"] as SourceType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === tab
                                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                            }`}
                    >
                        <span>{typeIcons[tab]}</span>
                        <span className="capitalize">{tab}</span>
                    </button>
                ))}
            </div>

            {/* Add Source Form */}
            <div className="card p-6">
                {activeTab === "text" && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <span>📝</span> Add Text Content
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Paste text content like FAQs, product descriptions, or documentation.
                        </p>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Source Name (optional)
                            </label>
                            <input
                                type="text"
                                value={textName}
                                onChange={(e) => setTextName(e.target.value)}
                                className="input"
                                placeholder="e.g., Product FAQs"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Content
                            </label>
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                className="input min-h-[200px] font-mono text-sm"
                                placeholder="Paste your text content here..."
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>{textContent.length.toLocaleString()} characters</span>
                                <span>Markdown supported</span>
                            </div>
                        </div>

                        <button
                            onClick={addTextSource}
                            disabled={saving || !textContent.trim()}
                            className="btn-primary w-full"
                        >
                            {saving ? "Adding..." : "Add Text Source"}
                        </button>
                    </div>
                )}

                {activeTab === "file" && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <span>📄</span> Upload Files
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Upload PDF, DOCX, or TXT files to train your chatbot.
                        </p>

                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                            <div className="text-4xl mb-4">📁</div>
                            <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Drag and drop files here
                            </p>
                            <p className="text-sm text-slate-500 mb-4">
                                Supports PDF, DOCX, TXT (max 10MB)
                            </p>
                            <label className="btn-secondary cursor-pointer inline-block">
                                Browse Files
                                <input type="file" className="hidden" accept=".pdf,.docx,.txt" />
                            </label>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                <strong>Coming Soon:</strong> File upload and processing will be available in Phase 5 with RAG implementation.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === "website" && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <span>🌐</span> Crawl Website
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Enter a URL and we&apos;ll fetch the content for training.
                        </p>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Source Name (optional)
                            </label>
                            <input
                                type="text"
                                value={websiteName}
                                onChange={(e) => setWebsiteName(e.target.value)}
                                className="input"
                                placeholder="e.g., Company Website"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Website URL
                            </label>
                            <input
                                type="url"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                className="input"
                                placeholder="https://example.com"
                            />
                        </div>

                        <button
                            onClick={addWebsiteSource}
                            disabled={saving || !websiteUrl.trim()}
                            className="btn-primary w-full"
                        >
                            {saving ? "Adding..." : "Add Website Source"}
                        </button>

                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>Note:</strong> Website crawling will be processed in Phase 5. For now, URLs are saved but not yet crawled.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Existing Sources */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Your Sources ({sources.length})
                </h2>

                {sources.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">📚</div>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">No sources yet</p>
                        <p className="text-sm text-slate-500">Add text, files, or websites to train your chatbot</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sources.map((source) => (
                            <div
                                key={source.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                            >
                                <div className="text-2xl">{typeIcons[source.type]}</div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-slate-800 dark:text-white truncate">
                                        {source.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="capitalize">{source.type}</span>
                                        <span>•</span>
                                        <span>{source.char_count.toLocaleString()} chars</span>
                                        {source.website_url && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate max-w-[200px]">{source.website_url}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[source.status]}`}>
                                    {source.status}
                                </span>

                                <button
                                    onClick={() => deleteSource(source.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
