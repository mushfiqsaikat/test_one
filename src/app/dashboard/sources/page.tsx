"use client";

import { useState } from "react";

export default function SourcesPage() {
    const [activeTab, setActiveTab] = useState<"text" | "files" | "website">("text");

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Sources</h1>
                <p className="text-slate-600 dark:text-slate-400">Train your chatbot with your data</p>
            </div>

            {/* Training Status */}
            <div className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Trained
                    </span>
                    <span className="text-sm text-slate-500">0 characters • 0 sources</span>
                </div>
                <button className="btn-primary">Retrain Chatbot</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
                {[
                    { id: "text", label: "Text", icon: "📝" },
                    { id: "files", label: "Files", icon: "📄" },
                    { id: "website", label: "Website", icon: "🌐" },
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

            {/* Content */}
            {activeTab === "text" && (
                <div className="card p-6">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Add Text</h3>
                    <textarea
                        placeholder="Enter FAQ, knowledge base content, or any text you want your chatbot to know..."
                        className="w-full h-48 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                    <div className="flex justify-end mt-4">
                        <button className="btn-primary">Add Text</button>
                    </div>
                </div>
            )}

            {activeTab === "files" && (
                <div className="card p-6">
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Upload files</h3>
                        <p className="text-slate-500 mb-4">Drag & drop files here, or click to browse</p>
                        <p className="text-sm text-slate-400">Supports PDF, DOCX, TXT (max 10MB)</p>
                        <button className="btn-primary mt-4">Browse Files</button>
                    </div>
                </div>
            )}

            {activeTab === "website" && (
                <div className="card p-6">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Crawl Website</h3>
                    <div className="flex gap-3">
                        <input
                            type="url"
                            placeholder="https://example.com"
                            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button className="btn-primary">Fetch Links</button>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">We&apos;ll crawl the website and extract content for training</p>
                </div>
            )}

            {/* Sources List */}
            <div className="card p-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Added Sources</h3>
                <div className="text-center py-8">
                    <p className="text-slate-500">No sources added yet</p>
                </div>
            </div>
        </div>
    );
}
