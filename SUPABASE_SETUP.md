# Supabase Authentication Setup for TarotSnap

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Existing OpenRouter configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# New Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key from the API settings

2. **Database Schema Setup**
   
   Run this SQL in your Supabase SQL Editor:

   ```sql
   -- Create profiles table
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

   -- Create reading_history table
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

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

   -- Create policies for profiles
   CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

   -- Create policies for reading_history
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
   ```

3. **Authentication Settings**
   - In Supabase Dashboard → Authentication → Settings
   - Enable email confirmation (recommended)
   - Configure your site URL: `http://localhost:3000` (development)
   - For production, add your domain

## Features Implemented

### ✅ Phase 2A - T008: User Authentication System

1. **Supabase Configuration** (`lib/supabase.ts`)
   - Browser and server client setup
   - TypeScript interfaces for user profiles and reading history
   - Database schema documentation

2. **Authentication Components**
   - `AuthProvider` - Context for managing user state
   - `LoginForm` - Mystical-themed login with validation
   - `SignupForm` - Registration with email verification
   - `AuthModal` - Modal wrapper with animations

3. **Protected Routes** (`middleware.ts`)
   - Route protection for `/dashboard`, `/profile`, `/history`
   - Automatic redirects for unauthenticated users
   - Session management and refresh

4. **User Dashboard** (`app/dashboard/page.tsx`)
   - Welcome section with user info
   - Usage statistics (daily readings, total readings)
   - Quick actions for new readings and history
   - Premium upgrade prompts for free users

5. **Homepage Integration**
   - Header with sign in/sign up buttons
   - User menu for authenticated users
   - Auth modal integration
   - Automatic redirect handling

## Rate Limiting Upgrade (Ready for T009)

The system is prepared to upgrade from IP-based to user-based rate limiting:

- Anonymous users: 3 readings/day (current system)
- Free users: 3 readings/day + reading history
- Premium users: Unlimited readings + full features

## Next Steps (T009 - Reading Memory & History)

1. **API Integration**
   - Modify `/api/reading` to save readings to user history
   - Implement user-based rate limiting
   - Add reading history retrieval endpoints

2. **Reading History UI**
   - History page with search and filtering
   - Reading detail view
   - Export functionality

3. **User Preferences**
   - Personalized AI prompts
   - Reading preferences
   - Notification settings

## Security Features

- **Row Level Security (RLS)** enabled on all user data
- **JWT-based authentication** with refresh tokens
- **Secure cookie handling** for sessions
- **Environment variable protection** for API keys
- **Input validation** on all forms

## Development vs Production

- **Development**: Uses localhost URLs, email confirmation optional
- **Production**: Requires proper domain setup, email confirmation recommended
- **Environment variables**: Different for each environment

## Testing the Implementation

1. **Sign Up Flow**
   - Create new account with email/password
   - Verify email (if enabled)
   - Auto-redirect to dashboard

2. **Sign In Flow**
   - Login with existing credentials
   - Session persistence across browser restarts
   - Proper error handling

3. **Protected Routes**
   - Try accessing `/dashboard` without login (should redirect)
   - Login and access should work
   - Sign out should clear session

4. **User Dashboard**
   - Shows correct user information
   - Displays usage statistics
   - Navigation between sections works

## Mystical Theming

All authentication components follow the Agatha Harkness dark mystical theme:
- **Colors**: Navy background, gold accents, purple gradients
- **Animation**: Framer Motion for smooth transitions
- **Icons**: Lucide React with mystical themes
- **Typography**: Consistent with existing design
- **Particles**: Background mystical particle effects 