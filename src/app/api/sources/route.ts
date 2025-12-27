// Sources API - CRUD operations for knowledge sources

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - List sources for a chatbot
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const chatbotId = searchParams.get('chatbotId');

        if (!chatbotId) {
            return NextResponse.json(
                { error: 'chatbotId is required' },
                { status: 400 }
            );
        }

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify user owns the chatbot
        const { data: chatbot } = await supabase
            .from('chatbots')
            .select('id')
            .eq('id', chatbotId)
            .eq('user_id', user.id)
            .single();

        if (!chatbot) {
            return NextResponse.json(
                { error: 'Chatbot not found' },
                { status: 404 }
            );
        }

        // Get sources
        const { data: sources, error } = await supabase
            .from('sources')
            .select('*')
            .eq('chatbot_id', chatbotId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ sources });
    } catch (error) {
        console.error('Error fetching sources:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sources' },
            { status: 500 }
        );
    }
}

// POST - Add a new source
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
        const { chatbotId, type, name, content, websiteUrl, crawlDepth } = body;

        if (!chatbotId || !type) {
            return NextResponse.json(
                { error: 'chatbotId and type are required' },
                { status: 400 }
            );
        }

        // Verify user owns the chatbot
        const { data: chatbot } = await supabase
            .from('chatbots')
            .select('id')
            .eq('id', chatbotId)
            .eq('user_id', user.id)
            .single();

        if (!chatbot) {
            return NextResponse.json(
                { error: 'Chatbot not found' },
                { status: 404 }
            );
        }

        // Prepare source data based on type
        const sourceData: Record<string, unknown> = {
            chatbot_id: chatbotId,
            type,
            name: name || `${type} source`,
            status: 'pending',
        };

        if (type === 'text') {
            if (!content) {
                return NextResponse.json(
                    { error: 'Content is required for text sources' },
                    { status: 400 }
                );
            }
            sourceData.content = content;
            sourceData.char_count = content.length;
            sourceData.status = 'trained'; // Text is immediately available
        } else if (type === 'website') {
            if (!websiteUrl) {
                return NextResponse.json(
                    { error: 'websiteUrl is required for website sources' },
                    { status: 400 }
                );
            }
            sourceData.website_url = websiteUrl;
            sourceData.crawl_depth = crawlDepth || 1;
            sourceData.status = 'pending'; // Will be processed asynchronously
        }

        // Insert source
        const { data: source, error } = await supabase
            .from('sources')
            .insert(sourceData)
            .select()
            .single();

        if (error) throw error;

        // TODO: For website sources, trigger async crawling job
        // For now, we'll just mark it as pending

        return NextResponse.json({ source }, { status: 201 });
    } catch (error) {
        console.error('Error creating source:', error);
        return NextResponse.json(
            { error: 'Failed to create source' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a source
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const sourceId = searchParams.get('id');

        if (!sourceId) {
            return NextResponse.json(
                { error: 'Source ID is required' },
                { status: 400 }
            );
        }

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify user owns the source (through chatbot)
        const { data: source } = await supabase
            .from('sources')
            .select('chatbot_id, chatbots!inner(user_id)')
            .eq('id', sourceId)
            .single();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chatbotData = source?.chatbots as unknown as { user_id: string } | null;
        if (!source || !chatbotData || chatbotData.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Source not found' },
                { status: 404 }
            );
        }

        // Delete source (cascade will delete embeddings)
        const { error } = await supabase
            .from('sources')
            .delete()
            .eq('id', sourceId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting source:', error);
        return NextResponse.json(
            { error: 'Failed to delete source' },
            { status: 500 }
        );
    }
}
