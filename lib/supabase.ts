import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Supabase client for browser/client-side operations
export const createBrowserSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Supabase client for server-side operations (API routes, middleware)
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()

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
  row_level_security: `
    -- Enable RLS on profiles table
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Enable RLS on reading_history table
    ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
    
    -- Policy: Users can only view/edit their own profile
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    
    -- Policy: Users can only view/manage their own reading history
    CREATE POLICY "Users can view own reading history" ON reading_history FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert own reading history" ON reading_history FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    -- Function to handle new user creation
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name)
      VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    
    -- Trigger to create profile on user signup
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  `
} 