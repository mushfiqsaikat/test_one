// Anthropic (Claude) Provider Implementation

import { LLMProvider, LLMConfig, Message, LLMResponse, StreamChunk } from '../types';

export class AnthropicProvider implements LLMProvider {
    private baseUrl = 'https://api.anthropic.com/v1';

    async chat(messages: Message[], config: LLMConfig): Promise<LLMResponse> {
        const { systemPrompt, nonSystemMessages } = this.separateSystemPrompt(messages, config.systemPrompt);

        const response = await fetch(`${this.baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: config.maxTokens ?? 1024,
                system: systemPrompt,
                messages: this.formatMessages(nonSystemMessages),
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            content: data.content[0]?.text || '',
            tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
            model: data.model,
            finishReason: data.stop_reason,
        };
    }

    async *stream(messages: Message[], config: LLMConfig): AsyncGenerator<StreamChunk> {
        const { systemPrompt, nonSystemMessages } = this.separateSystemPrompt(messages, config.systemPrompt);

        const response = await fetch(`${this.baseUrl}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: config.maxTokens ?? 1024,
                system: systemPrompt,
                messages: this.formatMessages(nonSystemMessages),
                stream: true,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data: ')) continue;

                try {
                    const data = JSON.parse(trimmed.slice(6));

                    if (data.type === 'content_block_delta') {
                        const content = data.delta?.text || '';
                        if (content) {
                            yield { content, done: false };
                        }
                    } else if (data.type === 'message_stop') {
                        yield { content: '', done: true };
                    }
                } catch {
                    // Skip invalid JSON
                }
            }
        }

        yield { content: '', done: true };
    }

    async validateApiKey(apiKey: string): Promise<boolean> {
        try {
            // Anthropic doesn't have a simple validation endpoint
            // We'll try a minimal request
            const response = await fetch(`${this.baseUrl}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 1,
                    messages: [{ role: 'user', content: 'Hi' }],
                }),
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    private separateSystemPrompt(messages: Message[], configSystemPrompt?: string): {
        systemPrompt: string;
        nonSystemMessages: Message[];
    } {
        const systemMessages = messages.filter(m => m.role === 'system');
        const nonSystemMessages = messages.filter(m => m.role !== 'system');

        const systemPrompt = configSystemPrompt || systemMessages.map(m => m.content).join('\n') ||
            'You are a helpful AI assistant.';

        return { systemPrompt, nonSystemMessages };
    }

    private formatMessages(messages: Message[]): { role: 'user' | 'assistant'; content: string }[] {
        return messages.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        }));
    }
}
