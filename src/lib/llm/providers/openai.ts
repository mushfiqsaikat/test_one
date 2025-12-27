// OpenAI Provider Implementation

import { LLMProvider, LLMConfig, Message, LLMResponse, StreamChunk } from '../types';

export class OpenAIProvider implements LLMProvider {
    private baseUrl = 'https://api.openai.com/v1';

    async chat(messages: Message[], config: LLMConfig): Promise<LLMResponse> {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                model: config.model,
                messages: this.formatMessages(messages, config.systemPrompt),
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens ?? 1024,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const choice = data.choices[0];

        return {
            content: choice.message.content,
            tokensUsed: data.usage?.total_tokens || 0,
            model: data.model,
            finishReason: choice.finish_reason,
        };
    }

    async *stream(messages: Message[], config: LLMConfig): AsyncGenerator<StreamChunk> {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                model: config.model,
                messages: this.formatMessages(messages, config.systemPrompt),
                temperature: config.temperature ?? 0.7,
                max_tokens: config.maxTokens ?? 1024,
                stream: true,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
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
                if (!trimmed || trimmed === 'data: [DONE]') continue;
                if (!trimmed.startsWith('data: ')) continue;

                try {
                    const data = JSON.parse(trimmed.slice(6));
                    const content = data.choices[0]?.delta?.content || '';
                    const isDone = data.choices[0]?.finish_reason === 'stop';

                    if (content) {
                        yield { content, done: isDone };
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
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: { 'Authorization': `Bearer ${apiKey}` },
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    private formatMessages(messages: Message[], systemPrompt?: string): Message[] {
        const formatted: Message[] = [];

        if (systemPrompt) {
            formatted.push({ role: 'system', content: systemPrompt });
        }

        formatted.push(...messages);
        return formatted;
    }
}
