"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GeneralPage() {
    const [profileName, setProfileName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const supabase = createClient();

    const loadProfile = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const name = user.email?.split("@")[0] || "";
            setProfileName(name.charAt(0).toUpperCase() + name.slice(1));
            setEmail(user.email || "");
        }
    }, [supabase]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleSaveProfile = async () => {
        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match!" });
            setTimeout(() => setMessage(null), 3000);
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters!" });
            setTimeout(() => setMessage(null), 3000);
            return;
        }
        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">Account Settings</h1>

            {message && (
                <div className={`mb-6 p-4 rounded-xl border ${message.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Profile Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Profile Information
                </h2>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                            {profileName.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600">
                                Upload Photo
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Email and Password */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Email & Password
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Change Password</h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleChangePassword}
                                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50"
                            >
                                {saving ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                <div className="text-center text-red-500 text-xs font-semibold mb-4 tracking-wider uppercase">
                    Danger Zone
                </div>

                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Delete Account
                </h3>
                <p className="text-slate-500 mb-4">
                    Once you delete your account, there is no going back. All your data, agents, and settings will be permanently deleted.
                </p>

                <div className="flex justify-end">
                    <button className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
