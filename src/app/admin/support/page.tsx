"use client";

import { useState } from "react";

interface Ticket {
    id: string;
    subject: string;
    email: string;
    status: "open" | "in_progress" | "resolved" | "closed";
    priority: "low" | "medium" | "high";
    created_at: string;
    message: string;
}

// Demo tickets for display
const demoTickets: Ticket[] = [];

export default function SupportPage() {
    const [tickets] = useState<Ticket[]>(demoTickets);
    const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");

    const filteredTickets = tickets.filter((ticket) =>
        filter === "all" ? true : ticket.status === filter
    );

    const statusColors = {
        open: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        closed: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    };

    const priorityColors = {
        low: "text-slate-500",
        medium: "text-yellow-600",
        high: "text-red-600",
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Support Tickets</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage customer support requests
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">{tickets.length} total tickets</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(["all", "open", "in_progress", "resolved"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === status
                                ? "bg-primary-600 text-white"
                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                    >
                        {status === "all" ? "All" : status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Tickets List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {filteredTickets.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-5xl mb-4">🎫</div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                            No support tickets
                        </h3>
                        <p className="text-slate-500">
                            {filter === "all"
                                ? "When customers submit support requests, they will appear here."
                                : `No ${filter.replace("_", " ")} tickets found.`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-slate-800 dark:text-white">
                                                {ticket.subject}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[ticket.status]}`}>
                                                {ticket.status.replace("_", " ")}
                                            </span>
                                            <span className={`text-xs font-medium ${priorityColors[ticket.priority]}`}>
                                                {ticket.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{ticket.email}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                                            {ticket.message}
                                        </p>
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">ℹ️</div>
                    <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                            Support Ticket System
                        </h3>
                        <p className="text-blue-700 dark:text-blue-300 mt-1">
                            Support tickets will be collected from a contact form on the website.
                            You can respond to tickets via email or integrate with a helpdesk system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
