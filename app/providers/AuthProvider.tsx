'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, SupabaseClient } from '@supabase/supabase-js'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { UserProfile } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  supabase: SupabaseClient | null
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  // Initialize Supabase client only on client-side to avoid SSR issues
  useEffect(() => {
    console.log('🔧 Initializing Supabase client on client-side')
    try {
      const client = createBrowserSupabaseClient()
      setSupabase(client)
      console.log('✅ Supabase client initialized successfully')
    } catch (error) {
      console.error('🚨 Failed to initialize Supabase client:', error)
      setLoading(false)
    }
  }, [])

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized, cannot fetch profile')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Check if user is returning (has existing profile)
  const isReturningUser = async (userId: string): Promise<boolean> => {
    if (!supabase) return false

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .single()

      if (error || !data) return false
      
      // If profile was created more than 5 minutes ago, consider them a returning user
      const profileAge = Date.now() - new Date(data.created_at).getTime()
      return profileAge > 5 * 60 * 1000 // 5 minutes
    } catch (error) {
      return false
    }
  }

  // Initialize auth state after Supabase client is ready
  useEffect(() => {
    if (!supabase) return

    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing auth state')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('👤 Found existing session')
          setUser(session.user)
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
        } else {
          console.log('🚫 No existing session found')
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        analytics.trackError('unknown', 'Auth initialization failed', 'medium')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth event:', event)
        
        if (session?.user) {
          setUser(session.user)
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
          
          // Track login events (but not initial page loads)
          if (event === 'SIGNED_IN') {
            const isReturning = await isReturningUser(session.user.id)
            analytics.trackLoginCompleted(isReturning)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase]) // Re-run when supabase client is initialized

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      return { error: 'Authentication system not ready. Please try again in a moment.' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        console.error('Signup error:', error)
        analytics.trackError('api_failure', `Signup failed: ${error.message}`, 'medium')
        return { error: error.message }
      }

      // Track successful signup
      if (data.user) {
        analytics.trackSignupCompleted(document.referrer || 'direct')
      }

      return {}
    } catch (error) {
      console.error('Unexpected signup error:', error)
      analytics.trackError('unknown', 'Unexpected signup error', 'high')
      return { error: 'An unexpected error occurred during sign up' }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Authentication system not ready. Please try again in a moment.' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Signin error:', error)
        analytics.trackError('api_failure', `Signin failed: ${error.message}`, 'medium')
        return { error: error.message }
      }

      // Track successful signin (detailed tracking happens in auth state change)
      return {}
    } catch (error) {
      console.error('Unexpected signin error:', error)
      analytics.trackError('unknown', 'Unexpected signin error', 'high')
      return { error: 'An unexpected error occurred during sign in' }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      console.warn('⚠️ Cannot sign out: Supabase client not initialized')
      return
    }

    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      
      // Track page view for signed out state
      analytics.trackPageView('Signed Out', {
        previous_state: 'authenticated'
      })
    } catch (error) {
      console.error('Error signing out:', error)
      analytics.trackError('api_failure', 'Signout failed', 'low')
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: 'No user logged in' }
    }

    if (!supabase) {
      return { error: 'Authentication system not ready. Please try again in a moment.' }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        analytics.trackError('api_failure', `Profile update failed: ${error.message}`, 'medium')
        return { error: error.message }
      }

      // Refresh profile data
      await refreshProfile()
      return {}
    } catch (error) {
      analytics.trackError('unknown', 'Unexpected profile update error', 'medium')
      return { error: 'An unexpected error occurred updating profile' }
    }
  }

  const refreshProfile = async () => {
    if (user && supabase) {
      const userProfile = await fetchProfile(user.id)
      setProfile(userProfile)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    supabase,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 