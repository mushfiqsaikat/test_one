// LLM Provider Types and Interfaces
// Unified interface for all LLM providers

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'google' | 'custom';
    model: string;
    apiKey: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}

export interface LLMResponse {
    content: string;
    tokensUsed: number;
    model: string;
    finishReason?: string;
}

export interface StreamChunk {
    content: string;
    done: boolean;
}

// Abstract LLM Provider interface
export interface LLMProvider {
    chat(messages: Message[], config: LLMConfig): Promise<LLMResponse>;
    stream(messages: Message[], config: LLMConfig): AsyncGenerator<StreamChunk>;
    validateApiKey(apiKey: string): Promise<boolean>;
}

// Available models per provider
export const AVAILABLE_MODELS = {
    openai: [
        { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable, multimodal' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and affordable' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High capability, large context' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast, affordable' },
    ],
    anthropic: [
        { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', description: 'Best balance of speed and capability' },
        { id: 'claude-3-opus-latest', name: 'Claude 3 Opus', description: 'Most capable' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fastest, most compact' },
    ],
    google: [
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Latest, fastest' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Advanced reasoning' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and versatile' },
    ],
    custom: [
        { id: 'custom', name: 'Custom Endpoint', description: 'Your own API endpoint' },
    ],
} as const;

// Provider display info
export const PROVIDERS = [
    { id: 'openai', name: 'OpenAI', icon: '🤖', color: '#10a37f' },
    { id: 'anthropic', name: 'Anthropic', icon: '🧠', color: '#d4a574' },
    { id: 'google', name: 'Google AI', icon: '✨', color: '#4285f4' },
    { id: 'custom', name: 'Custom API', icon: '⚙️', color: '#6b7280' },
] as const;

export type ProviderType = typeof PROVIDERS[number]['id'];
