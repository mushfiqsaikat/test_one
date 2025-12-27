// Admin utilities for owner-only access

import { createClient } from "@/lib/supabase/server";

const OWNER_EMAIL = process.env.OWNER_EMAIL;

export async function isOwner(): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !OWNER_EMAIL) {
            return false;
        }

        return user.email === OWNER_EMAIL;
    } catch {
        return false;
    }
}

export async function getOwnerEmail(): Promise<string | undefined> {
    return OWNER_EMAIL;
}

export async function requireOwner(): Promise<{ isOwner: boolean; user: { id: string; email: string } | null }> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !OWNER_EMAIL) {
            return { isOwner: false, user: null };
        }

        const owner = user.email === OWNER_EMAIL;

        return {
            isOwner: owner,
            user: owner ? { id: user.id, email: user.email! } : null,
        };
    } catch {
        return { isOwner: false, user: null };
    }
}
