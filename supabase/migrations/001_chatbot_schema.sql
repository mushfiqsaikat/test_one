-- ============================================
-- AutoMaxBot Database Schema
-- ============================================
-- Run this in Supabase SQL Editor
-- First, enable the vector extension in Supabase Dashboard > Database > Extensions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CHATBOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    is_trained BOOLEAN DEFAULT FALSE,
    last_trained_at TIMESTAMPTZ,
    total_messages INTEGER DEFAULT 0,
    total_conversations INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbots_user_id ON chatbots(user_id);

-- ============================================
-- LLM CONFIGURATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS llm_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE UNIQUE,
    provider TEXT NOT NULL DEFAULT 'openai' CHECK (provider IN ('openai', 'anthropic', 'google', 'custom')),
    model TEXT NOT NULL DEFAULT 'gpt-4o',
    api_key_encrypted TEXT,
    use_platform_key BOOLEAN DEFAULT FALSE,
    temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
    max_tokens INTEGER DEFAULT 1024 CHECK (max_tokens > 0 AND max_tokens <= 128000),
    system_prompt TEXT DEFAULT 'You are a helpful AI assistant. Be friendly, concise, and helpful in your responses.',
    context_window INTEGER DEFAULT 4096,
    response_format TEXT DEFAULT 'text' CHECK (response_format IN ('text', 'markdown', 'json')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_llm_configs_chatbot_id ON llm_configs(chatbot_id);

-- ============================================
-- KNOWLEDGE SOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('text', 'file', 'website', 'qa')),
    name TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    website_url TEXT,
    crawl_depth INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'trained', 'failed')),
    error_message TEXT,
    char_count INTEGER DEFAULT 0,
    chunk_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_chatbot_id ON sources(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_sources_status ON sources(status);

-- ============================================
-- WIDGET SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS widget_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE UNIQUE,
    primary_color TEXT DEFAULT '#7c3aed',
    secondary_color TEXT DEFAULT '#6366f1',
    background_color TEXT DEFAULT '#ffffff',
    text_color TEXT DEFAULT '#1e293b',
    user_bubble_color TEXT DEFAULT '#7c3aed',
    bot_bubble_color TEXT DEFAULT '#f1f5f9',
    position TEXT DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left')),
    bubble_size TEXT DEFAULT 'medium' CHECK (bubble_size IN ('small', 'medium', 'large')),
    chat_width INTEGER DEFAULT 380,
    chat_height INTEGER DEFAULT 600,
    bot_name TEXT DEFAULT 'AI Assistant',
    bot_avatar_url TEXT,
    welcome_message TEXT DEFAULT 'Hi there! How can I help you today?',
    placeholder_text TEXT DEFAULT 'Type your message...',
    show_branding BOOLEAN DEFAULT TRUE,
    auto_open BOOLEAN DEFAULT FALSE,
    auto_open_delay INTEGER DEFAULT 3,
    show_typing_indicator BOOLEAN DEFAULT TRUE,
    enable_sounds BOOLEAN DEFAULT FALSE,
    allowed_domains TEXT[] DEFAULT ARRAY[]::TEXT[],
    rate_limit_messages INTEGER DEFAULT 20,
    custom_css TEXT,
    custom_js TEXT,
    theme_preset TEXT DEFAULT 'default' CHECK (theme_preset IN ('default', 'dark', 'minimal', 'gradient', 'custom')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_widget_settings_chatbot_id ON widget_settings(chatbot_id);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL,
    session_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'archived')),
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_chatbot_id ON conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_conversations_visitor_id ON conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    feedback TEXT CHECK (feedback IN ('positive', 'negative')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_chatbot_id ON messages(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ============================================
-- API KEYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    permissions TEXT[] DEFAULT ARRAY['chat']::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY chatbots_user_policy ON chatbots FOR ALL USING (auth.uid() = user_id);

CREATE POLICY llm_configs_user_policy ON llm_configs FOR ALL USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
);

CREATE POLICY sources_user_policy ON sources FOR ALL USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
);

CREATE POLICY widget_settings_user_policy ON widget_settings FOR ALL USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
);

CREATE POLICY conversations_user_policy ON conversations FOR ALL USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
);

CREATE POLICY messages_user_policy ON messages FOR ALL USING (
    chatbot_id IN (SELECT id FROM chatbots WHERE user_id = auth.uid())
);

CREATE POLICY api_keys_user_policy ON api_keys FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_chatbots_updated_at BEFORE UPDATE ON chatbots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_llm_configs_updated_at BEFORE UPDATE ON llm_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_widget_settings_updated_at BEFORE UPDATE ON widget_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Increment message count
CREATE OR REPLACE FUNCTION increment_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations SET message_count = message_count + 1 WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_message_count AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION increment_conversation_message_count();

-- Update chatbot stats
CREATE OR REPLACE FUNCTION update_chatbot_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE chatbots SET total_messages = total_messages + 1 WHERE id = NEW.chatbot_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chatbot_message_stats AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_chatbot_stats();

-- Auto-create defaults for new chatbot
CREATE OR REPLACE FUNCTION create_chatbot_defaults()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO llm_configs (chatbot_id) VALUES (NEW.id);
    INSERT INTO widget_settings (chatbot_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chatbot_create_defaults AFTER INSERT ON chatbots FOR EACH ROW EXECUTE FUNCTION create_chatbot_defaults();
