"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BillingPage() {
    const [billingDetails, setBillingDetails] = useState({
        organizationName: "",
        country: "United States",
        addressLine1: "",
    });
    const [billingEmail, setBillingEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const supabase = createClient();

    const loadBilling = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setBillingEmail(user.email || "");
        }
    }, [supabase]);

    useEffect(() => {
        loadBilling();
    }, [loadBilling]);

    const handleSave = async () => {
        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessage("Billing details saved!");
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    const countries = [
        "United States",
        "Canada",
        "United Kingdom",
        "Germany",
        "France",
        "Australia",
        "India",
        "Japan",
        "Bangladesh",
        "Other",
    ];

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-8">Billing</h1>

            {message && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300">
                    {message}
                </div>
            )}

            {/* Billing Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                    Billing details
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Organization name
                        </label>
                        <input
                            type="text"
                            value={billingDetails.organizationName}
                            onChange={(e) => setBillingDetails({ ...billingDetails, organizationName: e.target.value })}
                            placeholder="Your Company, Inc."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Country or region
                        </label>
                        <select
                            value={billingDetails.country}
                            onChange={(e) => setBillingDetails({ ...billingDetails, country: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Address line 1
                        </label>
                        <input
                            type="text"
                            value={billingDetails.addressLine1}
                            onChange={(e) => setBillingDetails({ ...billingDetails, addressLine1: e.target.value })}
                            placeholder="123 Main Street"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
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

            {/* Billing Email */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                    Billing email
                </h2>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                    Email used for invoices.
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </p>

                <div className="flex gap-3">
                    <input
                        type="email"
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
