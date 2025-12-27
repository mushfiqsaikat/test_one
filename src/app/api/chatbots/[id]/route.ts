// Individual Chatbot API - GET, PUT, DELETE operations

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ id: string }> };

// GET - Get a single chatbot with all related data
export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const supabase = await createClient();
        const { id } = await context.params;

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get chatbot with all related data
        const { data: chatbot, error } = await supabase
            .from('chatbots')
            .select(`
                *,
                llm_configs(*),
                widget_settings(*),
                sources(id, name, type, status, char_count, created_at)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !chatbot) {
            return NextResponse.json(
                { error: 'Chatbot not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ chatbot });
    } catch (error) {
        console.error('Error fetching chatbot:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chatbot' },
            { status: 500 }
        );
    }
}

// PUT - Update a chatbot and its related configurations
export async function PUT(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const supabase = await createClient();
        const { id } = await context.params;

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify ownership
        const { data: existing } = await supabase
            .from('chatbots')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (!existing) {
            return NextResponse.json(
                { error: 'Chatbot not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { chatbot: chatbotData, llmConfig, widgetSettings } = body;

        // Update chatbot basic info
        if (chatbotData) {
            const { error: chatbotError } = await supabase
                .from('chatbots')
                .update({
                    name: chatbotData.name,
                    description: chatbotData.description,
                    status: chatbotData.status,
                })
                .eq('id', id);

            if (chatbotError) throw chatbotError;
        }

        // Update LLM config
        if (llmConfig) {
            const updateData: Record<string, unknown> = {
                provider: llmConfig.provider,
                model: llmConfig.model,
                temperature: llmConfig.temperature,
                max_tokens: llmConfig.maxTokens,
                system_prompt: llmConfig.systemPrompt,
            };

            // Encrypt and store API key if provided
            if (llmConfig.apiKey) {
                updateData.api_key_encrypted = encryptApiKey(llmConfig.apiKey);
                updateData.use_platform_key = false;
            }

            const { error: llmError } = await supabase
                .from('llm_configs')
                .update(updateData)
                .eq('chatbot_id', id);

            if (llmError) throw llmError;
        }

        // Update widget settings
        if (widgetSettings) {
            const { error: widgetError } = await supabase
                .from('widget_settings')
                .update({
                    primary_color: widgetSettings.primaryColor,
                    secondary_color: widgetSettings.secondaryColor,
                    background_color: widgetSettings.backgroundColor,
                    text_color: widgetSettings.textColor,
                    user_bubble_color: widgetSettings.userBubbleColor,
                    bot_bubble_color: widgetSettings.botBubbleColor,
                    position: widgetSettings.position,
                    bubble_size: widgetSettings.bubbleSize,
                    chat_width: widgetSettings.chatWidth,
                    chat_height: widgetSettings.chatHeight,
                    bot_name: widgetSettings.botName,
                    bot_avatar_url: widgetSettings.botAvatarUrl,
                    welcome_message: widgetSettings.welcomeMessage,
                    placeholder_text: widgetSettings.placeholderText,
                    show_branding: widgetSettings.showBranding,
                    auto_open: widgetSettings.autoOpen,
                    auto_open_delay: widgetSettings.autoOpenDelay,
                    show_typing_indicator: widgetSettings.showTypingIndicator,
                    enable_sounds: widgetSettings.enableSounds,
                    allowed_domains: widgetSettings.allowedDomains,
                    custom_css: widgetSettings.customCss,
                    theme_preset: widgetSettings.themePreset,
                })
                .eq('chatbot_id', id);

            if (widgetError) throw widgetError;
        }

        // Fetch updated chatbot
        const { data: updatedChatbot } = await supabase
            .from('chatbots')
            .select(`
                *,
                llm_configs(*),
                widget_settings(*)
            `)
            .eq('id', id)
            .single();

        return NextResponse.json({ chatbot: updatedChatbot });
    } catch (error) {
        console.error('Error updating chatbot:', error);
        return NextResponse.json(
            { error: 'Failed to update chatbot' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a chatbot
export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const supabase = await createClient();
        const { id } = await context.params;

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Delete chatbot (cascade will handle related tables)
        const { error } = await supabase
            .from('chatbots')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting chatbot:', error);
        return NextResponse.json(
            { error: 'Failed to delete chatbot' },
            { status: 500 }
        );
    }
}

// Helper: Encrypt API key (simplified - use proper encryption in production)
function encryptApiKey(apiKey: string): string {
    // In production, use proper encryption with a secret key
    return Buffer.from(apiKey).toString('base64');
}
