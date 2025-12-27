// Widget Configuration API Endpoint
// Returns widget settings for a specific chatbot

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client lazily to avoid build-time errors
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

interface WidgetConfig {
    botName: string;
    botAvatarUrl: string | null;
    welcomeMessage: string;
    placeholderText: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    userBubbleColor: string;
    botBubbleColor: string;
    position: string;
    bubbleSize: string;
    chatWidth: number;
    chatHeight: number;
    showBranding: boolean;
    autoOpen: boolean;
    autoOpenDelay: number;
    showTypingIndicator: boolean;
    enableSounds: boolean;
    customCss: string | null;
    themePreset: string;
}

type RouteContext = { params: Promise<{ chatbotId: string }> };

export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const supabase = getSupabase();
        const { chatbotId } = await context.params;

        if (!chatbotId) {
            return NextResponse.json(
                { error: 'Chatbot ID is required' },
                { status: 400 }
            );
        }

        // Get origin for CORS
        const origin = request.headers.get('origin');

        // Get chatbot and widget settings
        const { data: chatbot, error } = await supabase
            .from('chatbots')
            .select('id, name, status, widget_settings(*)')
            .eq('id', chatbotId)
            .single();

        if (error || !chatbot) {
            return NextResponse.json(
                { error: 'Chatbot not found' },
                { status: 404 }
            );
        }

        if (chatbot.status !== 'active') {
            return NextResponse.json(
                { error: 'Chatbot is not active' },
                { status: 403 }
            );
        }

        // Check domain whitelist
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const widgetSettings = chatbot.widget_settings as unknown as Record<string, unknown> | null;
        const allowedDomains = widgetSettings?.allowed_domains as string[] | undefined;
        if (allowedDomains?.length && origin) {
            const originHost = new URL(origin).hostname;
            const isAllowed = allowedDomains.some((domain: string) =>
                originHost === domain || originHost.endsWith(`.${domain}`)
            );
            if (!isAllowed) {
                return NextResponse.json(
                    { error: 'Domain not allowed' },
                    { status: 403 }
                );
            }
        }

        // Build widget configuration response
        const config: WidgetConfig = {
            botName: (widgetSettings?.bot_name as string) || 'AI Assistant',
            botAvatarUrl: (widgetSettings?.bot_avatar_url as string | null) || null,
            welcomeMessage: (widgetSettings?.welcome_message as string) || 'Hi there! 👋 How can I help you today?',
            placeholderText: (widgetSettings?.placeholder_text as string) || 'Type your message...',
            primaryColor: (widgetSettings?.primary_color as string) || '#7c3aed',
            secondaryColor: (widgetSettings?.secondary_color as string) || '#6366f1',
            backgroundColor: (widgetSettings?.background_color as string) || '#ffffff',
            textColor: (widgetSettings?.text_color as string) || '#1e293b',
            userBubbleColor: (widgetSettings?.user_bubble_color as string) || '#7c3aed',
            botBubbleColor: (widgetSettings?.bot_bubble_color as string) || '#f1f5f9',
            position: (widgetSettings?.position as string) || 'bottom-right',
            bubbleSize: (widgetSettings?.bubble_size as string) || 'medium',
            chatWidth: (widgetSettings?.chat_width as number) || 380,
            chatHeight: (widgetSettings?.chat_height as number) || 600,
            showBranding: (widgetSettings?.show_branding as boolean) ?? true,
            autoOpen: (widgetSettings?.auto_open as boolean) || false,
            autoOpenDelay: (widgetSettings?.auto_open_delay as number) || 3,
            showTypingIndicator: (widgetSettings?.show_typing_indicator as boolean) ?? true,
            enableSounds: (widgetSettings?.enable_sounds as boolean) || false,
            customCss: (widgetSettings?.custom_css as string | null) || null,
            themePreset: (widgetSettings?.theme_preset as string) || 'default',
        };

        return NextResponse.json({ config }, {
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Cache-Control': 'public, max-age=60', // Cache for 1 minute
            }
        });
    } catch (error) {
        console.error('Widget config error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');

    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}
