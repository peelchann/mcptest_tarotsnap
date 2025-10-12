-- Chat Messages Table for TarotSnap Chat-Centric Memory System
-- Migration: 20250109_chat_messages_fixed.sql
-- FIXED VERSION: Handles existing policies gracefully

-- Create chat_sessions table (optional, for grouping conversations)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reading_id UUID, -- Simplified to avoid foreign key issues
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'ai')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    reading_id UUID, -- Simplified to avoid foreign key issues
    metadata JSONB DEFAULT '{}' -- For topics, emotion, insights, etc.
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON public.chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_reading_id ON public.chat_messages(reading_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" ON public.chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON public.chat_sessions;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create updated_at trigger for chat_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: Foreign key constraints for reading_id can be added later when reading_sessions table is created
-- This allows the chat system to work independently of the reading system 