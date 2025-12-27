"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserData {
    email: string;
    credits_used: number;
    credits_limit: number;
}

interface AgentInfo {
    id: string;
    name: string;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentAgent, setCurrentAgent] = useState<AgentInfo | null>(null);
    const supabase = createClient();

    // Check if we're viewing an agent
    const agentMatch = pathname.match(/\/dashboard\/agents\/([^/]+)/);
    const isViewingAgent = !!agentMatch;
    const agentId = agentMatch?.[1];

    const loadUserData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { count } = await supabase
                .from("messages")
                .select("*", { count: "exact", head: true });

            setUserData({
                email: user.email || "",
                credits_used: count || 0,
                credits_limit: 50,
            });
        }
    }, [supabase]);

    const loadAgentInfo = useCallback(async () => {
        if (!agentId) {
            setCurrentAgent(null);
            return;
        }

        const { data } = await supabase
            .from("chatbots")
            .select("id, name")
            .eq("id", agentId)
            .single();

        if (data) {
            setCurrentAgent(data);
        }
    }, [agentId, supabase]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    useEffect(() => {
        loadAgentInfo();
    }, [loadAgentInfo]);

    useEffect(() => {
        if (pathname.startsWith("/dashboard/workspace")) {
            setSettingsOpen(true);
        }
    }, [pathname]);

    // Main workspace navigation
    const workspaceNavItems = [
        {
            name: "Agents",
            href: "/dashboard/agents",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M7 21v-2a2 2 0 012-2h6a2 2 0 012 2v2" />
                </svg>
            ),
        },
        {
            name: "Usage",
            href: "/dashboard/usage",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
    ];

    // Agent-specific navigation with modern SVG icons
    const agentNavItems = agentId ? [
        {
            name: "Playground",
            href: `/dashboard/agents/${agentId}?tab=playground`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
            ),
        },
        {
            name: "Activity",
            href: `/dashboard/agents/${agentId}?tab=activity`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
        },
        {
            name: "Sources",
            href: `/dashboard/agents/${agentId}?tab=sources`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
            ),
        },
        {
            name: "Actions",
            href: `/dashboard/agents/${agentId}?tab=actions`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },
        {
            name: "Deploy",
            href: `/dashboard/agents/${agentId}?tab=deploy`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
            ),
        },
        {
            name: "Widget",
            href: `/dashboard/agents/${agentId}?tab=widget`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            ),
        },
        {
            name: "Settings",
            href: `/dashboard/agents/${agentId}?tab=settings`,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
            ),
        },
    ] : [];

    const workspaceItems = [
        { name: "General", href: "/dashboard/workspace/general" },
        { name: "Members", href: "/dashboard/workspace/members" },
        { name: "Plans", href: "/dashboard/workspace/plans" },
        { name: "Billing", href: "/dashboard/workspace/billing" },
    ];

    const workspaceName = userData?.email?.split("@")[0] || "My Workspace";

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-900">
                {/* Workspace Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <Link href="/dashboard/agents" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm">
                            {workspaceName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white truncate text-sm">
                                {workspaceName.toUpperCase()}&apos;S...
                            </p>
                            <p className="text-xs text-slate-500">Free ⬇</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {isViewingAgent && currentAgent ? (
                        <>
                            {/* Back to Agents */}
                            <Link
                                href="/dashboard/agents"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Agents
                            </Link>

                            {/* Agent Name */}
                            <div className="px-3 py-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm">
                                        🤖
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-white truncate">
                                        {currentAgent.name}
                                    </span>
                                </div>
                            </div>

                            {/* Agent Navigation */}
                            {agentNavItems.map((item) => {
                                const tab = new URL(item.href, "http://localhost").searchParams.get("tab");
                                const currentTab = new URL(pathname + (typeof window !== "undefined" ? window.location.search : ""), "http://localhost").searchParams.get("tab");
                                const isActive = tab === currentTab || (!currentTab && tab === "playground");
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {/* Workspace Navigation */}
                            {workspaceNavItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                );
                            })}

                            {/* Workspace Settings */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setSettingsOpen(!settingsOpen)}
                                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/workspace")
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="3" />
                                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                                        </svg>
                                        Workspace settings
                                    </div>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${settingsOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {settingsOpen && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {workspaceItems.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive
                                                        ? "text-slate-900 dark:text-white font-medium"
                                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                                        }`}
                                                >
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </nav>

                {/* Credits & Upgrade */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Credits</span>
                            <span className="font-medium text-slate-800 dark:text-white">
                                {userData?.credits_used || 0} / {userData?.credits_limit || 50}
                            </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-600 rounded-full transition-all"
                                style={{
                                    width: `${Math.min(((userData?.credits_used || 0) / (userData?.credits_limit || 50)) * 100, 100)}%`,
                                }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Resets on Jan 1, 2026 at 6:00 AM
                        </p>
                    </div>

                    <Link
                        href="/dashboard/workspace/plans"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        Upgrade
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
