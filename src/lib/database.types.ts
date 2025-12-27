// Database Types - Generated from Supabase schema
// These types match the database tables

export interface Database {
    public: {
        Tables: {
            chatbots: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string | null;
                    status: 'draft' | 'active' | 'paused' | 'archived';
                    is_trained: boolean;
                    last_trained_at: string | null;
                    total_messages: number;
                    total_conversations: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description?: string | null;
                    status?: 'draft' | 'active' | 'paused' | 'archived';
                    is_trained?: boolean;
                    last_trained_at?: string | null;
                    total_messages?: number;
                    total_conversations?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string | null;
                    status?: 'draft' | 'active' | 'paused' | 'archived';
                    is_trained?: boolean;
                    last_trained_at?: string | null;
                    total_messages?: number;
                    total_conversations?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            llm_configs: {
                Row: {
                    id: string;
                    chatbot_id: string;
                    provider: 'openai' | 'anthropic' | 'google' | 'custom';
                    model: string;
                    api_key_encrypted: string | null;
                    use_platform_key: boolean;
                    temperature: number;
                    max_tokens: number;
                    system_prompt: string;
                    context_window: number;
                    response_format: 'text' | 'markdown' | 'json';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    chatbot_id: string;
                    provider?: 'openai' | 'anthropic' | 'google' | 'custom';
                    model?: string;
                    api_key_encrypted?: string | null;
                    use_platform_key?: boolean;
                    temperature?: number;
                    max_tokens?: number;
                    system_prompt?: string;
                    context_window?: number;
                    response_format?: 'text' | 'markdown' | 'json';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    chatbot_id?: string;
                    provider?: 'openai' | 'anthropic' | 'google' | 'custom';
                    model?: string;
                    api_key_encrypted?: string | null;
                    use_platform_key?: boolean;
                    temperature?: number;
                    max_tokens?: number;
                    system_prompt?: string;
                    context_window?: number;
                    response_format?: 'text' | 'markdown' | 'json';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            sources: {
                Row: {
                    id: string;
                    chatbot_id: string;
                    type: 'text' | 'file' | 'website' | 'qa';
                    name: string;
                    content: string | null;
                    file_url: string | null;
                    file_type: string | null;
                    file_size: number | null;
                    website_url: string | null;
                    crawl_depth: number;
                    status: 'pending' | 'processing' | 'trained' | 'failed';
                    error_message: string | null;
                    char_count: number;
                    chunk_count: number;
                    metadata: Record<string, unknown>;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    chatbot_id: string;
                    type: 'text' | 'file' | 'website' | 'qa';
                    name: string;
                    content?: string | null;
                    file_url?: string | null;
                    file_type?: string | null;
                    file_size?: number | null;
                    website_url?: string | null;
                    crawl_depth?: number;
                    status?: 'pending' | 'processing' | 'trained' | 'failed';
                    error_message?: string | null;
                    char_count?: number;
                    chunk_count?: number;
                    metadata?: Record<string, unknown>;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    chatbot_id?: string;
                    type?: 'text' | 'file' | 'website' | 'qa';
                    name?: string;
                    content?: string | null;
                    file_url?: string | null;
                    file_type?: string | null;
                    file_size?: number | null;
                    website_url?: string | null;
                    crawl_depth?: number;
                    status?: 'pending' | 'processing' | 'trained' | 'failed';
                    error_message?: string | null;
                    char_count?: number;
                    chunk_count?: number;
                    metadata?: Record<string, unknown>;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            widget_settings: {
                Row: {
                    id: string;
                    chatbot_id: string;
                    primary_color: string;
                    secondary_color: string;
                    background_color: string;
                    text_color: string;
                    user_bubble_color: string;
                    bot_bubble_color: string;
                    position: 'bottom-right' | 'bottom-left';
                    bubble_size: 'small' | 'medium' | 'large';
                    chat_width: number;
                    chat_height: number;
                    bot_name: string;
                    bot_avatar_url: string | null;
                    welcome_message: string;
                    placeholder_text: string;
                    show_branding: boolean;
                    auto_open: boolean;
                    auto_open_delay: number;
                    show_typing_indicator: boolean;
                    enable_sounds: boolean;
                    allowed_domains: string[];
                    rate_limit_messages: number;
                    custom_css: string | null;
                    custom_js: string | null;
                    theme_preset: 'default' | 'dark' | 'minimal' | 'gradient' | 'custom';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    chatbot_id: string;
                    primary_color?: string;
                    secondary_color?: string;
                    background_color?: string;
                    text_color?: string;
                    user_bubble_color?: string;
                    bot_bubble_color?: string;
                    position?: 'bottom-right' | 'bottom-left';
                    bubble_size?: 'small' | 'medium' | 'large';
                    chat_width?: number;
                    chat_height?: number;
                    bot_name?: string;
                    bot_avatar_url?: string | null;
                    welcome_message?: string;
                    placeholder_text?: string;
                    show_branding?: boolean;
                    auto_open?: boolean;
                    auto_open_delay?: number;
                    show_typing_indicator?: boolean;
                    enable_sounds?: boolean;
                    allowed_domains?: string[];
                    rate_limit_messages?: number;
                    custom_css?: string | null;
                    custom_js?: string | null;
                    theme_preset?: 'default' | 'dark' | 'minimal' | 'gradient' | 'custom';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    chatbot_id?: string;
                    primary_color?: string;
                    secondary_color?: string;
                    background_color?: string;
                    text_color?: string;
                    user_bubble_color?: string;
                    bot_bubble_color?: string;
                    position?: 'bottom-right' | 'bottom-left';
                    bubble_size?: 'small' | 'medium' | 'large';
                    chat_width?: number;
                    chat_height?: number;
                    bot_name?: string;
                    bot_avatar_url?: string | null;
                    welcome_message?: string;
                    placeholder_text?: string;
                    show_branding?: boolean;
                    auto_open?: boolean;
                    auto_open_delay?: number;
                    show_typing_indicator?: boolean;
                    enable_sounds?: boolean;
                    allowed_domains?: string[];
                    rate_limit_messages?: number;
                    custom_css?: string | null;
                    custom_js?: string | null;
                    theme_preset?: 'default' | 'dark' | 'minimal' | 'gradient' | 'custom';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            conversations: {
                Row: {
                    id: string;
                    chatbot_id: string;
                    visitor_id: string;
                    session_id: string | null;
                    status: 'active' | 'ended' | 'archived';
                    metadata: Record<string, unknown>;
                    started_at: string;
                    ended_at: string | null;
                    message_count: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    chatbot_id: string;
                    visitor_id: string;
                    session_id?: string | null;
                    status?: 'active' | 'ended' | 'archived';
                    metadata?: Record<string, unknown>;
                    started_at?: string;
                    ended_at?: string | null;
                    message_count?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    chatbot_id?: string;
                    visitor_id?: string;
                    session_id?: string | null;
                    status?: 'active' | 'ended' | 'archived';
                    metadata?: Record<string, unknown>;
                    started_at?: string;
                    ended_at?: string | null;
                    message_count?: number;
                    created_at?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    chatbot_id: string;
                    role: 'user' | 'assistant' | 'system';
                    content: string;
                    tokens_used: number;
                    response_time_ms: number | null;
                    feedback: 'positive' | 'negative' | null;
                    metadata: Record<string, unknown>;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    chatbot_id: string;
                    role: 'user' | 'assistant' | 'system';
                    content: string;
                    tokens_used?: number;
                    response_time_ms?: number | null;
                    feedback?: 'positive' | 'negative' | null;
                    metadata?: Record<string, unknown>;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    conversation_id?: string;
                    chatbot_id?: string;
                    role?: 'user' | 'assistant' | 'system';
                    content?: string;
                    tokens_used?: number;
                    response_time_ms?: number | null;
                    feedback?: 'positive' | 'negative' | null;
                    metadata?: Record<string, unknown>;
                    created_at?: string;
                };
            };
            api_keys: {
                Row: {
                    id: string;
                    user_id: string;
                    chatbot_id: string | null;
                    name: string;
                    key_hash: string;
                    key_prefix: string;
                    last_used_at: string | null;
                    expires_at: string | null;
                    is_active: boolean;
                    permissions: string[];
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    chatbot_id?: string | null;
                    name: string;
                    key_hash: string;
                    key_prefix: string;
                    last_used_at?: string | null;
                    expires_at?: string | null;
                    is_active?: boolean;
                    permissions?: string[];
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    chatbot_id?: string | null;
                    name?: string;
                    key_hash?: string;
                    key_prefix?: string;
                    last_used_at?: string | null;
                    expires_at?: string | null;
                    is_active?: boolean;
                    permissions?: string[];
                    created_at?: string;
                };
            };
        };
    };
}

// Convenience types
export type Chatbot = Database['public']['Tables']['chatbots']['Row'];
export type ChatbotInsert = Database['public']['Tables']['chatbots']['Insert'];
export type ChatbotUpdate = Database['public']['Tables']['chatbots']['Update'];

export type LLMConfig = Database['public']['Tables']['llm_configs']['Row'];
export type LLMConfigInsert = Database['public']['Tables']['llm_configs']['Insert'];
export type LLMConfigUpdate = Database['public']['Tables']['llm_configs']['Update'];

export type Source = Database['public']['Tables']['sources']['Row'];
export type SourceInsert = Database['public']['Tables']['sources']['Insert'];
export type SourceUpdate = Database['public']['Tables']['sources']['Update'];

export type WidgetSettings = Database['public']['Tables']['widget_settings']['Row'];
export type WidgetSettingsInsert = Database['public']['Tables']['widget_settings']['Insert'];
export type WidgetSettingsUpdate = Database['public']['Tables']['widget_settings']['Update'];

export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
export type ConversationUpdate = Database['public']['Tables']['conversations']['Update'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export type ApiKey = Database['public']['Tables']['api_keys']['Row'];
export type ApiKeyInsert = Database['public']['Tables']['api_keys']['Insert'];
export type ApiKeyUpdate = Database['public']['Tables']['api_keys']['Update'];

// Extended types with relations
export interface ChatbotWithRelations extends Chatbot {
    llm_configs: LLMConfig | null;
    widget_settings: WidgetSettings | null;
    sources?: Source[];
}
