// Google AI (Gemini) Provider Implementation

import { LLMProvider, LLMConfig, Message, LLMResponse, StreamChunk } from '../types';

export class GoogleProvider implements LLMProvider {
    private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    async chat(messages: Message[], config: LLMConfig): Promise<LLMResponse> {
        const url = `${this.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: this.formatMessages(messages),
                systemInstruction: config.systemPrompt ? {
                    parts: [{ text: config.systemPrompt }]
                } : undefined,
                generationConfig: {
                    temperature: config.temperature ?? 0.7,
                    maxOutputTokens: config.maxTokens ?? 1024,
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Google AI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const tokensUsed = (data.usageMetadata?.promptTokenCount || 0) +
            (data.usageMetadata?.candidatesTokenCount || 0);

        return {
            content,
            tokensUsed,
            model: config.model,
            finishReason: data.candidates?.[0]?.finishReason,
        };
    }

    async *stream(messages: Message[], config: LLMConfig): AsyncGenerator<StreamChunk> {
        const url = `${this.baseUrl}/models/${config.model}:streamGenerateContent?key=${config.apiKey}&alt=sse`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: this.formatMessages(messages),
                systemInstruction: config.systemPrompt ? {
                    parts: [{ text: config.systemPrompt }]
                } : undefined,
                generationConfig: {
                    temperature: config.temperature ?? 0.7,
                    maxOutputTokens: config.maxTokens ?? 1024,
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `Google AI API error: ${response.status}`);
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
                    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    const isDone = data.candidates?.[0]?.finishReason === 'STOP';

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
            const url = `${this.baseUrl}/models?key=${apiKey}`;
            const response = await fetch(url);
            return response.ok;
        } catch {
            return false;
        }
    }

    private formatMessages(messages: Message[]): { role: string; parts: { text: string }[] }[] {
        // Filter out system messages as they're handled separately
        const nonSystemMessages = messages.filter(m => m.role !== 'system');

        return nonSystemMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
    }
}
