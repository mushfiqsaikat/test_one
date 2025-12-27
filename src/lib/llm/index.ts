// LLM Service - Factory and utilities for LLM providers

import { LLMProvider, LLMConfig, Message, LLMResponse, StreamChunk, AVAILABLE_MODELS, PROVIDERS } from './types';
import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import { GoogleProvider } from './providers/google';

// Provider instances (singleton)
const providers: Record<string, LLMProvider> = {
    openai: new OpenAIProvider(),
    anthropic: new AnthropicProvider(),
    google: new GoogleProvider(),
};

/**
 * Get the appropriate LLM provider based on configuration
 */
export function getProvider(providerName: string): LLMProvider {
    const provider = providers[providerName];
    if (!provider) {
        throw new Error(`Unknown LLM provider: ${providerName}`);
    }
    return provider;
}

/**
 * Send a chat message and get a response
 */
export async function chat(messages: Message[], config: LLMConfig): Promise<LLMResponse> {
    const provider = getProvider(config.provider);
    return provider.chat(messages, config);
}

/**
 * Stream a chat response
 */
export async function* stream(messages: Message[], config: LLMConfig): AsyncGenerator<StreamChunk> {
    const provider = getProvider(config.provider);
    yield* provider.stream(messages, config);
}

/**
 * Validate an API key for a specific provider
 */
export async function validateApiKey(providerName: string, apiKey: string): Promise<boolean> {
    const provider = getProvider(providerName);
    return provider.validateApiKey(apiKey);
}

/**
 * Get available models for a provider
 */
export function getModelsForProvider(providerName: string) {
    return AVAILABLE_MODELS[providerName as keyof typeof AVAILABLE_MODELS] || [];
}

/**
 * Get all available providers
 */
export function getAllProviders() {
    return PROVIDERS;
}

/**
 * Build context-enhanced messages with RAG results
 */
export function buildMessagesWithContext(
    userMessage: string,
    conversationHistory: Message[],
    contextChunks: string[],
    systemPrompt: string
): Message[] {
    const messages: Message[] = [];

    // System prompt with context
    let enhancedSystemPrompt = systemPrompt;

    if (contextChunks.length > 0) {
        enhancedSystemPrompt += `\n\n---\nRelevant Context:\n${contextChunks.join('\n\n')}\n---\n\nUse the above context to help answer the user's question. If the context doesn't contain relevant information, use your general knowledge but mention that you're not certain about specifics.`;
    }

    messages.push({ role: 'system', content: enhancedSystemPrompt });

    // Add conversation history (last N messages)
    const recentHistory = conversationHistory.slice(-10);
    messages.push(...recentHistory);

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    return messages;
}

// Re-export types
export * from './types';
