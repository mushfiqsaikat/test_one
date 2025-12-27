"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GeneralPage() {
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceUrl, setWorkspaceUrl] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const supabase = createClient();

    const loadWorkspace = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const name = user.email?.split("@")[0] || "My";
            setWorkspaceName(`${name.toUpperCase()}'s workspace`);
            setWorkspaceUrl(`${name.toLowerCase().replace(/\s+/g, "-")}-workspace`);
        }
    }, [supabase]);

    useEffect(() => {
        loadWorkspace();
    }, [loadWorkspace]);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessage("Settings saved!");
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">General</h1>

            {message && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300">
                    {message}
                </div>
            )}

            {/* Workspace Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Workspace details
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                            Workspace name
                        </label>
                        <input
                            type="text"
                            value={workspaceName}
                            onChange={(e) => setWorkspaceName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                            Workspace URL
                        </label>
                        <input
                            type="text"
                            value={workspaceUrl}
                            onChange={(e) => setWorkspaceUrl(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <p className="text-sm text-slate-400 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Changing the workspace URL will redirect you to the new address
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="text-center text-red-500 text-sm font-medium mb-4 tracking-wider">
                    DANGER ZONE
                </div>

                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Delete workspace
                </h3>
                <p className="text-slate-500 mb-4">
                    Once you delete your workspace, there is no going back. Please be certain.
                    <br />
                    All your uploaded data and trained agents will be deleted.
                </p>

                <div className="flex justify-end">
                    <button className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
