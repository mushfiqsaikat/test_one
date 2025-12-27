// Main Chat API Endpoint
// Handles chat messages from the embeddable widget

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chat, stream, buildMessagesWithContext, Message } from '@/lib/llm';

// Create Supabase client lazily to avoid build-time errors
function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

interface ChatRequest {
    chatbotId: string;
    message: string;
    conversationId?: string;
    visitorId?: string;
    streaming?: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabase();
        const body: ChatRequest = await request.json();
        const { chatbotId, message, conversationId, visitorId, streaming = false } = body;

        // Validate required fields
        if (!chatbotId || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: chatbotId and message' },
                { status: 400 }
            );
        }

        // Validate origin/domain (optional security check)
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');

        // Get chatbot configuration
        const { data: chatbot, error: chatbotError } = await supabase
            .from('chatbots')
            .select('*, llm_configs(*), widget_settings(*)')
            .eq('id', chatbotId)
            .eq('status', 'active')
            .single();

        if (chatbotError || !chatbot) {
            return NextResponse.json(
                { error: 'Chatbot not found or inactive' },
                { status: 404 }
            );
        }

        // Check domain whitelist if configured
        const widgetSettings = chatbot.widget_settings;
        if (widgetSettings?.allowed_domains?.length > 0 && origin) {
            const originHost = new URL(origin).hostname;
            const isAllowed = widgetSettings.allowed_domains.some((domain: string) =>
                originHost === domain || originHost.endsWith(`.${domain}`)
            );
            if (!isAllowed) {
                return NextResponse.json(
                    { error: 'Domain not allowed' },
                    { status: 403 }
                );
            }
        }

        // Get or create conversation
        let activeConversationId = conversationId;

        if (!activeConversationId) {
            const { data: newConversation, error: convError } = await supabase
                .from('conversations')
                .insert({
                    chatbot_id: chatbotId,
                    visitor_id: visitorId || generateVisitorId(),
                    metadata: {
                        origin,
                        referer,
                        userAgent: request.headers.get('user-agent'),
                    }
                })
                .select()
                .single();

            if (convError) {
                console.error('Error creating conversation:', convError);
                return NextResponse.json(
                    { error: 'Failed to create conversation' },
                    { status: 500 }
                );
            }

            activeConversationId = newConversation.id;
        }

        // Get conversation history
        const { data: historyMessages } = await supabase
            .from('messages')
            .select('role, content')
            .eq('conversation_id', activeConversationId)
            .order('created_at', { ascending: true })
            .limit(20);

        const conversationHistory: Message[] = (historyMessages || []).map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content
        }));

        // Get relevant context from embeddings (RAG)
        const contextChunks = await getRelevantContext(chatbotId, message);

        // Build LLM configuration
        const llmConfig = chatbot.llm_configs;
        if (!llmConfig || !llmConfig.api_key_encrypted) {
            return NextResponse.json(
                { error: 'Chatbot LLM not configured' },
                { status: 400 }
            );
        }

        // Decrypt API key (in production, use proper encryption)
        const apiKey = decryptApiKey(llmConfig.api_key_encrypted);

        // Build messages with context
        const messages = buildMessagesWithContext(
            message,
            conversationHistory,
            contextChunks,
            llmConfig.system_prompt || 'You are a helpful AI assistant.'
        );

        // Save user message
        await supabase.from('messages').insert({
            conversation_id: activeConversationId,
            chatbot_id: chatbotId,
            role: 'user',
            content: message,
        });

        const startTime = Date.now();

        if (streaming) {
            // Return streaming response
            const encoder = new TextEncoder();
            const readable = new ReadableStream({
                async start(controller) {
                    try {
                        let fullResponse = '';

                        for await (const chunk of stream(messages, {
                            provider: llmConfig.provider,
                            model: llmConfig.model,
                            apiKey,
                            temperature: llmConfig.temperature,
                            maxTokens: llmConfig.max_tokens,
                        })) {
                            fullResponse += chunk.content;
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));

                            if (chunk.done) {
                                // Save assistant message
                                await supabase.from('messages').insert({
                                    conversation_id: activeConversationId,
                                    chatbot_id: chatbotId,
                                    role: 'assistant',
                                    content: fullResponse,
                                    response_time_ms: Date.now() - startTime,
                                });
                            }
                        }

                        controller.close();
                    } catch (error) {
                        console.error('Streaming error:', error);
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`));
                        controller.close();
                    }
                }
            });

            return new Response(readable, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': origin || '*',
                },
            });
        } else {
            // Return regular JSON response
            const response = await chat(messages, {
                provider: llmConfig.provider,
                model: llmConfig.model,
                apiKey,
                temperature: llmConfig.temperature,
                maxTokens: llmConfig.max_tokens,
            });

            // Save assistant message
            await supabase.from('messages').insert({
                conversation_id: activeConversationId,
                chatbot_id: chatbotId,
                role: 'assistant',
                content: response.content,
                tokens_used: response.tokensUsed,
                response_time_ms: Date.now() - startTime,
            });

            return NextResponse.json({
                response: response.content,
                conversationId: activeConversationId,
                tokensUsed: response.tokensUsed,
            }, {
                headers: {
                    'Access-Control-Allow-Origin': origin || '*',
                }
            });
        }
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
}

// Helper: Get relevant context from embeddings
async function getRelevantContext(chatbotId: string, _query: string): Promise<string[]> {
    try {
        // For now, return empty array
        // TODO: Implement embedding generation and similarity search
        // 1. Generate embedding for query using OpenAI embeddings API
        // 2. Call match_embeddings function to find similar chunks
        // 3. Return top chunks as context

        // Placeholder for text-based search
        const supabase = getSupabase();
        const { data: sources } = await supabase
            .from('sources')
            .select('content')
            .eq('chatbot_id', chatbotId)
            .eq('status', 'trained')
            .not('content', 'is', null)
            .limit(3);

        if (sources && sources.length > 0) {
            return sources.map((s: { content: string }) => s.content).filter(Boolean);
        }

        return [];
    } catch (error) {
        console.error('Error getting context:', error);
        return [];
    }
}

// Helper: Generate visitor ID
function generateVisitorId(): string {
    return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Helper: Decrypt API key (simplified - use proper encryption in production)
function decryptApiKey(encrypted: string): string {
    // In production, use proper encryption/decryption
    // For now, we'll store keys with basic encoding
    try {
        return Buffer.from(encrypted, 'base64').toString('utf-8');
    } catch {
        return encrypted;
    }
}
