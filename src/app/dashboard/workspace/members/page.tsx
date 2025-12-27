"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Member {
    id: string;
    email: string;
    role: "owner" | "admin" | "member";
    joined_at: string;
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const loadMembers = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // For now, just show the current user as owner
            setMembers([
                {
                    id: user.id,
                    email: user.email || "",
                    role: "owner",
                    joined_at: new Date().toISOString(),
                },
            ]);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    const roleColors = {
        owner: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        member: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">Members</h1>

            {/* Invite */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Invite team member
                </h2>
                <div className="flex gap-3">
                    <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100">
                        Invite
                    </button>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                    Team members can view and edit all agents in this workspace.
                </p>
            </div>

            {/* Members List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="font-semibold text-slate-800 dark:text-white">
                        {members.length} member{members.length !== 1 ? "s" : ""}
                    </h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-medium">
                                    {member.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-white">
                                        {member.email}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Joined {new Date(member.joined_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[member.role]}`}>
                                {member.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pro Notice */}
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-start gap-3">
                    <span className="text-xl">⭐</span>
                    <div>
                        <h3 className="font-medium text-amber-800 dark:text-amber-200">
                            Upgrade to add more members
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Free plan allows 1 member. Upgrade to Pro for unlimited team members.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
