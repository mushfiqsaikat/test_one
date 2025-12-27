// Chatbots API - CRUD operations for chatbots

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List all chatbots for the current user
export async function GET() {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get all chatbots with stats
        const { data: chatbots, error } = await supabase
            .from('chatbots')
            .select(`
                *,
                llm_configs(provider, model),
                widget_settings(primary_color, bot_name)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({ chatbots });
    } catch (error) {
        console.error('Error fetching chatbots:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chatbots' },
            { status: 500 }
        );
    }
}

// POST - Create a new chatbot
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        // Create chatbot (triggers will create default llm_configs and widget_settings)
        const { data: chatbot, error } = await supabase
            .from('chatbots')
            .insert({
                user_id: user.id,
                name,
                description: description || '',
            })
            .select(`
                *,
                llm_configs(*),
                widget_settings(*)
            `)
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ chatbot }, { status: 201 });
    } catch (error) {
        console.error('Error creating chatbot:', error);
        return NextResponse.json(
            { error: 'Failed to create chatbot' },
            { status: 500 }
        );
    }
}
