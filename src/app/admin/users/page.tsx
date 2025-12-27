"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface User {
    id: string;
    email: string;
    created_at: string;
    chatbot_count: number;
    message_count: number;
    status: "active" | "suspended";
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    const loadUsers = useCallback(async () => {
        try {
            // Get unique user IDs from chatbots table
            const { data: chatbots } = await supabase
                .from("chatbots")
                .select("user_id, id, total_messages");

            if (chatbots) {
                // Group by user_id
                const userMap = new Map<string, { chatbot_count: number; message_count: number }>();

                chatbots.forEach((bot) => {
                    const existing = userMap.get(bot.user_id) || { chatbot_count: 0, message_count: 0 };
                    userMap.set(bot.user_id, {
                        chatbot_count: existing.chatbot_count + 1,
                        message_count: existing.message_count + (bot.total_messages || 0),
                    });
                });

                const userList: User[] = Array.from(userMap.entries()).map(([userId, stats]) => ({
                    id: userId,
                    email: `User ${userId.substring(0, 8)}...`, // Placeholder
                    created_at: new Date().toISOString(),
                    chatbot_count: stats.chatbot_count,
                    message_count: stats.message_count,
                    status: "active" as const,
                }));

                setUsers(userList);
            }
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Users</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage user accounts and permissions
                    </p>
                </div>
                <div className="text-sm text-slate-500">
                    {users.length} total users
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by email or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Chatbots
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Messages
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {searchTerm ? "No users found matching your search" : "No users yet"}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-white">
                                                    {user.email}
                                                </p>
                                                <p className="text-sm text-slate-500 font-mono">
                                                    {user.id.substring(0, 20)}...
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-800 dark:text-white font-medium">
                                                {user.chatbot_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-800 dark:text-white font-medium">
                                                {user.message_count.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                    />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
