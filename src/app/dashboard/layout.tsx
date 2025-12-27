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
    const [agents, setAgents] = useState<AgentInfo[]>([]);
    const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
    const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
    const [workspaceSearch, setWorkspaceSearch] = useState("");
    const [agentSearch, setAgentSearch] = useState("");
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

    const loadAgents = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from("chatbots")
                .select("id, name")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (data) {
                setAgents(data);
            }
        }
    }, [supabase]);

    useEffect(() => {
        loadUserData();
        loadAgents();
    }, [loadUserData, loadAgents]);

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

    const filteredAgents = agents.filter(a =>
        a.name.toLowerCase().includes(agentSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
            {/* Top Header Bar */}
            <header className="h-12 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 bg-white dark:bg-slate-900 z-50">
                {/* Logo */}
                <Link href="/dashboard/agents" className="flex items-center gap-2 mr-4">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        M
                    </div>
                </Link>

                {/* Workspace Selector */}
                <div className="relative">
                    <button
                        onClick={() => { setWorkspaceDropdownOpen(!workspaceDropdownOpen); setAgentDropdownOpen(false); }}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="font-medium text-sm text-slate-800 dark:text-white truncate max-w-[150px]">
                            {workspaceName.toUpperCase()}&apos;S...
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                            Free
                        </span>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </button>

                    {workspaceDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                            <div className="px-3 pb-2">
                                <div className="relative">
                                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search workspace..."
                                        value={workspaceSearch}
                                        onChange={(e) => setWorkspaceSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                            <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between">
                                <span className="text-slate-800 dark:text-white truncate">{workspaceName.toUpperCase()}&apos;S works...</span>
                                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                            <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                                <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create or join workspace
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <span className="text-slate-300 dark:text-slate-700 mx-2">/</span>

                {/* Agent Selector */}
                <div className="relative">
                    <button
                        onClick={() => { setAgentDropdownOpen(!agentDropdownOpen); setWorkspaceDropdownOpen(false); }}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="font-medium text-sm text-slate-800 dark:text-white truncate max-w-[150px]">
                            {currentAgent?.name || (agents[0]?.name || "No Agent")}
                        </span>
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                            Agent
                        </span>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </button>

                    {agentDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                            <div className="px-3 pb-2">
                                <div className="relative">
                                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search Agent..."
                                        value={agentSearch}
                                        onChange={(e) => setAgentSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                {filteredAgents.map((agent) => (
                                    <Link
                                        key={agent.id}
                                        href={`/dashboard/agents/${agent.id}`}
                                        onClick={() => setAgentDropdownOpen(false)}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between"
                                    >
                                        <span className="text-slate-800 dark:text-white truncate">{agent.name}</span>
                                        {(currentAgent?.id === agent.id || (!currentAgent && agents[0]?.id === agent.id)) && (
                                            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </Link>
                                ))}
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                                <Link
                                    href="/dashboard/agents"
                                    onClick={() => setAgentDropdownOpen(false)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-600 dark:text-slate-400"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create agent
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side Icons */}
                <div className="ml-auto flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-medium ml-2">
                        {userData?.email?.charAt(0).toUpperCase() || "U"}
                    </div>
                </div>
            </header>

            {/* Main Layout with Sidebar */}
            <div className="flex-1 flex">
                {/* Sidebar */}
                <aside className="w-64 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-slate-900">

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
        </div>
    );
}
