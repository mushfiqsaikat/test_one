"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
            </div>

            {/* Profile Settings */}
            <div className="card">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Your name"
                            defaultValue=""
                        />
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
                    <button className="btn-primary mt-4">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Widget Settings */}
            <div className="card">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Widget Customization</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Primary Color
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                defaultValue="#7c3aed"
                                className="w-12 h-12 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700"
                            />
                            <input
                                type="text"
                                className="input flex-1"
                                defaultValue="#7c3aed"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Welcome Message
                        </label>
                        <textarea
                            className="input min-h-[100px]"
                            defaultValue="👋 Hello! I'm your AutoMax AI assistant. How can I help you today?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Widget Position
                        </label>
                        <select className="input">
                            <option value="right">Bottom Right</option>
                            <option value="left">Bottom Left</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* API Key */}
            <div className="card">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">API Access</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Use your API key to integrate AutoMax AI with your applications.
                </p>
                <div className="flex gap-3">
                    <input
                        type="password"
                        className="input flex-1 font-mono"
                        value="am_live_xxxxxxxxxxxxxxxxxxxxx"
                        readOnly
                    />
                    <button className="btn-secondary">
                        Copy
                    </button>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-500 font-medium mt-3">
                    Regenerate API Key
                </button>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-200 dark:border-red-900">
                <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-800 dark:text-white">Sign Out</p>
                        <p className="text-sm text-slate-500">Sign out of your account on this device</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? "Signing out..." : "Sign Out"}
                    </button>
                </div>
                <hr className="my-4 border-slate-200 dark:border-slate-700" />
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-800 dark:text-white">Delete Account</p>
                        <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>

            {message && (
                <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
                    {message}
                </div>
            )}
        </div>
    );
}
