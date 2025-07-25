import { createBrowserClient, createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Supabase client for browser/client-side operations
export const createBrowserSupabaseClient = () => {
  // Check if we're on the server side
  if (typeof window === 'undefined') {
    console.warn('🚨 createBrowserSupabaseClient called on server side')
    return {} as SupabaseClient
  }

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) {
    console.error('🚨 MISSING: NEXT_PUBLIC_SUPABASE_URL environment variable')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (!supabaseAnonKey) {
    console.error('🚨 MISSING: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  try {
    console.log('✅ Creating Supabase browser client')
    console.log('URL:', supabaseUrl)
    console.log('Key prefix:', supabaseAnonKey.substring(0, 20) + '...')
    
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('🚨 Error creating Supabase browser client:', error)
    throw error
  }
}

// Supabase client for server-side operations (API routes, middleware)
// Note: This should only be called from server components, API routes, or middleware
export const createServerSupabaseClient = (cookieStore: any) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Types for user profile and reading history
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  subscription_tier: 'free' | 'premium'
  daily_readings_used: number
  last_reading_date?: string
}

export interface ReadingHistory {
  id: string
  user_id: string
  question: string
  card_name: string
  card_meaning: string
  interpretation: string
  guidance: string
  energy: string
  timeframe: string
  created_at: string
  reading_type: 'single' | 'three-card' | 'celtic-cross'
}

// Enhanced Memory Bank Types
export interface ReadingSession {
  id: string
  user_id: string
  timestamp: string
  question_context: string
  emotional_state: {
    mood?: string
    energy?: string
    openness?: string
    stress_level?: number
  }
  cards_drawn: Array<{
    card_id: string
    position: string
    meaning: string
    personal_significance?: string
  }>
  spread_type: string
  full_interpretation: string
  key_themes: string[]
  user_feedback?: {
    helpful?: boolean
    accuracy_rating?: number
    notes?: string
    resonance_level?: number
  }
  follow_up_needed: boolean
  created_at: string
}

export interface UserTheme {
  id: string
  user_id: string
  theme_name: string
  frequency: number
  first_appearance: string
  last_appearance: string
  evolution_notes?: string
  resolution_status: 'ongoing' | 'resolved' | 'improved'
  significance_level: number
  created_at: string
}

export interface CardRelationship {
  id: string
  user_id: string
  card_id: string
  personal_meaning?: string
  frequency_drawn: number
  significance_level: number
  emotional_associations: string[]
  first_drawn: string
  last_drawn: string
  created_at: string
}

export interface ProgressTracking {
  id: string
  user_id: string
  guidance_given: string
  check_in_date: string
  user_progress: {
    status?: string
    notes?: string
    rating?: number
  }
  outcome_notes?: string
  reading_session_id: string
  created_at: string
}

export interface UserPreferences {
  user_id: string
  communication_style: {
    tone?: string
    detail_level?: string
    style?: string
    formality?: string
  }
  preferred_spreads: string[]
  reading_frequency?: string
  reminder_preferences: {
    enabled?: boolean
    frequency?: string
    check_in_reminders?: boolean
  }
  created_at: string
  updated_at: string
}

// Database schema for reference
export const DATABASE_SCHEMA = {
  profiles: `
    CREATE TABLE profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      subscription_tier TEXT DEFAULT 'free'::text CHECK (subscription_tier IN ('free', 'premium')),
      daily_readings_used INTEGER DEFAULT 0,
      last_reading_date DATE,
      PRIMARY KEY (id)
    );
  `,
  reading_history: `
    CREATE TABLE reading_history (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      question TEXT NOT NULL,
      card_name TEXT NOT NULL,
      card_meaning TEXT NOT NULL,
      interpretation TEXT NOT NULL,
      guidance TEXT NOT NULL,
      energy TEXT NOT NULL,
      timeframe TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      reading_type TEXT DEFAULT 'single'::text CHECK (reading_type IN ('single', 'three-card', 'celtic-cross'))
    );
  `,
  // Enhanced Memory Bank Schema
  reading_sessions: `
    CREATE TABLE reading_sessions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      question_context TEXT NOT NULL,
      emotional_state JSONB DEFAULT '{}',
      cards_drawn JSONB NOT NULL DEFAULT '[]',
      spread_type VARCHAR(50) DEFAULT 'single',
      full_interpretation TEXT NOT NULL,
      key_themes TEXT[] DEFAULT ARRAY[]::TEXT[],
      user_feedback JSONB DEFAULT '{}',
      follow_up_needed BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
  `,
  user_themes: `
    CREATE TABLE user_themes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      theme_name VARCHAR(100) NOT NULL,
      frequency INTEGER DEFAULT 1,
      first_appearance TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      last_appearance TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      evolution_notes TEXT,
      resolution_status VARCHAR(20) DEFAULT 'ongoing' CHECK (resolution_status IN ('ongoing', 'resolved', 'improved')),
      significance_level INTEGER DEFAULT 1 CHECK (significance_level BETWEEN 1 AND 5),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
  `,
  card_relationships: `
    CREATE TABLE card_relationships (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      card_id VARCHAR(50) NOT NULL,
      personal_meaning TEXT,
      frequency_drawn INTEGER DEFAULT 1,
      significance_level INTEGER DEFAULT 1 CHECK (significance_level BETWEEN 1 AND 5),
      emotional_associations JSONB DEFAULT '[]',
      first_drawn TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      last_drawn TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      UNIQUE(user_id, card_id)
    );
  `,
  progress_tracking: `
    CREATE TABLE progress_tracking (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      guidance_given TEXT NOT NULL,
      check_in_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      user_progress JSONB DEFAULT '{}',
      outcome_notes TEXT,
      reading_session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
  `,
  user_preferences: `
    CREATE TABLE user_preferences (
      user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
      communication_style JSONB DEFAULT '{}',
      preferred_spreads TEXT[] DEFAULT ARRAY[]::TEXT[],
      reading_frequency VARCHAR(20),
      reminder_preferences JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
  `,
  row_level_security: `
    -- Enable RLS on profiles table
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Enable RLS on reading_history table
    ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
    
    -- Enable RLS on memory bank tables
    ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;
    ALTER TABLE card_relationships ENABLE ROW LEVEL SECURITY;
    ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can only view/edit their own profile
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    
    -- Policy: Users can only view/manage their own reading history
    CREATE POLICY "Users can view own reading history" ON reading_history FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert own reading history" ON reading_history FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    -- Memory Bank RLS Policies
    CREATE POLICY "Users can manage own reading sessions" ON reading_sessions FOR ALL USING (auth.uid() = user_id);
    CREATE POLICY "Users can manage own themes" ON user_themes FOR ALL USING (auth.uid() = user_id);
    CREATE POLICY "Users can manage own card relationships" ON card_relationships FOR ALL USING (auth.uid() = user_id);
    CREATE POLICY "Users can manage own progress tracking" ON progress_tracking FOR ALL USING (auth.uid() = user_id);
    CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
    
    -- Function to handle new user creation
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name)
      VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
      
      -- Initialize user preferences
      INSERT INTO public.user_preferences (user_id, communication_style, reminder_preferences)
      VALUES (new.id, '{"tone": "mystical", "detail_level": "medium", "style": "caring"}', '{"enabled": true}');
      
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Trigger to create profile on user signup
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
      
    -- Indexes for performance
    CREATE INDEX idx_reading_sessions_user_id ON reading_sessions(user_id);
    CREATE INDEX idx_reading_sessions_timestamp ON reading_sessions(timestamp);
    CREATE INDEX idx_user_themes_user_id ON user_themes(user_id);
    CREATE INDEX idx_user_themes_theme_name ON user_themes(theme_name);
    CREATE INDEX idx_card_relationships_user_id ON card_relationships(user_id);
    CREATE INDEX idx_card_relationships_card_id ON card_relationships(card_id);
    CREATE INDEX idx_progress_tracking_user_id ON progress_tracking(user_id);
  `
} 